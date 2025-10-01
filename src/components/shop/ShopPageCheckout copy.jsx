// react
import React, { useEffect, useReducer, useState } from "react";

// third-party
import classNames from "classnames";
import { connect } from "react-redux";
import { Helmet } from "react-helmet-async";
import queryString from "query-string";
import { useParams, Link, withRouter } from "react-router-dom";
import Swal from "sweetalert2";
import { Collapse } from "reactstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import { Modal, ModalBody } from "reactstrap";

// application
import AsyncAction from "../shared/AsyncAction";
import RequestPostLoader from "../shared/RequestPostLoader";
import { addMiniCart } from "../../store/mini-cart";

// data stubs
import theme from "../../data/theme";
import customerApi from "../../api/customer";
import BlockLoader from "../blocks/BlockLoader";
import { url } from "../../services/utils";
import { ArrowLeft } from "../../svg";

const customStyles = {
    placeholder: (provided, state) => ({
        ...provided,
        fontSize: "14px",
    }),
};

function parseQueryOptions(location) {
    const query = queryString.parse(location);

    const optionValues = {
        shipping: "",
        from: "",
        isInsurance: 0,
    };

    if (typeof query.shipping === "string") {
        optionValues.shipping = query.shipping;
    }
    if (typeof query.from === "string") {
        optionValues.from = query.from;
    }
    if (typeof query.isInsurance === "string") {
        optionValues.isInsurance = query.isInsurance;
    }

    return optionValues;
}
function parseQuery(location) {
    return [parseQueryOptions(location)];
}

function buildQuery(options) {
    const params = {};

    if (options.shipping !== "" && options.shipping !== "penyedia") {
        params.shipping = options.shipping;
    }

    if (options.from !== "") {
        params.from = options.from;
    }
    if (options.isInsurance !== "") {
        params.isInsurance = options.isInsurance;
    }
    return queryString.stringify(params, { encode: false });
}

const initialState = {
    checkoutIsLoading: true,
    checkout: null,
    options: {},
};

function reducer(state, action) {
    switch (action.type) {
        case "FETCH_CHECKOUT":
            return {
                ...state,
                checkoutIsLoading: true,
            };
        case "FETCH_CHECKOUT_SUCCESS":
            return { ...state, checkout: action.checkout, checkoutIsLoading: false };
        case "SET_SHIPPING_VALUE":
            return {
                ...state,
                options: { ...state.options, shipping: action.shipping },
            };
        case "SET_OPTIONS":
            return { ...state, options: { ...state.options, isInsurance: action.isInsurance } };
        case "RESET":
            return state.init ? initialState : state;
        default:
            throw new Error();
    }
}

function init(state) {
    const [options] = parseQuery(window.location.search);

    return { ...state, options };
}

