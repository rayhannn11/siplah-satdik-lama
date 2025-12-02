// react
import React from "react";

// third-party
import classNames from "classnames";
import { useMediaQuery } from "react-responsive";
import { Link, matchPath, Switch, Route, Redirect, withRouter } from "react-router-dom";

// pages
import AccountPageDashboard from "./AccountPageDashboard";
import AccountPageOrderDetails from "./AccountPageOrderDetails";
import AccountPageOrders from "./AccountPageOrders";
import AccountPageOrdersBulk from "./AccountPageOrdersBulk";
import AccountPageLocationSchool from "./AccountPageLocationSchool";
import AccountPageSchoolDetail from "./AccountPageSchoolDetail";
import AccountPageNotification from "./AccountPageNotification";
import AccountPageNegotiation from "./AccountPageNegotiation";
import AccountPageCompare from "./AccountPageCompare";
import AccountPageComplaint from "./AccountPageComplaint";
import AccountPageCompareDetail from "./AccountPageCompareDetail";
import AccountPageNegotiationDetail from "./AccountPageNegotiationDetail";
import AccountPageComparisonReports from "./AccountPageComparisonReports";
import AccountPageComplaintDetail from "./AccountPageComplaintDetail";
import theme from "../../data/theme";
import customerApi from "../../api/customer";
import { connect } from "react-redux";
import AccountPageChat from "./AccountPageChat";
import AccountPagePbj from "./AccountPagePbj";

import { customerAdd } from "../../store/customer";
import { loginCustomer } from "../../store/auth";
import { resetMiniCart } from "../../store/mini-cart";
import { resetFirstLogin } from "../../store/first-login/firstLoginActions";
import { toast } from "react-toastify";
import { AUTH } from "../../store/auth/authActionTypes";

