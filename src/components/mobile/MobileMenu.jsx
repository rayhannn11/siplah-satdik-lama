// react
import React, { useEffect, useState } from "react";

// third-party
import classNames from "classnames";
import { connect } from "react-redux";

// application
import MobileLinks from "./MobileLinks";
import { Cross20Svg } from "../../svg";
import { currencyChange } from "../../store/currency";
import { localeChange } from "../../store/locale";
import { mobileMenuClose } from "../../store/mobile-menu";

// data stubs
import currencies from "../../data/shopCurrencies";
import mobileMenuLinks from "../../data/mobileMenu";
import customerApi from "../../api/customer";
import categoryApi from "../../api/category";

import { customerAdd } from "../../store/customer";
import { loginCustomer } from "../../store/auth";
import { resetMiniCart } from "../../store/mini-cart";
import { resetFirstLogin } from "../../store/first-login/firstLoginActions";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";

function MobileMenu(props) {
    const [linksCategory, setLinksCategory] = useState([]);
    const { mobileMenuState, closeMobileMenu, changeLocale, changeCurrency, auth, customer } = props;

    useEffect(() => {
        categoryApi.getCategories().then((result) => {
            const { status, data } = result;
            if (status.code === 200) {
                const links = data.map((item) => {
                    return {
                        type: "button",
                        label: item.title,
                        children: item.submenu.menu.map((child) => {
                            return {
                                type: child.submenu.length > 0 ? "button" : "link",
                                label: child.title,
                                url: `/products/category/${child.id}/${child.url}`,
                                children: child.submenu.map((child) => {
                                    return {
                                        type: "link",
                                        label: child.title,
                                        url: `/products/category/${child.id}/${child.url}`,
                                    };
                                }),
                            };
                        }),
                    };
                });
                let mobileLink = mobileMenuLinks.filter(
                    (item) => item.auth === auth || typeof item.auth === "undefined"
                );

                const category = { type: "button", label: "Kategori", url: "", children: links };
                mobileLink.splice(1, 0, category);
                setLinksCategory(mobileLink);
            }
        });
        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth]);

    const classes = classNames("mobilemenu", {
        "mobilemenu--open": mobileMenuState.open,
    });

    const handleItemClick = (item) => {
        if (item.data) {
            if (item.data.type === "language") {
                changeLocale(item.data.locale);
                closeMobileMenu();
            }
            if (item.data.type === "currency") {
                const currency = currencies.find((x) => x.currency.code === item.data.code);

                if (currency) {
                    changeCurrency(currency.currency);
                    closeMobileMenu();
                }
            }
        }
        if (item.type === "link") {
            closeMobileMenu();
        }
        if (item.label.toLowerCase() === "logout") {
            customerApi.logout(customer?.token).then((res) => {
                props.history.push("/login");
                props.loginCustomer(false);
                props.customerAdd({});
                props.resetMiniCart();
                props.resetFirstLogin();
                toast.success("Berhasil logout");
            });
            closeMobileMenu();
        }
    };

    return (
        <div className={classes}>
            {/* eslint-disable-next-line max-len */}
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
            <div className="mobilemenu__backdrop" onClick={closeMobileMenu} />
            <div className="mobilemenu__body">
                <div className="mobilemenu__header">
                    <div className="mobilemenu__title">Menu</div>
                    <button type="button" className="mobilemenu__close" onClick={closeMobileMenu}>
                        <Cross20Svg />
                    </button>
                </div>
                <div className="mobilemenu__content">
                    <MobileLinks links={linksCategory} onItemClick={handleItemClick} />
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    mobileMenuState: state.mobileMenu,
    auth: state.auth,
    customer: state.customer,
    categories: state.categories,
});

const mapDispatchToProps = {
    closeMobileMenu: mobileMenuClose,
    changeLocale: localeChange,
    changeCurrency: currencyChange,
    customerAdd,
    loginCustomer,
    resetMiniCart,
    resetFirstLogin,
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MobileMenu));
