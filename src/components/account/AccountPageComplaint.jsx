import React, { useEffect, useReducer } from "react";

// third-party
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import queryString from "query-string";

import theme from "../../data/theme";
import { FETCH_COMPLAINT_LIST, FETCH_COMPLAINT_LIST_SUCCESS, SET_OPTION_VALUE } from "../../data/constant";
import BlockLoader from "../blocks/BlockLoader";
import Pagination from "../shared/Pagination";
import customerApi from "../../api/customer";
import { connect } from "react-redux";

const initialState = {
    complaintList: null,
    complaintListIsLoading: true,
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

function parseQuery(location) {
    return [parseQueryOptions(location)];
}

function buildQuery(options) {
    const params = {};

    if (options.page !== 1) {
        params.page = options.page;
    }

    return queryString.stringify(params, { encode: false });
}

function reducer(state, action) {
    switch (action.type) {
        case FETCH_COMPLAINT_LIST:
            return {
                ...state,
                complaintListIsLoading: true,
            };
        case FETCH_COMPLAINT_LIST_SUCCESS:
            return {
                ...state,
                complaintListIsLoading: false,
                complaintList: action.complaintList,
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
    const [options] = parseQuery(window.location.search);

    return { ...state, options };
}

const AccountPageComplaint = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState, init);
    const { token } = props.customer;

    // Replace current url.
    useEffect(() => {
        const query = buildQuery(state.options);

        const location = `${window.location.pathname}${query ? "?" : ""}${query}`;
        window.history.replaceState(null, "", location);
    }, [state.options]);

    useEffect(() => {
        dispatch({ type: FETCH_COMPLAINT_LIST });
        customerApi.getComplaintList(state.options, token).then((res) => {
            const { data } = res;

            dispatch({ type: FETCH_COMPLAINT_LIST_SUCCESS, complaintList: data });
        });
    }, [state.options, token]);

    const handlePageChange = (page) => {
        dispatch({ type: SET_OPTION_VALUE, option: "page", value: page });
    };

    if (state.complaintListIsLoading) {
        return <BlockLoader />;
    }

    let number = state.options.page * state.options.limit - 9;

    return (
        <div className="card">
            <Helmet>
                <title>{`Daftar Perbandingan — ${theme.name}`}</title>
            </Helmet>

            <div className="card-header text-center">
                <h5>Daftar Komplain</h5>
            </div>

            <div className="card-divider" />
            <div className="card-table">
                <div className="table-responsive" style={{ fontSize: "14px" }}>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Invoice</th>
                                <th>Produk</th>
                                <th>Toko</th>
                                <th>Komplain</th>
                                <th>Tgl Komplain</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {state.complaintList.items.length > 0 ? (
                                state.complaintList.items.map((item) => (
                                    <tr>
                                        <td>{number++}</td>
                                        <td>{item.invoice}</td>
                                        <td>
                                            <p style={{ width: "167px" }}>{item.productName}</p>
                                        </td>
                                        <td>
                                            <p style={{ width: "150px" }}>{item.storeName}</p>
                                        </td>
                                        <td>{item.type}</td>
                                        <td>{item.date}</td>
                                        <td>
                                            <Link to={`${props.match.path}/${item.id}`}>Detail</Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7}>
                                        <h6 className="text-center my-2">Data Tidak Ditemukan</h6>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* {state.complaintList.items.length > 0 && (
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-info m-3">Cetak</button>
                    </div>
                )} */}
            </div>
            {state.complaintList.items.length > 0 && (
                <>
                    <div className="card-divider" />
                    <div className="card-footer">
                        <Pagination
                            current={state.options.page}
                            total={state.complaintList.pages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

const mapStateToProps = (state) => ({ customer: state.customer });

export default connect(mapStateToProps, null)(AccountPageComplaint);
