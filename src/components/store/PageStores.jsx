/*eslint eqeqeq: "error"*/
/*react-hooks/exhaustive-deps:"error" */
import React, { useEffect, useReducer, useRef } from "react";

// api
import territory from "../../api/territory";
import store from "../../api/store";

// third-party
import queryString from "query-string";
import propTypes from "prop-types";

// application
import StoreView from "./StoreView";

// constant
import {
    FETCH_CITY_LIST,
    FETCH_CITY_LIST_SUCCESS,
    FETCH_DISTRICT_LIST,
    FETCH_DISTRICT_LIST_SUCCESS,
    FETCH_PROVINCE_LIST,
    FETCH_PROVINCE_LIST_SUCCESS,
    FETCH_STORE_LIST,
    FETCH_STORE_LIST_SUCCESS,
    SELECTED_CITY,
    SELECTED_DISTRICT,
    SELECTED_PROVINCE,
    SET_FILTER_VALUE,
    SET_OPTION_VALUE,
    SET_SEARCH_VALUE,
} from "../../data/constant";
import { connect } from "react-redux";

function parseQueryOptions(location) {
    const query = queryString.parse(location);

    const optionValues = {
        page: 1,
        limit: 10,
    };

    if (typeof query.page === "string") {
        optionValues.page = parseFloat(query.page);
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

function parseQueryKeyword(location) {
    const query = queryString.parse(location);
    let keyword;
    if (typeof query.keyword === "string") {
        keyword = query.keyword;
    }

    return keyword;
}

function parseQuery(location) {
    return [parseQueryOptions(location), parseQueryFilters(location), parseQueryKeyword(location)];
}

function buildQuery(options, filters, keyword) {
    const params = { keyword };

    if (options.page !== 1) {
        params.page = options.page;
    }

    Object.keys(filters)
        .filter((x) => x !== "category" && !!filters[x])
        .forEach((filterSlug) => {
            params[`filter_${filterSlug}`] = filters[filterSlug];
        });

    return queryString.stringify(params, { encode: false });
}

const initialState = {
    /*
        loading province
    */
    provinceIsLoading: true,
    /*
        list province
    */
    provincesList: [],
    /*
        selected province
    */
    selectedProvince: null,
    /*
        loading city
    */
    cityIsLoading: false,
    /*
    city list
   */
    citiesList: [],
    /*
    selected city
  */
    selectedCity: null,
    /*
        loading district
    */
    districtIsLoading: false,
    /*
    district list
   */
    districtsList: [],
    /*
    selected district
  */
    selectedDistrict: null,
    /*
        filter
    */
    filters: {},
    /*
        options
    */
    options: {},
    /*
        stores
    */
    storeList: [],

    storeIsLoading: true,
    keyword: null,
};

function reducer(state, action) {
    switch (action.type) {
        case FETCH_PROVINCE_LIST:
            return {
                ...state,
                provinceIsLoading: true,
            };
        case FETCH_PROVINCE_LIST_SUCCESS:
            return {
                ...state,
                provinceIsLoading: false,
                provincesList: action.provincesList,
            };
        case SELECTED_PROVINCE:
            return {
                ...state,
                selectedProvince: action.selectedProvince,
                citiesList: null,
                districtsList: null,
                selectedCity: null,
                selectedDistrict: null,
                filters: { province: state.filters.province },
            };
        case FETCH_CITY_LIST:
            return {
                ...state,
                cityIsLoading: true,
            };
        case FETCH_CITY_LIST_SUCCESS:
            return {
                ...state,
                cityIsLoading: false,
                citiesList: action.citiesList,
            };
        case SELECTED_CITY:
            return {
                ...state,
                selectedCity: action.selectedCity,
                selectedDistrict: null,
                filters: { province: state.filters.province, city: state.filters.city },
            };
        case FETCH_DISTRICT_LIST:
            return {
                ...state,
                districtIsLoading: true,
            };
        case FETCH_DISTRICT_LIST_SUCCESS:
            return {
                ...state,
                districtIsLoading: false,
                districtsList: action.districtsList,
            };
        case SELECTED_DISTRICT:
            return {
                ...state,
                selectedDistrict: action.selectedDistrict,
            };
        case SET_FILTER_VALUE:
            return {
                ...state,
                options: { ...state.options, page: 1 },
                filters: { ...state.filters, [action.filter]: action.value },
            };
        case FETCH_STORE_LIST:
            return { ...state, storeIsLoading: true };
        case FETCH_STORE_LIST_SUCCESS:
            return { ...state, storeIsLoading: false, storeList: action.storeList };
        case SET_OPTION_VALUE:
            return {
                ...state,
                options: { ...state.options, page: 1, [action.option]: action.value },
            };
        case SET_SEARCH_VALUE:
            return {
                ...state,
                keyword: action.keyword,
                options: { ...state.options, page: 1 },
            };
        default:
            throw new Error();
    }
}

function init(state) {
    const [options, filters, keyword] = parseQuery(window.location.search);

    return { ...state, options, filters, keyword };
}

const Stores = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState, init);
    const { layout, doHandleChooseStore, customer } = props;
    const queryPars = queryString.parse(window.location.search);
    const typingTimeoutRef = useRef(null);

    // Replace current url.
    useEffect(() => {
        const query = buildQuery(state.options, state.filters);
        const location = `${window.location.pathname}${query ? "?" : ""}${query}`;
        window.history.replaceState(null, "", location);
    }, [state.options, state.filters]);

    useEffect(() => {
        if (queryPars.keyword !== state.keyword) {
            dispatch({ type: SET_SEARCH_VALUE, keyword: queryPars.keyword });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryPars.keyword]);

    // load store list
    useEffect(() => {
        // kalau keyword kosong -> langsung fetch
        if (!state.keyword) {
            dispatch({ type: FETCH_STORE_LIST });
            store.getStores(state.options, { ...state.filters }, undefined, customer.token).then((res) => {
                const { data } = res;
                dispatch({ type: FETCH_STORE_LIST_SUCCESS, storeList: data });
            });
            return; // stop disini
        }

        // kalau ada keyword -> debounce 2 detik
        // const handler = setTimeout(() => {
        //     dispatch({ type: FETCH_STORE_LIST });
        //     store.getStores(state.options, { ...state.filters }, state.keyword, customer.token).then((res) => {
        //         const { data } = res;
        //         dispatch({ type: FETCH_STORE_LIST_SUCCESS, storeList: data });
        //     });
        // }, 2000);

        // return () => clearTimeout(handler);
    }, [state.options, state.filters]);

    // load province list
    useEffect(() => {
        dispatch({ type: FETCH_PROVINCE_LIST });
        territory.getProvince().then((result) => {
            const { status, data } = result;

            const provincesList = data.items.map((item) => {
                return { value: item.id, label: item.name };
            });

            const selectedProvince = provincesList.find((item) => item.value === state.filters.province);
            if (status.code === 200) {
                if (selectedProvince !== undefined) {
                    doChangeProvince(selectedProvince);
                }
                dispatch({ type: FETCH_PROVINCE_LIST_SUCCESS, provincesList });
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.filters.province]);

    /*
            function for change province
    */
    const doChangeProvince = (data) => {
        if (data !== null) {
            dispatch({ type: SELECTED_PROVINCE, selectedProvince: data });

            dispatch({ type: SET_FILTER_VALUE, filter: "province", value: data.value });

            dispatch({ type: FETCH_CITY_LIST });

            territory.getCity(data.value).then((res) => {
                const { status, data } = res;

                const citiesList = data.items.city.map((item) => {
                    return { label: item.name, value: item.id };
                });

                const selectedCity = citiesList.find((item) => item.value === state.filters.city);

                if (status.code === 200) {
                    if (selectedCity !== undefined) {
                        doChangeCity(selectedCity);
                    }
                    dispatch({
                        type: FETCH_CITY_LIST_SUCCESS,
                        citiesList,
                    });
                }
            });
        } else {
            dispatch({ type: SELECTED_PROVINCE, selectedProvince: data });
            dispatch({ type: SET_FILTER_VALUE, filter: "province", value: data });
        }
    };

    /*

    function for change city

    */
    const doChangeCity = (data) => {
        if (data !== null) {
            dispatch({ type: SELECTED_CITY, selectedCity: data });

            dispatch({ type: SET_FILTER_VALUE, filter: "city", value: data.value });

            dispatch({ type: FETCH_DISTRICT_LIST });

            territory.getDistrict(data.value).then((res) => {
                const { status, data } = res;
                if (status.code === 200) {
                    const districtsList = data.items.district.map((item) => {
                        return { value: item.id, label: item.name };
                    });

                    const selectedDistrict = districtsList.find((item) => item.value === state.filters.district);
                    if (selectedDistrict !== undefined) {
                        doChangeDistrict(selectedDistrict);
                    }

                    dispatch({ type: FETCH_DISTRICT_LIST_SUCCESS, districtsList });
                }
            });
        } else {
            dispatch({ type: SELECTED_CITY, selectedCity: data });

            dispatch({ type: SET_FILTER_VALUE, filter: "city", value: data });
            dispatch({ type: FETCH_DISTRICT_LIST_SUCCESS, districtsList: null });
        }
    };
    /*

    function for change district

    */
    const doChangeDistrict = (data) => {
        if (data !== null) {
            dispatch({ type: SET_FILTER_VALUE, filter: "district", value: data.value });
            dispatch({ type: SELECTED_DISTRICT, selectedDistrict: data });
        } else {
            dispatch({ type: SET_FILTER_VALUE, filter: "district", value: data });
            dispatch({ type: SELECTED_DISTRICT, selectedDistrict: data });
        }
    };

    const doChangeKeywordValue = (e) => {
        const { value } = e.target;

        // update keyword state
        dispatch({
            type: SET_SEARCH_VALUE,
            keyword: value !== "" ? value : undefined,
        });

        // selalu clear timeout biar ga numpuk
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // kalau ada value → debounce 2 detik
        typingTimeoutRef.current = setTimeout(() => {
            dispatch({ type: FETCH_STORE_LIST });
            store.getStores(state.options, { ...state.filters }, value, customer.token).then((res) => {
                dispatch({
                    type: FETCH_STORE_LIST_SUCCESS,
                    storeList: res.data,
                });
            });
        }, 2000);
    };

    return (
        <section className="py-4" style={{ backgroundColor: "rgb(0,129,199)" }}>
            <div className="container">
                {layout === "default" && (
                    <div className="row d-none d-md-none d-lg-block">
                        <div className="col-xl-12">
                            <div
                                className="card bg-transparent border-0 text-white"
                                style={{
                                    borderRadius: "15px",
                                }}
                            >
                                <div className="card-body p-0">
                                    <h5 className="card-title">Terdapat Banyak Penyedia</h5>
                                    <p className="card-text">
                                        Penyedia adalah subjek dalam rantai pemenuhan keperluan sekolah. Penyedia
                                        menyediakan dan melayani sekolah yang melakukan pemesanan pada sistem SIPLah
                                        sesuai dengan kebijakan yang berlaku. Penyedia tunduk pada kebijakan produk
                                        maupun kebijakan privasi. Total Penyedia berasal dari penyedia yang sudah
                                        dinyatakan lengkap persyaratan (proses Approve) menjadi penyedia SIPLah
                                        Kemdikbud Eureka.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-12 mt-3">
                            <div
                                className="card text-white shadow"
                                style={{
                                    background:
                                        "url(https://siplah.eurekabookhouse.co.id/assets/front/images/banner/banner-mall-page.jpg) no-repeat center center",
                                    height: "280px",
                                    borderRadius: "15px",
                                    border: "none",
                                }}
                            >
                                <div className="card-body ">
                                    <h5>Penyedia Beragam</h5>
                                    <h3>Berbagai penyedia di seluruh pelosok indonesia</h3>
                                    <h6>Temukan disekitar anda</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <StoreView
                    isLoading={state.storeIsLoading}
                    storeList={state.storeList}
                    state={state}
                    layout={layout}
                    doHandleChooseStore={doHandleChooseStore}
                    options={state.options}
                    doChangeCity={doChangeCity}
                    doChangeDistrict={doChangeDistrict}
                    doChangeProvince={doChangeProvince}
                    dispatch={dispatch}
                    doChangeKeywordValue={doChangeKeywordValue}
                />
            </div>
        </section>
    );
};

Stores.propTypes = {
    layout: propTypes.oneOf(["default", "modal"]),
};

Stores.defaultPropTypes = {
    layout: "default",
};

const mapStateToProps = (state) => ({ customer: state.customer });
export default connect(mapStateToProps, null)(Stores);
