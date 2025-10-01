import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import React, { useState } from "react";

// third-party
import Swal from "sweetalert2";
import classNames from "classnames";
import PropTypes from "prop-types";
import Select from "react-select";
import AsyncAction from "./AsyncAction";
import { connect } from "react-redux";

const ModalPayment = (props) => {
    const {
        isOpen,
        toggle,
        data,
        invoice,
        setUpdateConfirmPayment,
        customer,
        updateConfirmPayment,
        paymentMethodSelected,
        paymentMethod,
        totalPriceCurrencyFormat,
        doSendConfirmPayment,
    } = props;
    const [state, setState] = useState({ accountNumber: "", accountAsName: customer.school.name });
    const doHandleChange = (e) => {
        e.preventDefault();
        const { value, name, files } = e.target;
        if (name === "file") {
            setState({ ...state, [name]: files[0] });
        } else {
            setState({ ...state, [name]: value });
        }
    };

    const doHandleConfirmPayment = () => {
        return doSendConfirmPayment({ ...state, bank: paymentMethodSelected.value });
    };

    let content = (
        <div className="row">
            <div className="col-lg-6">
                <div class="form-group">
                    <label for="">No. Invoice</label>
                    <input type="text" class="form-control" readOnly disabled value={invoice} />
                </div>
            </div>
            {/* <div className="col-lg-6">
                <div class="form-group">
                    <label for="">No. Rekening Sekolah</label>
                    <input
                        name="accountNumber"
                        onChange={doHandleChange}
                        type="text"
                        class="form-control"
                        placeholder="Masukan No Rekening Anda"
                    />
                </div>
            </div> */}
            <div className="col-lg-6">
                <div class="form-group">
                    <label for="">Rek. Atas Nama Sekolah</label>
                    <input
                        type="text"
                        class="form-control"
                        onChange={doHandleChange}
                        disabled={true}
                        value={customer.school.name}
                        name="accountAsName"
                        id=""
                        aria-describedby="helpId"
                        placeholder="Masukan Nama Sekolah Anda"
                    />
                </div>
            </div>
            <div className="col-lg-6">
                <div class="form-group">
                    <label for="">Jumlah yang dibayar</label>
                    <input type="text" value={totalPriceCurrencyFormat} disabled readOnly class="form-control" />
                </div>
            </div>
            <div className="col-lg-6">
                <div class="form-group">
                    <label for="">Bank </label>
                    <Select
                        className="basic-single"
                        classNamePrefix="select"
                        value={paymentMethodSelected}
                        isDisabled
                        placeholder="Pilih Metode Pembayaran"
                        options={paymentMethod.map(({ group, items }) => ({
                            label: group,
                            options: items.map(({ value, name }) => ({ label: name, value })),
                        }))}
                    />
                </div>
            </div>
            <div className="col-lg-6">
                <div class="form-group">
                    <label for="">Tanggal Transfer</label>
                    <input type="date" class="form-control" onChange={doHandleChange} name="date" />
                </div>
            </div>
            <div className="col-lg-6">
                <div class="form-group">
                    <label for="">Bukti Pembayaran</label>
                    <input type="file" class="form-control-file" name="file" onChange={doHandleChange} />
                </div>
            </div>
            <div className="col-12">
                <div class="form-group">
                    <label for="">Memo</label>
                    <textarea class="form-control" onChange={doHandleChange} name="memo" rows="3"></textarea>
                </div>
            </div>
        </div>
    );

    if (Object.keys(data).length > 0 && !updateConfirmPayment) {
        const {
            status,
            invoice,
            method,
            accountNumber,
            asName,
            date,
            memo,
            datePayment,
            totalCurrencyFormat,
            adminFeeCurrencyFormat,
            ppn,
            image,
        } = data;
        content = (
            <div className="row">
                <div className="col-12">
                    <div class="alert alert-success" role="alert">
                        <strong>Anda telah melakukan konfirmasi pembayaran</strong>
                    </div>
                </div>
                <div className="col-lg-3 col-sm-6 my-2">
                    <div className="font-weight-bold">Status</div>
                    <span class="badge badge-pill badge-success">{status}</span>
                </div>
                <div className="col-lg-3 col-sm-6 my-2">
                    <div className="font-weight-bold">Kode Pesanan</div>
                    <small className="text-muted">{invoice}</small>
                </div>
                <div className="col-lg-3 col-sm-6 my-2">
                    <div className="font-weight-bold">Metode Pembayaran</div>
                    <small className="text-muted">{method}</small>
                </div>
                <div className="col-lg-3 col-sm-6 my-2">
                    <div className="font-weight-bold">No. Rekening</div>
                    <small className="text-muted">{accountNumber || "-"}</small>
                </div>
                <div className="col-lg-3 col-sm-6 my-2">
                    <div className="font-weight-bold">Atas Nama</div>
                    <small className="text-muted">{asName}</small>
                </div>
                <div className="col-lg-3 col-sm-6 my-2">
                    <div className="font-weight-bold">Tanggal</div>
                    <small className="text-muted">{date}</small>
                </div>
                <div className="col-lg-3 col-sm-6 my-2">
                    <div className="font-weight-bold">Memo</div>
                    <small className="text-muted">{memo || "-"}</small>
                </div>
                <div className="col-lg-3 col-sm-6 my-2">
                    <div className="font-weight-bold">Tanggal Pembayaran</div>
                    <small className="text-muted">{datePayment}</small>
                </div>
                <div className="col-lg-3 col-sm-6 my-2">
                    <div className="font-weight-bold">Total Pembayaran</div>
                    <small className="text-muted">{totalCurrencyFormat}</small>
                </div>
                <div className="col-lg-3 col-sm-6 my-2">
                    <div className="font-weight-bold">Biaya Admin</div>
                    <small className="text-muted">{adminFeeCurrencyFormat}</small>
                </div>
                <div className="col-lg-3 col-sm-6 my-2">
                    <div className="font-weight-bold">Ppn</div>
                    <small className="text-muted">{ppn}</small>
                </div>
                <div className="col-lg-3 col-sm-6 my-2 text-left">
                    <div className="font-weight-bold">Bukti Transfer</div>
                    <img
                        src={image}
                        style={{
                            width: "100%",
                            height: "100px",
                            objectFit: "contain",
                        }}
                        alt=""
                    />
                </div>
            </div>
        );
    }

    const onClickPayment = () => {
        Swal.fire({
            text: "Dengan melakukan konfirmasi ulang, data konfirmasi sebelumnya menjadi tidak berlaku",
            icon: "info",
            showCancelButton: true,
            cancelButtonText: `Batal`,
            confirmButtonText: `Lanjutkan`,
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                setUpdateConfirmPayment(true);
            }
        });
    };

    const doOpen = () => {
        toggle("paymentConfirmed");
        setUpdateConfirmPayment(false);
    };

    return (
        <Modal isOpen={isOpen} centered size="xl" toggle={doOpen}>
            <ModalHeader toggle={doOpen}>Konfirmasi Pembayaran</ModalHeader>
            <ModalBody>{content}</ModalBody>
            <ModalFooter>
                {Object.keys(data).length > 0 && !updateConfirmPayment ? (
                    <button type="button" onClick={onClickPayment} className="btn btn-md btn-primary">
                        Konfirmasi Ulang
                    </button>
                ) : (
                    <AsyncAction
                        action={doHandleConfirmPayment}
                        render={({ run, loading }) => (
                            <button
                                type="button"
                                data-placement="right"
                                title="kirim konfirmasi pembayaran"
                                onClick={run}
                                className={classNames("btn btn-md btn-primary", {
                                    "btn-loading": loading,
                                })}
                            >
                                Kirim
                            </button>
                        )}
                    />
                )}
            </ModalFooter>
        </Modal>
    );
};

ModalPayment.propTypes = {
    isOpen: PropTypes.bool,
    toggle: PropTypes.func,
};

ModalPayment.defaultPropTypes = {
    isOpen: false,
};

const mapStateToProps = (state) => ({
    customer: state.customer,
});

export default connect(mapStateToProps, null)(ModalPayment);
