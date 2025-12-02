// react
import React, { useEffect, useReducer } from "react";

// third-party
import PropTypes from "prop-types";
import queryString from "query-string";
import { connect } from "react-redux";
import { Helmet } from "react-helmet-async";

// application
import BlockLoader from "../blocks/BlockLoader";
import CategorySidebar from "./CategorySidebar";
import CategorySidebarItem from "./CategorySidebarItem";
import ProductsView from "./ProductsView";
import shopApi from "../../api/shop";
import storeApi from "../../api/store";
import WidgetFilters from "../widgets/WidgetFilters";
import { sidebarClose } from "../../store/sidebar";

// data stubs
import theme from "../../data/theme";

function parseQueryOptions(location) {
    const query = queryString.parse(location);

    const optionValues = {
        page: 1,
        limit: 24,
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

    if (typeof query.categoryId === "string") {
        optionValues.categoryId = query.categoryId;
    }
    if (typeof query.locationId === "string") {
        optionValues.locationId = query.locationId;
    }
    if (typeof query.locationName === "string") {
        optionValues.locationName = query.locationName;
    }
    if (typeof query.longitude === "string") {
        optionValues.longitude = query.longitude;
    }
    if (typeof query.latitude === "string") {
        optionValues.latitude = query.latitude;
    }

    return optionValues;
}
function parseQueryKeyword(location) {
    const query = queryString.parse(location);

    let keyword = undefined;

    if (typeof query.keyword == "string") {
        keyword = query.keyword;
    }

    return keyword;
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
    return [parseQueryOptions(location), parseQueryFilters(location), parseQueryKeyword(location)];
}

function buildQuery(options, filters, keyword) {
    const params = {};

    if (options.page !== 1) {
        params.page = options.page;
    }

    if (options.limit !== 24) {
        params.limit = options.limit;
    }

    if (options.sort !== "default") {
        params.sort = options.sort;
    }

    if (options.longitude !== "") {
        params.longitude = options.longitude;
    }
    if (options.latidude !== "") {
        params.latidude = options.latidude;
    }
    if (options.locationName !== "") {
        params.locationName = options.locationName;
    }
    if (options.locationId !== "") {
        params.locationId = options.locationId;
    }
    if (options.categoryId !== "") {
        params.categoryId = options.categoryId;
    }

    if (keyword !== "" && keyword !== undefined && keyword !== null) {
        params.keyword = keyword;
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
    keyword: null,
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
            return {
                ...state,
                options: { ...state.options, page: 1, locationName: "", locationId: "", categoryId: "" },
                filters: {},
            };
        case "RESET":
            return state.init ? initialState : state;
        default:
            throw new Error();
    }
}

function init(state) {
    const [options, filters, keyword] = parseQuery(window.location.search);

    return { ...state, options, filters, keyword };
}

function ShopPageSearch(props) {
    const { columns, viewMode, sidebarPosition, customer } = props;
    const offcanvas = columns === 3 ? "mobile" : "always";
    const [state, dispatch] = useReducer(reducer, initialState, init);

    // Replace current url.
    useEffect(() => {
        const query = buildQuery(state.options, state.filters, state.keyword);

        const location = `${window.location.pathname}${query ? "?" : ""}${query}`;
        window.history.replaceState(null, "", location);
    }, [state.options, state.filters, state.keyword]);

    // Load products.
    useEffect(() => {
        let canceled = false;

        dispatch({ type: "FETCH_PRODUCTS_LIST" });
        if (state.keyword === "" || state.keyword === undefined) {
            props.history.push("/");
        }

        storeApi
            .getNewProducts(state.options, { ...state.filters }, state.keyword, customer?.token)
            .then((result) => {
                if (canceled) {
                    return;
                }

                console.log("ShopPageSearch - API result:", result);

                // Handle the new API response structure - items are nested in result.data.data
                const apiData = result.data?.data || result.data || result;
                console.log("ShopPageSearch - apiData:", apiData);
                console.log("ShopPageSearch - apiData.items:", apiData?.items);
                console.log("ShopPageSearch - apiData.filters:", apiData?.filters);
                console.log("ShopPageSearch - apiData.sorts:", apiData?.sorts);

                // Transform the response to match expected structure
                const transformedData = {
                    ...apiData,
                    page: state.options.page || 1,
                    // Calculate pages based on total items and limit
                    // Since the API doesn't return total count, we'll estimate or set a default
                    pages:
                        apiData.items && apiData.items.length < (apiData.limit || 10)
                            ? state.options.page || 1
                            : (state.options.page || 1) + 1,
                    // Ensure sorts array exists with default if not provided
                    sorts: apiData.sorts || [
                        { slug: "RELEVANCE", name: "Paling Sesuai", isSelected: true },
                        { slug: "name-asc", name: "Nama (A-Z)", isSelected: false },
                        { slug: "name-desc", name: "Nama (Z-A)", isSelected: false },
                        { slug: "price-asc", name: "Harga Terendah", isSelected: false },
                        { slug: "price-desc", name: "Harga Tertinggi", isSelected: false },
                    ],
                    // Ensure filters array exists
                    filters: apiData.filters || [],
                };

                console.log("ShopPageSearch - transformedData:", transformedData);
                console.log("ShopPageSearch - transformedData.filters:", transformedData.filters);

                dispatch({ type: "FETCH_PRODUCTS_LIST_SUCCESS", productsList: transformedData });
            })
            .catch((error) => {
                console.error("Search API Error:", error);
                if (canceled) return;

                // Set empty result on error
                dispatch({
                    type: "FETCH_PRODUCTS_LIST_SUCCESS",
                    productsList: {
                        items: [],
                        page: 1,
                        pages: 1,
                        limit: 24,
                        sorts: [],
                        filters: [],
                    },
                });
            });

        return () => {
            canceled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, state.keyword, state.options, state.filters, props.history]);

    if (state.productsListIsLoading && !state.productsList) {
        return <BlockLoader />;
    }

    let content;

    const productsView = (
        <ProductsView
            isLoading={state.productsListIsLoading}
            productsList={state.productsList || { items: [], sorts: [], filters: [] }}
            sorts={state.productsList?.sorts || []}
            options={state.options}
            filters={state.filters}
            dispatch={dispatch}
            layout={viewMode}
            grid={`grid-${columns}-${columns > 3 ? "full" : "sidebar"}`}
            offcanvas={offcanvas}
            keyword={state.keyword}
        />
    );

    const sidebarComponent = (
        <CategorySidebar offcanvas={offcanvas}>
            <CategorySidebarItem>
                <WidgetFilters
                    title="Filter"
                    offcanvas={offcanvas}
                    filters={(state.productsList?.filters || []).map((item) =>
                        item.type === "category" ? { ...item, selected: state.options.categoryId } : { ...item }
                    )}
                    values={{ ...state.filters, ...state.options }}
                    dispatch={dispatch}
                />
            </CategorySidebarItem>
        </CategorySidebar>
    );

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
            <div className="container mt-5">
                {state.productsList.categoryFiltered && (
                    <div className="page-header__title mt-1">
                        <h4>{state.productsList.categoryFiltered}</h4>
                    </div>
                )}
                <div className={`shop-layout shop-layout--sidebar--${sidebarPosition}`}>
                    {sidebarPosition === "start" && sidebar}
                    <div className="shop-layout__content">
                        <div className="block">{productsView}</div>
                    </div>
                    {sidebarPosition === "end" && sidebar}
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: "rgb(236,236,237)" }} className="pt-5">
            <Helmet>
                <title>{theme.name}</title>
            </Helmet>

            {content}
        </div>
    );
}

ShopPageSearch.propTypes = {
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
};

ShopPageSearch.defaultProps = {
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

export default connect(mapStateToProps, mapDispatchToProps)(ShopPageSearch);
