// react
import React, { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";

// third-party
import PropTypes from "prop-types";
import queryString from "query-string";
import { connect } from "react-redux";

// application
import BlockLoader from "../blocks/BlockLoader";
import CategorySidebar from "./CategorySidebar";
import CategorySidebarItem from "./CategorySidebarItem";
import ProductsView from "./ProductsView";
import shopApi from "../../api/shop";
import WidgetFilters from "../widgets/WidgetFilters";
import { sidebarClose } from "../../store/sidebar";

function parseQueryOptions(location) {
    const query = queryString.parse(location);

    const optionValues = {
        page: 1,
        limit: 6,
        from: "",
        fromProductId: "",
    };

    if (typeof query.page === "string") {
        optionValues.page = parseFloat(query.page);
    }
    if (typeof query.limit === "string") {
        optionValues.limit = parseFloat(query.limit);
    }
    if (typeof query.sort === "string") {
        optionValues.sort = query.sort;
    }
    if (typeof query.keyword === "string") {
        optionValues.keyword = query.keyword;
    }
    if (typeof query.from === "string") {
        optionValues.from = query.from;
    }
    if (typeof query.fromProductId === "string") {
        optionValues.fromProductId = query.fromProductId;
    }
    if (typeof query.categoryId === "string") {
        optionValues.categoryId = query.categoryId;
    }

    return optionValues;
}

function parseQueryFilters(location) {
    const query = queryString.parse(location);
    const filterValues = {};

    Object.keys(query).forEach((param) => {
        const mr = param.match(/^filter_([-_A-Za-z0-9]+)$/);

        if (!mr) {
            return;
        }

        const filterSlug = mr[1];

        filterValues[filterSlug] = query[param];
    });

    return filterValues;
}

function parseQuery(location) {
    return [parseQueryOptions(location), parseQueryFilters(location)];
}

function buildQuery(options, filters) {
    const params = {};

    if (options.page !== 1) {
        params.page = options.page;
    }

    if (options.limit !== 6) {
        params.limit = options.limit;
    }

    if (options.sort !== "") {
        params.sort = options.sort;
    }
    if (options.keyword !== "") {
        params.keyword = options.keyword;
    }

    if (options.from !== "") {
        params.from = options.from;
    }
    if (options.fromProductId !== "") {
        params.fromProductId = options.fromProductId;
    }

    if (options.categoryId !== "") {
        params.categoryId = options.categoryId;
    }

    Object.keys(filters)
        .filter((x) => !!filters[x])
        .forEach((filterSlug) => {
            params[`filter_${filterSlug}`] = filters[filterSlug];
        });

    return queryString.stringify(params, { encode: false });
}

const initialState = {
    init: false,
    /**
     * Indicates that the category is loading.
     */
    categoryIsLoading: true,
    /**
     * Category object.
     */
    category: null,
    /**
     * Indicates that the products list is loading.
     */
    productsListIsLoading: true,
    /**
     * Products list.
     */
    productsList: null,
    /**
     * Products list options.
     *
     * options.page:  number - Current page.
     * options.limit: number - Items per page.
     * options.sort:  string - Sort algorithm.
     */
    options: {},
    /**
     * Products list filters.
     *
     * filters[FILTER_SLUG]: string - filter value.
     */
    filters: {},
    // categoryName: "",
    // categoryId: "",
};

function reducer(state, action) {
    switch (action.type) {
        case "FETCH_CATEGORY_SUCCESS":
            return {
                ...state,
                init: true,
                categoryIsLoading: false,
                category: action.category,
            };
        case "FETCH_PRODUCTS_LIST":
            return { ...state, productsListIsLoading: true };
        case "FETCH_PRODUCTS_LIST_SUCCESS":
            return { ...state, productsListIsLoading: false, productsList: action.productsList };
        case "SET_OPTION_VALUE":
            return {
                ...state,
                options: { ...state.options, page: 1, [action.option]: action.value },
            };
        case "SET_FILTER_VALUE":
            return {
                ...state,
                options: { ...state.options, page: 1 },
                filters: { ...state.filters, [action.filter]: action.value },
            };
        case "RESET_FILTERS":
            return { ...state, options: { page: 1, limit: 6 }, filters: {} };
        case "RESET":
            return state.init ? initialState : state;
        default:
            throw new Error();
    }
}

function init(state) {
    const [options, filters] = parseQuery(window.location.search);

    return { ...state, options, filters };
}

function ShopProducts(props) {
    const {
        columns,
        viewMode,
        sidebarPosition,
        store,
        storeData,
        forAct,
        doHandleChooseProduct,
        mainProduct,
        customer,
        doHandleFetchCompareList,
    } = props;
    const offcanvas = columns === 3 ? "mobile" : "always";
    const [state, dispatch] = useReducer(reducer, initialState, init);
    let { slug, categoryId } = useParams();

    // Replace current url.
    useEffect(() => {
        const query = buildQuery(state.options, state.filters);

        const location = `${window.location.pathname}${query ? "?" : ""}${query}`;
        window.history.replaceState(null, "", location);
    }, [state.options, state.filters]);

    if (store !== "" && store !== undefined) {
        slug = store;
    }
    // Load products.
    useEffect(() => {
        let canceled = false;
        dispatch({ type: "FETCH_PRODUCTS_LIST" });
        shopApi
            .getProducts({ ...state.options }, { ...state.filters }, slug, categoryId, customer?.token)
            .then((result) => {
                const { data } = result;
                if (canceled) {
                    return;
                }

                if (!forAct) {
                    dispatch({
                        type: "FETCH_PRODUCTS_LIST_SUCCESS",
                        productsList: { ...data, filters: data.filters.filter((item) => item.type !== "category") },
                    });
                } else {
                    dispatch({ type: "FETCH_PRODUCTS_LIST_SUCCESS", productsList: data });
                }
            });

        return () => {
            canceled = true;
        };
        //eslint-disable-next-line
    }, [dispatch, slug, store, categoryId, state.categoryName, state.options, state.filters, customer?.token]);

    if (state.productsListIsLoading && !state.productsList) {
        return <BlockLoader />;
    }

    let content;

    // if (state.category) {
    //     getCategoryParents(state.category).forEach((parent) => {
    //         breadcrumb.push({ title: parent.name, url: url.category(parent) });
    //     });

    //     breadcrumb.push({ title: state.category.name, url: url.category(state.category) });

    //     pageTitle = state.category.name;
    // }

    const productsView = (
        <ProductsView
            forAct={forAct}
            storeData={storeData}
            doHandleChooseProduct={doHandleChooseProduct}
            isLoading={state.productsListIsLoading}
            productsList={state.productsList}
            mainProduct={mainProduct}
            sorts={state.productsList.sorts}
            options={state.options}
            filters={state.filters}
            dispatch={dispatch}
            layout={viewMode}
            doHandleFetchCompareList={doHandleFetchCompareList}
            grid={`grid-${columns}-${columns > 3 ? "full" : "sidebar"}`}
            offcanvas={offcanvas}
        />
    );

    let sidebarComponent = (
        <CategorySidebar offcanvas={offcanvas}>
            <CategorySidebarItem>
                <WidgetFilters
                    title="Filter"
                    offcanvas={offcanvas}
                    filters={state.productsList.filters}
                    values={state.filters}
                    dispatch={dispatch}
                />
            </CategorySidebarItem>
        </CategorySidebar>
    );

    if (forAct === "compare") {
        sidebarComponent = (
            <CategorySidebar offcanvas={offcanvas} style={{ position: "sticky", top: "10px", left: 0 }}>
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12">
                                <img
                                    alt=""
                                    src={mainProduct.image}
                                    style={{
                                        width: "100%",
                                        opacity: 0.7,
                                        display: "block",
                                        height: "auto",
                                        transition: ".5s ease",
                                        backfaceVisibility: "hidden",
                                    }}
                                />
                            </div>
                            <div
                                className="col-12 text-center"
                                style={{
                                    position: "absolute",
                                    top: " 50%",
                                    left: " 50%",
                                    transform: "translate(-50%, -50%)",
                                    msTransform: "translate(-50%, -50%)",
                                    textAlign: "center",
                                    background: "rgba(0,0,0,.5)",
                                    padding: "17px",
                                    color: "white",
                                }}
                            >
                                <h5>{mainProduct.name}</h5>
                                <h6>{mainProduct.priceCurrencyFormat}</h6>
                                <h6>Jumlah : {mainProduct.qty}</h6>
                                <span class="badge badge-primary">Barang Yang Dibandingkan</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CategorySidebar>
        );
    }

    if (columns > 4) {
        content = (
            <div className="container mt-5">
                <div className="block">{productsView}</div>
                {sidebarComponent}
            </div>
        );
    } else {
        const sidebar = <div className="shop-layout__sidebar">{sidebarComponent}</div>;

        content = (
            <div style={{ background: "rgb(236,236,237)" }} className="pt-5">
                <div className="container">
                    <div className={`shop-layout shop-layout--sidebar--${sidebarPosition}`}>
                        {sidebarPosition === "start" && sidebar}
                        <div className="shop-layout__content">
                            <div className="block">{productsView}</div>
                        </div>
                        {sidebarPosition === "end" && sidebar}
                    </div>
                </div>
            </div>
        );
    }

    return <React.Fragment>{content}</React.Fragment>;
}

ShopProducts.propTypes = {
    /**
     * Category slug.
     */
    categorySlug: PropTypes.string,
    /**
     * number of product columns (default: 3)
     */
    columns: PropTypes.number,
    /**
     * mode of viewing the list of products (default: 'grid')
     * one of ['grid', 'grid-with-features', 'list']
     */
    viewMode: PropTypes.oneOf(["grid", "grid-with-features", "list"]),
    /**
     * sidebar position (default: 'start')
     * one of ['start', 'end']
     * for LTR scripts "start" is "left" and "end" is "right"
     */
    sidebarPosition: PropTypes.oneOf(["start", "end"]),
    forAct: PropTypes.string,
};

ShopProducts.defaultProps = {
    columns: 3,
    viewMode: "grid",
    sidebarPosition: "start",
};

const mapStateToProps = (state) => ({
    sidebarState: state.sidebar,
    page: state.category,
    customer: state.customer,
});

const mapDispatchToProps = () => ({
    sidebarClose,
});

export default connect(mapStateToProps, mapDispatchToProps)(ShopProducts);
