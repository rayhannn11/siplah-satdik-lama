// react
import React, { useEffect, useReducer, useState } from "react";

// third-party
import { Helmet } from "react-helmet-async";
import { Link, useHistory, useParams } from "react-router-dom";

// data stub
import theme from "../../data/theme";

// application
import { ArrowLeft } from "../../svg";
import { FETCH_NEGOTIATION_DETAIL, FETCH_NEGOTIATION_DETAIL_SUCCESS } from "../../data/constant";
import ModalRespond from "../shared/ModalRespond";
import BlockLoader from "../blocks/BlockLoader";
import customerApi from "../../api/customer";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { url } from "../../services/utils";
import AsyncAction from "../shared/AsyncAction";
import classNames from "classnames";
import { cartAddItem } from "../../store/cart";
import RequestPostLoader from "../shared/RequestPostLoader";
import Swal from "sweetalert2";

const initialState = {
    negotiationDetail: null,
    negotiationDetailIsLoading: true,
};

const reducer = (state, action) => {
    switch (action.type) {
        case FETCH_NEGOTIATION_DETAIL:
            return { ...state, negotiationDetailIsLoading: true };
        case FETCH_NEGOTIATION_DETAIL_SUCCESS:
            return { ...state, negotiationDetailIsLoading: false, negotiationDetail: action.negotiationDetail };
        default:
            throw new Error();
    }
};

