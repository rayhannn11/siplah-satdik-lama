// react
import React, { useEffect, useState } from "react";

// third-party
import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";

// application
import Product from "../shared/Product";
import ProductTabs from "./ProductTabs";
import shopApi from "../../api/shop";

// blocks
import BlockLoader from "../blocks/BlockLoader";

// widgets
import WidgetCategories from "../widgets/WidgetCategories";

// data stubs
import categories from "../../data/shopWidgetCategories";
import theme from "../../data/theme";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

function ShopPageProduct(props) {
    const { productSlug, layout, sidebarPosition, mallId, customer } = props;
    const [isLoading, setIsLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const history = useHistory();

    // Load product.
    useEffect(() => {
        let canceled = false;

        setIsLoading(true);

        shopApi.getProductBySlug(productSlug, mallId, customer.token).then((res) => {
            const { status, data } = res;
            if (canceled) {
                return;
            }
            if (status.code !== 200) {
                return history.push("/");
            }

            setProduct(data);
            setIsLoading(false);
        });

        return () => {
            canceled = true;
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productSlug, setIsLoading, mallId]);

    if (isLoading && product == null) {
        return <BlockLoader />;
    }

    let content;

    if (layout === "sidebar") {
        const sidebar = (
            <div className="shop-layout__sidebar">
                <div className="block block-sidebar">
                    <div className="block-sidebar__item">
                        <WidgetCategories categories={categories} location="shop" />
                    </div>
                </div>
            </div>
        );

        content = (
            <div className="container mt-3">
                <div className={`shop-layout shop-layout--sidebar--${sidebarPosition}`}>
                    {sidebarPosition === "start" && sidebar}
                    <div className=" shop-layout__content">
                        <div className=" block">
                            <Product product={product} layout={layout} />
                            <ProductTabs product={product} withSidebar />
                        </div>
                    </div>
                    {sidebarPosition === "end" && sidebar}
                </div>
            </div>
        );
    } else {
        content = (
            <React.Fragment>
                <div className="block pt-5 mb-0 pb-5" style={{backgroundColor:'rgb(236, 236, 237)'}}>
                    <div className="container">
                        <Product product={product} layout={layout} />
                        <ProductTabs product={product} />
                    </div>
                </div>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>{`${product.name} — ${theme.name}`}</title>
            </Helmet>

            {content}
        </React.Fragment>
    );
}

ShopPageProduct.propTypes = {
    /** Product slug. */
    productSlug: PropTypes.string,
    /** one of ['standard', 'sidebar', 'columnar', 'quickview'] (default: 'standard') */
    layout: PropTypes.oneOf(["standard", "sidebar", "columnar", "quickview"]),
    /**
     * sidebar position (default: 'start')
     * one of ['start', 'end']
     * for LTR scripts "start" is "left" and "end" is "right"
     */
    sidebarPosition: PropTypes.oneOf(["start", "end"]),
};

ShopPageProduct.defaultProps = {
    layout: "standard",
    sidebarPosition: "start",
};

const mapStateToProps = (state) => ({ customer: state.customer });

export default connect(mapStateToProps, () => {})(ShopPageProduct);
