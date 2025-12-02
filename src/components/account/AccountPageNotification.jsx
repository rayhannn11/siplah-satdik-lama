import React, { useEffect, useReducer, useState } from "react";

// third-party
import DateRangePicker from "react-bootstrap-daterangepicker";
import { Link, useHistory } from "react-router-dom";
import classNames from "classnames";
import {
    FETCH_NOTIFICATION_LIST,
    FETCH_NOTIFICATION_LIST_SUCCESS,
    SET_FILTER_VALUE,
    SET_OPTION_VALUE,
} from "../../data/constant";
import queryString from "query-string";
import customerApi from "../../api/customer";
import BlockLoader from "../blocks/BlockLoader";
import Pagination from "../shared/Pagination";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import AsyncAction from "../shared/AsyncAction";
import ReactGA from "react-ga";

const initialState = {
    init: false,
    /**
     * Indicates that the category is loading.
     */

    notificationListIsLoading: true,
    /**
     * Products list.
     */
    notificationList: null,
    /**
     * Products list options.
     *
     * options.page:  number - Current page.
     * options.limit: number - Items per page.
     * options.sort:  string - Sort algorithm.
     */
    options: { page: 1, limit: 10 },
    /**
     * Products list filters.
     *
     * filters[FILTER_SLUG]: string - filter value.
     */
    filters: { type: "all", date: { startDate: "", endDate: "" } },
    // filters: { type: "all", date: `${new Date().toLocaleDateString()}-${new Date().toLocaleDateString()}` },
};

function reducer(state, action) {
    switch (action.type) {
        case FETCH_NOTIFICATION_LIST:
            return {
                ...state,
                notificationListIsLoading: true,
            };
        case FETCH_NOTIFICATION_LIST_SUCCESS:
            return {
                ...state,
                init: true,
                notificationListIsLoading: false,
                notificationList: action.notification,
            };
        case SET_OPTION_VALUE:
            return { ...state, options: { ...state.options, page: action.value } };
        case SET_FILTER_VALUE:
            return {
                ...state,
                options: { ...state.options, page: 1 },
                filters: { ...state.filters, [action.filter]: action.value },
            };
        case "RESET_FILTERS":
            return { ...state, options: { ...state.options, page: 1, limit: 10 }, filters: {} };
        case "RESET":
            return state.init ? initialState : state;
        default:
            throw new Error();
    }
}