const AccountPageNegotiationDetail = (props) => {
    const [openRespond, setOpenRespond] = useState(false);
    const [state, dispatch] = useReducer(reducer, initialState);
    const { id } = useParams();
    const historyRoute = useHistory();
    const [response, setResponse] = useState({});
    const { cartAddItem, customer } = props,
        [sendRequest, setSendRequest] = useState(false);

    let buttonCart;

    useEffect(() => {
        dispatch({ type: FETCH_NEGOTIATION_DETAIL });
        const handleFetch = () => {
            customerApi
                .getNegotiationDetail(id, customer.token)
                .then((res) => {
                    const { data, status } = res;
                    if (Number(status.code) !== 200) return historyRoute.push("/account/negotiation");
                    dispatch({ type: FETCH_NEGOTIATION_DETAIL_SUCCESS, negotiationDetail: data });
                })
                .catch((err) => alert(err));
        };
        dispatch({ type: FETCH_NEGOTIATION_DETAIL });
        handleFetch();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customer.token, id]);

    const handleFetch = () => {
        customerApi
            .getNegotiationDetail(id, customer.token)
            .then((res) => {
                const { data } = res;

                dispatch({ type: FETCH_NEGOTIATION_DETAIL_SUCCESS, negotiationDetail: data });
            })
            .catch((err) => alert(err));
    };
    const doOpenRespond = (value) => {
        setResponse({ ...state.negotiationDetail, ...value });
        setOpenRespond(!openRespond);
    };

    const handleSendNegotiationRespon = (req) => {
        setSendRequest(true);
        return new Promise((resolve) => {
            if (req.priceNego === 0) {
                toast.error("Masukan harga tanggapan anda!");
                doOpenRespond();
                resolve();
            } else {
                customerApi
                    .sendNegotiationResponse({ ...req, negoId: state.negotiationDetail.id }, customer.token)
                    .then((res) => {
                        setSendRequest(false);
                        toast.success("Tanggapan anda terkirim");
                        handleFetch();
                        doOpenRespond();
                        resolve();
                    })
                    .catch((err) => alert(`error kirim nego ${err}`));
            }
        });
    };

    const doHandleRejectNegotiation = () => {
        Swal.fire({
            text: "Yakin ingin menolak negosiasi?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Lanjutkan",
            cancelButtonText: "Batal",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                customerApi.rejectNego({ negoId: id }, customer.token).then((res) => {
                    handleFetch();
                });
            }
        });
    };

    const doHandleAddToCart = (isNego) => {
        props.history.push("/shop/cart");
        if (isNego) {
            return cartAddItem(
                { id: productId, name },
                customer.token,
                qty,
                id,
                history[history.length - 1].priceResponse
            );
        } else {
            return cartAddItem({ id: productId, name }, customer.token, qty);
        }
    };

    const doHandleDealNego = () => {
        return new Promise((resolve) => {
            Swal.fire({
                text: "Yakin ingin menerima harga tanggapan dari penyedia?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yakin",
                cancelButtonText: "Batal",
                reverseButtons: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    customerApi.dealNego({ negoId: id }, customer.token).then((res) => {
                        handleFetch();
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        });
    };

    if (sendRequest) return <RequestPostLoader />;

    if (state.negotiationDetailIsLoading) {
        return <BlockLoader />;
    }
    const {
        productId,
        date,
        image,
        name,
        mall,
        initialUnitPriceCurrencyFormat,
        negoUnitPriceCurrencyFormat,
        totalPriceCurrencyFormat,
        qty,
        isNegoAlreadyCheckout,
        termOfPayment,
        priceZone,
        printDocumentRecap,
        courier,
        wrapping,
        printDocumentFromCompare,
        isNegoDone,
        // packagingCostCurrencyFormat,
        assurance,
        note: noteNego,
        isNegoReject,
        history,
    } = state.negotiationDetail;


    const renderStatus = () => {
        let content;
        if (isNegoDone) {
            content = (
                <div
                    class="alert alert-success mt-1 d-flex flex-row justify-content-between align-items-center"
                    role="alert"
                >
                    Proses negosiasi selesai
                </div>
            );
        }
        if (state.negotiationDetail.isNegoReject) {
            content = (
                <div
                    class="alert alert-danger mt-1 d-flex flex-row justify-content-between align-items-center"
                    role="alert"
                >
                    Negosiasi Ditolak {state.negotiationDetail.isRespondFrom}
                </div>
            );
        } else if (history[history.length - 1].priceResponse !== "0") {
            if (isNegoDone) {
                if (history[history.length - 1].priceResponse !== history[history.length - 1].negoUnitPrice) {
                    buttonCart = (
                        <AsyncAction
                            action={() => doHandleAddToCart(true)}
                            render={({ run, loading }) => (
                                <button
                                    type="button"
                                    onClick={run}
                                    title="Tambahkan ke keranjang"
                                    className={classNames("btn btn-primary btn-sm ml-3", {
                                        "btn-loading": loading,
                                    })}
                                >
                                    Tambahkan ke keranjang
                                </button>
                            )}
                        />
                    );
                } else {
                    if (!isNegoAlreadyCheckout) {
                        buttonCart = (
                            <AsyncAction
                                action={() => doHandleAddToCart(true)}
                                render={({ run, loading }) => (
                                    <button
                                        type="button"
                                        onClick={run}
                                        title="Tambahkan ke keranjang"
                                        className={classNames("btn btn-primary btn-sm", {
                                            "btn-loading": loading,
                                        })}
                                    >
                                        Tambahkan ke keranjang
                                    </button>
                                )}
                            />
                        );
                    }
                }
            } else {
                buttonCart = (
                    <AsyncAction
                        action={() => doHandleDealNego()}
                        render={({ run, loading }) => (
                            <button
                                type="button"
                                onClick={run}
                                title="Tambahkan ke keranjang"
                                className={classNames("btn btn-primary btn-sm ml-2", {
                                    "btn-loading": loading,
                                })}
                            >
                                Terima tanggapan penyedia
                            </button>
                        )}
                    />
                );
            }
        } else {
            content = (
                <div class="alert alert-warning mt-1" role="alert">
                    Menunggu tanggapan penyedia
                </div>
            );
        }
        return content;
    };
    return (
        <>
            <Helmet>
                <title>{`Detail Negosiasi — ${theme.name}`}</title>
            </Helmet>
            <h6 style={{ cursor: "pointer" }} className="mb-3" onClick={() => historyRoute.goBack()}>
                <ArrowLeft className="float-left mr-2" /> Kembali ke Negosiasi
            </h6>
            <div class="card">
                <div class="card-body">
                    <div className="d-flex justify-content-end">
                        {printDocumentFromCompare && (
                            <a
                                rel="noopener noreferrer"
                                target="_blank"
                                href={printDocumentFromCompare}
                                className="btn btn-primary btn-sm mr-2"
                            >
                                <i class="fa fa-download mr-1" aria-hidden="true"></i>
                                Unduh rekapan negosiasi
                            </a>
                        )}
                        <a
                            rel="noopener noreferrer"
                            target="_blank"
                            href={printDocumentRecap}
                            className="btn btn-primary btn-sm"
                        >
                            <i class="fa fa-download mr-1" aria-hidden="true"></i>
                            Unduh rekapan negosiasi
                        </a>
                    </div>
                    {renderStatus()}
                    <div className="row">
                        <div className="col-md-3">
                            <small className="my-1 d-sm-none">{date}</small>
                            <Link to={url.product(state.negotiationDetail)}>
                                <img
                                    src={image}
                                    alt=""
                                    style={{ width: "100%" }}
                                    // height="100px"
                                />
                            </Link>
                        </div>
                        <div className="col-md-5">
                            <div className="product-card__name">
                                <Link to={url.product(state.negotiationDetail)} className="font-weight-bold ">
                                    {name}
                                </Link>
                            </div>
                            <small className="d-block my-1">
                                Nama Toko: <span className="font-weight-bold">{mall.name}</span>
                            </small>
                            <small className="d-block my-1">
                                Harga Satuan (Awal):{" "}
                                <span className="font-weight-bold">
                                    {priceZone.length > 0
                                        ? `${
                                              priceZone[customer?.school?.location?.zone - 1].priceCurrencyFormat
                                          } (zona ${customer?.school?.location?.zone})`
                                        : initialUnitPriceCurrencyFormat}
                                </span>
                            </small>
                            <small className="d-block my-1">
                                Harga Satuan (Nego):{" "}
                                <span className="font-weight-bold">{negoUnitPriceCurrencyFormat}</span>
                            </small>
                            <small className="d-block my-1">
                                Jumlah Pesanan (Qty): <span className="font-weight-bold">{qty}</span>
                            </small>
                            <small className="d-block my-1">
                                Total Harga: <span className="font-weight-bold">{totalPriceCurrencyFormat}</span>
                            </small>
                        </div>
                        <div className="col-md-4">
                            <small className="my-1 text-left d-none d-sm-block">{date}</small>
                            <div className="card-divider my-2" />
                            <small className="d-block my-1">
                                Term of Payment: <span className="font-weight-bold">{termOfPayment}</span>
                            </small>
                            <small className="d-block my-1">
                                Kurir: <span className="font-weight-bold"> {courier}</span>
                            </small>
                            <small className="d-block my-1">
                                Pembungkus:<span className="font-weight-bold"> {wrapping}</span>
                            </small>
                            {/* <small className="d-block my-1">
                                Biaya Pembungkus:{" "}
                                <span className="font-weight-bold"> {packagingCostCurrencyFormat}</span>
                            </small> */}
                            <small className="d-block my-1">
                                Asuransi: <span className="font-weight-bold">{assurance}</span>
                            </small>
                            <small className="d-block my-1">
                                Catatan: <span className="font-weight-bold">{noteNego}</span>
                            </small>
                        </div>
                    </div>
                </div>
                <div className="card-divider"></div>
                <div className="card-table">
                    <div className="table-responsive" style={{ fontSize: "14px" }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Harga Nego</th>
                                    <th>Qty</th>
                                    <th>Total</th>
                                    <th>Tgl</th>
                                    <th>Harga Tanggapan</th>
                                    <th>Catatan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item, index) => (
                                    <tr>
                                        <td>{++index}</td>
                                        <td>{item.negoUnitPriceCurrencyFormat}</td>
                                        <td>{item.qty}</td>
                                        <td>{item.totalCurrencyFormat}</td>
                                        <td>{item.date}</td>
                                        <td>{item.priceResponse !== "0" ? item.priceResponseCurrencyFormat : "-"}</td>
                                        <td>{item.otherSpec}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-footer ">
                    <div className="d-flex justify-content-end">
                        {/* history[history.length - 1].negoUnitPrice !== history[history.length - 1].priceResponse &&
                            history[history.length - 1].priceResponse !== "0" */}
                        {!isNegoReject &&
                            !isNegoDone &&
                            history[history.length - 1].negoUnitPrice !== history[history.length - 1].priceResponse &&
                            history[history.length - 1].priceResponse !== "0" && (
                                <>
                                    <button
                                        className="btn btn-danger mr-2 btn-sm"
                                        onClick={() => doHandleRejectNegotiation()}
                                    >
                                        Tolak
                                    </button>
                                    <button
                                        className="btn btn-info btn-sm"
                                        onClick={() => doOpenRespond(history[history.length - 1])}
                                    >
                                        Tanggapi
                                    </button>
                                </>
                            )}
                        {buttonCart}
                    </div>
                    {/* {!isNegoReject && (
                        <div className="mt-2">
                            <div dangerouslySetInnerHTML={{ __html: note }} />
                        </div>
                    )} */}
                </div>
            </div>
            {openRespond && (
                <ModalRespond
                    customer={customer}
                    open={openRespond}
                    handleSendNegotiationRespon={handleSendNegotiationRespon}
                    toggle={doOpenRespond}
                    data={response}
                />
            )}
        </>
    );
};
const mapStateToProps = (state) => ({ customer: state.customer });

const mapDispatchToProps = { cartAddItem };

export default connect(mapStateToProps, mapDispatchToProps)(AccountPageNegotiationDetail);