function AccountLayout(props) {
    const { match, location, customer } = props;

    const isDesktopOrLaptop = useMediaQuery({
        query: "(min-width: 992px)",
    });

    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 991px)" });

    const accountLinks = [
        { title: "Dashboard", url: "dashboard" },
        { title: "Data Sekolah", url: "detail" },
        { title: "Lokasi Sekolah", url: "address" },
        { title: "Notifikasi", url: "notification" },
        { title: "Chat", url: "chat" },
    ].map((link) => {
        const url = `${match.url}/${link.url}`;
        const isActive = matchPath(location.pathname, { path: url, exact: true });
        const classes = classNames("account-nav__item", {
            "account-nav__item--active": isActive,
        });

        return (
            <li key={link.url} className={classes}>
                <Link to={url}>{link.title}</Link>
            </li>
        );
    });

    const transactionLinks = [
        { title: "Riwayat Belanja", url: "orders" },
        { title: "Negosiasi", url: "negotiation" },
        { title: "Perbandingan", url: "compare" },
        { title: "Komplain", url: "complaint" },
        { title: "Perencanaan PBJ", url: "pbj" },
        // { title: "Belanja Sekali Banyak", url: "bulk-order" },
    ].map((link) => {
        const url = `${match.url}/${link.url}`;
        const isActive = matchPath(location.pathname, { path: url, exact: true });
        const classes = classNames("account-nav__item", {
            "account-nav__item--active": isActive,
        });

        return (
            <li key={link.url} className={classes}>
                <Link to={url}>{link.title}</Link>
            </li>
        );
    });
    // const hotlineLink = [{ title: "Tiket Pengaduan", url: "complaint-ticket" }].map((link) => {
    //     const url = `${match.url}/${link.url}`;
    //     const isActive = matchPath(location.pathname, { path: url, exact: true });
    //     const classes = classNames("account-nav__item", {
    //         "account-nav__item--active": isActive,
    //     });

    //     return (
    //         <li key={link.url} className={classes}>
    //             <Link to={url}>{link.title}</Link>
    //         </li>
    //     );
    // });

    return (
        <React.Fragment>
            <div className="block mt-3">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-lg-3 d-flex">
                            <div className="account-nav flex-grow-1">
                                {isTabletOrMobile && (
                                    <>
                                        <h4 aria-hidden />
                                        <ul>
                                            {accountLinks.concat(transactionLinks)}{" "}
                                            <li className="account-nav__item">
                                                <a
                                                    href="https://wa.me/6282260255552"
                                                    rel="noopener noreferrer"
                                                    target="_blank"
                                                >
                                                    WA : {`${theme.contacts.whatsapp}`}
                                                </a>
                                            </li>
                                        </ul>
                                    </>
                                )}
                                {isDesktopOrLaptop && (
                                    <>
                                        <h4 className="account-nav__title">Akun</h4>
                                        <ul>{accountLinks}</ul>
                                        <h4 className="account-nav__title">Transaksi</h4>
                                        <ul>{transactionLinks}</ul>
                                        <h4 className="account-nav__title">Hotline</h4>
                                        <ul>
                                            {/* {hotlineLink} */}
                                            <li className="account-nav__item ">
                                                <a
                                                    className="bg-success text-light"
                                                    href="https://wa.me/6282260255552"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <i className="fab fa-whatsapp" style={{ fontSize: "18px" }}></i>{" "}
                                                    {`${theme.contacts.whatsapp}`}
                                                </a>
                                            </li>
                                            <li className="account-nav__item">
                                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                                <a
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => {
                                                        customerApi.logout(customer?.token).then((res) => {
                                                            // Bersihkan localStorage
                                                            localStorage.removeItem("auth");
                                                            localStorage.removeItem("token");
                                                            localStorage.removeItem("userData");
                                                            localStorage.removeItem("notifShown");

                                                            // Dispatch logout dengan isLogout flag
                                                            props.loginCustomer({
                                                                type: AUTH,
                                                                auth: false,
                                                                isLogout: true,
                                                            });

                                                            // Reset state lainnya
                                                            props.customerAdd({});
                                                            props.resetMiniCart();
                                                            props.resetFirstLogin();

                                                            // Redirect dan tampilkan pesan
                                                            props.history.push("/login");
                                                            toast.success("Berhasil logout");
                                                        });
                                                    }}
                                                >
                                                    Logout
                                                </a>
                                            </li>
                                        </ul>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="col-12 col-lg-9 mt-4 mt-lg-0">
                            <Switch>
                                <Redirect exact from={match.path} to={`${match.path}/dashboard`} />
                                <Route exact path={`${match.path}/dashboard`} component={AccountPageDashboard} />
                                <Route exact path={`${match.path}/orders`} component={AccountPageOrders} />
                                <Route exact path={`${match.path}/bulk-order`} component={AccountPageOrdersBulk} />
                                <Route exact path={`${match.path}/notification`} component={AccountPageNotification} />
                                <Route exact path={`${match.path}/detail`} component={AccountPageSchoolDetail} />
                                <Route exact path={`${match.path}/negotiation`} component={AccountPageNegotiation} />
                                <Route exact path={`${match.path}/chat`} component={AccountPageChat} />
                                <Route
                                    exact
                                    path={`${match.path}/negotiation/:id`}
                                    component={AccountPageNegotiationDetail}
                                />
                                <Route exact path={`${match.path}/compare`} component={AccountPageCompare} />
                                <Route
                                    exact
                                    path={`${match.path}/compare/compare-news-events/:id`}
                                    component={AccountPageComparisonReports}
                                />
                                <Route exact path={`${match.path}/compare/:id`} component={AccountPageCompareDetail} />
                                <Route exact path={`${match.path}/complaint`} component={AccountPageComplaint} />
                                <Route
                                    exact
                                    path={`${match.path}/complaint/:id`}
                                    component={AccountPageComplaintDetail}
                                />
                                <Route exact path={`${match.path}/pbj`} component={AccountPagePbj} />
                                <Route
                                    exact
                                    path={`${match.path}/orders/:orderId`}
                                    component={AccountPageOrderDetails}
                                />
                                <Route exact path={`${match.path}/address`} component={AccountPageLocationSchool} />
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => ({ customer: state.customer });

const mapDispatchToProps = {
    customerAdd,
    loginCustomer,
    resetMiniCart,
    resetFirstLogin,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AccountLayout));
