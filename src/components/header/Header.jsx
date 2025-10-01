// react
import React, { lazy } from "react";

// third-party
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

// application

const NavPanel = lazy(() => import("./NavPanel"));
// const Search = lazy(() => import("./Search"));

function Header(props) {
    const { layout } = props;
    let bannerSection;

    if (layout === "default") {
        bannerSection = (
            <div className="site-header__middle container">
                <div className="site-header__logo">
                    <Link to="/">
                        <LazyLoadImage
                            alt="logo siplah eureka"
                            effect="opacity"
                            src={`${process.env.PUBLIC_URL}/images/logo.png`}
                            style={{ width: "90%" }}
                        />
                    </Link>
                </div>
                <div className="site-header__search">
                    {/* <Search context="header" /> */}
                </div>
                <div className="site-header__phone">
                    <div className="site-header__phone-title">
                        <FormattedMessage id="header.phoneLabel" defaultMessage="Customer Service" />
                    </div>
                    <div className="site-header__phone-number">
                        <a rel="noopener noreferrer" className="text-dark" href="https://wa.me/6282111972195" target="_blank">
                            <i className="footer-contacts__icon fab fa-whatsapp" />
                            0821 1197 2195
                        </a>
                        {/* <FormattedMessage id="header.phone1" defaultMessage="0822 6025 5552" /> */}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="site-header">
            {bannerSection}
            <div className="site-header__nav-panel">
                <NavPanel layout={layout} />
            </div>
        </div>
    );
}

Header.propTypes = {
    /** one of ['default', 'compact'] (default: 'default') */
    layout: PropTypes.oneOf(["default", "compact"]),
};

Header.defaultProps = {
    layout: "default",
};

export default Header;
