import React, { memo, useState } from "react";
// third-party
import { Modal, ModalBody, ModalHeader, Collapse } from "reactstrap";
import PropTypes from "prop-types";
import { Messaging } from "../../svg";
import classNames from "classnames";
import AsyncAction from "./AsyncAction";
import Swal from "sweetalert2";

const ModalComplaint = (props) => {
    const {
        
        isOpen,
        invoice,
        toggle,
        // items,
        doHandleComplaintResolve,
        complaint,
        complaintCategory,
        doHandleSendMessageComplaint,
        isSendComplaint,
        doSendComplaint,
    } = props;
    const [state, setState] = useState({ category: "" });
    const [message, setMessage] = useState("");
    const [openHistoryChat, setOpenHistoryChat] = useState({});

    let content;

    // const product = items[0];

    const toggleCollapse = (targetName) => {
        if (!openHistoryChat[targetName]) {
            setOpenHistoryChat({
                [targetName]: {
                    collapse: true,
                },
            });
        } else {
            setOpenHistoryChat({
                [targetName]: {
                    collapse: !openHistoryChat[targetName].collapse,
                },
            });
        }
    };

    const isCollapseOpen = (targetName) => {
        return openHistoryChat[targetName] ? openHistoryChat[targetName].collapse : false;
    };

    const handleComplaintResolve = () => {
        return new Promise((resolve) => {
            Swal.fire({
                title: "Masukan solusi anda",
                input: "text",
                showCancelButton: true,
                cancelButtonText: "Batal",
                confirmButtonText: "Kirim",
                inputAttributes: {
                    autocapitalize: "off",
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    doHandleComplaintResolve({ solution: result.value });
                    resolve();
                }
            });
        });
    };

    const doHandleChange = (e) => {
        e.preventDefault();
        const { value, name, files } = e.target;
        if (name === "file") {
            setState({ ...state, [name]: files[0] });
        } else {
            setState({ ...state, [name]: value });
        }
    };
    content = (
        <>
            {complaint.length > 0 &&
                complaint.map((item) => (
                    <div className="card address-card address-card--featured mb-3">
                        <div className="address-card__body">
                            <div
                                className="address-card__badge address-card__badge--muted"
                                style={{ fontSize: "14px" }}
                            >
                                Komplain Dari {item.isHasResolve ? "Penyedia" : "Satdik"}
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6 col-sm-6 col-lg-3">
                                    <p className="font-weight-bold d-block">Komplain Mengenai :</p>
                                    <p>{item.type}</p>
                                    <p className="font-weight-bold d-block">Pesan Komplain : </p>
                                    <p>{item.main}</p>
                                </div>

                                <div className="col-md-6 col-sm-6 col-lg-3">
                                    <p className="font-weight-bold">Bukti Gambar</p>
                                    <img src={item.image} alt="" style={{ width: "75px", objectFit: "contain" }} />
                                </div>

                                <div className="col-md-6 col-sm-6 col-lg-3">
                                    <p className="font-weight-bold">Status</p>
                                    <h5>
                                        {item.isResolved ? (
                                            <span class="badge badge-pill badge-success">Selesai</span>
                                        ) : (
                                            <span class="badge badge-pill badge-warning">Sedang berlangsung</span>
                                        )}
                                    </h5>
                                </div>
                                <div className="col-md-6 col-sm-6 col-lg-3">
                                    <p className="font-weight-bold">Solusi</p>
                                    <p>{item.solution || "-"}</p>
                                </div>
                                <div className="col-md-12 my-3">
                                    <p
                                        style={{ cursor: "pointer" }}
                                        onClick={() => toggleCollapse(`collapse-${item.complaintId}`)}
                                        className="text-center text-primary font-weight-bold"
                                    >
                                        Lihat History Percakapan
                                    </p>
                                </div>
                                <Collapse className="row w-100" isOpen={isCollapseOpen(`collapse-${item.complaintId}`)}>
                                    <div className="col-md-12 mt-1">
                                        <div className="card border-0">
                                            <div className="card-divider my-2"></div>
                                            <div className="card-body">
                                                <div className="row" style={{ maxHeight: "300px", overflowY: "auto" }}>
                                                    {item.message.length < 1 ? (
                                                        <div className="col-12">
                                                            <div className="row justify-content-center align-items-center">
                                                                <div className="col-md-6">
                                                                    <Messaging style={{ width: "50%" }} />
                                                                    <h5 className="text-center my-3">
                                                                        Belum ada percakapan
                                                                    </h5>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {item.message.map((item, index) =>
                                                                item.from === "mall" || item.from === "admin" ? (
                                                                    <div className="col-10">
                                                                        <div
                                                                            className={classNames(`alert`, {
                                                                                "alert-secondary": item.from === "mall",
                                                                                "alert-warning": item.from === "admin",
                                                                            })}
                                                                            role="alert"
                                                                        >
                                                                            <strong>{item.name}</strong> (
                                                                            <small>{item.createdAt}</small>)
                                                                            <p>{item.message}</p>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="col-10 offset-2">
                                                                        <div
                                                                            class="alert alert-primary text-right"
                                                                            role="alert"
                                                                        >
                                                                            ( <small>{item.createdAt}</small>){" "}
                                                                            <strong>Satdik</strong>
                                                                            <p>{item.message}</p>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </>
                                                    )}
                                                </div>

                                                {!item.isResolved && (
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
                                                            <div className="float-right">
                                                                <AsyncAction
                                                                    action={() =>
                                                                        doHandleSendMessageComplaint({
                                                                            complaintId: item.complaintId,
                                                                            message,
                                                                        })
                                                                    }
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

                                                            {item.isHasResolve && (
                                                                <AsyncAction
                                                                    action={handleComplaintResolve}
                                                                    render={({ run, loading }) => (
                                                                        <button
                                                                            type="button"
                                                                            onClick={run}
                                                                            className={classNames(
                                                                                "btn btn-danger ml-2",
                                                                                {
                                                                                    "btn-loading": loading,
                                                                                }
                                                                            )}
                                                                        >
                                                                            Selesaikan komplain
                                                                        </button>
                                                                    )}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Collapse>

                                {/* <div className="col-12 row justify-content-end">
                                    <AsyncAction
                                        action={() => doSendComplaint(state)}
                                        render={({ run, loading }) => (
                                            <button
                                                type="button"
                                                data-placement="right"
                                                title="kirim komplain"
                                                onClick={run}
                                                className={classNames("btn btn-md btn-primary", {
                                                    "btn-loading": loading,
                                                })}
                                            >
                                                Kirim Komplain
                                            </button>
                                        )}
                                    />
                                </div>
                            */}
                            </div>
                        </div>
                    </div>
                ))}

            {isSendComplaint && (
                <div className="card address-card address-card--featured">
                    <div className="address-card__body">
                        <div className="address-card__badge address-card__badge--muted" style={{ fontSize: "14px" }}>
                            Form Komplain
                        </div>
                        <div className="row mt-3">
                            <div className="col-12">
                                <h5 className="my-3">Komplain invoice : {invoice} </h5>
                                <div class="form-group">
                                    <label for="complaintCategory">Kategori Komplain</label>
                                    {/* {orderStatusId < 1 ? (
                                        <h5>Pesanan</h5>
                                    ) : ( */}
                                    <select
                                        class="form-control"
                                        name="category"
                                        onChange={doHandleChange}
                                        id="complaintCategory"
                                    >
                                        <option disabled selected>
                                            Pilih Kategori
                                        </option>
                                        {complaintCategory.map((item) => (
                                            <option value={item.value}>{item.name}</option>
                                        ))}
                                    </select>
                                    {/* )} */}
                                </div>
                            </div>
                            <div className="col-12">
                                <div class="form-group">
                                    <label for="">Alasan</label>
                                    <textarea
                                        onChange={doHandleChange}
                                        class="form-control"
                                        name="reason"
                                        id=""
                                        rows="3"
                                        placeholder="Silahkan isi alasan  disini"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="col-12">
                                <div class="form-group">
                                    <label for="">Bukti Gambar</label>
                                    <input
                                        type="file"
                                        class="form-control-file"
                                        onChange={doHandleChange}
                                        name="file"
                                        id=""
                                        placeholder=""
                                        aria-describedby="fileHelpId"
                                    />
                                </div>
                            </div>
                            <div className="col-12 row justify-content-end">
                                <AsyncAction
                                    action={() => doSendComplaint(state)}
                                    render={({ run, loading }) => (
                                        <button
                                            type="button"
                                            data-placement="right"
                                            title="kirim komplain"
                                            onClick={run}
                                            className={classNames("btn btn-md btn-primary", {
                                                "btn-loading": loading,
                                            })}
                                        >
                                            Kirim Komplain
                                        </button>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* <div className="row">
                <div className="col-12">
                       <div className="card address-card address-card--featured">
                            <div className="address-card__body">
                                <div className="address-card__badge address-card__badge--muted">Detail Pengiriman</div>
                                <div className="address-card__name">{shippingAddress.to}</div>
                                <div className="address-card__row">{shippingAddress.addressDetail}</div>
                                <div className="address-card__row">
                                    <div className="address-card__row-title">No. Handphone</div>
                                    <div className="address-card__row-content">{shippingAddress.phone || "-"}</div>
                                </div>
                            </div>
                        </div>
                     
                    <div className="card address-card address-card--featured">
                        <div className="address-card__body">
                         <div className="address-card__badge address-card__badge--muted">Detail Pengiriman</div>
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
        */}
        </>
    );

    // if (complaintFor !== "newOrder") {
    //     content = (
    //         <>
    //             <div className="row">
    //               <div className="col-md-9">
    //                     <div className="row">
    //                         <div className="col-md-12">
    //                             <h5>{product.name}</h5>
    //                         </div>
    //                         <div className="col-md-6">
    //                             <div className="font-weight-bold">Harga Produk :</div>
    //                             <small className="text-muted">{product.priceCurrencyFormat}</small>
    //                             <div className="font-weight-bold">Jumlah Pesanan :</div>
    //                             <small className="text-muted">{product.qty}</small>
    //                         </div>
    //                         <div className="col-md-6">
    //                             <div className="font-weight-bold">Biaya Pengiriman :</div>
    //                             <small className="text-muted">Rp 20.000</small>
    //                             <div className="font-weight-bold">Total Pesanan :</div>
    //                             <small className="text-muted">{total}</small>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //             <div className="row mt-3">
    //                 <div className="col-12">
    //                     <div class="form-group">
    //                         <label for="complaintCategory">Kategori Komplain</label>
    //                         <select
    //                             class="form-control"
    //                             name="category"
    //                             onChange={doHandleChange}
    //                             id="complaintCategory"
    //                         >
    //                             <option disabled selected>
    //                                 Pilih Kategori
    //                             </option>
    //                             {complaintCategory.map((item) => (
    //                                 <option value={item.value}>{item.name}</option>
    //                             ))}
    //                         </select>
    //                     </div>
    //                 </div>
    //                 <div className="col-12">
    //                     <div class="form-group">
    //                         <label for="">Alasan</label>
    //                         <textarea
    //                             onChange={doHandleChange}
    //                             class="form-control"
    //                             name="reason"
    //                             id=""
    //                             rows="3"
    //                             placeholder="Silahkan isi alasan komplaint disini"
    //                         ></textarea>
    //                     </div>
    //                 </div>
    //                 <div className="col-12">
    //                     <div class="form-group">
    //                         <label for="">Bukti Gambar</label>
    //                         <input
    //                             type="file"
    //                             class="form-control-file"
    //                             onChange={doHandleChange}
    //                             name="file"
    //                             id=""
    //                             placeholder=""
    //                             aria-describedby="fileHelpId"
    //                         />
    //                     </div>

    //                 </div>
    //             </div>
    //         </>
    //     );
    // }

    return (
        <Modal isOpen={isOpen} size="xl" centered toggle={() => toggle("complaint")}>
            <ModalHeader toggle={() => toggle("complaint")}>Komplain</ModalHeader>
            <ModalBody>
                <div className="container">{content}</div>
            </ModalBody>
        </Modal>
    );
};

ModalComplaint.propTypes = {
    isOpen: PropTypes.bool,
    toggle: PropTypes.func,
    eBast: PropTypes.object,
    complaintCategory: PropTypes.array,
};

ModalComplaint.defaultProps = {
    isOpen: false,
    eBast: { items: [] },
    complaintCategory: [],
};

export default memo(ModalComplaint);
