// react
import React from "react";

// third-party
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

// application
import CartIndicator from "./IndicatorCart";
import Departments from "./Departments";
import IndicatorAccount from "./IndicatorAccount";
// import IndicatorSearch from "./IndicatorSearch";
import IndicatorChat from "./IndicatorChat";
import IndicatorCompare from "./IndicatorCompare";
import IndicatorNotification from "./IndicatorNotification";
import Search from "./Search";

function NavPanel(props) {
    const { layout } = props;

    let logo = null;
    let departments = null;
    // let searchIndicator;

    if (layout === "compact") {
        logo = (
            <div className="nav-panel__logo">
                <Link to="/">
                    <img
                        alt=""
                        src="https://siplah.eurekabookhouse.co.id/assets/front/images/icons/ebhcom-header_new.png"
                        style={{ width: "100%" }}
                    />
                </Link>
            </div>
        );

        // searchIndicator = <IndicatorSearch />;
    }

    if (layout === "default") {
        departments = (
            <div className="nav-panel__departments">
                <Departments />
            </div>
        );
    }

    return (
        <div className="nav-panel">
            <div className="nav-panel__container container">
                <div className="nav-panel__row">
                    {logo}
                    {departments}

                    <div className="nav-panel__indicators align-items-center justify-content-between">
                        {/* {searchIndicator} */}

                        <div
                            className="site-header__search"
                            style={{
                                width: "100%",
                                marginRight: "20px",
                                flexGrow: 0,
                            }}
                        >
                            <Search context="header" />
                        </div>

                        {props.auth ? (
                            <>
                                <IndicatorChat />
                                <IndicatorCompare />
                                <IndicatorNotification />
                                <CartIndicator />
                                <IndicatorAccount />
                            </>
                        ) : (
                            <div className="d-flex justify-content-center align-items-center">
                                {/* <Link to="/login" style={{ borderRadius: '10px', background: 'rgb(255,98,33)', color: 'white' }} className="btn mr-2">
                                Sekolah
                            </Link> */}
                                <Link
                                    to="/login"
                                    style={{ borderRadius: "10px", background: "rgb(255,98,33)", color: "white" }}
                                    className="btn mr-2"
                                >
                                    Login
                                </Link>
                                <a
                                    style={{ borderRadius: "10px", background: "#0A6BB2", color: "white" }}
                                    className="btn "
                                    href={process.env.REACT_APP_URL_SELLER + "register"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Daftar
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

NavPanel.propTypes = {
    /** one of ['default', 'compact'] (default: 'default') */
    layout: PropTypes.oneOf(["default", "compact"]),
};

NavPanel.defaultProps = {
    layout: "default",
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(NavPanel);
