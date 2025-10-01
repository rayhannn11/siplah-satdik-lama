import React, { useState } from "react";
import { Modal, ModalBody } from "reactstrap";
import ModalHeader from "reactstrap/lib/ModalHeader";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";
import AsyncAction from "./AsyncAction";
import classNames from "classnames";

const ModalRespond = (props) => {
    const { open, toggle, data, handleSendNegotiationRespon, customer } = props;
    const { image, name, priceResponseCurrencyFormat, priceZone, initialUnitPriceCurrencyFormat } = data;

    const [state, setState] = useState({ priceNego: 0, otherSpec: "" });

    const doHandleChange = (e, name) => {
        if (e.target !== undefined) {
            const { value, name } = e.target;
            setState({ ...state, [name]: value });
        } else {
            setState({ ...state, [name]: e.floatValue });
        }
    };

    return (
        <Modal isOpen={open} size="lg" toggle={toggle}>
            <ModalHeader toggle={toggle}>Negosiasi</ModalHeader>
            <ModalBody>
                <div className="row">
                    <div className="col-md-12 mb-3">
                        <div className="row align-items-center">
                            <div className="col-2">
                                <img src={image} style={{ objectFit: "contain", width: "100px" }} alt="" />
                            </div>
                            <div className="col-10">
                                <h6>{name}</h6>
                                {priceZone.length > 0 ? (
                                    <>
                                        {priceZone[customer?.school?.location?.zone - 1].priceCurrencyFormat}{" "}
                                        <small className="text-success font-weight-bold">
                                            (zona {customer?.school?.location?.zone})
                                        </small>
                                    </>
                                ) : (
                                    initialUnitPriceCurrencyFormat
                                )}
                                {/* {" "}
                                / {data.specification.unitType || "Pcs"} */}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div class="form-group">
                            <label for="">Tanggapan Penjual</label>
                            <input
                                type="text"
                                class="form-control"
                                name=""
                                disabled
                                readOnly
                                value={priceResponseCurrencyFormat}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div class="form-group">
                            <label for="">Tanggapan Anda</label>
                            <NumberFormat
                                thousandSeparator
                                onValueChange={(val) => doHandleChange(val, "priceNego")}
                                className="form-control"
                                prefix={"Rp"}
                            />
                        </div>
                    </div>
                    <div className="col-12">
                        <div class="form-group">
                            <label for="">Masukan Pesan Anda</label>
                            <textarea
                                class="form-control"
                                name="otherSpec"
                                id=""
                                rows="3"
                                onChange={doHandleChange}
                            ></textarea>
                        </div>
                    </div>
                    <div className="col-12 d-flex justify-content-end align-items-end">
                        <AsyncAction
                            action={() => handleSendNegotiationRespon(state)}
                            render={({ run, loading }) => (
                                <button
                                    type="button"
                                    onClick={run}
                                    className={classNames("btn btn-primary btn-md", {
                                        "btn-loading": loading,
                                    })}
                                >
                                    Kirim
                                </button>
                            )}
                        />
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
};

ModalRespond.propTypes = {
    open: PropTypes.bool,
    toggle: PropTypes.func,
};

ModalRespond.defaultProps = {
    open: false,
};

export default ModalRespond;
