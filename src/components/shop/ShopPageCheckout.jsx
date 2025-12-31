// react
import React, { useEffect, useReducer, useState } from "react";
import { useLocation } from "react-router-dom";

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
import RevitalisasiModal from "./RevitalisasiModal";
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
    const params = useLocation();

    const { customer, addMiniCart } = props;
    const { id } = useParams();
    const [data, setData] = useState({});
    const [note, setNote] = useState(""),
        [sendRequest, setSendRequest] = useState(false);
    console.log(`id`, id);
    localStorage.setItem("idCheckOut", id);
    const [countValid, setcountValid] = useState(1);
    const [kurir, setKurir] = useState("penyedia");
    // const [paymentMethodName, setPaymentMethodName] = useState(localStorage.getItem("payment"));
    const [paymentMethodName, setPaymentMethodName] = useState("Pilih Metode Pembayaran");
    const [paymentDue, setPaymentDue] = useState(localStorage.getItem("top"));
    const [wrapping, setWrapping] = useState(localStorage.getItem("wrapping"));

    const [seeProductPackets, setSeeProductPackets] = useState({});
    const [openVa, setOpenVa] = useState(false);
    const [openPeringatan, setOpenPeringatan] = useState(false);
    const [openPeringatanArkas, setOpenPeringatanArkas] = useState(false);
    const [openPeraturan, setOpenPeraturan] = useState(false);
    const [cekList, setCekList] = useState(false);
    const [kurirCost, setKurirCost] = useState(15000);
    const [pretransaction, setPreTransaction] = useState("");

    const [sumberDana, setSumberDana] = useState({ label: "BOSP Reguler", value: "BOSREG2025" });
    const [isLoadingBtn, setIsLoadingBtn] = useState(false);

    // State untuk modal pilihan sumber pembayaran
    const [openPaymentSource, setOpenPaymentSource] = useState(false);
    const [selectedPaymentSource, setSelectedPaymentSource] = useState("");
    const [openRevitalisasi, setOpenRevitalisasi] = useState(false); // const OpenExternalPage = () => {

    // Handler untuk konfirmasi pesanan revitalisasi
    const handleRevitalisasiConfirm = (revitalisasiData) => {
        console.log("Data revitalisasi:", revitalisasiData);
        // Implementasi logika untuk proses revitalisasi
        // Misalnya simpan data revitalisasi dan lanjutkan ke proses pembayaran
        alert(`Pesanan revitalisasi berhasil dikonfirmasi dengan rekening: ${revitalisasiData.accountNumber}`);
        // Bisa ditambahkan logika untuk redirect atau proses selanjutnya
    }; //     setIsLoadingBtn(true); // Mulai loading

    //     localStorage.setItem("pretransaction", id);
    //     //   window.open(`https://siplah.eurekabookhouse.co.id/staging/prarkas-eureka?idx=${id}`, 'foo');
    //     // window.location.href = state.checkout.redirect;
    //     setKurirCost(state.checkout.shippingCost);

    //     customerApi
    //         .putUpdatePra(customer?.token, id, kurir, kurirCost, paymentMethodName, paymentDue, wrapping)
    //         .then((res) => {
    //             console.log(res);
    //             let submitUrl = `/${paymentMethodName}/${state.checkout.shippingTerpilih}/${paymentDue}/${state.checkout.shippingCost}`;
    //             window.location.href = state.checkout.redirect + submitUrl;
    //         })
    //         .catch((err) => {
    //             console.error(err);
    //             setIsLoadingBtn(false); // Set false kalau error
    //         });

    // };

    const OpenExternalPage = async () => {
        setIsLoadingBtn(true);
        try {
            localStorage.setItem("pretransaction", id);
            setKurirCost(state.checkout.shippingCost);

            const res = await customerApi.putUpdatePra(
                customer?.token,
                id,
                kurir,
                kurirCost,
                paymentMethodName,
                paymentDue,
                wrapping
            );

            console.log(res);

            const submitUrl = `/${paymentMethodName}/${state.checkout.shippingTerpilih}/${paymentDue}/${state.checkout.shippingCost}`;
            window.location.href = state.checkout.redirect + submitUrl;
        } catch (err) {
            console.error("Terjadi kesalahan saat mengirim data:", err);
            setIsLoadingBtn(false);
            // Tambahkan notifikasi error jika perlu
        } finally {
            setIsLoadingBtn(false);
        }
    };

    const handleBack = () => {
        props.history.push("/shop/cart");
    };

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

    console.log(customer, "customer");

    useEffect(() => {
        if (id === undefined) return;
        doHandleFetchCheckout();
        // eslint-disable-next-line
    }, [state.options, dispatch]);

    useEffect(() => {
        if (state?.checkout?.paymentDue?.length > 0) {
            setData((prev) => ({
                ...prev,
                paymentDue: {
                    label: state.checkout.paymentDue[0].name,
                    value: state.checkout.paymentDue[0].value,
                },
            }));
        }
        if (state?.checkout?.wrapping?.length > 0) {
            setData((prev) => ({
                ...prev,
                wrapping: {
                    label: state.checkout.wrapping[0].name,
                    value: state.checkout.wrapping[0].value,
                },
            }));
        }
    }, [state.checkout]);

    useEffect(() => {
        setcountValid((prevCount) => {
            let newCount = 1; // Default count

            if (data.paymentDue) {
                newCount += 1;
            }
            if (data.wrapping) {
                newCount += 1;
            }

            // Pastikan tidak menurunkan nilai countValid jika sudah lebih besar
            return Math.max(prevCount, newCount);
        });
    }, [data, paymentDue, wrapping]);

    const doHandleFetchCheckout = () => {
        dispatch({ type: "FETCH_CHECKOUT" });

        customerApi.getCheckout(customer?.token, id, state.options).then((res) => {
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

        var idx = localStorage.getItem("pretransaction");
        if (id === idx) {
            setPreTransaction(idx);
        } else {
            localStorage.setItem("pretransaction", "");
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (state?.checkout?.from) {
            localStorage.setItem("checkout_from", state.checkout.from);
        }
    }, [state?.checkout?.from]);
    const fromLocalStorage = localStorage.getItem("checkout_from");

    console.log(fromLocalStorage, "fromLocalStorage");

    const doHandleChange = (item) => {
        if (state.options.from === "cart") {
            if (item.value !== "penyedia") {
                dispatch({ type: "SET_SHIPPING_VALUE", shipping: item.value });
                setKurir(item.value);
            } else if (item.value === "penyedia") {
                dispatch({ type: "SET_SHIPPING_VALUE", shipping: "" });
                setKurir("penyedia");
            }
        } else {
            const req = { storeId: state.checkout.cartSelected.mall.id, shippingCode: item.value };
            customerApi.changeShippingCompare(req, customer?.token).then((res) => {
                doHandleFetchCheckout();
            });
        }

        localStorage.setItem("shipping", item.value);
    };

    const isValid = (req) => {
        const reqValid = Object.keys({
            id: 91,
            from: fromLocalStorage,
            shipping: "penyedia",
            sourceOfFund: "BOSREG2025",
            wrapping: "",
            paymentMethod: "bank_bpd_va_dki",
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
        console.log(`dari pilihan bank`, item, name);
        const cValid = parseInt(countValid) + 1;

        localStorage.setItem("cValid", cValid);

        setData({ ...data, [name]: item });
        if (name === "paymentMethod") {
            setPaymentMethodName(item.name);
            localStorage.setItem("payment", item.name);
            setOpenVa(!openVa);
            setcountValid(cValid);
        }
        // if(name === "paymentMethod"){
        //     setPaymentMethodName(item.value);
        //     localStorage.setItem("payment", item.value);
        //     setOpenVa(!openVa)
        //     setcountValid (cValid)
        // }
        if (name === "paymentDue") {
            setPaymentDue(item.value);
            localStorage.setItem("top", item.value);
            setcountValid(cValid);
        }
        if (name === "wrapping") {
            setWrapping(item.value);
            localStorage.setItem("wrapping", item.value);
            setcountValid(cValid);
        }
        // alert(JSON.stringify(item)+"-"+name);
    };

    console.log(countValid);

    const waitPayment = (
        <Modal isOpen={openVa} centered toggle={() => setOpenVa(!openVa)}>
            <ModalBody>
                <div class="text-center p-3" style={{ color: "#0e336d" }}>
                    {" "}
                    <h5>Metode Pembayaran SIPLah Eureka</h5>{" "}
                </div>
                <div className="d-flex ">
                    <medium
                        className="border p-2 text-center btn btn-primary"
                        style={{
                            width: "50%",
                            marginRight: 10,
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                            fontSize: 14,
                        }}
                    >
                        {" "}
                        Virtual Account
                    </medium>
                </div>

                <div className="card p-2 idVA">
                    <div className="d-flex mt-2">
                        <small
                            className="border p-2 text-center btn btn-default"
                            style={{ width: "50%", height: 60, marginRight: 10, fontSize: 13 }}
                            onClick={(val) =>
                                doHandleChangeSelect(
                                    { value: "bank_bri_va", name: "Virtual Account BRI (BRIVA)" },
                                    "paymentMethod"
                                )
                            }
                        >
                            {" "}
                            <img
                                alt="logo siplah eureka"
                                src="https://developers.bri.co.id/sites/default/files/inline-images/BRIVA-BRI.jpg"
                                style={{ height: 25 }}
                            ></img>{" "}
                            <br /> BRIVA BRI
                        </small>
                        {/* <small className="border p-2 text-center btn btn-default" style={{width:"50%", height: 60,  marginRight:10, fontSize:13 }}  onClick={(val) => doHandleChangeSelect({value:"bank_mandiri_va",name:"Virtual Account Mandiri"}, "paymentMethod")} > <img alt="logo siplah eureka" src="https://storage.googleapis.com/go-merchant-production.appspot.com/uploads/2020/09/11f8970a182ad8cf6aaf0a0cd22dd9ad_3948cb3bf5c4887c7cca7ca7ee421708_compressed.png" style={{height:25}}></img> <br/> VA MANDIRI</small>   */}
                        <small
                            className="border p-2 text-center btn btn-default"
                            style={{ width: "50%", height: 60, marginRight: 10, fontSize: 13 }}
                            onClick={(val) =>
                                doHandleChangeSelect(
                                    { value: "bank_bpd_va_dki", name: "Virtual Account Bank DKI" },
                                    "paymentMethod"
                                )
                            }
                        >
                            {" "}
                            <img
                                alt="logo siplah eureka"
                                src="data:image/png;base64,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"
                                style={{ height: 25 }}
                            ></img>{" "}
                            <br /> BANK DKI
                        </small>
                        <small
                            className="border p-2 text-center btn btn-default"
                            style={{ width: "50%", height: 60, fontSize: 13 }}
                            onClick={(val) =>
                                doHandleChangeSelect(
                                    { value: "bank_bpd_va_jatim", name: "Virtual Account Bank Jatim" },
                                    "paymentMethod"
                                )
                            }
                        >
                            {" "}
                            <img
                                alt="logo siplah eureka"
                                src="https://www.bankjatim.co.id/themes/bjtm07/assets/img/logo.png"
                                style={{ height: 25 }}
                            ></img>{" "}
                            <br /> BANK JATIM
                        </small>
                    </div>
                    <div className=" p-2 idVA">
                        <div className="d-flex mt-2">
                            <small
                                className="border p-2 text-center btn btn-default"
                                style={{ width: "50%", height: 60, marginRight: 10, fontSize: 13 }}
                                onClick={(val) =>
                                    doHandleChangeSelect(
                                        { value: "bank_bpd_va_bjb", name: "Virtual Account Bank BJB" },
                                        "paymentMethod"
                                    )
                                }
                            >
                                {" "}
                                <img
                                    alt="logo siplah eureka"
                                    src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxASEhUSEBEWFhUWFxUaFxYVFRcVGBgWFRUYGBgaFRgYHSghGRolGxUVIjEhJzUrLi4uFyAzODMtNygtLisBCgoKDg0OGxAQGy8mICUtMC8tLy8tLS0tLS4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAKIBOAMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABQcEBggBAwL/xABKEAABAwICBQYKCAUCBAcAAAABAAIDBBEFIQYHEjFBE1FhcXOBFCIzNXKRobGysyMyNEJSYpLBJIKDotFTYxUW4fAXJUNUk6PC/8QAGQEBAAMBAQAAAAAAAAAAAAAAAAIDBAEF/8QAMBEAAgIBAwEGBAYDAQAAAAAAAAECAxEEEjEhE0FRcYHwIjORsRQyQmHB0TSh8QX/2gAMAwEAAhEDEQA/ALxREQBERAEREAREQBERAEREAREQBERAEREARF85JWtF3EAc5Nh7UB9F4Vr1fpVC3KIcoefc318e5Qj66pqnbOZv9xuTe/o6SvO1H/pVVdI/FLwXv+3+xbGmT56I2SrxyNvix/SO3C26/WN/cs2iifbakN3HhwaOYBYeDYO2EbTs3+xvV/lS4U9NXfN9pe8eEVxHz8ZeeUu4TcF8MPr77j1ERbioIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiwsWxBlPDJPJfYja5ztkXNmi+Q4laFPrdps+TpZnW3bRjYD6nOI9SnGuUuEQlZGPLLKRVLNrXqHeTpo2ek90nuDVF1OnOIy759gc0bWt9pBKODjyR7aL4LpmmawbT3Bo53EAesqCr9MaKLISco78MY2vbk0etU/JUvkN5JHPdzvc55z4AuJKn8K0XrJrFsJa38UniD1HP2LLOyXEUSjLJsNbp3K/KCMMHO7xnercPaoZ1TPUOs9z5HHcMz6mjIdy2XDNA2NsaiUuP4WeK39RzPsWzRQ09Ky4DIm8TkL9ZOZKyT01t3zJYXv09X6F0ZYNXwnROR1nTnYb+EZuPXwb7VtdPTwwM8UBjRvJ49ZO9QWI6XMGUDdo/idk3uG8+xRtJDU1j7ucS0HNx+q3oaOdUK6iiW3Tx3zfvnw8uni+8s2yl1k8I2OPFDK/YgGQ+tIRkOocT1qYAWLQUbIm7DB1niTzlZa9HTwsUc2vMn4cL9l/fL8sFc2s/DwERFoIBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAaprOc7/hs4aCXO5NoDQSTeRtwAOi6p7DNEcRm+pRy2vvkbyQ6/pLXHVdXdjWl1BSO2KmoDH2B2A173WN7HZY0ngVBVGtPDR9TlpPRiLR38oWlaqpWRhiMfUzWwhKWZSx9DW8N1XVbrcvLFH0NvIf2C2fDdWtHHnK+SY5ZEhjMuYMF+4kqHqtbF/I0nfJJb2NBUNV6wMRl+rIyIc0bBe3MXP2j3iyrnv/AFHE6lx1LXpMMpaYXjjjjA42A9bjmo+u0yoo8hLyh5ovHH6vq+1VBPWTTH6WR8hO4OcXX6gVPYVotWzWLYS1v4pPEHq+se4LHOcl0ii+Ms8E7X6dTvyhY2NvOfHf/ge1RMQnqX/flf8Aqt+zR6gtow7QaGMbVTIX23gHYZ3m9/aFmVGklHTjk6docRwjADR1u3HuusV1MpLN0sL33f8AS6LxwY+EaJWs6pdf8jTl/M7j1BSdbjcMI5OIBzhkGs+qOgke4ZrVqnGaqqdsC9jujZlfrO89+S2XAMAEVny2MnADc3q5z0qmqbbcNLHHjN++r8FwvBFjSXWb9CSw1spG3MfGd90ZBvR1rPXi9XrQhsjjLfnyUt5CIimcCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIsTEa1kET5pDZkbS5xAubNFzYcUBQ+tecHEpbkZcm3M8zBl6yo7C9G66byVLKRzlhYPW6wsrHl1mYTG90kNK90jz4z2xRsc487nOIJWFVa4JDcQ0TQODpJiT3saz/8AS9TdcoKKhwu9/wDDBOFW5yc+fAwcN1YV7/KuihHS4yO/S0W/uW24dq0pIxeeV8lt+Yjb07s7d60mq1j4lLkHsjH+2wX7i66hKvEppzeeaSToe8uA6m3sO4LHYp/qJxlWuF9S3himD0ItFyQd/tN5R55ruFyeslRNdrFc7Knh2fzSG5/S029pWm4Po9WVFjFA/Z/G4bDOsF28dV1ueFaujkamb+SMe95/Yd6xz38RNEW2a3VYrUVDhysj3knJg3X/ACsbl+62HBtEJ5LOl+ib05vPUOHf6lu2GYPT04tDE1p4u3uPW45qQWZaNSeZvJam1wYGGYXDA20TLc5Obj1n9lnoi2RiorCWEcCIi6AiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgC1jWRIRhtTa93MDRbf4zgFs6/JaDvClF7ZJ+BxrKwczUGjNfPbkaSZ19x2C1v632b7VtWF6rMQfYymKEcxdyjh0EMy9pV4WSy12a6cuEl/szR0kIld4dqppm2M88sn5W2jaeuwLvUQtuw3Ruip/I07Gn8RG07L8zrm6l0WSU5S5ZfGuMeEeL1EUSYREQBERAEREAREQBERAEREAREQBERAEREAREQBERAR7sYpQbGoiBBsRyjL3HDepBc04oB4TL20vzHLpZXW1bEnnkpqtc85XAREVJcEREAREQBERAEREAREQBERAfGedjGlz3BrRvc4hoFzYXJ6SvjBiMEh2Y5o3u32a9rjYdAKgdZ3m2o/pfOjVc6ox/5iOyl97FdCrdW554KZ2uNkYY5LwREVJcEREAX4eQMzuC/axsR8lJ6D/hKAhf8AnjDP/eM9v+FKYVi1PUtL6eVsjQbEtO477H1rmmL6o6h7lbmpXyNR2jfhWu7TxhHKZjp1MrJbWiyURFkNgREQHhUfBjVK9/JsqInP/C2RpN+gA5qD1nTSMw6UxXzLGuI3iNzwH91sj0FURusRkWkEEZEEG4I5iCB6lpp0/aLOTLfqOzeMHUaisWx+kpS0VM7Yy4EgOJuQONgsnCZHugidJ9cxsLr5eMWi9+9VVro+1Q9kfjVVUFOe1lt03CG5Fh0umOHSPbHHVRlziA0XIuTuAuFPrmzR/wC1U3bQfNYuk1O+pVtJEdPa7E2wiIqC8IiIDmrE/tMvbS/MculVzVif2mXtpfmOVqabaxG0r3QUzQ+Vv13u8mw82WbnDjuA577t18JT2qK7v4RipnGG9y8SwUVDVOl2NG8hmma3fdsDWsA6Dye7rJWdges6tiI8JIqGcTstZJboLQGnvHeqvws8ZWCxauGcPKLrRR+DYrDVRNmgdtMd3EEb2uHAjmWa91he1+gbz1LM+hpXXg/aKncW1oVkjzHSQiLMgBzeVlNt/ijK+XSsB2N6Q7O2X1Nufwdg/tEf7LR+Gnjq0vNmb8VDuTfkXiipbA9Z1ZE4CqtOy9nHZayQZ522QGkjmIHWrcwyvjqImzQu2mPF2n9jzEG4I6FXZVKvksruhZ+UzUXhVR6L6wK+erghldFsSP2XbMdjbZO47WWYC5CuUk2u4lOxQaT7y3UVX6W6zeTc6KhDXbJs6Z+bb8RG0Hxus8efjqE+muLggvqpW33XijaO4GOxVsNLZJZ49+RVPVVxeOS/0VU6K6zXl7Yq8NLSQBM0bNidxkaMrdItbmVqgqqdcoPEi2uyM1mJq2s3zbUf0vnRqutUnnEdlL72KxdZvm2o/pfOjVdapPOI7KX3sWir5EvfgZ7fnQ9+Jd6Iq3071gPp5fB6LYL2H6V7htNB4MABGfOeGQ57Z4Qc3hGic4wWZFkItI0BxPEqscvVGNsGYYGx7LpD+IEk2YOfiVu65OO14Z2ElJZQWNiPkpPQf8JWSsbEfJSeg/4SokjmSPcOoe5W3qV8hUdo34Aqkj3DqHuUlQY7UwRSQwyljJSC+2TshbJ29oI32XrXwc4uK8Tx6JqEtzLxxfTPD6Z2xNUN2+LGB0jh6QYDs99li0OsHC5HbPhGwT/qMfG39ThsjvKp6j0ZrpWcpHSyuacwdm1+kXsSoueFzHFj2lrgbFrgQQekFULS1vpnr6Gh6qxddv3OnY3ggEEEHcQbg9S/aobQfTGShkax7i6mcbOZv2L/AH4+a3Ebj1q9YpA4BzTcEAgjcQdxCy21Ot4ZrqtViyjGxSeBkTnVLmNitZ5kIDLOys6+Wd1pNHRaNRSCVk1PtA3AdUl7Qb3uGOeW5cMslm63vN57WL3qk1dp6d8c7mvIo1FyhLG1M6chma9ocxwc1wBDmm4IO4gjeFUeuj7VD2R+NWFoH5upOxZ7lX2uj7VD2R+NQ06xbjzJ6nrV9DTtHvtVN28PzWroXEcShp2bc8rI2873AdwvvPQubYJnMc17DZzHNc05GzmkOBz6QFJVE1biM5cQ+eT8LW3DG8zQMmD/ALzWm6ne028JGWm7ZFpLLyW47WVhd7cs8jn5GW3w39incIxylqm7VNM2QcQMnD0mGzm94VAYlglXTgOqKeSNp3Oc3K56RkFi0dVJE8SQvcx7dzmmxH+R0HJQekg18L+zJrVzT+JfdHTqLVNAtKRXQnbsJ47CQDIG+57RzGxy4G68WKScXhm6MlJZRSeLn+Im7Wb5jlbOr3Q2OONtVVMD6iTxxt+NyYdmLX3vN7l2/O3SaoxT7TN20vzHLpNjbCw3Dctupm1BJd5j09ac5SfcfpVlrN0Oi5N1ZTMDHNN5WNFmvaTm8AbnA5nnueKs5Y9bTCSN8btz2uaepwIPvWSE3CSaNdkFOOGU5qnxkw1fg5J2KgWtwEjASDbhdoI7hzBXUuatGJT4TSPBz5amP/2sv6xl3rpW6v1cUp+hn0bbhh9zMCgwqnhL3QxMY57nOe4NG05ziSbneczu4LPVf6TazIIXOjpGCd4Ni8utEDxsRm/uy6VqjdMsbqc4GvI/2IC4D+azrd5UI6ecll9PMseohF7V18ib1v4HGGMrGNDX7QZJYW2g4eKTzuBFr8x6Av1qXryWTU5Nw0tkaObbydbvaD6+dajpB/xkw3r+X5Hab5TYDdr7u7NT+pX7RUdkz4yr5QxQ03nBnjLN6aTWfEt5cvNlLLOa4tIG8GxGVsiN2V11CuZMPaDLECLgvjBHQXBc0n6vfiT1f6Ui6NBNDYqSJkkrA6ocAS5wB5O4+oy+63E8VtdVTRyMLJGNexwsWuAcCOkFZCLHKTk8s1RiorauDn/TzAW0VW6NnkngPjvwByc3psQe4hWpqzxEz0EW0buj2o7nMkMNm/22Wpa6mjlaY8diQd201S+pg/wkvRMflxrXY91Ck+TJUtt7iuCZ1m+baj+l86NVxqk84jsZfexWNrN821H9L50aqDRTG/ApnThu04RyNYOG28t2dr8osSepKU3TJL3wdvaVsG/fUs/WNpj4IzkID/EPGZv5Jh+96R4DrPCx0vV9oY6sdy9QCIGnje8zr5i/4b7zx3c61VlUHz8rVbUgc8OlsbOeCbuseGW7oFsuHReFSwuhjdT7PJFrdjZyGzbIAcOpdszRDbHl8sjXi+e6XC4Xv3/OTHGGgNaAABYACwAG4AcAvoiLEbgsbEfJSeg/4SslY2I+Sk9B/wAJQHMkW4dQ9y3zVZo0ypldUTNDo4SA1pFw6Q53POGjO3ORzLQ4vqjqHuV26omNGHgjeZZS7rBAH9oavT1MnGDweVpYqU1k3YLTNZOjTKmnfMxv08LS5pAzc1ubmG2/K9uY9ZW6L8vGR6l50ZOD3I9OUVNbWcvq6dUuJGWi5JxuYHFg9A+MwdwJb1NCpZ7GglrfqgkDqBIHssrP1Jk/xI4fRevxv+i9DVLNZ5ulbViXiTmt7zee1i95VKK69b3m89rF7yqUXNJ8v1/o7rPmeh0FoD5upOxZ7lX+un7VB2R+NWBoF5upOxZ7lX2un7VB2R+NZ6PnP1NN/wAn6GhU1O+R7Y4xd73Na0fmcbC54DNdDaN4FDRQthiA4F77WL32zc7/ABwFgqX1eMacRptrg5xHWGOsugFPVyeVEho4rDkfCpp2SMcyRocxwIc1wuCDvBBVAaa4F4FVvib5M2fET+B33SedpBHVY8V0Mqo11sbt0x+9syDuu0+9Q0smp48SzVRThnwNT0CxQ09dC6/ivcIn9LZSAP7tk9yKGoSRJGRvDm269sWRX31RlLLKNPbKMcLxPriptUTE/wCrL8xy6ShlD2hzTcOAIPQRcLnSWjdPWOhZbakme1t913SOte3BbpoVp34I3wOva8CMlrX2u6O33JGjMgHIEX4cM1y+DnFbeV7/AIO0WKEpbuG+ff7MtxR2PV4p6eWZ33I3EddvFHebBRb9OcMDdrwyM9AuXfpAvdVpp7pv4ZaGAOZA03Jdk6QjcSPusG8Dfuva1lmrplKWGuhptvjCOU+pBaGUJkraWNvCWJx9GIiR3sZbvVs608VfBRFsbtl0zhHtDeGm5fbpIFv5iofVLo05gNbM2xe3ZhBGewc3PPNtZW6BfipLW5h7pKISNF+ReHuH5CC1x7rgnoBPBXWTU70u5FFcJRoeOX1NJ1Y6ORVc73Tt2ooWtOwdznuJ2Q78oDSbcbjpV2RxtaA1oAA3ACwHUFR+rjSWOimeJ7iKUNBcBfYc0nZJH4bEg93SrZl0sw9rNs1cWz0PBPqGajqYzdn29+ZPSuCr+/vyIPW95vd2sXvK1jUp9oqOyZ8ZUZp1pQ7EHbNOx/g8A2iSLEkkMD3j7ozsAc8zfoktS7v4mcc8TfY8/wCVYoOFDT98FW9T1Ca44+5b65lw3y0XaR/G1dNLmXDfLRdpH8bVHS8S9+JZq/0+Z00iIsZrKn12eUpvRk97VL6l/skvbn5UaiNdnlKb0ZPe1S2pj7JL25+XGtcv8ZeZij/kvyJjWb5tqP6Xzo1U+geDxVdayKa+wGue4D72xbxSeYk59AVs6zfNs/8AS+fGq51SecR2UvvYu0tqmTXvg7ck7oJ++TYNaWiQLPC6ZgBYAJWNyvG0WDwOduQPR1KH1YaWeDyeCzu+hkI2CTlHITuv+F2XUesq5HtBFiLg7weIVE6wtFvAp7xj6CUkx/kO90Z6t46OorlMlZHs5egvi65drH1L5RaBqx0t8Jj8GndeaMeK4/8AqRjj6Tdx6LHntv6zTg4vDNUJqaygsbEfJSeg/wCErJWNiPkpPQf8JUSRzJF9UdQ9ys7U5jTW8pRvNi48pH05APHXk025r8xVYR7h1D3L7xOkZsys2m7LhsvFxZ+8AOG51s7b169sN8XE8aqxwkpI6eUBprjbaOkkkuA8tLYhzyOBAy4gbz0BVrRa0a5jNl7IpCBbbddpPS4NyJ9S1bHcbqayTlKmTaIyaALNaOZjeHXvKxQ0st3xcG2zVx2/DyRzW2AA4K49TuHllI+Yjy0h2fRj8S/6g71Kr9HcDlrZ2wRDfYvdwYzi4/sOJXQ9DSMhjZFGLMY0NaOYNFgrdVZ02lekr67jUdb3m89rF7yqUV163vN57WL3lUopaT5fr/RDWfM9DoLQLzdSdiz3KvtdP2qDsj8asHQHzdSdiz3KvtdH2qDsj8az0fOfqab/AJP0NIwmvdTzRztFzG8Otzgbx3i4710dQVsc0bJYnBzHgFp6D+/QuaGNJIDQSSbAAXJPMAN5U7o5pbV0N2xOuy52opAS0OG+3Fjr77d4Wm+l2JNcozae7s+j4Z0GVRWs3Gm1VYRGbxwjk2kcXXu8jovYfy34r9Y3rErqhhjGzC1ws7kr7RHNtk3A6s+lahu6lGihwe6RLUahTW2JNaG4caitgjAyEjXu6GxnbPdkB3r1WPqs0YdTxuqZm2klaAxpFiyLfmOBcbEjmA6UVGotzP4XwaNPTiHxLk++G6uIYallSKiRzmSF+yQyxJvvsL8VI6UaE0tadt145beUZa5tu2wcnc3PbitpRU9rPOc9S1VQSxjoVMdUUt8q1hHPyDgfVyh96ntHtWdJTkPncah4tk5obGCOaO5v/MSt7RTlfZJYb+y+xGOnri8pHgX4kaCLEXByIO6xX0RUlxXON6q4ZHl9LMYLm5YWcoz+TxgW+0dCwaTVEdq81X4vERxWcepznED1FWoiuWosSxn7f0UvT1N5wa3/AMn0jaSSkhbybZRZzxm8kEEOJO8i2XBYeiugsdBMZo55H3YWFrgwDMg3yF7i3tW4IodpLDWeSfZxynjgKuYdVFO1zXCqmOy5rrbMeey4Gxy6FYyJGco/lYlCMvzI8C9RFAmavpdodHiDo3PmfHyYcBsBpvtEHPaHQsnRHRpmHxPiZI54e/bu4AEHZa2w2Ru8VT6KW+W3bnoQ7OO7djqRekWEtq6d9O5xaH7N3NsSNl7XZXy+6tf0X0BiopxOyeR52HN2XBgFnWzyF+C3REU5JOKfRhwi3lrqFG47hEVXA+CUeK4bxa7XcHNvxBzUkiim08ok0n0ZXlDqvihkZLHWTNexwc0hseRHduIuCOIJCsIL1FKU5T/MyMIRh+VBfORgcCCLgggjoK+iKJM0f/wtw3hyv/yn/CncM0bpYKc0rYw6JxJc2Tx9ou3l1+odVgptFOVk5dGyEa4x4RXmJ6qqV5LoJpIb/dsJGDqBs72r4UGqWBpBmqZH24MY2IHruXH1FWUil29niQ/D15zj39iOwfB6elZydPGGN3m29x53E5uPWpFFr+ncjm4fUuY4tIjNiDYjduI3KtZk8FnSK8iA1w1cYo2xFw5R8jC1vEhty425hz85CpxHuJJLiSTvJNyesnesvCMLmqpWwwNLnOIvlk0He554NGZ7ss16lUFXHGTybbHbLKRfGgnm6l7FnuX50k0Qpa5zHzh+0wEAscW5E3zUthtGIYo4m7o2taOF9kWWWvM3NSyj1tqccM1LCNX1DTTMnjEhewkt2nkgEgi9uO8rI0i0Ko607cjCyT/UjIa4+lcEO7wtlRd7Sec5eTnZwxtx0KwOqJm1lWO2ebkm7X6tq3sWw4Bq/oaVwfsulkGYfKQbHna0ANB7ltyLsrrJLDZGNFcXlIIiKstCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAo/GomvppWvaHAxuuHAEHxeIO9ERcnHwUTovTRvfZ7GuF9zmhw9qvHAqCGKG0MTIwd+wxrL9eyERb9XwYdHySi9RFgN4REQBERAEREB//Z"
                                    style={{ height: 25 }}
                                ></img>{" "}
                                <br /> BANK BJB
                            </small>

                            {/* <small className="border p-2 text-center btn btn-default" style={{width:"50%", height: 60, marginRight:10,  fontSize:13 }}  onClick={(val) => doHandleChangeSelect({value:"bank_bpd_va_dki",name:"Virtual Account Bank DKI"}, "paymentMethod")} > <img alt="logo siplah eureka" src="data:image/png;base64,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" style={{height:25}}></img> <br/> BANK DKI</small>
                         <small className="border p-2 text-center btn btn-default" style={{width:"50%", height: 60, fontSize:13 }}  onClick={(val) => doHandleChangeSelect({value:"bank_bpd_va_jatim",name:"Virtual Account Bank Jatim"}, "paymentMethod")} > <img alt="logo siplah eureka" src="https://www.bankjatim.co.id/themes/bjtm07/assets/img/logo.png" style={{height:25}}></img> <br/> BANK JATIM</small>    */}
                            <small
                                className="border p-2 text-center btn btn-default"
                                style={{ width: "50%", height: 60, marginRight: 10, fontSize: 13 }}
                                onClick={(val) =>
                                    doHandleChangeSelect(
                                        { value: "bank_bpd_va_bali", name: "Virtual Account Bank BPD BALI" },
                                        "paymentMethod"
                                    )
                                }
                            >
                                {" "}
                                <img
                                    alt="logo siplah eureka"
                                    src="https://portal.bpdbali.id/regmerchant/assets/1.51-IBI-PAC/ctx/assets/img/Logo.png"
                                    style={{ height: 25 }}
                                ></img>{" "}
                                <br /> BANK BPD BALI
                            </small>
                            <small
                                className="border p-2 text-center btn btn-default"
                                style={{ width: "50%", height: 60, marginRight: 10, fontSize: 13 }}
                                onClick={(val) =>
                                    doHandleChangeSelect(
                                        { value: "bank_sulselbar_va", name: "Virtual Account Bank Sulselbar" },
                                        "paymentMethod"
                                    )
                                }
                            >
                                {" "}
                                <img
                                    alt="logo siplah eureka"
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Logo_Bank_Sulselbar.png/960px-Logo_Bank_Sulselbar.png"
                                    style={{ height: 25 }}
                                ></img>{" "}
                                <br /> BANK SULSELBAR
                            </small>
                            {/* <small className="border p-2 text-center btn btn-default" style={{width:"50%", height: 60, marginRight:10,  fontSize:13 }}  onClick={(val) => doHandleChangeSelect({value:"bank_bpd_va_dki",name:"Virtual Account Bank DKI"}, "paymentMethod")} > <img alt="logo siplah eureka" src="data:image/png;base64,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" style={{height:25}}></img> <br/> BANK DKI</small>
                         <small className="border p-2 text-center btn btn-default" style={{width:"50%", height: 60, fontSize:13 }}  onClick={(val) => doHandleChangeSelect({value:"bank_bpd_va_jatim",name:"Virtual Account Bank Jatim"}, "paymentMethod")} > <img alt="logo siplah eureka" src="https://www.bankjatim.co.id/themes/bjtm07/assets/img/logo.png" style={{height:25}}></img> <br/> BANK JATIM</small>    */}
                        </div>
                    </div>
                    {/* BSI */}
                    <div className="p-2 idVA">
                        <div className="d-flex mt-2">
                            <small
                                className="border p-2 text-center btn btn-default"
                                style={{ width: "100%", height: 60, marginRight: 10, fontSize: 13 }}
                                onClick={(val) =>
                                    doHandleChangeSelect(
                                        { value: "bank_sumsel_babel_va", name: "Virtual Account Bank Sumsel Babel" },
                                        "paymentMethod"
                                    )
                                }
                            >
                                {" "}
                                <img
                                    alt="logo siplah eureka"
                                    src="https://play-lh.googleusercontent.com/Z6i09fL3HsbkdVX0f3hViARF6H04hBg7R9g42QteKhlrJdRkyQBbSSl70j3DcmP5wg"
                                    style={{ height: 25 }}
                                ></img>{" "}
                                <br /> BANK SUMSEL BABEL
                            </small>
                            {/* <small
                                className="border p-2 text-center btn btn-default"
                                style={{ width: "50%", height: 60, fontSize: 13 }}
                                onClick={(val) =>
                                    doHandleChangeSelect(
                                        { value: "bank_bsi_va", name: "Virtual Account Bank BSI" },
                                        "paymentMethod"
                                    )
                                }
                            >
                                {" "}
                                <img
                                    alt="logo bank bsi"
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Bank_Syariah_Indonesia.svg/1200px-Bank_Syariah_Indonesia.svg.png"
                                    style={{ height: 25 }}
                                ></img>{" "}
                                <br /> BANK BSI
                            </small> */}
                        </div>
                    </div>
                </div>
                <div className="d-flex  mt-2">
                    <medium
                        className="border p-2 text-center btn btn-primary"
                        style={{
                            width: "50%",
                            borderTopLeft: 10,
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                            fontSize: 14,
                        }}
                    >
                        {" "}
                        Kode Bayar
                    </medium>
                </div>

                <div className="card p-2 idBPD">
                    <div className="d-flex mt-2">
                        <small
                            className="border p-2 text-center btn btn-default"
                            style={{ width: "50%", height: 60, marginRight: 10, fontSize: 14 }}
                            onClick={(val) =>
                                doHandleChangeSelect(
                                    { value: "bank_bpd_va", name: "Virtual Account BPD Jateng (BPDAja)" },
                                    "paymentMethod"
                                )
                            }
                        >
                            {" "}
                            <img
                                alt="logo siplah eureka"
                                src="data:image/png;base64,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"
                                style={{ height: 25 }}
                            ></img>{" "}
                            <br /> <span style={{ fontSize: "12px" }}>BANK JATENG </span>
                        </small>
                        <small
                            className="border p-2 text-center btn btn-default"
                            style={{ width: "50%", height: 60, marginRight: 10, fontSize: 13 }}
                            onClick={(val) =>
                                doHandleChangeSelect(
                                    { value: "bank_bpd_va", name: "Virtual Account BPD Jateng (BPDAja)" },
                                    "paymentMethod"
                                )
                            }
                        >
                            {" "}
                            <img
                                alt="logo siplah eureka"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqHpirVgMwAdzMP4Fthty183_BAx6QojedZQ&s"
                                style={{ height: 25 }}
                            ></img>{" "}
                            <br /> <span style={{ fontSize: "12px" }}>SULUT GO </span>
                        </small>
                        <small
                            className="border p-2 text-center btn btn-default"
                            style={{ width: "50%", height: 60, marginRight: 10, fontSize: 14 }}
                            onClick={(val) =>
                                doHandleChangeSelect(
                                    { value: "bank_bpd_va", name: "Virtual Account BPD Jateng (BPDAja)" },
                                    "paymentMethod"
                                )
                            }
                        >
                            {" "}
                            <img
                                alt="logo siplah eureka"
                                src="data:image/png;base64,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"
                                style={{ height: 25 }}
                            ></img>{" "}
                            <br /> <span style={{ fontSize: "12px" }}>BANK NAGARI </span>
                        </small>

                        <small
                            className="border p-2 text-center btn btn-default"
                            style={{ width: "50%", height: 60, fontSize: 14 }}
                            onClick={(val) =>
                                doHandleChangeSelect(
                                    { value: "bank_bpd_va", name: "Virtual Account BPD Jateng (BPDAja) " },
                                    "paymentMethod"
                                )
                            }
                        >
                            {" "}
                            <img
                                alt="logo siplah eureka"
                                src="data:image/png;base64,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"
                                style={{ height: 25 }}
                            ></img>{" "}
                            <br /> <span style={{ fontSize: "11px", whiteSpace: "nowrap" }}>BANK KALTIMTARA</span>
                        </small>
                    </div>
                    <div className=" p-2 idBPD">
                        <div className="d-flex mt-2">
                            <small
                                className="border p-2 text-center btn btn-default"
                                style={{ width: "50%", height: 60, marginRight: 10, fontSize: 14 }}
                                onClick={(val) =>
                                    doHandleChangeSelect(
                                        { value: "bank_bpd_va", name: "Virtual Account BPD Jateng (BPDAja)" },
                                        "paymentMethod"
                                    )
                                }
                            >
                                {" "}
                                <img
                                    alt="logo siplah eureka"
                                    src="data:image/png;base64,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"
                                    style={{ height: 25 }}
                                ></img>{" "}
                                <br /> <span style={{ fontSize: "12px" }}>BANK KALSEL </span>
                            </small>
                            <small
                                className="border p-2 text-center btn btn-default"
                                style={{ width: "50%", height: 60, marginRight: 10, fontSize: 14 }}
                                onClick={(val) =>
                                    doHandleChangeSelect(
                                        { value: "bank_bpd_va", name: "Virtual Account BPD Jateng (BPDAja)" },
                                        "paymentMethod"
                                    )
                                }
                            >
                                {" "}
                                <img
                                    alt="logo siplah eureka"
                                    src="https://www.banklampung.co.id/assets/img/logo-bank-color.svg"
                                    style={{ height: 25 }}
                                ></img>{" "}
                                <br /> <span style={{ fontSize: "12px" }}> BANK LAMPUNG </span>
                            </small>
                            <small
                                className="border p-2 text-center btn btn-default"
                                style={{ width: "50%", height: 60, fontSize: 14 }}
                                onClick={(val) =>
                                    doHandleChangeSelect(
                                        { value: "bank_bpd_va", name: "Virtual Account BPD Jateng (BPDAja)" },
                                        "paymentMethod"
                                    )
                                }
                            >
                                {" "}
                                <img
                                    alt="logo siplah eureka"
                                    src="https://banksumut.co.id/wp-content/uploads/2019/04/logo-1.png"
                                    style={{ height: 25 }}
                                ></img>{" "}
                                <br /> <span style={{ fontSize: "12px" }}> BANK SUMUT </span>
                            </small>
                        </div>
                    </div>
                    <div className=" p-2 idBPD">
                        <div className="d-flex ">
                            <small
                                className="border p-2 text-center btn btn-default"
                                style={{ width: "50%", height: 60, marginRight: 10, fontSize: 14 }}
                                onClick={(val) =>
                                    doHandleChangeSelect(
                                        { value: "bank_bpd_va", name: "Virtual Account BPD Jateng (BPDAja)" },
                                        "paymentMethod"
                                    )
                                }
                            >
                                {" "}
                                <img
                                    alt="logo siplah eureka"
                                    src="https://upload.wikimedia.org/wikipedia/commons/7/77/Logo_Bank_Jambi.png"
                                    style={{ height: 25 }}
                                ></img>{" "}
                                <br /> <span style={{ fontSize: "12px" }}> BANK JAMBI </span>
                            </small>
                            <small
                                className="border p-2 text-center btn btn-default"
                                style={{ width: "50%", height: 60, marginRight: 10, fontSize: 14 }}
                                onClick={(val) =>
                                    doHandleChangeSelect(
                                        { value: "bank_ntt_va", name: "BPD Nusa Tenggara Timur " },
                                        "paymentMethod"
                                    )
                                }
                            >
                                {" "}
                                <img
                                    alt="logo bank ntt"
                                    src="https://www.bpdntt.co.id/bundle/img/logo_ntt.png"
                                    style={{ height: 25 }}
                                ></img>{" "}
                                <br /> <span style={{ fontSize: "12px" }}> BANK NTT </span>
                            </small>

                            <small
                                className="border p-2 text-center btn btn-default"
                                style={{ width: "50%", height: 60, fontSize: 14 }}
                                onClick={(val) =>
                                    doHandleChangeSelect(
                                        { value: "bank_bpd_va", name: "Virtual Account BPD Jateng (BPDAja)" },
                                        "paymentMethod"
                                    )
                                }
                            >
                                {" "}
                                <img
                                    alt="logo siplah eureka"
                                    src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjB18nYS6ET_KUh6lOV7BnXqpnDDOEItd3vuiVOB6HXVgsG73V1FFhcWnZHuEKmJX7u3OWYpMTtge-aOUydXl6LQsFwJg_M99csLLUtTde4QkDuCG_6tDk_PWLnZoNFaNwRt0lDyfAsDKo/w400-h246/Logo+Bank+Kalbar.png"
                                    style={{ height: 25 }}
                                ></img>{" "}
                                <br />
                                <span style={{ fontSize: "12px" }}> BANK KALBAR </span>
                            </small>
                        </div>
                        <div className=" mt-2">
                            {/* <small
                                className="border p-2 text-center btn btn-default"
                                style={{ width: "50%", height: 60, marginRight: 10, fontSize: 14 }}
                                onClick={(val) =>
                                    doHandleChangeSelect(
                                        { value: "bank_sumsel", name: "BPD Sumatera Selatan" },
                                        "paymentMethod"
                                    )
                                }
                            >
                                {" "}
                                <img
                                    alt="logo siplah eureka"
                                    src="https://asset-2.tstatic.net/bangka/foto/bank/images/20211223_logo-bank-sumsel-babel.jpg"
                                    style={{ height: 25 }}
                                ></img>{" "}
                                <br /> <span style={{ fontSize: "12px" }}>Bank Sumsel Babel</span>
                            </small> */}
                            <small
                                className="border p-2 text-center btn btn-default "
                                style={{ width: "100%", height: 60, marginRight: 10, fontSize: 14 }}
                                onClick={(val) =>
                                    doHandleChangeSelect(
                                        { value: "bank_bpd_va", name: "Virtual Account BPD Jateng (BPDAja)" },
                                        "paymentMethod"
                                    )
                                }
                            >
                                {" "}
                                <img
                                    alt="logo siplah eureka"
                                    src="data:image/png;base64,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"
                                    style={{ height: 25 }}
                                ></img>{" "}
                                <br /> <span style={{ fontSize: "12px" }}>BANK NTB SYARIAH</span>
                            </small>
                        </div>
                    </div>
                </div>
                {/* <div className="d-flex  mt-2">
                    <medium
                        className="border p-2 text-center btn btn-primary"
                        style={{
                            width: "50%",
                            borderTopLeft: 10,
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                            fontSize: 14,
                        }}
                    >
                        {" "}
                        Revitalisasi
                    </medium>
                </div> */}
                {/* <small
                    className="border p-2 text-center btn btn-default"
                    style={{ width: "50%", height: 60, marginRight: 10, fontSize: 14 }}
                    onClick={(val) =>
                        doHandleChangeSelect({ value: "bank_himbara", name: "Bank Himbara" }, "paymentMethod")
                    }
                >
                    {" "}
                    <img
                        alt="logo bank himbara"
                        src="https://the-iconomics.storage.googleapis.com/wp-content/uploads/2020/06/24193838/Himbara.jpg"
                        style={{ height: 25 }}
                    ></img>{" "}
                    <br /> <span style={{ fontSize: "12px" }}>BANK HIMBARA</span>
                </small> */}
                {/* <div className="d-flex mt-3"
                onClick={()=>{
                    setSelectedPaymentSource("revitalisasi");
                                setOpenPaymentSource(false);
                                // Handle revitalisasi logic here
                                setOpenRevitalisasi(true);
                }}
                >
                    <medium
                        className="border p-2 text-center btn "
                        style={{
                            width: "100%",
                            marginRight: 10,
                            backgroundColor:"#0e69b0",
                            // borderTopLeftRadius: 10,
                            // borderTopRightRadius: 10,
                            fontSize: 14,
                            color:"white"
                        }}
                    >
                        {" "}
                        Revitalisasi
                    </medium>
                </div> */}
            </ModalBody>
        </Modal>
    );

    // Modal untuk pemilihan sumber pembayaran
    const paymentSourceModal = (
        <Modal isOpen={openPaymentSource} centered toggle={() => setOpenPaymentSource(!openPaymentSource)}>
            <ModalBody>
                <div className="text-center p-3" style={{ color: "#0e336d" }}>
                    <h5>Pilih Sumber Pembayaran</h5>
                </div>
                <div className="text-left p-3">
                    <div className="d-flex flex-column">
                        {/* <button
                            className="btn btn-primary mb-3"
                            onClick={() => {
                                setSelectedPaymentSource("revitalisasi");
                                setOpenPaymentSource(false);
                                // Handle revitalisasi logic here
                                setOpenRevitalisasi(true);
                            }}
                        >
                            Revitalisasi
                        </button> */}
                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                setSelectedPaymentSource("normal");
                                setOpenPaymentSource(false);
                                setOpenVa(true);
                            }}
                        >
                            Normal
                        </button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
    const waitPeringatan = (
        <Modal isOpen={openPeringatan} toggle={() => setOpenPeringatan(!openPeringatan)}>
            <ModalBody>
                <img width="90" src="./images/siplaharkas.png" alt="Siplah Eureka Logo" />
                <div class="text-left p-3" style={{ color: "#0e336d" }}>
                    {" "}
                    <h5>Anda akan menuju Halaman Pemetaan Pembelanjaan</h5>{" "}
                </div>
                <div class="text-left p-3" style={{ color: "#000" }}>
                    <p>
                        Di Halaman Pemetaan Pembelanjaan, Anda dapat memilih sumber dana untuk pesanan ini & wajib
                        melakukan pemetaan pesanan sesuai kegiatan pada RKAS yang telah disahkan.
                    </p>
                    <p style={{ marginLeft: 30, color: "red", display: "none" }}>
                        <input
                            type="checkbox"
                            onClick={(e) => setCekList(!cekList)}
                            class="form-check-input"
                            checked={cekList}
                        />
                        <b>
                            Satdik wajib checklist pesan peringatan sebelum order ID ke generate. (Ceklist untuk
                            melanjutkan)
                        </b>
                    </p>
                    <div>
                        <button
                            type="button"
                            onClick={OpenExternalPage}
                            className="btn btn-primary btn-sm"
                            style={{ float: "right" }}
                            disabled={isLoadingBtn}
                        >
                            {isLoadingBtn ? "Loading..." : "Lanjutkan"}
                        </button>
                        <button
                            type="button"
                            onClick={handleBack}
                            title="Buat Pesanan"
                            className="btn btn-secondary btn-sm"
                            style={{ marginRight: 15, float: "right" }}
                        >
                            Batal
                        </button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );

    const waitPeringatanArkas = (
        <Modal isOpen={openPeringatanArkas} centered toggle={() => setOpenPeringatanArkas(!openPeringatanArkas)}>
            <ModalBody>
                <div class="text-left p-3" style={{ color: "#0e336d" }}>
                    {" "}
                    <h5>Pastikan Anda tidak melewati tenggat pembayaran</h5>{" "}
                </div>
                <div class="text-left p-3" style={{ color: "#000" }}>
                    <p>
                        Silakan melunasi pembayaran paling lambat 31 Desember 2024 pukul 23.59 agar pesanan tidak tandai
                        sebagai transaksi yang tidak dapat dilaporkan ke BKU ARKAS. Jika terjadi keterlambatan
                        pembayaran dan barang sudah diterima, maka proses pengembalian dan biaya lain yang mungkin
                        timbul menjadi tanggung jawab satuan pendidikan dan penyedia.
                    </p>

                    <button
                        type="button"
                        // onClick={doCreateOrder}
                        onClick={() => {
                            setOpenPeringatanArkas(false);
                            setOpenPeraturan(!openPeringatan);
                        }}
                        title="Buat Pesanan"
                        className={classNames("btn btn-primary custome btn-md btn-block cart__checkout-button")}
                    >
                        Lanjutkan
                    </button>
                </div>
            </ModalBody>
        </Modal>
    );
    const waitPeraturan = (
        <Modal isOpen={openPeraturan} centered toggle={() => setOpenPeraturan(!openPeraturan)}>
            <ModalBody>
                <div class="text-center p-3" style={{ color: "#0e336d" }}>
                    {" "}
                    <h5>
                        Pelaksana dalam kapasitas mewakili Satuan Pendidikan menyatakan bahwa pesanan telah sesuai
                        dengan:
                    </h5>{" "}
                </div>
                <div class="text-left p-3" style={{ color: "#000" }}>
                    <p>• Pedoman Pengadaan Barang Jasa Satuan Pendidikan yang berlaku. </p>
                    <p>• Ketentuan yang berlaku terkait pengelolaan dana bantuan sesuai sumber dana. </p>
                    <p>• Ketentuan yang berlaku terkait penyusunan Anggaran Pendapatan dan Belanja Daerah. </p>
                    <p>• Ketentuan yang berlaku terkait perpajakan baik pusat maupun daerah. </p>
                    <p>
                        <a
                            href="https://docs.google.com/document/d/18mVqLwLYZTLj1Hxrtx10G_BKaQVQhuBFlxDST-VuRBA/edit"
                            target="_blank"
                        >
                            {" "}
                            <b>
                                <u>Link Peraturan</u>
                            </b>
                        </a>{" "}
                    </p>
                    <p style={{ marginLeft: 30, color: "red" }}>
                        <input
                            type="checkbox"
                            onClick={(e) => setCekList(!cekList)}
                            class="form-check-input"
                            checked={cekList}
                        />
                        <b>
                            Satdik wajib checklist pesan peringatan sebelum order ID ke generate. (Ceklist untuk
                            melanjutkan)
                        </b>
                    </p>
                    {cekList === true ? (
                        <button
                            type="button"
                            // onClick={doCreateOrder}
                            onClick={() => {
                                setOpenPeraturan(false);
                                setOpenPeringatan(!openPeringatan);
                            }}
                            title="Buat Pesanan"
                            className={classNames("btn btn-primary custome btn-md btn-block cart__checkout-button")}
                        >
                            Konfirmasi Pesanan
                        </button>
                    ) : (
                        <></>
                    )}
                </div>
            </ModalBody>
        </Modal>
    );

    const waitPeraturanv22 = (
        <Modal isOpen={openPeraturan} centered toggle={() => setOpenPeraturan(!openPeraturan)}>
            <ModalBody>
                <div class="text-center p-3" style={{ color: "#0e336d" }}>
                    {" "}
                    <h5>Peraturan SIPLAH:</h5>{" "}
                </div>
                <div class="text-left p-3" style={{ color: "#0e336d" }}>
                    <p>
                        1. Ketentuan PBJ Satuan Pendidikan sesuai Permendikbudristek 18 Tahun 2022 pasal 23 untuk
                        memastikan barang/jasa memenuhi kriteria yang berlaku.{" "}
                    </p>
                    <p>2. Ketentuan pengadaan barang jasa yang dapat berlaku dalam wilayah Satuan Pendidikan terkait</p>
                    <p>
                        {
                            "3. Jika berbelanja dengan sumber dana bantuan sarana/prasarana dalam bentuk uang, mengikuti ketentuan maksimal nominal belanja yang berlaku sesuai dengan Peraturan Menteri Keuangan No. 168/PMK.05/2015 Pasal 24 & 25."
                        }
                    </p>
                    <p style={{ marginLeft: 30, color: "red" }}>
                        <input
                            type="checkbox"
                            onClick={(e) => setCekList(!cekList)}
                            class="form-check-input"
                            checked={cekList}
                        />
                        <b>
                            Satdik wajib checklist pesan peringatan sebelum order ID ke generate. (Ceklist untuk
                            melanjutkan)
                        </b>
                    </p>
                    {cekList === true ? (
                        <button
                            type="button"
                            // onClick={doCreateOrder}
                            onClick={() => {
                                setOpenPeraturan(false);
                                setOpenPeringatan(!openPeringatan);
                            }}
                            title="Buat Pesanan"
                            className={classNames("btn btn-primary custome btn-md btn-block cart__checkout-button")}
                        >
                            Konfirmasi Pesanan
                        </button>
                    ) : (
                        <></>
                    )}
                </div>
            </ModalBody>
        </Modal>
    );
    const showVA = (jenis) => {
        if (jenis === "VA") {
            alert(jenis);
        } else {
            alert(jenis);
        }
    };

    function doCreateOrder() {
        if (!customer.school.npwp) {
            return new Promise((resolve) => {
                Swal.fire({
                    icon: "info",
                    title: "NPWP TIDAK DITEMUKAN",
                    showCancelButton: false,
                    html: `Silahkan lengkapi NPWP sekolah pada sistem dapodik`,
                });
                resolve();
            });
        }
        if (process.env.REACT_APP_IS_MAINTENANCE === "true") {
            return new Promise((resolve) => {
                Swal.fire({
                    icon: "info",
                    title: "Maintenance",
                    showCancelButton: false,
                    html: `mohon maaf proses order tidak bisa dilanjutkan dikarenakan sedang tahap sinkronisasi ke DJP`,
                });
                resolve();
            });
        }
        let req = { isInsurance: false };
        Object.keys(data).forEach((item) => {
            req = { ...req, [item]: data[item].value };
        });
        if (state.options.isInsurance === 1) {
            req.isInsurance = true;
        }
        setSendRequest(true);
        req = {
            ...req,
            note,
            shipping: state.options.shipping || "penyedia",
            id,
            from: fromLocalStorage,
        };
        if (isValid(req)) {
            return new Promise((resolve) => {
                customerApi.createOrder(req, customer?.token).then((res) => {
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
                    customerApi.getMiniCart(customer?.token).then((res) => {
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
    }

    const doHandleCreateOrder = () => {
        console.log("checkout");
        if (!customer.school.npwp) {
            return new Promise((resolve) => {
                Swal.fire({
                    icon: "info",
                    title: "NPWP TIDAK DITEMUKAN",
                    showCancelButton: false,
                    html: `Silahkan lengkapi NPWP sekolah pada sistem dapodik`,
                });
                resolve();
            });
        }
        if (process.env.REACT_APP_IS_MAINTENANCE === "true") {
            return new Promise((resolve) => {
                Swal.fire({
                    icon: "info",
                    title: "Maintenance",
                    showCancelButton: false,
                    html: `mohon maaf proses order tidak bisa dilanjutkan dikarenakan sedang tahap sinkronisasi ke DJP`,
                });
                resolve();
            });
        }
        let req = { isInsurance: false };
        Object.keys(data).forEach((item) => {
            req = { ...req, [item]: data[item].value };
        });
        if (state.options.isInsurance === 1) {
            req.isInsurance = true;
        }
        setSendRequest(true);
        req = {
            ...req,
            note,
            shipping: state.options.shipping || "penyedia",
            id,
            from: fromLocalStorage,
        };
        if (isValid(req)) {
            return new Promise((resolve) => {
                customerApi.createOrder(req, customer?.token).then((res) => {
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
                    toast.success("yeatyt");

                    setSendRequest(false);
                    customerApi.getMiniCart(customer?.token).then((res) => {
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

    console.log(state.checkout?.from);

    const { name, location, telephone } = customer?.school;

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
            redirect,
            cartSelected,
            sourceOfFunds,
            shipping,
            insuranceTotalCurrencyFormat,
            shippingSelected,
            paymentDueSelected,
            wrappingSelected,
            paymentMethod,
            totalCurrencyFormat,
            weightText,
            paymentDue,
            wrapping,
            subTotalCurrencyFormat,
            ppnCurrencyFormat,
            shippingTerpilih,
            shippingCost,
            shippingCostCurrencyFormat,
        } = state.checkout;

        // const adaStokKosong = state?.checkout?.cartSelected?.product.some((item) => Number(item.stock) === 0);

        // if (true) {
        //     Swal.fire({
        //         html: `Kembali ke halaman keranjang dan melihat barang, jumlah barang, dan harga yang sudah disesuaikan dengan ketersediaan barang dan harga terbaru yang ada pada penyedia.`,
        //         title: "Terdapat Update Stok dan Harga",
        //         allowOutsideClick: false,
        //         icon: "warning",
        //         showCancelButton: true,
        //         confirmButtonText: "Kembali ke Keranjang",
        //         cancelButtonText: "Batalkan",
        //     }).then((result) => {
        //         if (result.dismiss === Swal.DismissReason.cancel) {
        //             // Aksi jika tombol "Batalkan" diklik
        //             customerApi.deleteAllCart(state.checkout.pratransakasiId, customer?.token).then((res) => {
        //                 toast.success(`Produk berhasil dihapus dari keranjang`);
        //                 props.history.push("/");
        //                 customerApi.getMiniCart(customer?.token).then((res) => {
        //                     const { data } = res;
        //                     addMiniCart(data);
        //                 });
        //             });
        //         } else if (result.isConfirmed) {
        //             props.history.push("/shop/cart");
        //         }
        //     });
        // } else {
        //     console.log("Berhasil stock sama");
        // }

        // siniii cek stock
        //         const adaStokKosong = state?.checkout?.cartSelected?.product.some((item) => Number(item.stock) === 0);

        //         const outOfStockProducts = state?.checkout?.cartSelected?.product?.filter((p) => Number(p.stock) === 0);
        //         console.log(outOfStockProducts, "outOfStockProducts");
        //         // Buat HTML daftar produk
        //         const outOfStockListHTML =
        //             outOfStockProducts.length > 0
        //                 ? `
        //       <div style="text-align:left; margin-top:10px;">
        //         <b>Produk berikut stoknya habis:</b>
        //         <ul style="margin: 8px 0 0 18px; padding:0;">
        //           ${outOfStockProducts?.map((p) => `<li><b>${p?.name}</b></li>`)?.join("")}
        //         </ul>
        //       </div>
        //     `
        //                 : "";

        //         if (adaStokKosong) {
        //             Swal.fire({
        //                 title: "Terdapat Update Stok dan Harga",
        //                 html: `
        //     Kembali ke halaman keranjang dan melihat barang, jumlah barang, dan harga
        //     yang sudah disesuaikan dengan ketersediaan barang dan harga terbaru yang ada pada penyedia.
        //     ${outOfStockListHTML}
        //   `,
        //                 icon: "warning",
        //                 allowOutsideClick: false,
        //                 showCancelButton: false, // ❗ Cancel dihilangkan
        //                 confirmButtonText: "Kembali ke Keranjang",
        //             }).then((result) => {
        //                 if (result.isConfirmed) {
        //                     props.history.push("/shop/cart");
        //                 }
        //             });
        //         } else {
        //             console.log("Berhasil stock sama");
        //         }

        console.log(state.checkout.grandTotalDppNilaiLain, "state.checkout");

        let dppLainnya = 0;

        const hasCrossPrice = cartSelected.product.some((item) => Number(item?.ppn) !== 0 && item?.isCrossPrice);

        if (hasCrossPrice) {
            dppLainnya = cartSelected.product.reduce((total, item) => {
                if (Number(item?.ppn) === 0) {
                    return total;
                }

                if (item?.isCrossPrice) {
                    return total + Number(item?.totalDppNilaiLain);
                }

                return total;
            }, 0);
        } else {
            dppLainnya = state?.checkout?.grandTotalDppNilaiLain || 0;
        }

        const dppPph = cartSelected.product.reduce((total, item) => {
            const dppPphValue =
                item.ppn === 0
                    ? Number(item.price)
                    : item.isCrossPrice
                    ? Math.floor(parseFloat(item?.priceCurrencyFormat.replace(/[^\d]/g, "")))
                    : Math.floor(parseFloat(item?.priceCurrencyFormat.replace(/[^\d]/g, "")));
            const dppPphFinalValue = dppPphValue * Number(item?.qty);
            return total + dppPphFinalValue;
        }, 0);

        console.log(cartSelected.product, "cartSelected.product");
        console.log(subTotalCurrencyFormat, "subTotalCurrencyFormat");
        console.log(totalCurrencyFormat, "totalCurrencyFormat");

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
                                            <th>Total</th>
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
                                                            PPN : {Number(item.ppn) !== 0 ? "12%" : "0"}
                                                        </small>
                                                        <p
                                                            style={{
                                                                margin: "4px 0px 4px 0px",
                                                                fontSize: "12px",
                                                                color: "#1951de",
                                                            }}
                                                        >
                                                            {item?.brand} <br />
                                                        </p>
                                                        <div
                                                            className={`product-card__badge ${
                                                                item?.ppnType === "non"
                                                                    ? "product-card__badge--non"
                                                                    : "product-card__badge--ppn"
                                                            }`}
                                                            style={{ fontSize: "12px" }}
                                                        >
                                                            {item?.ppnType === "non"
                                                                ? "Bebas Pajak"
                                                                : "Dikenakan Pajak"}
                                                        </div>

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

                                    {state.checkout.cartSelected.isArkas ? (
                                        <div className="col-lg-6">
                                            <div class="form-group ">
                                                <input
                                                    class="form-control"
                                                    placeholder="Pilih Kurir"
                                                    value={state.checkout.cartSelected.praKurir}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    ) : state.options.from === "compare" ? (
                                        <div className="col-lg-6">
                                            <div class="form-group ">
                                                <input
                                                    class="form-control"
                                                    placeholder="Pilih Kurir"
                                                    value={state.checkout.shippingTerpilih}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <Select
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    styles={customStyles}
                                                    value={{
                                                        label: shippingSelected.name,
                                                        value: shippingSelected.value,
                                                    }}
                                                    onChange={doHandleChange}
                                                    placeholder="Pilih Kurir"
                                                    options={shipping.map(({ value, name }) => ({
                                                        label: name,
                                                        value,
                                                    }))}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="col-lg-6">
                                        <h6
                                            className="pt-sm-2"
                                            onClick={() => setOpenPaymentSource(!openPaymentSource)}
                                        >
                                            Metode Pembayaran
                                        </h6>
                                    </div>
                                    <div className="col-lg-6">
                                        <div class="form-group ">
                                            <input
                                                class="form-control"
                                                placeholder="Pilih Metode Pembayaran"
                                                value={paymentMethodName}
                                                // onClick={() => setOpenPaymentSource(!openPaymentSource)}
                                                onClick={() => {
                                                    setSelectedPaymentSource("normal");
                                                    setOpenPaymentSource(false);
                                                    setOpenVa(true);
                                                }}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6" style={{ display: "none" }}>
                                        <h6 className="pt-sm-2">Sumber Dana</h6>
                                    </div>

                                    <div className="col-lg-6" style={{ display: "none" }}>
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

                                    {state.checkout.cartSelected.isArkas ? (
                                        <div className="col-lg-6">
                                            <div class="form-group ">
                                                <input
                                                    class="form-control"
                                                    placeholder="Pilih Tempo Pembayaran"
                                                    value={state.checkout.cartSelected.praTop}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <Select
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    styles={customStyles}
                                                    onChange={(val) => doHandleChangeSelect(val, "paymentDue")}
                                                    value={
                                                        data["paymentDue"] ?? {
                                                            label: paymentDue[0].name,
                                                            value: paymentDue[0].value,
                                                        }
                                                    } // Default sesuai format react-select
                                                    placeholder="Pilih Tempo Pembayaran "
                                                    options={paymentDue.map(({ value, name }) => ({
                                                        label: name,
                                                        value,
                                                    }))}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="col-lg-6">
                                        <h6 className="pt-sm-2">Pembungkus</h6>
                                    </div>

                                    {state.checkout.cartSelected.isArkas ? (
                                        <div className="col-lg-6">
                                            <div class="form-group ">
                                                <input
                                                    class="form-control"
                                                    placeholder="Pilih Pembungkus"
                                                    value={state.checkout.cartSelected.praWrapping}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <Select
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    styles={customStyles}
                                                    onChange={(val) => doHandleChangeSelect(val, "wrapping")}
                                                    value={
                                                        data["wrapping"] ?? {
                                                            label: wrapping[0].name,
                                                            value: wrapping[0].value,
                                                        }
                                                    }
                                                    placeholder="Pilih Pembungkus"
                                                    options={wrapping.map(({ value, name }) => ({
                                                        label: name,
                                                        value,
                                                    }))}
                                                />
                                            </div>
                                        </div>
                                    )}
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
                                                    {state.checkout.ppn === 0 && (
                                                        <tr key={1}>
                                                            <th style={{ color: "#28a745" }}>Bebas Pajak</th>
                                                            <td style={{ display: "none" }}>1</td>
                                                        </tr>
                                                    )}

                                                    <React.Fragment>
                                                        {state.checkout.ppn === 0 ? (
                                                            cartSelected?.product?.length > 0 && (
                                                                <tr key="dpp-pph-0">
                                                                    <th>Dpp PPh</th>
                                                                    <td>Rp{dppPph.toLocaleString("id-ID")}</td>
                                                                </tr>
                                                            )
                                                        ) : (
                                                            <tr key="dpp-pph">
                                                                <th>Dpp PPh</th>
                                                                <td>Rp{dppPph.toLocaleString("id-ID")}</td>
                                                            </tr>
                                                        )}

                                                        <tr key="dpp-nilai-lain">
                                                            <th>Dpp Nilai Lainnya</th>
                                                            <td>
                                                                {state.checkout.ppn === 0 ? (
                                                                    <div>Rp 0</div>
                                                                ) : (
                                                                    <div> Rp{dppLainnya.toLocaleString("id-ID")}</div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    </React.Fragment>

                                                    <tr key={1}>
                                                        <th>Subtotal</th>
                                                        <td>{subTotalCurrencyFormat}</td>
                                                    </tr>
                                                    <tr key={3}>
                                                        <th>Ongkos Kirim ({weightText})</th>
                                                        <td>{shippingCostCurrencyFormat}</td>
                                                    </tr>
                                                    <tr key={2}>
                                                        <th>Ppn 12%</th>
                                                        <td>{ppnCurrencyFormat}</td>
                                                    </tr>
                                                    <div style={{ width: "100%" }}>
                                                        <small>
                                                            *PPN yang dikenakan telah menggunakan perhitungan terbaru
                                                            sesuai dengan{" "}
                                                            <a
                                                                target="_blank"
                                                                href="https://jdih.kemenkeu.go.id/api/download/ad276b82-94bd-4197-b409-af33e2842cd6/2024pmkeuangan131.pdf"
                                                            >
                                                                PMK No. 131 Tahun 2024
                                                            </a>
                                                            *
                                                        </small>
                                                    </div>
                                                    <tr key={4} style={{ display: "none" }}>
                                                        <th>Asuransi</th>
                                                        <td>{insuranceTotalCurrencyFormat}</td>
                                                    </tr>
                                                </tbody>
                                                <tfoot className="cart__totals-footer">
                                                    <tr>
                                                        <th>Total</th>
                                                        <th style={{ color: "#0e336d" }}>{totalCurrencyFormat}</th>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                            {isCreateOrder() && (
                                                <AsyncAction
                                                    action={doHandleCreateOrder}
                                                    render={({ run, loading }) => (
                                                        <>
                                                            {isCreateOrder() &&
                                                            !customer.position.toLowerCase().includes("bendahara") ? (
                                                                <>
                                                                    {countValid > 3 ? (
                                                                        state.checkout.cartSelected.isArkas ? (
                                                                            <>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        if (state.checkout.isWarning) {
                                                                                            setOpenPeringatanArkas(
                                                                                                !openPeringatanArkas
                                                                                            );
                                                                                        } else {
                                                                                            setOpenPeraturan(
                                                                                                !openPeraturan
                                                                                            );
                                                                                        }
                                                                                        doHandleChangeSelect(
                                                                                            sumberDana,
                                                                                            "sourceOfFund"
                                                                                        );
                                                                                        console.log(
                                                                                            "sumberDana:",
                                                                                            sumberDana
                                                                                        );
                                                                                    }}
                                                                                    title="Buat Pesanan baru"
                                                                                    disabled={loading}
                                                                                    className={classNames(
                                                                                        "btn btn-primary custome btn-md btn-block cart__checkout-button",
                                                                                        {
                                                                                            "btn-loading": loading,
                                                                                        }
                                                                                    )}
                                                                                >
                                                                                    Lanjutkan Pemetaan Pesanan
                                                                                </button>

                                                                                <div
                                                                                    class="alert alert-secondary mt-2"
                                                                                    role="alert"
                                                                                >
                                                                                    <h5 class="alert-heading">
                                                                                        Anda memiliki pemetaan yang
                                                                                        tersimpan
                                                                                    </h5>
                                                                                    <p>
                                                                                        Silahkan melanjutkan pemetaan
                                                                                        terakhir yang Anda masukkan.
                                                                                        Segera selesaikan pemetaan untuk
                                                                                        dapat membuat pesanan.
                                                                                    </p>
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        //    setSumberDana(state.checkout.cartSelected.praSumberDana, "sourceOfFund");

                                                                                        if (state.checkout.isWarning) {
                                                                                            setOpenPeringatanArkas(
                                                                                                !openPeringatanArkas
                                                                                            );
                                                                                        } else {
                                                                                            setOpenPeraturan(
                                                                                                !openPeraturan
                                                                                            );
                                                                                        }
                                                                                        //    setOpenPeringatan(!openPeringatan);
                                                                                        doHandleChangeSelect(
                                                                                            sumberDana,
                                                                                            "sourceOfFund"
                                                                                        );
                                                                                        console.log(
                                                                                            "sumberDana:",
                                                                                            sumberDana
                                                                                        );
                                                                                    }}
                                                                                    title="Buat Pesanan baru"
                                                                                    disabled={loading}
                                                                                    className={classNames(
                                                                                        "btn btn-primary custome btn-md btn-block cart__checkout-button",
                                                                                        {
                                                                                            "btn-loading": loading,
                                                                                        }
                                                                                    )}
                                                                                >
                                                                                    Buat Pesanan Baru
                                                                                </button>
                                                                            </>
                                                                        )
                                                                    ) : state.checkout.cartSelected.isArkas ? (
                                                                        <>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    if (state.checkout.isWarning) {
                                                                                        setOpenPeringatanArkas(
                                                                                            !openPeringatanArkas
                                                                                        );
                                                                                    } else {
                                                                                        setOpenPeraturan(
                                                                                            !openPeraturan
                                                                                        );
                                                                                    }
                                                                                    doHandleChangeSelect(
                                                                                        sumberDana,
                                                                                        "sourceOfFund"
                                                                                    );
                                                                                    console.log(
                                                                                        "sumberDana:",
                                                                                        sumberDana
                                                                                    );
                                                                                }}
                                                                                title="Buat Pesanan baru"
                                                                                disabled={loading}
                                                                                className={classNames(
                                                                                    "btn btn-primary custome btn-md btn-block cart__checkout-button",
                                                                                    {
                                                                                        "btn-loading": loading,
                                                                                    }
                                                                                )}
                                                                            >
                                                                                Lanjutkan Pemetaan Pesanan
                                                                            </button>

                                                                            <div
                                                                                class="alert alert-secondary mt-2"
                                                                                role="alert"
                                                                            >
                                                                                <h5 class="alert-heading">
                                                                                    Anda memiliki pemetaan yang
                                                                                    tersimpan
                                                                                </h5>
                                                                                <p>
                                                                                    Silahkan melanjutkan pemetaan
                                                                                    terakhir yang Anda masukkan. Segera
                                                                                    selesaikan pemetaan untuk dapat
                                                                                    membuat pesanan.
                                                                                </p>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <button
                                                                                type="button"
                                                                                title="Buat Pesanan baru"
                                                                                className={classNames(
                                                                                    "btn btn-defaut custome btn-md btn-block cart__checkout-button"
                                                                                )}
                                                                                style={{
                                                                                    borderRadius: "5px",
                                                                                    color: "white",
                                                                                    marginTop: "10px",
                                                                                    marginBottom: "10px",
                                                                                    background: "#828282",
                                                                                }}
                                                                            >
                                                                                Buat Pesanan Baru
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                //posisi sebagai bendahara

                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        title="Buat Pesanan baru"
                                                                        className={classNames(
                                                                            "btn btn-defaut custome btn-md btn-block cart__checkout-button"
                                                                        )}
                                                                        style={{
                                                                            borderRadius: "5px",
                                                                            color: "white",
                                                                            marginTop: "10px",
                                                                            marginBottom: "10px",
                                                                            background: "#828282",
                                                                        }}
                                                                    >
                                                                        Buat Pesanan Baru
                                                                    </button>

                                                                    <div
                                                                        class="alert alert-secondary mt-2"
                                                                        role="alert"
                                                                    >
                                                                        <h5 class="alert-heading">
                                                                            Anda tidak memiliki akses untuk membuat
                                                                            pesanan
                                                                        </h5>
                                                                        <p>
                                                                            Silakan hubungi Kepala Sekolah atau
                                                                            pelaksana pengadaan barang/jasa yang
                                                                            ditugaskan untuk dapat membuat pesanan.
                                                                        </p>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </>
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

    console.log(state.checkout, "checkout");

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
            {/* {paymentSourceModal} */}
            {waitPeringatan}
            {/* <RevitalisasiModal
                isOpen={openRevitalisasi}
                toggle={() => setOpenRevitalisasi(!openRevitalisasi)}
                onConfirmOrder={handleRevitalisasiConfirm}
            />             */}
            {waitPeringatanArkas}
            {waitPeraturan}
        </React.Fragment>
    );
};

const mapStateToProps = (state) => ({ checkout: state.checkout, customer: state.customer });

const mapDispatchToProps = {
    addMiniCart,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ShopPageCheckout));
