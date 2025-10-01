import React, { useEffect, useReducer, useState } from "react";

// third-party
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import queryString from "query-string";

//application
import theme from "../../data/theme";
import validateURL from "../../services/validateUrl";
import {
    FETCH_COMPARE_LIST,
    FETCH_COMPARE_LIST_SUCCESS,
    SET_FILTER_VALUE,
    SET_OPTION_VALUE,
} from "../../data/constant";
import customerApi from "../../api/customer";
import BlockLoader from "../blocks/BlockLoader";
import Pagination from "../shared/Pagination";
import { connect } from "react-redux";

const initialState = {
    compareList: null,
    compareListIsLoading: true,
    filters: {},
    options: {},
};

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

function parseQuery(location) {
    return [parseQueryOptions(location), parseQueryFilters(location)];
}

function buildQuery(options, filters) {
    const params = {};

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

function reducer(state, action) {
    switch (action.type) {
        case FETCH_COMPARE_LIST:
            return {
                ...state,
                compareListIsLoading: true,
            };
        case FETCH_COMPARE_LIST_SUCCESS:
            return {
                ...state,
                compareListIsLoading: false,
                compareList: action.compareList,
            };

        case SET_FILTER_VALUE:
            return {
                ...state,
                filters: { ...state.filters, [action.filter]: action.value, page: 1 },
            };
        case SET_OPTION_VALUE:
            return {
                ...state,
                options: { ...state.options, page: 1, [action.option]: action.value },
            };

        default:
            throw new Error();
    }
}

function init(state) {
    const [options, filters] = parseQuery(window.location.search);

    return { ...state, options, filters };
}

const AccountPageCompare = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState, init);
    const [openDropdown, setOpenDropdown] = useState({});
    const { token } = props.customer;

    const handlePageChange = (page) => {
        dispatch({ type: SET_OPTION_VALUE, option: "page", value: page });
    };

    // Replace current url.
    useEffect(() => {
        const query = buildQuery(state.options, state.filters);

        const location = `${window.location.pathname}${query ? "?" : ""}${query}`;
        window.history.replaceState(null, "", location);
    }, [state.options, state.filters]);

    useEffect(() => {
        dispatch({ type: FETCH_COMPARE_LIST });
        customerApi.getCompareList(state.options, token).then((res) => {
            const { data } = res;

            dispatch({ type: FETCH_COMPARE_LIST_SUCCESS, compareList: data });
        });
        return () => {};
    }, [state.options, token]);

    const toggle = (id) => setOpenDropdown({ ...openDropdown, [`toggle-${id}`]: !openDropdown[`toggle-${id}`] });

    if (state.compareListIsLoading) {
        return <BlockLoader />;
    }

    let number = state.options.page * state.options.limit - 9;

    return (
        <div className="card">
            <Helmet>
                <title>{`Daftar Perbandingan — ${theme.name}`}</title>
            </Helmet>

            <div className="card-header text-center">
                <h5>Daftar Perbandingan Produk</h5>
            </div>

            <div className="card-divider" />
            <div className="card-table">
                <div className="table-responsive" style={{ fontSize: "14px" }}>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Invoice</th>
                                <th>Tanggal</th>
                                <th>Catatan</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.compareList.compareList.length > 0 ? (
                                state.compareList.compareList.map((item, index) => {
                                    return (
                                        <tr>
                                            <th scope="row">{number++}</th>
                                            <td>{item.invoice}</td>
                                            <td>{item.date}</td>
                                            <td>{item.note}</td>
                                            <td>
                                                <Dropdown
                                                    isOpen={openDropdown[`toggle-${item.id}`]}
                                                    toggle={() => toggle(item.id)}
                                                    right
                                                >
                                                    <DropdownToggle
                                                        style={{
                                                            verticalAlign: "middle",
                                                        }}
                                                    >
                                                        ...
                                                    </DropdownToggle>
                                                    <DropdownMenu>
                                                        <Link
                                                            to={`/account/compare/${item.id}`}
                                                            className="dropdown-item custom"
                                                        >
                                                            Detail
                                                        </Link>
                                                        <Link
                                                            to={`/account/compare/compare-news-events/${item.id}`}
                                                            className="dropdown-item custom"
                                                        >
                                                            Berita Acara
                                                        </Link>
                                                        <a
                                                            href={
                                                                validateURL(item.printDocumentFromOrder)
                                                                    ? item.printDocumentFromOrder
                                                                    : ""
                                                            }
                                                            className="dropdown-item custom"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            Cetak Perbandingan
                                                        </a>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5}>
                                        <h6 className="text-center my-2">Data Tidak Ditemukan</h6>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {state.compareList.compareList.length > 0 && (
                    <>
                        <div className="products-view__pagination mb-2">
                            <Pagination
                                current={state.options.page || state.compareList.page}
                                siblings={2}
                                total={state.compareList.pages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                        {/* <div className="d-flex justify-content-end">
                            <button className="btn btn-info m-3">Cetak</button>
                        </div> */}
                    </>
                )}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({ customer: state.customer });

export default connect(mapStateToProps, null)(AccountPageCompare);
