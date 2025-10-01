import React, { useEffect, useState } from "react";

// third-party
import { Helmet } from "react-helmet-async";
import theme from "../../data/theme";
import { ArrowLeft } from "../../svg";
import AsyncAction from "../shared/AsyncAction";
import classNames from "classnames";
import customerApi from "../../api/customer";
import { useHistory, useParams } from "react-router-dom";
import BlockLoader from "../blocks/BlockLoader";
import { connect } from "react-redux";
import { toast } from "react-toastify";

const AccountPageComplaintDetail = (props) => {
    const [state, setState] = useState({ complaintDetail: null, complaintDetailIsLoading: true });
    const { id } = useParams();
    const history = useHistory();
    const { token } = props.customer;
    const [message, setMessage] = useState("");

    useEffect(() => {
        setState({ ...state, complaintDetailIsLoading: true });
        customerApi.getComplaintDetail(id, token).then((res) => {
            const { data } = res;

            setState({ ...state, complaintDetailIsLoading: false, complaintDetail: data });
        });
        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const doHandleSendComplaint = () => {
        return customerApi.sendMessageComplaint({ message, complaintId: id }, token).then((res) => {
            if (res.status.code === 200) {
                setState({ ...state, complaintDetailIsLoading: true });
                customerApi.getComplaintDetail(id, token).then((res) => {
                    const { data } = res;

                    setState({ ...state, complaintDetailIsLoading: false, complaintDetail: data });
                });
                setMessage("");
                toast.success("Pesan terkirim");
            } else {
                toast.success("Pesan tidak terkirim");
            }
        });
    };

    if (state.complaintDetailIsLoading) {
        return <BlockLoader />;
    }

    const { product, complaint } = state.complaintDetail;

    return (
        <>
            <Helmet>
                <title>{`Detail Komplain — ${theme.name}`}</title>
            </Helmet>
            <h6 style={{ cursor: "pointer" }} className="mb-3" onClick={() => history.goBack()}>
                <ArrowLeft className="float-left mr-2" /> Kembali ke daftar komplain
            </h6>
            {complaint.isEscalation && (
                <div class="alert alert-warning" role="alert">
                    <strong>{complaint.escalation}</strong>
                </div>
            )}
            <div class="card">
                <div class="card-body">
                    <div className="row">
                        <div className="col-4">
                            <img
                                src={product.image}
                                alt=""
                                style={{
                                    width: "100%",
                                    // height: "200px",
                                    objectFit: "contain",
                                }}
                            />
                        </div>
                        <div className="col-md-8">
                            <div className="row">
                                <div className="col-12">
                                    <h5>{product.name}</h5>
                                </div>
                                <div className="col-md-6 my-2">
                                    <p className="d-block mb-0">Harga Produk :</p>
                                    <p className="d-block font-weight-bold">{product.priceCurrencyFormat}</p>
                                    <p className="d-block mb-0">Jumlah Pesanan :</p>
                                    <p className="d-block font-weight-bold">{product.qty}</p>
                                </div>
                                <div className="col-md-6 my-2">
                                    <p className="d-block mb-0">Biaya Kirim :</p>
                                    <p className="d-block font-weight-bold">{product.shippingCostCurrencyFormat}</p>
                                    <p className="d-block mb-0">Total Pesanan :</p>
                                    <p className="d-block font-weight-bold">{product.totalCurrencyFormat}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-divider" />
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <p className="font-weight-bold">Komplain Mengenai :</p>
                            <p>{complaint.type}</p>
                        </div>
                        <div className="col-md-6">
                            <p className="font-weight-bold">Alasan :</p>
                            <p>{complaint.main}</p>
                        </div>
                        <div className="col-md-6">
                            <p className="font-weight-bold">Bukti Gambar</p>
                            <img src={complaint.image} alt="" style={{ width: "75px", objectFit: "contain" }} />
                        </div>
                        <div className="col-md-6 mt-1">
                            {/* <p className="font-weight-bold mt-sm-5">Komplain telah diakhiri oleh Admin</p> */}
                            <div className="card">
                                <div className="card-body">
                                    <div className="row" style={{ maxHeight: "500px", overflowY: "auto" }}>
                                        {complaint.message.map((item, index) =>
                                            item.from === "mall" || item.from === "admin" ? (
                                                <div className="col-10">
                                                    <div
                                                        className={classNames(`alert`, {
                                                            "alert-secondary": item.from === "mall",
                                                            "alert-warning": item.from === "admin",
                                                        })}
                                                        role="alert"
                                                    >
                                                        <strong>{item.name}</strong>
                                                        <p>{item.message}</p>
                                                        <small>{item.createdAt}</small>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="col-10 offset-2">
                                                    <div class="alert alert-primary" role="alert">
                                                        <strong>Anda</strong>
                                                        <p>{item.message}</p>
                                                        <small>{item.createdAt}</small>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-12">
                                            <div class="form-group">
                                                <textarea
                                                    style={{
                                                        resize: "none",
                                                    }}
                                                    className="form-control"
                                                    name=""
                                                    onChange={(e) => setMessage(e.target.value)}
                                                    id=""
                                                    rows="2"
                                                ></textarea>
                                            </div>
                                            <AsyncAction
                                                action={doHandleSendComplaint}
                                                render={({ run, loading }) => (
                                                    <button
                                                        type="button"
                                                        onClick={run}
                                                        className={classNames("btn btn-primary", {
                                                            "btn-loading": loading,
                                                        })}
                                                    >
                                                        Kirim Pesan
                                                    </button>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({ customer: state.customer });

export default connect(mapStateToProps, null)(AccountPageComplaintDetail);
