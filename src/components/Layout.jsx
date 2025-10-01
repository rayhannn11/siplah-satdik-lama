// react
import React, { lazy } from "react";

// third-party
import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { connect } from "react-redux";
import { useMediaQuery } from "react-responsive";

// data stubs
import theme from "../data/theme";
import { newMessageAdd } from "../store/new-message";
import SitePageFaq from "./site/SitePageFaq";
import SitePagePaymentMethod from "./site/SitePagePaymentMethod";
// import ShopPageCheckout from "./shop/ShopPageCheckout";

const SiteTutorial = lazy(() => import("./site/SiteTutorial"));
// application
const Footer = lazy(() => import("./footer"));
const Header = lazy(() => import("./header"));
const MobileHeader = lazy(() => import("./mobile/MobileHeader"));
const MobileMenu = lazy(() => import("./mobile/MobileMenu"));
const Quickview = lazy(() => import("./shared/Quickview"));
const AccountLayout = lazy(() => import("./account/AccountLayout"));
const AccountPageLogin = lazy(() => import("./account/AccountPageLogin"));
const AccountPageLoginv22 = lazy(() => import("./account/AccountPageLoginv22"));
const ShopPageProduct = lazy(() => import("./shop/ShopPageProduct"));
const SitePageAboutUs = lazy(() => import("./site/SitePageAboutUs"));
const SitePageNotFound = lazy(() => import("./site/SitePageNotFound"));
const SitePrivacyPolicy = lazy(() => import("./site/SitePrivacyPolicy"));
const SiteProductPolicy = lazy(() => import("./site/SiteProductPolicy"));
const SiteTermsAndConditions = lazy(() => import("./site/SiteTermsAndConditions"));
const AccountRegister = lazy(() => import("./account/AccountRegister"));
const Store = lazy(() => import("./store/Store"));
const ShopProducts = lazy(() => import("./shop/ShopProducts"));
const PageStores = lazy(() => import("./store/PageStores"));
const PrivateRoute = lazy(() => import("./routes/PrivateRoute"));
const SitePageTechnicalSupport = lazy(() => import("./site/SitePageTechnicalSupport"));
const ShopPageSearch = lazy(() => import("./shop/ShopPageSearch"));
const ShopLayout = lazy(() => import("./shop/ShopLayout"));
const LoginRoute = lazy(() => import("./routes/LoginRoute"));
const Topbar = lazy(() => import("./header/Topbar"));

function Layout(props) {
    const { match, headerLayout, homeComponent } = props;
    const isDesktopOrLaptop = useMediaQuery({
        query: "(min-width: 1224px)",
    });

    return (
        <React.Fragment>
            <Helmet>
                <title>{theme.name}</title>
                <meta name="description" content={theme.fullName} />
            </Helmet>

            <ToastContainer autoClose={5000} hideProgressBar />

            <Quickview />
            {!isDesktopOrLaptop && <MobileMenu />}

            <div className="site">
                <header
                    className="site__header d-lg-none"
                    style={{
                        zIndex: 100,
                        position: "sticky",
                        top: 0,
                        left: 0,
                    }}
                >
                    <MobileHeader />
                </header>
                {isDesktopOrLaptop && (
                    <>
                        <div className="site__header d-lg-block d-none">
                            <Topbar />
                        </div>

                        <header
                            className="site__header d-lg-block d-none"
                            style={{
                                zIndex: 100,
                                position: "sticky",
                                top: 0,
                                left: 0,
                            }}
                        >
                            <Header layout={headerLayout} />
                        </header>
                    </>
                )}

                <div className="site__body">
                    <Switch>
                        {/*
                        // Home
                        */}
                        <Route exact path={`${match.path}`} component={homeComponent} />

                        {/* 
                            Store
                        */}
                        <Route exact path={`${match.path}store/:slug`} component={Store} />
                        <Route
                            exact
                            path="/product/:mallId/:productSlug"
                            render={(props) => (
                                <ShopPageProduct
                                    {...props}
                                    layout="standard"
                                    productSlug={props.match.params.productSlug}
                                    mallId={props.match.params.mallId}
                                />
                            )}
                        />
                        <Route
                            exact
                            path={`${match.path}store`}
                            render={(props) => <PageStores {...props} layout="default" />}
                        />

                        {/*
                        // Shop
                        */}
                        <Route
                            exact
                            path={["/products/category/:categoryId/:slug", "/products/category/:slug"]}
                            render={(props) => (
                                <ShopProducts {...props} columns={3} viewMode="grid" sidebarPosition="start" />
                            )}
                        />
                        <Route
                            exact
                            path="/products/search"
                            render={(props) => (
                                <ShopPageSearch {...props} columns={3} viewMode="grid" sidebarPosition="start" />
                            )}
                        />

                        {/*
                        // Account
                        */}
                        <LoginRoute auth={props.auth} exact path="/login" component={AccountPageLogin} />
                        <LoginRoute auth={props.auth} exact path="/loginv22" component={AccountPageLoginv22} />
                        <Route exact path="/register" component={AccountRegister} />

                        <PrivateRoute auth={props.auth} path="/account" component={AccountLayout} />

                        <PrivateRoute auth={props.auth} path="/shop" component={ShopLayout} />

                        {/*
                        // Site
                        */}
                        <Route exact path="/site/faq" component={SitePageFaq} />
                        <Route exact path="/site/how-to-pay" component={SitePagePaymentMethod} />
                        <Route exact path="/site/about" component={SitePageAboutUs} />
                        <Route exact path="/site/technical-support" component={SitePageTechnicalSupport} />
                        <Route exact path="/site/privacy-policy" component={SitePrivacyPolicy} />
                        <Route
                            exact
                            path="/site/kebijakan-produk-siplah-eurekabookhouse-kemendikbud"
                            component={SiteProductPolicy}
                        />
                        <Route exact path="/site/terms-and-conditions" component={SiteTermsAndConditions} />
                        <Route exact path="/site/not-found" component={SitePageNotFound} />
                        <Route exact path="/site/tutorial" component={SiteTutorial} />

                        {/*
                        // Page Not Found
                        */}
                        <Route component={SitePageNotFound} />
                    </Switch>
                </div>

                <footer className="site__footer">
                    <Footer />
                </footer>
            </div>
        </React.Fragment>
    );
}

Layout.propTypes = {
    /**
     * header layout (default: 'classic')
     * one of ['classic', 'compact']
     */
    headerLayout: PropTypes.oneOf(["default", "compact"]),
    /**
     * home component
     */
    homeComponent: PropTypes.elementType.isRequired,
};

Layout.defaultProps = {
    headerLayout: "default",
};

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        customer: state.customer,
        auth: state.auth
    };
};

const mapDispatchToProps = {
    newMessageAdd,
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