const ShopPageCheckout = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState, init);
    const { customer, addMiniCart } = props;
    const { id } = useParams();
    const [data, setData] = useState({});
    const [note, setNote] = useState(""),
        [sendRequest, setSendRequest] = useState(false);

    const [seeProductPackets, setSeeProductPackets] = useState({});
    const [openVa, setOpenVa] = useState(false);
    let content;

    const isCreateOrder = () => {
        return new Date().getTime() >= new Date("2021-08-19").getTime();
    };

    // Replace current url.
    useEffect(() => {
        const query = buildQuery(state.options);
        const location = `${window.location.pathname}${query ? "?" : ""}${query}`;
        window.history.replaceState(null, "", location);
    }, [state.options]);

    useEffect(() => {
        if (id === undefined) return;
        doHandleFetchCheckout();
        // eslint-disable-next-line
    }, [state.options, dispatch]);

    const doHandleFetchCheckout = () => {
        dispatch({ type: "FETCH_CHECKOUT" });

        customerApi.getCheckout(customer.token, id, state.options).then((res) => {
            const { status, data } = res;
            if (status.code === 200) {
                dispatch({ type: "FETCH_CHECKOUT_SUCCESS", checkout: data });
            } else {
                Swal.fire({
                    html: status.message,
                    title: "Perhatian",
                    allowOutsideClick: false,
                    icon: "warning",
                    confirmButtonText: "OK",
                }).then((result) => {
                    if (result.isConfirmed) {
                        props.history.push("/shop/cart");
                    }
                });
                dispatch({ type: "FETCH_CHECKOUT_SUCCESS", checkout: null });
            }
        });
    };

    const toggleCollapse = (targetName) => {
        if (!seeProductPackets[targetName]) {
            setSeeProductPackets({
                [targetName]: {
                    tooltipOpen: true,
                },
            });
        } else {
            setSeeProductPackets({
                [targetName]: {
                    tooltipOpen: !seeProductPackets[targetName].tooltipOpen,
                },
            });
        }
    };

    const isCollapseOpen = (targetName) => {
        return seeProductPackets[targetName] ? seeProductPackets[targetName].tooltipOpen : false;
    };

    useEffect(() => {
        if (id === undefined) return props.history.push("/shop/cart");
        Swal.fire({
            html: `Pastikan Barang yang Anda beli telah sesuai dengan Ketentuan dari Kemendikbud.<br/>
        SIPLah Eureka tidak bertanggung jawab atas kesalahan pemilihan Barang yang tidak sesuai dengan Ketentuan Kemendikbud.`,
            title: "Perhatian",
            icon: "info",
            confirmButtonText: "OK",
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const doHandleChange = (item) => {
        if (state.options.from === "cart") {
            if (item.value !== "penyedia") {
                dispatch({ type: "SET_SHIPPING_VALUE", shipping: item.value });
            } else if (item.value === "penyedia") {
                dispatch({ type: "SET_SHIPPING_VALUE", shipping: "" });
            }
        } else {
            const req = { storeId: state.checkout.cartSelected.mall.id, shippingCode: item.value };
            customerApi.changeShippingCompare(req, customer.token).then((res) => {
                doHandleFetchCheckout();
            });
        }
    };

    const isValid = (req) => {
        const reqValid = Object.keys({
            id: 91,
            from: "cart",
            shipping: "penyedia",
            sourceOfFund: "BOSE00110",
            wrapping: "",
            paymentMethod: "bank_mandiri_va",
            paymentDue: "",
            isInsurance: false,
            note: "",
        });
        if (reqValid.every((arr) => Object.keys(req).includes(arr))) {
            return req.sourceOfFund !== "" && req.paymentDue !== "" && req.paymentMethod !== "";
        }
        return false;
    };

    const doHandleChangeSelect = (item, name) => {
        setData({ ...data, [name]: item });
        alert(JSON.stringify(item)+"-"+name);
    };
    const waitPayment = (
        <Modal isOpen={openVa} centered toggle={() => setOpenVa(!openVa)}>
            <ModalBody>
                <div class="text-center p-3">  <h5 >Metode Pembayaran SIPLah Eureka</h5> </div>
                <div className="d-flex ">
                    <medium className="border p-2 text-center btn btn-primary" style={{width:"50%", marginRight:10, borderTopLeftRadius: 10, borderTopRightRadius: 10, fontSize:14}} > Virtual Account</medium> 
                     
                </div>
                
                <div className="card p-2 idVA">
                    <div className="d-flex mt-2">
                        <small className="border p-2 text-center btn btn-default" style={{width:"50%", height: 60, marginRight:10, fontSize:13}} onClick={(val) => doHandleChangeSelect({value:"bank_bri_va",name:"Virtual Account BRI (BRIVA)"}, "paymentMethod")} > <img alt="logo siplah eureka" src="https://storage.googleapis.com/go-merchant-production.appspot.com/uploads/2020/09/0fcddd245474380834dfe5f3beb0492f_093eb297aba2188382cf91e556dd9bdf_compressed.png" style={{height:25}}></img> <br/> BRIVA BRI</small> 
                        <small className="border p-2 text-center btn btn-default" style={{width:"50%", height: 60, fontSize:14 }}  onClick={(val) => doHandleChangeSelect({value:"bank_mandiri_va",name:"Virtual Account Mandiri"}, "paymentMethod")} > <img alt="logo siplah eureka" src="https://storage.googleapis.com/go-merchant-production.appspot.com/uploads/2020/09/11f8970a182ad8cf6aaf0a0cd22dd9ad_3948cb3bf5c4887c7cca7ca7ee421708_compressed.png" style={{height:25}}></img> <br/> VA MANDIRI</small>  
                    </div> 
                     
                </div>
                <div className="d-flex  mt-2"> 
                    <medium className="border p-2 text-center btn btn-primary" style={{width:"50%",  borderTopLeft:10, borderTopLeftRadius: 10, borderTopRightRadius: 10, fontSize:14}} > Kode Bayar BPD</medium>  
                 </div>
                
                <div className="card p-2 idBPD">
                    <div className="d-flex mt-2">
                        <small className="border p-2 text-center btn btn-default" style={{width:"50%", height: 60 , marginRight:10, fontSize:14}}  onClick={(val) => doHandleChangeSelect({value:"bank_bpd_va",name:"BPD JATENG"}, "paymentMethod")} > <img alt="logo siplah eureka" src="data:image/png;base64,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" style={{height:25}}></img> <br/>  BPD JATENG</small> 
                        <small className="border p-2 text-center btn btn-default" style={{width:"50%", height: 60 , marginRight:10, fontSize:14}}  onClick={(val) => doHandleChangeSelect({value:"bank_bpd_va",name:"BPD NAGARI"}, "paymentMethod")} > <img alt="logo siplah eureka" src="data:image/png;base64,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" style={{height:25}}></img> <br/>  BPD NAGARI</small>    
                        <small className="border p-2 text-center btn btn-default" style={{width:"50%", height: 60, fontSize:14 }}   onClick={(val) => doHandleChangeSelect({value:"bank_bpd_va",name:"BPD KALTIMTARA"}, "paymentMethod")} > <img alt="logo siplah eureka" src="data:image/png;base64,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" style={{height:25}}></img> <br/>  BPD KALTIMTARA</small> 
                        
                    </div> 
                    <div className="d-flex mt-2">
                        <small className="border p-2 text-center btn btn-default" style={{width:"50%",  height: 60 ,marginRight:10, fontSize:14}}  onClick={(val) => doHandleChangeSelect({value:"bank_bpd_va",name:"BPD BALI"}, "paymentMethod")} > <img alt="logo siplah eureka" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAWhmC9jvU9fUMmIB29DAVUet3c5LUg_OckQ&usqp=CAU" style={{height:25}}></img> <br/>  BPD BALI</small>    
                        <small className="border p-2 text-center btn btn-default" style={{width:"50%",  height: 60 ,marginRight:10, fontSize:14}} onClick={(val) => doHandleChangeSelect({value:"bank_bpd_va",name:"BPD SUMUT"}, "paymentMethod")} > <img alt="logo siplah eureka" src="data:image/png;base64,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" style={{height:25}}></img> <br/>  BPD SUMUT</small> 
                        <small className="border p-2 text-center btn btn-default" style={{width:"50%",  height: 60 ,fontSize:14}} onClick={(val) => doHandleChangeSelect({value:"bank_bpd_va",name:"BPD BJB"}, "paymentMethod")} > <img alt="logo siplah eureka" src="data:image/png;base64,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" style={{height:25}}></img> <br/> BPD BJB</small>    
                    </div> 
                </div>
            </ModalBody>
        </Modal>
    );

    const showVA = (jenis) => {
        if (jenis === 'VA') {
           alert(jenis);
        } else {
            alert(jenis);
        }
    };

    const doHandleCreateOrder = () => {

        if (!customer.school.npwp) {
            return new Promise((resolve) => {
                Swal.fire({
                    icon: "info",
                    title: "NPWP TIDAK DITEMUKAN",
                    showCancelButton: false,
                    html: `Silahkan lengkapi NPWP sekolah pada sistem dapodik`
                })
                resolve()
            })
        }
        if (process.env.REACT_APP_IS_MAINTENANCE === 'true') {
            return new Promise((resolve) => {
                Swal.fire({
                    icon: "info",
                    title: "Maintenance",
                    showCancelButton: false,
                    html: `mohon maaf proses order tidak bisa dilanjutkan dikarenakan sedang tahap sinkronisasi ke DJP`
                })
                resolve()
            })
        }
        let req = { isInsurance: false };
        Object.keys(data).forEach((item) => {
            req = { ...req, [item]: data[item].value };
        });
        if (state.options.isInsurance === 1) {
            req.isInsurance = true;
        }
        setSendRequest(true);
        req = { ...req, note, shipping: state.options.shipping || "penyedia", id, from: state.checkout.from };
        if (isValid(req)) {
            return new Promise((resolve) => {
                customerApi.createOrder(req, customer.token).then((res) => {
                    const { data, status } = res;
                    if (status.code === 200) {
                        props.history.push(`/account/orders/${data}`);

                        toast.success("Pesanan berhasil dibuat", {
                            position: "top-center",
                            bodyClassName: "font-weight-bold",
                        });
                    } else {
                        toast.error("Pesanan gagal dibuat");
                    }
                    setSendRequest(false);
                    customerApi.getMiniCart(customer.token).then((res) => {
                        const { data } = res;
                        addMiniCart(data);
                    });
                    resolve();
                });
            });
        } else {
            return new Promise((resolve) => {
                setSendRequest(false);
                setTimeout(() => {
                    toast.error("Data tidak boleh kosong");
                    resolve();
                }, 100);
            });
        }
    };

    const { name, location, telephone } = customer.school;

    if (sendRequest) {
        return <RequestPostLoader />;
    }

    if (state.checkoutIsLoading) {
        return <BlockLoader />;
    }

    if (state.checkout == null) {
        content = (
            <div className="block block-empty">
                <div className="container">
                    <div className="block-empty__body">
                        <div className="block-empty__message">Belum ada data checkout</div>
                    </div>
                </div>
            </div>
        );
    } else {
        const {
            cartSelected,
            sourceOfFunds,
            shipping,
            insuranceTotalCurrencyFormat,
            shippingSelected,
            paymentMethod,
            totalCurrencyFormat,
            weightText,
            paymentDue,
            wrapping,
            subTotalCurrencyFormat,
            ppnCurrencyFormat,
            shippingCostCurrencyFormat,
        } = state.checkout;

        content = (
            <div className="cart block mt-1">
                <div className="container">
                    {!isCreateOrder() && (
                        <div class="alert alert-danger" role="alert">
                            <strong>
                                Mohon maaf atas ketidaknyamanannya.
                                <br /> dikarenakan ada migrasi ke versi terbaru..
                                <br /> Transaksi baru bisa dilakukan kembali mulai tanggal 19 Agustus 2021.
                            </strong>
                        </div>
                    )}
                    <div className="card">
                        <div className="card-header d-flex flex-row justify-content-between align-items-center">
                            <h6 className="text-primary">{cartSelected.mall.name}</h6>
                        </div>

                        <div className="card-table">
                            <div className="table-responsive" style={{ fontSize: "14px" }}>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Produk</th>
                                            <th />
                                            <th>Harga</th>
                                            <th>Ppn</th>
                                            <th>Jumlah</th>
                                            <th>Sub Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartSelected.product.map((item) => (
                                            <>
                                                <tr>
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
                                                        <p style={{ marginBottom: 0 }}>{item.name}</p>
                                                        <small
                                                            className="d-block"
                                                            style={{ color: "#0E336D", fontSize: "14px" }}
                                                        >
                                                            {item.brand}
                                                        </small>
                                                        {item.packet.length > 0 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleCollapse(`collapse-${item.id}`)}
                                                                name=""
                                                                id=""
                                                                class="btn btn-primary btn-sm"
                                                            >
                                                                Lihat Paket
                                                            </button>
                                                        )}
                                                        {item.badges.map((item) => {
                                                            return (
                                                                (item.toLowerCase() === "banding" ||
                                                                    item.toLowerCase() === "het") && (
                                                                    <div
                                                                        key={item}
                                                                        className="product-card__badge product-card__badge--hot w-sm-50"
                                                                    >
                                                                        {item}
                                                                    </div>
                                                                )
                                                            );
                                                        })}
                                                    </td>
                                                    <td>
                                                        {item.isCrossPrice ? (
                                                            <>
                                                                <small style={{ textDecoration: "line-through" }}>
                                                                    {item.crossPrice}
                                                                </small>{" "}
                                                                <span>{item.priceCurrencyFormat}</span>
                                                                {item.badges.map(
                                                                    (item) =>
                                                                        item.toLowerCase() !== "het" && (
                                                                            <div
                                                                                key={item}
                                                                                className={classNames("w-sm-50", {
                                                                                    "product-card__badge product-card__badge--hot":
                                                                                        item.toLowerCase() === "nego" ||
                                                                                        item.toLowerCase() === "het",
                                                                                    "product-card__badge product-card__badge--sale":
                                                                                        item.toLowerCase() === "grosir",
                                                                                })}
                                                                            >
                                                                                {item}
                                                                            </div>
                                                                        )
                                                                )}
                                                            </>
                                                        ) : (
                                                            item.priceCurrencyFormat
                                                        )}
                                                    </td>
                                                    <td>
                                                        {item.ppnType !== "include" ? (
                                                            item.ppnCurrencyFormat
                                                        ) : (
                                                            <span class="badge badge-primary">{item.ppnType}</span>
                                                        )}
                                                    </td>
                                                    <td>{item.qty}</td>
                                                    <td>{item.subTotalUnitCurrencyFormat}</td>
                                                </tr>
                                                {isCollapseOpen(`collapse-${item.id}`) && (
                                                    <tr>
                                                        <td colSpan={7}>
                                                            <Collapse isOpen={isCollapseOpen(`collapse-${item.id}`)}>
                                                                <div className="card-table">
                                                                    <div className="table-responsive">
                                                                        <table className="table">
                                                                            <thead>
                                                                                <th>#</th>
                                                                                <th>Gambar</th>
                                                                                <th>Produk</th>
                                                                                <th>Jumlah</th>
                                                                                <th></th>
                                                                            </thead>
                                                                            <tbody>
                                                                                {item.packet.map((item, index) => (
                                                                                    <tr>
                                                                                        <td>{++index}</td>
                                                                                        <td>
                                                                                            <img
                                                                                                src={item.image}
                                                                                                alt=""
                                                                                                style={{
                                                                                                    width: "70px",
                                                                                                    height: "70px",
                                                                                                    objectFit:
                                                                                                        "contain",
                                                                                                }}
                                                                                            />
                                                                                        </td>
                                                                                        <td>{item.name}</td>
                                                                                        <td>{item.quantity}</td>
                                                                                        <td>
                                                                                            <Link
                                                                                                className="btn btn-secondary btn-sm"
                                                                                                to={url.product({
                                                                                                    mall: {
                                                                                                        id: item.mall_id,
                                                                                                    },
                                                                                                    slug: item.seo,
                                                                                                })}
                                                                                            >
                                                                                                Lihat Detail
                                                                                            </Link>
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </Collapse>
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="row pt-md-3 pt-2">
                        <div className="col-lg-6 mb-2">
                            <div class="card mb-2">
                                <div class="card-body">
                                    <h6 className="card-title">Alamat Kirim</h6>
                                    <p className="card-text">
                                        {name} {location.address}, {location.district.name}, {location.city.name},{" "}
                                        {location.province.name}, {location.postalCode} {telephone}
                                    </p>
                                </div>
                            </div>

                            <div class="card">
                                <div class="card-body row justify-content-center align-items-center">
                                    <div className="col-lg-6">
                                        <h6 className="pt-sm-2">Kurir Pengiriman</h6>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <Select
                                                isDisabled={
                                                    state.options.from === "compare" || Number(cartSelected.negoId) > 0
                                                }
                                                className="basic-single"
                                                classNamePrefix="select"
                                                styles={customStyles}
                                                value={{ label: shippingSelected.name, value: shippingSelected.value }}
                                                onChange={doHandleChange}
                                                placeholder="Pilih Kurir"
                                                options={shipping.map(({ value, name }) => ({
                                                    label: name,
                                                    value,
                                                }))}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <h6 className="pt-sm-2"   onClick={() => setOpenVa(!openVa)}>Metode Pembayaran</h6>
                                    </div>
                                    <div className="col-lg-6">
                                        <div class="form-group ">
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                value={data["paymentMethod"]}
                                                onChange={(val) => doHandleChangeSelect(val, "paymentMethod")}
                                                styles={customStyles}
                                                placeholder="Pilih Metode Pembayaran"
                                                options={paymentMethod.map(({ group, items }) => ({
                                                    label: group,
                                                    options: items.map(({ value, name }) => ({ label: name, value })),
                                                }))}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <h6 className="pt-sm-2">Sumber Dana</h6>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                styles={customStyles}
                                                value={data["sourceOfFund"]}
                                                onChange={(val) => doHandleChangeSelect(val, "sourceOfFund")}
                                                placeholder="Pilih Sumber Dana"
                                                options={sourceOfFunds.map(({ value, name }) => ({
                                                    label: name,
                                                    value,
                                                }))}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <h6 className="pt-sm-2">Tempo Pembayaran</h6>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                styles={customStyles}
                                                onChange={(val) => doHandleChangeSelect(val, "paymentDue")}
                                                value={data["paymentDue"]}
                                                placeholder="Pilih Tempo Pembayaran"
                                                options={paymentDue.map(({ value, name }) => ({
                                                    label: name,
                                                    value,
                                                }))}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <h6 className="pt-sm-2">Pembungkus</h6>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                styles={customStyles}
                                                onChange={(val) => doHandleChangeSelect(val, "wrapping")}
                                                value={data["wrapping"]}
                                                placeholder="Pilih Pembungkus"
                                                options={wrapping.map(({ value, name }) => ({
                                                    label: name,
                                                    value,
                                                }))}
                                            />
                                        </div>
                                    </div>

                                    {/* <div className="col-lg-6">
                                        <h6 className="pt-sm-2">Asuransi</h6>
                                    </div>
                                    */}
                                    {/* <div className="col-lg-6">
                                        <div className="form-group">
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                styles={customStyles}
                                                onChange={(val) =>
                                                    dispatch({ type: "SET_OPTIONS", isInsurance: val.value })
                                                }
                                                value={{
                                                    label: Number(state.options.isInsurance) === 1 ? "Ya" : "Tidak",
                                                    value: Number(state.options.isInsurance),
                                                }}
                                                options={[
                                                    { label: "Ya", value: 1 },
                                                    { label: "Tidak", value: 0 },
                                                ]}
                                            />
                                        </div>
                                    </div>
                                */}
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-6">
                            <div className="row">
                                <div className="col-12">
                                    <div class="form-group">
                                        <textarea
                                            class="form-control"
                                            onChange={(e) => setNote(e.target.value)}
                                            style={{ resize: "none" }}
                                            name=""
                                            id=""
                                            placeholder="Catatan ..."
                                            rows="3"
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">Detail Belanja</h5>
                                            <table className="cart__totals">
                                                <tbody className="cart__totals-body">
                                                    <tr key={1}>
                                                        <th>Subtotal</th>
                                                        <td>{subTotalCurrencyFormat}</td>
                                                    </tr>
                                                    <tr key={2}>
                                                        <th>Ppn</th>
                                                        <td>{ppnCurrencyFormat}</td>
                                                    </tr>
                                                    <tr key={4}>
                                                        <th>Asuransi</th>
                                                        <td>{insuranceTotalCurrencyFormat}</td>
                                                    </tr>
                                                    <tr key={3}>
                                                        <th>Ongkos Kirim ({weightText})</th>
                                                        <td>{shippingCostCurrencyFormat}</td>
                                                    </tr>
                                                </tbody>
                                                <tfoot className="cart__totals-footer">
                                                    <tr>
                                                        <th>Total</th>
                                                        <td>{totalCurrencyFormat}</td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                            {isCreateOrder() && (
                                                <AsyncAction
                                                    action={doHandleCreateOrder}
                                                    render={({ run, loading }) => (
                                                        <button
                                                            type="button"
                                                            onClick={run}
                                                            title="Buat Pesanan"
                                                            disabled={loading}
                                                            className={classNames(
                                                                "btn btn-primary custome btn-md btn-block cart__checkout-button",
                                                                {
                                                                    "btn-loading": loading,
                                                                }
                                                            )}
                                                        >
                                                            Buat Pesanan
                                                        </button>
                                                    )}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>{`Checkout — ${theme.name}`}</title>
            </Helmet>
            <div className="container">
                <h3 className="text-center my-3">Checkout</h3>
                <h6 style={{ cursor: "pointer" }} onClick={() => props.history.push("/shop/cart")} className="mb-3">
                    <ArrowLeft className="float-left mr-2" /> Kembali
                </h6>
            </div>

            {content}
            {waitPayment}
        </React.Fragment>
    );
};

const mapStateToProps = (state) => ({ checkout: state.checkout, customer: state.customer });

const mapDispatchToProps = {
    addMiniCart,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ShopPageCheckout));