const AccountPageNotification = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { customer, location } = props;
    const history = useHistory();
    const [reload, setReload] = useState(true);
    const shopLinks = [
        { title: "Informasi untuk anda", url: "?type=notif" },
        { title: "Perlu Ditindaklanjuti", url: "?isNotifReminder=1" },
        { title: "Log Aktifitas", url: "?type=log" },
    ].map((link) => {
        const url = `${link.url}`;
        const isActive = location.search.includes(url) || (location.search === "" && url.includes("notif"));
        const classes = classNames("nav-item-negotiation", {
            active: isActive,
        });

        return (
            <Link to={url} className={classes}>
                {link.title}
            </Link>
        );
    });

    useEffect(() => {
        ReactGA.event({
            category: "School Notification",
            action: "Show All Notification",
        });
    }, []);

    const handleEvent = (event, picker) => {
        dispatch({
            type: SET_FILTER_VALUE,
            filter: "date",
            value: { startDate: new Date(picker.startDate._d), endDate: new Date(picker.endDate._d) },
            // value: `${new Date(picker.startDate._d).toLocaleDateString()}-${new Date(
            //     picker.endDate._d
            // ).toLocaleDateString()}`,
        });
    };

    const handleCallback = (start, end, label) => {
        // console.log(start, end, label);
    };

    const handleFilter = (e) => {
        const { value } = e.target;
        dispatch({ type: SET_FILTER_VALUE, filter: "type", value });
    };

    const handleReadAllNotification = () => {
        return customerApi.readAllNotification(customer?.token).then((res) => {
            if (res.status.code === 200) {
                toast.success("Semua notifikasi telah dibaca", { toastId: "read" });
                setReload((state) => !state);
            } else {
                toast.error("Terjadi kesalaha pada sistem");
            }
        });
    };

    useEffect(() => {
        dispatch({ type: FETCH_NOTIFICATION_LIST });
        if (location.search.includes("log")) {
            customerApi.getLog(state.options, state.filters, customer?.token).then((res) => {
                const { data } = res;
                dispatch({ type: FETCH_NOTIFICATION_LIST_SUCCESS, notification: data });
            });
        } else {
            const isNotifReminder = queryString.parse(location.search).isNotifReminder || 0;
            customerApi
                .getNotification({ ...state.options, isNotifReminder }, { ...state.filters }, customer?.token)
                .then((res) => {
                    const { data } = res;

                    dispatch({ type: FETCH_NOTIFICATION_LIST_SUCCESS, notification: data });
                })
                .catch((err) => {
                    dispatch({ type: FETCH_NOTIFICATION_LIST_SUCCESS, notification: null });
                });
        }
    }, [state.options, state.filters, customer?.token, location.search, reload]);

    const handlePage = (value) => {
        dispatch({ type: SET_OPTION_VALUE, value });
    };

    const urlRedirect = (item) => {
        switch (item.type) {
            case "nego":
                return `/account/negotiation/${item.linkRedirect}`;

            default:
                return `/account/orders/${item.linkRedirect}`;
        }
    };

    const handleRedirect = (item) => {
        customerApi.readNotification({ id: item.id }, customer?.token);
        ReactGA.event({
            category: "School Notification",
            action: "Show Order Detail From Notification",
        });
        history.push(urlRedirect(item));
    };

    let content;

    if (state.notificationListIsLoading) {
        return <BlockLoader />;
    }
    if (state.notificationList != null) {
        content = (
            <>
                <div className="row">
                    <div className="col-6">
                        <DateRangePicker
                            onEvent={() => {}}
                            onApply={handleEvent}
                            onCallback={handleCallback}
                            initialSettings={{
                                locale: "en",
                                startDate: state?.filters?.date?.startDate || new Date(),
                                endDate: state?.filters?.date?.endDate || new Date(),
                            }}
                        >
                            <input
                                type="text"
                                className="form-control mb-3"
                                id="daterangepicker"
                                placeholder="Tanggal Transfer"
                            />
                        </DateRangePicker>
                    </div>
                    {state.notificationList.filters !== undefined && (
                        <div className="col-6">
                            <div className="form-group">
                                <select className="form-control" onChange={handleFilter}>
                                    {state.notificationList.filters[0].items.map((item, index) => (
                                        <option
                                            key={index}
                                            selected={item.slug === state.filters.type}
                                            value={item.slug}
                                        >
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {state.notificationList.items.length > 0 ? (
                    <div className="list-group mb-3">
                        {state.notificationList.items.map((item) => (
                            <>
                                {item.isRedirect ? (
                                    <div
                                        onClick={() => handleRedirect(item)}
                                        style={
                                            !item.isRead
                                                ? {
                                                      background: "rgba(14, 51, 109, 0.11) none repeat scroll 0% 0%",
                                                      padding: "6px 10px",
                                                  }
                                                : { padding: "6px 10px" }
                                        }
                                        className="list-group-item list-group-item-action cp"
                                    >
                                        <div className="d-flex alig">
                                            <img
                                                src={item.icon}
                                                alt=""
                                                style={{ width: "60px", height: "60px", alignSelf: "center" }}
                                            />
                                            <div className="ml-2">
                                                <strong>{item.title}</strong>
                                                <br />
                                                <small dangerouslySetInnerHTML={{ __html: item.text }}></small>
                                                <br />
                                                <div className="d-flex w-100 justify-content-between align-items-center">
                                                    <small>{item.dateAt}</small>
                                                    {item.mustFollowUp && (
                                                        <small className="text-primary">
                                                            Tindaklanjuti{" "}
                                                            <i class="fa fa-angle-right" aria-hidden="true"></i>
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="list-group-item ">
                                        <div className="d-flex justify-content-between align-items-center">
                                            {location.search.includes("log") ? (
                                                <div>
                                                    <small style={{ fontSize: "15px" }} className="font-weight-bold">
                                                        {item.text} {item.createdAt}
                                                    </small>
                                                    <br />
                                                    <small className="d-block">{item.userAgent}</small>
                                                    <small>IP: {item.ip || "-"}</small>
                                                </div>
                                            ) : (
                                                <div>
                                                    <strong>{item.title}</strong>
                                                    <br />
                                                    <small>{item.text}</small>
                                                    <small>{item.dateAt}</small>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        ))}
                    </div>
                ) : (
                    <h3 className="text-center">Data Tidak Ditemukan</h3>
                )}
                {state.notificationList.pages && (
                    <Pagination
                        current={state.options.page || state.notificationList.page}
                        siblings={2}
                        total={state.notificationList.pages}
                        onPageChange={handlePage}
                    />
                )}
            </>
        );
    } else {
        content = <h3 className="text-center">Data Tidak Ditemukan</h3>;
    }

    return (
        <>
            <div className="nav-negotiation">
                <div className="nav-content-negotiation">{shopLinks}</div>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="m-0">{location.search.includes("log") ? "Log Aktifitas" : "Notifikasi"}</h4>
                {location.search.includes("notif") && (
                    <AsyncAction
                        action={handleReadAllNotification}
                        render={({ run, loading }) => (
                            <button
                                style={
                                    {
                                        // fontSize: '12px',
                                        // padding: '5px',
                                        // height: 'calc(1.543rem + 2px)'
                                    }
                                }
                                type="button"
                                onClick={run}
                                className={classNames("btn btn-primary btn-md", {
                                    "btn-loading": loading,
                                })}
                            >
                                Tandai sudah dibaca
                            </button>
                        )}
                    />
                )}
            </div>

            {content}
        </>
    );
};

const mapStateToProps = (state) => ({ customer: state.customer });

export default connect(mapStateToProps, null)(AccountPageNotification);
