// react
import React, { useCallback, useState } from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// application
import Pagination from "../shared/Pagination";
import ProductCard from "../shared/ProductCard";
import { Filters16Svg } from "../../svg";
import { sidebarOpen } from "../../store/sidebar";
import ModalNego from "../shared/ModalNego";
import { useMediaQuery } from "react-responsive";

function useSetOption(option, filter, dispatch) {
    const callback = useCallback(filter, []);

    return useCallback(
        (data) => {
            dispatch({
                type: "SET_OPTION_VALUE",
                option,
                value: callback(data),
            });
        },
        [option, callback, dispatch]
    );
}

function ProductsView(props) {
    const {
        isLoading,
        productsList,
        options,
        filters,
        dispatch,
        layout: propsLayout,
        grid,
        sorts,
        mainProduct,
        doHandleChooseProduct,
        keyword,
        doHandleFetchCompareList,
        offcanvas,
        forAct,
        customer,
        sidebarOpen,
    } = props;
    const [layout] = useState(propsLayout);
    let productsListItems;

    const isTabletOrMobile = useMediaQuery({ query: "(max-width:1224px)" });
    const handlePageChange = useSetOption("page", parseFloat, dispatch);
    const handleSortChange = useSetOption("sort", (event) => event.target.value, dispatch);
    const [searchKeyword, setSearchKeyword] = useState(options.keyword ?? "");

    const handleLimitChange = useSetOption("limit", (event) => parseFloat(event.target.value), dispatch);
    const [openNego, setOpenNego] = useState(false);
    const [agree, setAgree] = useState(false);

    const handleResetFilters = useCallback(() => {
        dispatch({ type: "RESET_FILTERS" });
    }, [dispatch]);

    const handleSearch = useCallback(() => {
        dispatch({ type: "SET_OPTION_VALUE", option: "keyword", value: searchKeyword });
    }, [dispatch, searchKeyword]);

    const filtersCount = Object.keys(filters)
        .map((x) => filters[x])
        .filter((x) => x).length;

    if (!productsList || !productsList.items || productsList.items.length === 0) {
        productsListItems = [];
    } else {
        productsListItems = productsList.items.map((product) => (
            <div key={product.id} className="products-list__item">
                <ProductCard
                    mainProduct={mainProduct}
                    dispatch={dispatch}
                    forAct={forAct}
                    doHandleChooseProduct={doHandleChooseProduct}
                    product={product}
                />
            </div>
        ));
    }

    const rootClasses = classNames("products-view", {
        "products-view--loading": isLoading,
    });

    const viewOptionsClasses = classNames("view-options", {
        "view-options--offcanvas--always": offcanvas === "always",
        "view-options--offcanvas--mobile": offcanvas === "mobile",
    });

    const handleOpenNego = () => {
        setOpenNego(!openNego);
    };

    let content;

    if (productsListItems.length > 0) {
        content = (
            <div className="products-view__content">
                <div
                    className="products-view__options"
                    style={
                        forAct === "compare"
                            ? {
                                  background: "white",
                                  zIndex: 99,
                                  position: "sticky",
                                  padding: "10px",
                                  top: 0,
                                  right: 0,
                              }
                            : {}
                    }
                >
                    <div className={viewOptionsClasses}>
                        <div className="view-options__filters-button">
                            {forAct === "compare" ? (
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
                            ) : (
                                <button type="button" className="filters-button" onClick={() => sidebarOpen()}>
                                    <Filters16Svg className="filters-button__icon" />
                                    <span className="filters-button__title">Filters</span>
                                    {!!filtersCount && <span className="filters-button__counter">{filtersCount}</span>}
                                </button>
                            )}
                        </div>

                        <div className="view-options__divider" />
                        {forAct === "compare" ? (
                            <div className="view-options__control">
                                <div className="row" style={{ width: "45rem" }}>
                                    <div className="col-lg-4 col-sm-12">
                                        <div className="form-group">
                                            <div
                                                className="btn btn-primary btn-md"
                                                onClick={() => {
                                                    dispatch({
                                                        type: "SET_FILTER_VALUE",
                                                        filter: "closest",
                                                        value:
                                                            filters.closest === 0 || filters.closest === undefined
                                                                ? 1
                                                                : 0,
                                                    });
                                                }}
                                            >
                                                Filter lokasi terdekat
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-8 col-12">
                                        <div className="site-header__search">
                                            <div className="search search--location--header">
                                                <div className="search__body">
                                                    <div className="search__form">
                                                        <input
                                                            className="search__input"
                                                            value={searchKeyword}
                                                            onChange={(e) => setSearchKeyword(e.target.value)}
                                                            placeholder="Cari toko atau produk..."
                                                            name="keyword"
                                                            aria-label="Site search"
                                                            type="text"
                                                            autoComplete="off"
                                                        />
                                                        <button
                                                            className="search__button search__button--type--submit text-light"
                                                            type="submit"
                                                            onClick={handleSearch}
                                                        >
                                                            Cari
                                                            {/* <Search20Svg /> */}
                                                        </button>
                                                        <div className="search__border" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {isLoading && <h4 className="my-2">Sedang mencari...</h4>}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="view-options__control">
                                    <label htmlFor="view-options-sort">Urut Berdasarkan</label>
                                    <div>
                                        <select
                                            style={{ borderRadius: "10px" }}
                                            id="view-options-sort"
                                            className="form-control form-control-sm"
                                            // value={options.sort || productsList.sort}
                                            onChange={handleSortChange}
                                        >
                                            {sorts.map((item) => (
                                                <option selected={item.isSelected} value={item.slug}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="view-options__control">
                                    <label htmlFor="view-options-limit">Tampil</label>
                                    <div>
                                        <select
                                            style={{ borderRadius: "10px" }}
                                            id="view-options-limit"
                                            className="form-control form-control-sm"
                                            value={options.limit || productsList.limit}
                                            onChange={handleLimitChange}
                                        >
                                            <option value="6">6</option>
                                            <option value="12">12</option>
                                            <option value="18">18</option>
                                            <option value="24">24</option>
                                        </select>
                                    </div>
                                </div>
                                {forAct === "store" && (
                                    <div
                                        className={classNames(`site-header__search`, {
                                            "ml-4": !isTabletOrMobile,
                                            "w-100 mt-2": isTabletOrMobile,
                                        })}
                                    >
                                        <div className="search search--location--header">
                                            <div className="search__body">
                                                <div className="search__form">
                                                    <input
                                                        className="search__input"
                                                        value={searchKeyword}
                                                        onChange={(e) => setSearchKeyword(e.target.value)}
                                                        placeholder="Cari produk..."
                                                        name="keyword"
                                                        aria-label="Site search"
                                                        type="text"
                                                        autoComplete="off"
                                                    />
                                                    <button
                                                        className="search__button search__button--type--submit text-light"
                                                        type="submit"
                                                        onClick={handleSearch}
                                                    >
                                                        Cari
                                                        {/* <Search20Svg /> */}
                                                    </button>
                                                    <div className="search__border" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div
                    className="products-view__list products-list"
                    data-layout={layout !== "list" ? grid : layout}
                    data-with-features={layout === "grid-with-features" ? "true" : "false"}
                >
                    <div className="products-list__body">{productsListItems}</div>
                </div>

                <div className="products-view__pagination">
                    <Pagination
                        current={options.page || productsList.page}
                        siblings={2}
                        total={productsList.pages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        );
    } else {
        content = (
            <div className="products-view__content">
                <div className="products-view__options">
                    <div className={viewOptionsClasses}>
                        <div className="view-options__filters-button">
                            {forAct === "compare" && (
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-12">
                                                <img
                                                    alt={mainProduct.name}
                                                    src={mainProduct.image}
                                                    style={{
                                                        opacity: 0.7,
                                                        display: "block",
                                                        width: "100%",
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
                            )}
                        </div>

                        <div className="view-options__divider" />
                        {forAct === "compare" && (
                            <div className="view-options__control">
                                <div className="row" style={{ width: "45rem" }}>
                                    <div className="col-lg-4 col-sm-12">
                                        <div className="form-group">
                                            <div
                                                className="btn btn-primary btn-md"
                                                onClick={() => {
                                                    dispatch({
                                                        type: "SET_FILTER_VALUE",
                                                        filter: "closest",
                                                        value:
                                                            filters.closest === 0 || filters.closest === undefined
                                                                ? 1
                                                                : 0,
                                                    });
                                                }}
                                            >
                                                Filter lokasi terdekat
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-8 col-sm-12">
                                        <div className="site-header__search">
                                            <div className="search search--location--header">
                                                <div className="search__body">
                                                    <div className="search__form">
                                                        <input
                                                            className="search__input"
                                                            value={searchKeyword}
                                                            onChange={(e) => setSearchKeyword(e.target.value)}
                                                            placeholder="Cari toko atau produk..."
                                                            name="keyword"
                                                            aria-label="Site search"
                                                            type="text"
                                                            autoComplete="off"
                                                        />
                                                        <button
                                                            className="search__button search__button--type--submit text-light"
                                                            type="submit"
                                                            onClick={handleSearch}
                                                        >
                                                            Cari
                                                            {/* <Search20Svg /> */}
                                                        </button>
                                                        <div className="search__border" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {isLoading && <h4 className="my-2">Sedang mencari...</h4>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="products-view__empty position-relative">
                    <div className="products-view__empty-title">Data Tidak Ditemukan</div>

                    {forAct === "compare" ? (
                        <>
                            <button
                                type="button"
                                onClick={handleOpenNego}
                                disabled={!agree}
                                className="btn btn-danger btn-sm ml-2 d-block"
                            >
                                Nego Barang
                            </button>
                        </>
                    ) : (
                        <button type="button" className="btn btn-secondary btn-sm" onClick={handleResetFilters}>
                            Reset Filter
                        </button>
                    )}

                    {forAct === "compare" && (
                        <div class="form-check d-block position-absolute" style={{ bottom: "10px", left: "10px" }}>
                            <label class="form-check-label">
                                <input
                                    onChange={() => setAgree(!agree)}
                                    type="checkbox"
                                    class="form-check-input"
                                    name=""
                                    value="checkedValue"
                                    checked={agree}
                                />
                                Saya selaku satdik, menyatakan bahwa tidak menemukan barang yang serupa dipenyedia
                                sekitar sekolah. oleh karena itu saya akan melanjutkan untuk negosiasi barang tersebut.
                            </label>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    let zone = "";
    if (Object.keys(customer).length > 0) {
        zone = customer?.school?.location?.zone;
    }

    return (
        <div className={rootClasses}>
            <div className="products-view__loader" />
            {keyword && <h6>Kata Kunci "{keyword}"</h6>}

            {content}
            {forAct === "compare" && (
                <ModalNego
                    agree={agree}
                    doHandleFetchCompareList={doHandleFetchCompareList}
                    token={customer.token}
                    open={openNego}
                    product={mainProduct}
                    zone={zone}
                    forAct={forAct}
                    toggle={handleOpenNego}
                />
            )}
        </div>
    );
}

ProductsView.propTypes = {
    /**
     * Indicates that products is loading.
     */
    isLoading: PropTypes.bool,
    /**
     * ProductsList object.
     */
    productsList: PropTypes.object,
    /**
     * Products list options.
     */
    options: PropTypes.object,
    /**
     * Products list filters.
     */
    filters: PropTypes.object,
    /**
     * Category page dispatcher.
     */
    dispatch: PropTypes.func,
    /**
     * products list layout (default: 'grid')
     * one of ['grid', 'grid-with-features', 'list']
     */
    layout: PropTypes.oneOf(["grid", "grid-with-features", "list"]),
    /**
     * products list layout (default: 'grid')
     * one of ['grid-3-sidebar', 'grid-4-full', 'grid-5-full']
     */
    grid: PropTypes.oneOf(["grid-3-sidebar", "grid-4-full", "grid-5-full"]),
    /**
     * indicates when sidebar should be off canvas
     */
    offcanvas: PropTypes.oneOf(["always", "mobile"]),
    keyword: PropTypes.string,
};

ProductsView.defaultProps = {
    layout: "grid",
    grid: "grid-3-sidebar",
    offcanvas: "mobile",
    keyword: "",
};

const mapDispatchToProps = {
    sidebarOpen,
};

const mapStateToProps = (state) => ({ customer: state.customer });

export default connect(mapStateToProps, mapDispatchToProps)(ProductsView);
