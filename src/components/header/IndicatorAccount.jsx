/* eslint-disable no-unused-expressions */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
// react
import React from "react";

// third-party
import { Link, withRouter } from "react-router-dom";

// application
import Indicator from "./Indicator";
import { Person20Svg } from "../../svg";
import { connect } from "react-redux";
import customerApi from "../../api/customer";

import { customerAdd } from "../../store/customer";
import { loginCustomer } from "../../store/auth";
import { resetMiniCart } from "../../store/mini-cart";
import { resetFirstLogin } from "../../store/first-login/firstLoginActions";
import { toast } from "react-toastify";
import { AUTH } from "../../store/auth/authActionTypes";

function IndicatorAccount(props) {
    const { customer } = props;
    const dropdown = (
        <div className="account-menu">
            <div className="account-menu__divider" />
            <Link to="/account/dashboard" className="account-menu__user">
                <div className="account-menu__user-avatar">
                    <img src="https://siplah.eurekabookhouse.co.id/assets/image/logo-kemdikbud.png" alt="" />
                </div>
                <div className="account-menu__user-info">
                    <div className="account-menu__user-name">{customer?.name}</div>
                    <div className="account-menu__user-email" style={{ fontSize: "12px" }}>
                        {customer?.email}
                    </div>
                </div>
            </Link>
            <div className="account-menu__divider" />
            <ul className="account-menu__links">
                <li>
                    <Link to="/account/detail">Data Sekolah</Link>
                </li>
                <li>
                    <Link to="/account/orders">Riwayat Belanja</Link>
                </li>
                <li>
                    <Link to="/account/notification">Notifikasi</Link>
                </li>
                <li>{/* <Link to="/account/bulk-order">Belanja Sekali Banyak</Link> */}</li>
            </ul>
            <div className="account-menu__divider" />
            <ul className="account-menu__links">
                <li>
                    <a
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            // localStorage.setItem('auth',false)
                            localStorage.removeItem("auth");
                            localStorage.removeItem("auth");
                            localStorage.removeItem("token");
                            localStorage.removeItem("userData");
                            localStorage.removeItem("persist:primary");
                            localStorage.removeItem("notifShown");

                            window.location.href = "/satdik";
                            customerApi
                                .logout(customer?.token)
                                .then((res) => {
                                    // Reset state dulu
                                    // props.loginCustomer({
                                    //     type: AUTH,
                                    //     auth: false,
                                    //     isLogout: true
                                    // });
                                    props.customerAdd(null);
                                    props.resetMiniCart();
                                    props.resetFirstLogin();

                                    // Kemudian bersihkan localStorage
                                    localStorage.clear();
                                    localStorage.removeItem("auth");
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("userData");
                                    localStorage.removeItem("notifShown");

                                    // Clear cache jika perlu
                                    customerApi.clearCache();

                                    // Tampilkan pesan sukses
                                    toast.success("Berhasil logout");

                                    // Terakhir, redirect
                                    window.location.href = "/satdik";
                                })
                                .catch((error) => {
                                    // Handle error jika ada
                                    console.log("Logout error:", error);
                                    toast.error("Gagal logout");
                                });
                        }}
                        // onClick={() => {
                        //     customerApi.logout(customer?.token).then((res) => {
                        //         // Bersihkan localStorage
                        //         localStorage.removeItem("auth");
                        //         localStorage.removeItem("token");
                        //         localStorage.removeItem("userData");

                        //         // Dispatch logout dengan isLogout flag
                        //         props.loginCustomer({
                        //             type: AUTH,
                        //             auth: false,
                        //             isLogout: true,
                        //         });

                        //         // Reset state lainnya
                        //         props.customerAdd({});
                        //         props.resetMiniCart();
                        //         props.resetFirstLogin();

                        //         // Redirect dan tampilkan pesan
                        //         props.history.push("/login");
                        //         toast.success("Berhasil logout");
                        //     });
                        // }}
                    >
                        Logout
                    </a>
                </li>
            </ul>
        </div>
    );

    return <Indicator url="/account" dropdown={dropdown} icon={<Person20Svg />} />;
}

const mapStateToProps = (state) => {
    return { customer: state.customer };
};
const mapDispatchToProps = {
    customerAdd,
    loginCustomer,
    resetMiniCart,
    resetFirstLogin,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(IndicatorAccount));
