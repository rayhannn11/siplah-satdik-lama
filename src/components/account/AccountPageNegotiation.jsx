import React, { useEffect, useReducer } from "react";

// third-party
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import theme from "../../data/theme";
import classNames from "classnames";
import queryString from "query-string";

// application
import {
    SET_OPTION_VALUE,
    SET_FILTER_VALUE,
    FETCH_NEGOTIATION_LIST,
    FETCH_NEGOTIATION_LIST_SUCCESS,
} from "../../data/constant";
import BlockLoader from "../blocks/BlockLoader";
import Pagination from "../shared/Pagination";
import customerApi from "../../api/customer";
import { connect } from "react-redux";

const initialState = {
    negotiationList: null,
    negotiationListIsLoading: true,
    filters: {},
    options: {},
};

function parseQueryOptions(location) {
    const query = queryString.parse(location);

    const optionValues = {
        page: 1,
        limit: 10,
        status: 0,
    };

    if (typeof query.page === "string") {
        optionValues.page = parseFloat(query.page);
    }
    if (typeof query.status === "string") {
        optionValues.status = query.status;
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

    if (options.status !== 0) {
        params.status = options.status;
    }

    return queryString.stringify(params, { encode: false });
}

function reducer(state, action) {
    switch (action.type) {
        case FETCH_NEGOTIATION_LIST:
            return {
                ...state,
                negotiationListIsLoading: true,
            };
        case FETCH_NEGOTIATION_LIST_SUCCESS:
            return {
                ...state,
                negotiationListIsLoading: false,
                negotiationList: action.negotiationList,
            };
        case SET_FILTER_VALUE:
            return {
                ...state,
                options: { ...state.options, page: 1 },
                filters: { ...state.filters, [action.filter]: action.value },
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

const AccountPageNegotiation = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState, init);
    let content;
    const { token } = props.customer;

    // Replace current url.
    useEffect(() => {
        const query = buildQuery(state.options, state.filters);

        const location = `${window.location.pathname}${query ? "?" : ""}${query}`;
        window.history.replaceState(null, "", location);
    }, [state.options, state.filters]);

    useEffect(() => {
        dispatch({ type: FETCH_NEGOTIATION_LIST });
        customerApi.getNegotiationList(state.options, token).then((res) => {
            const { data } = res;

            dispatch({ type: FETCH_NEGOTIATION_LIST_SUCCESS, negotiationList: data });
        });
        return () => {};
    }, [state.options, token]);

    const doHandleChangePage = (page, option) => {
        dispatch({ type: SET_OPTION_VALUE, option, value: page });
    };

    if (state.negotiationListIsLoading) {
        return <BlockLoader />;
    }

    if (state.negotiationList) {
        let number = state.options.page * state.options.limit - 9;
        const { page, pages, listNegotiation, filters } = state.negotiationList;
        content = (
            <>
                <div className="row">
                    <div className="col-12">
                        <div className="container">
                            <div className="nav-negotiation">
                                <div className="nav-content-negotiation">
                                    {filters.map((item) => (
                                        <div
                                            className={classNames("nav-item-negotiation", {
                                                active: item.inActive,
                                            })}
                                            name="1"
                                            onClick={() => doHandleChangePage(item.id, "status")}
                                        >
                                            {item.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-divider mt-3" />
                <div className="card-table">
                    <div className="table-responsive" style={{ fontSize: "14px" }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Produk</th>
                                    <th />
                                    <th>Tanggal</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listNegotiation.length > 0 ? (
                                    listNegotiation.map((item) => {
                                        return (
                                            <tr>
                                                <td>{number++}</td>
                                                <td>
                                                    <img
                                                        src={item.image}
                                                        alt=""
                                                        style={{
                                                            width: "75px",
                                                            height: "75px",
                                                            objectFit: "contain",
                                                        }}
                                                    />
                                                </td>
                                                <td>
                                                    <p style={{ fontSize: "14px" }}>{item.name}</p>
                                                </td>
                                                <td>{item.date}</td>
                                                <td>
                                                    <Link
                                                        to={{
                                                            pathname: `/account/negotiation/${item.id}`,
                                                            state: state.options,
                                                        }}
                                                    >
                                                        Detail
                                                    </Link>
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
                    {/* {listNegotiation.length > 0 && (
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-info m-3">Cetak</button>
                        </div>
                    )} */}
                </div>
                {listNegotiation.length > 0 && (
                    <>
                        <div className="card-divider" />
                        <div className="card-footer">
                            <Pagination
                                current={page}
                                total={pages}
                                onPageChange={(page) => doHandleChangePage(page, "page")}
                            />
                        </div>
                    </>
                )}
            </>
        );
    } else {
        content = <h4>Data Tidak Ditemukan</h4>;
    }

    return (
        <div className="card">
            <Helmet>
                <title>{`Negosiasi — ${theme.name}`}</title>
            </Helmet>

            <div className="card-header">
                <h5>Daftar Negosiasi</h5>
            </div>

            {content}
        </div>
    );
};

const mapStateToProps = (state) => ({ customer: state.customer });

export default connect(mapStateToProps, null)(AccountPageNegotiation);
