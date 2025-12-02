import React, { useEffect, useState } from "react";

// third-party
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";
import configApi from "../../api/config";
import customerApi from "../../api/customer";
import { toast } from "react-toastify";
import AsyncAction from "./AsyncAction";
import classNames from "classnames";
import RequestPostLoader from "./RequestPostLoader";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

const ModalNego = (props) => {
    const { open, toggle, product, zone, token, forAct, doHandleFetchCompareList, agree } = props;
    const [config, setConfig] = useState([]);
    const [state, setState] = useState({ qty: product.qty ?? 0, qtyError: false });
    const [priceNego, setPriceNego] = useState({ floatValue: 0 });
    const [sendRequest, setSendRequest] = useState(false);

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     let newVal = value;
    //     if (name === "qty") {
    //         newVal = newVal.replaceAll(/[//A-Za-z.,-]/g, "");
    //         newVal = newVal.replaceAll(/^0+/g, "");
    //     }
    //     setState({ ...state, [name]: newVal });
    // };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newVal = value;

        if (name === "qty") {
            newVal = newVal.replaceAll(/[//A-Za-z.,-]/g, "");
            newVal = newVal.replaceAll(/^0+/g, "");

            const grosir = product?.price?.grosir;
            if (grosir && grosir.length > 0) {
                const minQty = parseInt(grosir[0].min, 10);
                const qty = parseInt(newVal, 10);

                if (!isNaN(qty) && qty > minQty) {
                    setState((prev) => ({ ...prev, qty: "0", qtyError: true }));
                    return;
                } else {
                    setState((prev) => ({ ...prev, qty: newVal, qtyError: false }));
                    return;
                }
            }
        }

        setState({ ...state, [name]: newVal });
    };

    useEffect(() => {
        if (product?.mall?.slug && token) {
            configApi.getConfigNego(product.mall.slug, token).then((res) => {
                console.log(res.data, "config nego");
                setConfig(res.data);
            });
        }
    }, [product?.mall?.slug, token]);

    useEffect(() => {
        if (config.length > 0) {
            const defaults = config.reduce((acc, item) => {
                if (item.items?.length > 0) {
                    acc[item.value] = item.items[0].value;
                }
                return acc;
            }, {});

            setState((prev) => ({
                ...prev,
                ...defaults,
            }));
        }
    }, [config]);

    const doHandleSend = () => {
        let productId = product?.id;
        let req = { ...state, productId, priceNego: priceNego.floatValue, mallId: product?.mall?.id };
        console.log(req);
        if (forAct === "compare") {
            req.productId = product?.productId;
            req.isCompare = agree;
            req.qty = product?.qty;
        }
        setSendRequest(true);
        if (isValid(req)) {
            return new Promise((resolve) => {
                customerApi.addNegotiation(req, token).then((res) => {
                    const { data } = res;
                    if (forAct === "compare") {
                        customerApi.deleteProductCompare(product?.productId, token).then((res) => {
                            doHandleFetchCompareList();
                        });
                    }
                    if (Number(res.status.code) === 200) {
                        toast.success(`Negosiasi telah dikirim`);
                        props.history.push(`/account/negotiation/${data}`);
                        setSendRequest(false);
                        toggle();
                        resolve();
                    } else {
                        toast.error(res.status.message);
                        setSendRequest(false);
                        toggle();
                        resolve();
                    }
                });
            });
        } else {
            return new Promise((resolve) =>
                setTimeout(() => {
                    setSendRequest(false);
                    toast.error(`Negosiasi gagal dikirim, Silahkan isi semua data`);
                    resolve();
                }, 500)
            );
        }
    };

    const isValid = (req) => {
        const reqValid = Object.keys({
            productId: 913133,
            mallId: 1579,
            qty: 2,
            priceNego: 50000,
            courier: "jne",
            wrapping: "Kardus dan Plastik",
        });

        if (reqValid.every((arr) => Object.keys(req).includes(arr))) {
            return (
                req.qty !== 0 &&
                req.priceNego !== 0 &&
                req.courier !== "" &&
                req.wrapping !== "" &&
                req.insurance !== ""
            );
        }
        return false;
    };

    // Check if product is tax exempt
    const isTaxExempt = !product?.ppn?.ppnPrice || Number(product?.ppn?.ppnPrice) === 0;

    // Get product price based on zone or primary price
    const productPrice =
        product?.price?.zone?.length > 0 && zone !== ""
            ? product?.price?.zone[zone - 1]?.priceCurrencyFormat
            : product?.price?.primaryCurrencyFormat || product?.priceCurrencyFormat;

    if (sendRequest) {
        return <RequestPostLoader />;
    }

    console.log(state.qty);
    console.log(state, "state");
    console.log(config, "config");

    return (
        <>
            <Modal isOpen={open} toggle={() => toggle(false)} centered size="xl">
                <ModalHeader toggle={() => toggle(false)}>Negosiasi</ModalHeader>
                <ModalBody>
                    <div className="row justify-content-center align-items-center mb-3">
                        <div className="col-md-2">
                            <img
                                src={product?.images === undefined ? product?.image : product?.images?.[0]}
                                alt=""
                                style={{
                                    width: "100%",
                                    height: "200px",
                                    objectFit: "contain",
                                }}
                            />
                        </div>
                        <div className="col-md-6">
                            <h4
                                style={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    wordBreak: "break-all",
                                    whiteSpace: "nowrap",
                                    marginBottom: "0",
                                }}
                            >
                                {product?.name}
                            </h4>

                            <h5 className="text-muted" style={{ marginTop: 10, color: "#0e336d" }}>
                                {productPrice}
                            </h5>

                            {isTaxExempt ? (
                                <div className="tax-exempt-info" style={{ marginTop: "5px", fontSize: "14px" }}>
                                    <div className="mb-1">
                                        <strong>Harga:</strong> {productPrice}
                                    </div>
                                    <div className="mb-1" style={{ color: "#28a745" }}>
                                        <strong>Keterangan:</strong> Bebas Pajak
                                    </div>
                                    <div className="mb-1">
                                        <strong>DPP Nilai Lain:</strong> Rp 0
                                    </div>
                                    <div className="mb-1">
                                        <strong>PPN 12%:</strong> Rp 0
                                    </div>
                                    <div className="mb-1">
                                        <strong>DPP PPh:</strong> {productPrice}
                                    </div>
                                </div>
                            ) : (
                                <ul className="product__meta mb-4 d-block" style={{ color: "#000" }}>
                                    <li>
                                        <dl className="d-flex mb-0">
                                            <dt style={{ width: "100px" }}>Dpp Pph</dt>
                                            <dd className="mb-0">:</dd>
                                            <dd className="mb-0 ml-1">
                                                Rp{Number(product?.ppn?.dpp).toLocaleString().replaceAll(",", ".") || 0}
                                            </dd>
                                        </dl>
                                    </li>
                                    <li>
                                        <dl className="d-flex mb-0">
                                            <dt style={{ width: "100px" }}>Dpp Nilai Lain</dt>
                                            <dd className="mb-0">:</dd>
                                            <dd className="mb-0 ml-1">
                                                Rp
                                                {/* {Math.floor((11 / 12) * Number(product?.ppn?.dpp)).toLocaleString(
                                                    "id-ID"
                                                ) || 0} */}
                                                {Math.ceil((11 / 12) * Number(product?.ppn?.dpp)).toLocaleString(
                                                    "id-ID"
                                                )}
                                            </dd>
                                        </dl>
                                    </li>
                                    <li>
                                        <dl className="d-flex mb-0">
                                            <dt style={{ width: "100px" }}>Ppn 12%</dt>
                                            <dd className="mb-0">:</dd>
                                            <dd className="mb-0 ml-1">
                                                Rp
                                                {Number(product?.ppn?.ppnPrice).toLocaleString().replaceAll(",", ".") ||
                                                    0}
                                            </dd>
                                        </dl>
                                    </li>
                                    <small>
                                        *PPN yang dikenakan telah menggunakan perhitungan terbaru sesuai dengan{" "}
                                        <a
                                            target="_blank"
                                            href="https://jdih.kemenkeu.go.id/api/download/ad276b82-94bd-4197-b409-af33e2842cd6/2024pmkeuangan131.pdf"
                                        >
                                            PMK No. 131 Tahun 2024
                                        </a>
                                        *
                                    </small>
                                </ul>
                            )}
                        </div>
                    </div>
                    <form>
                        <div className="row">
                            <div className="col-md-6">
                                <label>Masukan Harga Nego</label>
                                <div className="input-group">
                                    <NumberFormat
                                        name="negoPrice"
                                        value={priceNego.floatValue}
                                        onValueChange={(value) =>
                                            value.floatValue > 0 ? setPriceNego(value) : setPriceNego(priceNego)
                                        }
                                        prefix={"Rp"}
                                        thousandSeparator
                                        className="form-control"
                                    />
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="inputGroupPrepend3">
                                            1 Pcs
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="">Masukkan Jumlah Barang:</label>
                                    <input
                                        type="text"
                                        name="qty"
                                        value={state.qty}
                                        className="form-control"
                                        placeholder=""
                                        onChange={handleChange}
                                    />
                                    {state.qtyError && (
                                        <small className="text-danger">
                                            Jumlah barang tidak boleh lebih dari minimum grosir (
                                            {product?.price?.grosir?.[0]?.min || 0})
                                        </small>
                                    )}
                                </div>
                            </div>
                            {config?.length > 0 &&
                                config.map((item) => (
                                    <div className="col-md-6" key={item?.value}>
                                        <div className="form-group">
                                            <label htmlFor={item?.value}>{item?.name}</label>
                                            <select
                                                required
                                                className="form-control"
                                                name={item?.value}
                                                id={item?.value}
                                                value={
                                                    state[item?.value] ??
                                                    (Array.isArray(item?.items) && item.items.length > 0
                                                        ? item.items[0].value
                                                        : "")
                                                }
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setState((prev) => ({ ...prev, [item.value]: value }));
                                                }}
                                            >
                                                {item?.items?.map((subItem) => (
                                                    <option key={subItem?.value} value={subItem?.value}>
                                                        {subItem?.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                ))}

                            {/* {config?.map((item) => (
                                <div className="col-md-6" key={item?.value}>
                                    <div className="form-group">
                                        <label htmlFor={item?.value}>{item?.name}</label>
                                        <select
                                            required
                                            className="form-control"
                                            name={item?.value}
                                            id={item?.value}
                                            value={state[item?.value] ?? item?.items?.[0]?.value}
                                            onChange={(e) =>
                                                setState((prev) => ({ ...prev, [item.value]: e.target.value }))
                                            }
                                        >
                                            {item?.items?.map((subItem) => (
                                                <option key={subItem?.value} value={subItem?.value}>
                                                    {subItem?.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ))} */}

                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="">Catatan</label>
                                    <textarea
                                        className="form-control"
                                        name="otherSpec"
                                        onChange={handleChange}
                                        id=""
                                        rows="3"
                                        placeholder="Catatan ....."
                                    ></textarea>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="">Total Harga Nego:</label>
                                    <NumberFormat
                                        disabled
                                        thousandSeparator
                                        prefix={"Rp"}
                                        value={priceNego.floatValue * state.qty}
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <AsyncAction
                                        action={doHandleSend}
                                        render={({ run, loading }) => (
                                            <button
                                                type="button"
                                                onClick={run}
                                                className={classNames("btn btn-primary btn-block btn-lg", {
                                                    "btn-loading": loading,
                                                })}
                                            >
                                                Kirim Negosiasi
                                            </button>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </>
    );
};

ModalNego.propTypes = {
    /** product object */
    open: PropTypes.bool.isRequired,
    /** one of ['standard', 'sidebar', 'columnar', 'quickview'] (default: 'standard') */
    toggle: PropTypes.func.isRequired,
    product: PropTypes.object.isRequired,
    token: PropTypes.string,
};

ModalNego.defaultProps = {
    open: false,
};

const mapStateToProps = (state) => ({ customer: state.customer });

export default withRouter(connect(mapStateToProps, null)(ModalNego));
