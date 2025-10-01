// react
import React, { Component } from "react";

// third-party
import classNames from "classnames";
import { connect } from "react-redux";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

// application
import { Menu18x14Svg, Search20Svg, Cart20Svg } from "../../svg";
import { mobileMenuOpen } from "../../store/mobile-menu";
import Indicator from "../header/Indicator";
import Search from "../header/Search";

class MobileHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchOpen: false,
        };
        this.searchInput = React.createRef();
    }

    componentDidUpdate(prevProps, prevState) {
        const { searchOpen } = this.state;

        if (searchOpen && searchOpen !== prevState.searchOpen && this.searchInput.current) {
            this.searchInput.current.focus();
        }
    }

    handleOpenSearch = () => {
        this.setState(() => ({ searchOpen: true }));
    };

    handleCloseSearch = () => {
        this.setState(() => ({ searchOpen: false }));
    };

    render() {
        const { openMobileMenu, miniCart, auth } = this.props;
        const { searchOpen } = this.state;
        const searchClasses = classNames("mobile-header__search", {
            "mobile-header__search--open": searchOpen,
        });

        return (
            <div className="mobile-header">
                <div className="mobile-header__panel">
                    <div className="container">
                        <div className="mobile-header__body">
                            <button type="button" className="mobile-header__menu-button" onClick={openMobileMenu}>
                                <Menu18x14Svg />
                            </button>
                            <Link to="/" className="mobile-header__logo">
                                <LazyLoadImage
                                    width="100%"
                                    height="100%"
                                    effect="opacity"
                                    alt="logo siplah"
                                    src={`${process.env.PUBLIC_URL}/images/logo.png`}
                                />
                            </Link>
                            <Search
                                context="mobile-header"
                                className={searchClasses}
                                inputRef={this.searchInput}
                                onClose={this.handleCloseSearch}
                            />
                            <div className="mobile-header__indicators">
                                <Indicator
                                    className="indicator--mobile indicator--mobile-search d-md-none"
                                    onClick={this.handleOpenSearch}
                                    icon={<Search20Svg />}
                                />
                                {auth && (
                                    <Indicator
                                        className="indicator--mobile"
                                        url="/shop/cart"
                                        value={miniCart.totalAllProduct}
                                        icon={<Cart20Svg />}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    cart: state.cart,
    miniCart: state.miniCart,
    auth: state.auth,
});

const mapDispatchToProps = {
    openMobileMenu: mobileMenuOpen,
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileHeader);
