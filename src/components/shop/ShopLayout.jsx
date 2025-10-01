import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import classNames from "classnames";
import ShopPageCart from "./ShopPageCart";
import ShopPageCompare from "./ShopPageCompare";
import ShopPageCheckout from "./ShopPageCheckout";
import ShopPageCheckoutArkas from "./ShopPageCheckoutArkas";

const ShopLayout = (props) => {
    const { match, location } = props;
    const urlCheckout = `${match.url}/checkout`;
    const isCheckout = location.pathname.includes(urlCheckout);

    const shopLinks = [
        { title: "Keranjang Belanja", url: "/cart" },
        { title: "Perbandingan", url: "/compare" },
    ].map((link) => {
        const url = `${match.url}${link.url}`;
        const isActive = location.pathname.includes(url);
        const classes = classNames("nav-item-negotiation", {
            active: isActive,
        });

        return (
            <Link to={url} className={classes}>
                {link.title}
            </Link>
        );
    });

    return (
        <>
            <div class="cart block mt-5">
                <div className="container">
                    {!isCheckout && (
                        <div className="nav-negotiation">
                            <div className="nav-content-negotiation">{shopLinks}</div>
                        </div>
                    )}
                    <Switch>
                        <Route exact path={`${match.path}/cart`} component={ShopPageCart} />

                        <Route
                            exact
                            path={[`${match.path}/checkout/:id`, `${match.path}/checkout`]}
                            component={ShopPageCheckout}
                        />

                        <Route
                            exact
                            path={[`${match.path}/checkoutArkas/:id`, `${match.path}/checkoutArkas`]}
                            component={ShopPageCheckoutArkas}
                        />

                        <Route exact path={`${match.path}/compare`} component={ShopPageCompare} />
                    </Switch>
                </div>
            </div>
        </>
    );
};

export default ShopLayout;
