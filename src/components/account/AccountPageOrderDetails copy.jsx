// react
import React, { useEffect, useReducer, useState } from "react";

// third-party
import { Helmet } from "react-helmet-async";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import { useParams, useHistory } from "react-router-dom";
import classNames from "classnames"; 
import { connect } from "react-redux";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { addMiniCart } from "../../store/mini-cart";

// data stubs
import theme from "../../data/theme";
import { FETCH_ORDER_DETAIL, FETCH_ORDER_DETAIL_SUCCESS } from "../../data/constant";
import ModalComplaint from "../shared/ModalComplaint";
import ModalEbast from "../shared/ModalEbast";
import ModalReview from "../shared/ModalReview";
import ModalPayment from "../shared/ModalPayment"; 

// application
import BlockLoader from "../blocks/BlockLoader";
import validateUrl from "../../services/validateUrl";
import customerApi from "../../api/customer";
import { ArrowLeft } from "../../svg";
import AsyncAction from "../shared/AsyncAction";
import InputNumber from "../shared/InputNumber";
import shopApi from "../../api/shop";
import storeApi from "../../api/store";
import ModalPaymentHistory from "../shared/ModalPaymentHistory";

const initialState = {
    transactionDetail: null,
    transactionDetailIsLoading: true,
};

const reducer = (state, action) => {
    switch (action.type) {
        case FETCH_ORDER_DETAIL:
            return { ...state, transactionDetailIsLoading: true };

        case FETCH_ORDER_DETAIL_SUCCESS:
            return { ...state, transactionDetailIsLoading: false, transactionDetail: action.transactionDetail };

        default:
            throw new Error();
    }
};

function AccountPageOrderDetails(props) {
    const [modal, setModal] = useState({
        reason: false,
        konfirmCancel: false,
        paymentConfirmed: false,
        ebast: false,
        complaint: false,
        rincian: false,
        review: false,
    });
    const {  addMiniCart } = props;
    const [updateConfirmPayment, setUpdateConfirmPayment] = useState(false);
    const [state, dispatch] = useReducer(reducer, initialState);
    const { orderId } = useParams();
    const [tax, setTax] = useState("");
    const [loadingPajak, setLoadingPajak] = useState(false)
    const [loadingBatal, setLoadingBatal] = useState(false)
    const [tracking, setTracking] = useState([]);
    const [reviewOpen, setReviewOpen] = useState({});
    
    const [openReason, setOpenReason] = useState(false);
    const [openKonfirmBatal, setOpenKonfirmBatal] = useState(false);
    const [openVa, setOpenVa] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [successPreviewEbast, setsuccessPreviewEbast] = useState(false); 
    const [complaintFor, setComplaintFor] = useState("");
    const [reviewStore, setReviewStore] = useState({
        mallId: "",
        orderId: orderId,
        rate: 5,
        title: "",
        note: "",
    });

    const [productsUpdated, setProductsUpdated] = useState([]);
    const [copy, setCopy] = useState(false);
    let history = useHistory();
    const { token} = props.customer;

    const [reasonType, setReasonType] = useState('')
    const [reasonValue, setReasonValue] = useState('')
    let content;

    useEffect(() => {
        doHandleFetch(); 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);

    useEffect(() => { 
        customerApi.getMiniCart(token).then((res) => {
            const { data } = res;
            addMiniCart(data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    });

    const doHandleComplaintResolve = ({ solution }) => {
        return new Promise((resolve) => {
            customerApi
                .complaintResolve({ orderId, solution }, token)
                .then((res) => {
                    const { status } = res;
                    if (status.code === 200) {
                        doHandleFetch();
                        toast.success("Komplain berhasil diselesaikan");
                    } else {
                        toast.success("Komplain gagal diselesaikan");
                    }
                    resolve();
                })
                .catch((err) => {
                    resolve();
                });
        });
    };

    const doHandleAddReviewStore = () => {
        return new Promise((resolve) => {
            if (reviewStore.note === "") {
                toast.error("Silahkan tulis ulasan anda");
                return;
            }
            storeApi.addReviewStore(reviewStore, token).then((res) => {
                if (res.status.code === 200) {
                    toast.success("Ulasan untuk toko berhasil dikirim");
                } else {
                    toast.error("Ulasan untuk toko gagal dikirim");
                }
                resolve();
            });
        });
    };

    const doHandleGenerateEbast = () => {
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
        return new Promise((resolve) => {
            customerApi
                .generateEbast({ orderId }, token)
                .then((res) => {
                    const { status } = res;
                    if (status.code === 200) {
                        toast.success(status.message);
                        doHandleFetch();
                        doOpen("ebast");
                    } else {
                        toast.error(status.message);
                    }
                    resolve();
                })
                .catch((err) => {
                    resolve();
                });
        });
    };

    const doHandleAddProductReview = (productReviews) => {
        return new Promise((resolve) => {
            shopApi.addProductReview({ review: productReviews, orderId }, token).then((res) => {
                if (res.status.code === 200) {
                    toast.success("Ulasan berhasil terkirim");
                    doOpen("review");
                    doHandleFetch();
                    resolve();
                } else {
                    toast.error(res.status.message);
                    doOpen("review");
                    doHandleFetch();
                    resolve();
                }
            });
        });
    };

    const doHandleCopy = (e) => {
        navigator.clipboard.writeText(state.transactionDetail.billingDetail.virtualAccountNumber);
        setCopy(true);
    };

    const doHandleFetch = () => {
        dispatch({ type: FETCH_ORDER_DETAIL });
        customerApi.getOrder(orderId, token).then((res) => {
            const { data, status } = res;
            if (status.code === 200) {
                setOpenVa(data.status.name.toLowerCase().includes("belum dibayar"));

                if (data.isProductUncategorized) {
                    Swal.fire({
                        title: "Transaksi tertunda",
                        text: "hubungi penyedia untuk melakukan perubahan kategori pada produk",
                        icon: "info",
                        allowOutsideClick: false,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            props.history.push("/account/orders");
                        }
                    });
                }

                dispatch({ type: FETCH_ORDER_DETAIL_SUCCESS, transactionDetail: data });
                setReviewStore({ ...reviewStore, mallId: data.mall.id });
            } else {
                dispatch({ type: FETCH_ORDER_DETAIL_SUCCESS, transactionDetail: null });
            }
        });
    };

    const doAcceptOrder = () => {
        return new Promise((resolve) => {
            customerApi.acceptOrder(token, { orderId }).then((res) => {
                doHandleFetch();
                resolve();
            });
        });
    };

    const doOpen = (e) => {
        let name;
        if (e.target === undefined) name = e;
        else name = e.target.name;
        setModal({ ...modal, [name]: !modal[name] });
    };

    const doHandleCancelOrder = (orderId) => { //Auto Cancel
        
        setOpenKonfirmBatal(false)
        Swal.fire({
            title: "<h4>Konfirmasi Pembatalan Pesanan</h4> ",
            html: `<span class='text-muted'>Anda yakin ingin membatalkan transaksi dengan kode <strong>${state.transactionDetail.invoice}</strong>?</span>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Lanjutkan",
            cancelButtonText: "Batal",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                if (reasonType === '') {
                    toast.error("Pilih alasan pembatalan");
                } else {
                    customerApi.cancelOrder({ orderId, reasonType }, token).then((res) => {
                        if (res.status.code === 200) {
                            toast.success("Pesanan berhasil dibatalkan");
                            doHandleFetch();
                            doOpen('reason')
                            setOpenKonfirmBatal(false)
                        } else {
                            doOpen('reason')
                            setOpenKonfirmBatal(false)
                            toast.error("Pesanan gagal dibatalkan");
                        }
                    });
                }
            }
        });
    };

    const doHandleCancellationProposed = () => { //Permintaan Cancel ke Penyedia Tanpa Form
        return new Promise((resolve) => {
            Swal.fire({
                // title: "Anda yakin?",
                text: "Anda yakin ingin mengajukan pembatalan pesanan?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Ok",
                cancelButtonText: "Batal",
                reverseButtons: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    customerApi.applyCancellation({ orderId }, token).then((res) => {
                        const { status } = res;
                        if (status.code === 200) {
                            toast.success("Pengajuan pembatalan pesanan sudah terkirim ke penyedia");
                                        doOpen("reasonProses");
                                        doHandleFetch();
                        } else {
                            toast.error(status.message);
                        }
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        });
    };
    
    const doHandleAjukanBatalMitraOld = () => { //Pengajuan Batal Penggunaan Form
       
        if (tax === '') {
            Swal.fire({ 
                text: "Upload Form Pengajuan Pembatalan Dahulu.",
                icon: "warning", 
                confirmButtonColor: "#d33", 
                confirmButtonText: "Ok", 
                reverseButtons: true,
            })
        } else {
            if(reasonType === '') { 
                Swal.fire({ 
                    text: "Pilih Alasan Pembatalan Dahulu",
                    icon: "warning", 
                    confirmButtonColor: "#d33", 
                    confirmButtonText: "Ok", 
                    reverseButtons: true,
                })
            } else{
                return new Promise((resolve) => {
                    Swal.fire({ 
                        text: "Anda yakin ingin mengajukan pembatalan pesanan?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Ok",
                        cancelButtonText: "Batal",
                        reverseButtons: true,
                    }).then((result) => {  
                            if (result.isConfirmed) {
                                customerApi.pengajuanPembatalan({ orderId,  reasonValue,  reasonType}, token).then((res) => {
                                    const { status } = res;
                                    if (status.code === 200) {
                                        toast.success("Pengajuan pembatalan pesanan sudah terkirim ke penyedia");
                                        doHandleFetch();
                                        doUploadBatal();
                                        doOpen("AjukanReason")
                                    } else {
                                        toast.error(status.message);
                                    }
                                    resolve();
                                });
                            } else {
                                resolve();
                            }
                    });
                });
            }
        
        }
    };

    const doHandleAjukanBatalMitra = () => { //Pengajuan Batal Penggunaan Form
       
         
            if(reasonType === '') { 
                Swal.fire({ 
                    text: "Pilih Alasan Pembatalan Dahulu",
                    icon: "warning", 
                    confirmButtonColor: "#d33", 
                    confirmButtonText: "Ok", 
                    reverseButtons: true,
                })
            } else{
                return new Promise((resolve) => {
                    Swal.fire({ 
                        text: "Anda yakin ingin mengajukan pembatalan pesanan?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Ok",
                        cancelButtonText: "Batal",
                        reverseButtons: true,
                    }).then((result) => {  
                            if (result.isConfirmed) {
                                customerApi.pengajuanPembatalan({ orderId,  reasonValue,  reasonType}, token).then((res) => {
                                    const { status } = res;
                                    if (status.code === 200) {
                                        toast.success("Pengajuan pembatalan pesanan sudah terkirim ke penyedia");
                                        doHandleFetch(); 
                                        doOpen("AjukanReason")
                                    } else {
                                        toast.error(status.message);
                                    }
                                    resolve();
                                });
                            } else {
                                resolve();
                            }
                    });
                });
            }
      
    };

    const doHandleAjukanBatal = () => {
        
        // if (tax === '') {
        //     Swal.fire({ 
        //         text: "Upload Form Pengajuan Pembatalan Dahulu.",
        //         icon: "warning", 
        //         confirmButtonColor: "#d33", 
        //         confirmButtonText: "Ok", 
        //         reverseButtons: true,
        //     })
        // } else {
            if(reasonType === '') { 
                Swal.fire({ 
                    text: "Pilih Alasan Pembatalan Dahulu",
                    icon: "warning", 
                    confirmButtonColor: "#d33", 
                    confirmButtonText: "Ok", 
                    reverseButtons: true,
                })
            } else{
                return new Promise((resolve) => {
                    Swal.fire({ 
                        text: "Anda yakin ingin mengajukan pembatalan pesanan?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Ok",
                        cancelButtonText: "Batal",
                        reverseButtons: true,
                    }).then((result) => {
                            if (result.isConfirmed) {
                                customerApi.pengajuanPembatalan({ orderId,  reasonValue,  reasonType }, token).then((res) => {
                                    const { status } = res;
                                    if (status.code === 200) {
                                        toast.success("Pengajuan pembatalan pesanan sudah terkirim ke penyedia");
                                        doHandleFetch();
                                        // doUploadBatal();
                                        doOpen("AjukanReasonOne")
                                    } else {
                                        toast.error(status.message);
                                    }
                                    resolve();
                                });
                            } else {
                                resolve();
                            } 
                    });
                });
            }
        // }
    };

    const doHandleSendPenalty = (req) => {
        return new Promise((resolve) => {
            if (Object.keys(req) < 2) {
                toast.error("Denda gagal dikirim");
                resolve();
            } else {
                customerApi.penaltyOrder({ ...req, orderId }, token).then((res) => {
                    const { status } = res;
                    if (status.code === 200) {
                        toast.success("Denda berhasil dikirim");
                        doOpen("ebast");
                        doHandleFetch();
                        resolve();
                    } else {
                        toast.success(status.message);
                        resolve();
                    }
                });
            }
        });
    };

    // const isCollapseOpen = (targetName) => {
    //     return editEnabled[targetName] ? editEnabled[targetName].tooltipOpen : false;
    // };

    const toggleReviewCollapse = (targetName) => {
        if (!reviewOpen[targetName]) {
            setReviewOpen({
                [targetName]: {
                    collapseOpen: true,
                },
            });
        } else {
            setReviewOpen({
                [targetName]: {
                    collapseOpen: !reviewOpen[targetName].collapseOpen,
                },
            });
        }
    };

    const isReviewCollapseOpen = (targetName) => {
        return reviewOpen[targetName] ? reviewOpen[targetName].collapseOpen : false;
    };

    const doSendComplaint = (req) => {
        return new Promise((resolve) => {
            if (Object.keys(req).length < 3) {
                customerApi.complaintCreate({ ...req, orderId, fileName: "" }, token).then((res) => {
                    toast.success("Komplain anda berhasil dikirim");
                    doHandleFetch();
                    doOpen("complaint");
                    resolve();
                });
            } else {
                const formData = new FormData();
                formData.append("file", req.file);
                formData.append("for", "complaint");
                customerApi.uploadImage(formData, token).then((res) => {
                    if (res.status.code === 200) {
                        customerApi.complaintCreate({ ...req, orderId, fileName: res.data }, token).then((res) => {
                            toast.success("Komplain anda berhasil dikirim");
                            doHandleFetch();
                            doOpen("complaint");
                            resolve();
                        });
                    }
                });
            }
        });
    };

    const doHandleSendMessageComplaint = ({ complaintId, message }) => {
        return new Promise((resolve) => {
            if (message !== "") {
                customerApi.sendMessageComplaint({ message, complaintId }, token).then((res) => {
                    if (res.status.code === 200) {
                        doHandleFetch();
                        // setMessage("");
                        toast.success("Pesan terkirim");
                    } else {
                        toast.success("Pesan tidak terkirim");
                    }
                    resolve();
                });
            } else {
                toast.error("Pesan tidak boleh kosong");
                resolve();
            }
        });
    };

    const doUploadBatal = () => {
        const formData = new FormData();
        setLoadingBatal(true)

        if (tax !== undefined) {
            formData.append("file", tax);
            formData.append("for", "tax");
            formData.append("orderId", state.transactionDetail.id);
            customerApi.uploadImageBatal(formData, token).then((res) => {
                if (res.status.code === 200) {
                    toast.success("Form Pembatalan berhasil diupload", {
                        position: "top-center",
                        className: "text-center",
                    });
                } else {
                    toast.error(res.status.message, {
                        position: "top-center",
                        className: "text-center",
                    });
                }
                doHandleFetch()
                setLoadingBatal(false)
            });
        }
    };
    const doUploadTax = () => {
        const formData = new FormData();
        setLoadingPajak(true)

        if (tax !== undefined) {
            formData.append("file", tax);
            formData.append("for", "tax");
            formData.append("orderId", state.transactionDetail.id);
            customerApi.uploadImageTax(formData, token).then((res) => {
                if (res.status.code === 200) {
                    toast.success("Pajak berhasil diupload", {
                        position: "top-center",
                        className: "text-center",
                    });
                } else {
                    toast.error(res.status.message, {
                        position: "top-center",
                        className: "text-center",
                    });
                }
                doHandleFetch()
                setLoadingPajak(false)
            });
        }
    };

    const doSendConfirmPayment = (req) => {
        return new Promise((resolve) => {
            if (Object.keys(req).length < 4) {
                toast.error(`Isi semua data`);
                resolve();
            } else {
                const formData = new FormData();
                formData.append("file", req.file);
                formData.append("for", "confirmPayment");
                customerApi.uploadImage(formData, token).then((res) => {
                    const { data, status } = res;
                    if (status.code === 200) {
                        delete req.file;
                        customerApi
                            .confirmPayment({ ...req, orderId, fileName: data, memo: req.memo || "" }, token)
                            .then((res) => {
                                if (res.status.code === 200) {
                                    toast.success("Pembayaran anda berhasil dikonfirmasi");
                                    doOpen("paymentConfirmed");
                                    doHandleFetch();
                                    resolve();
                                } else {
                                    toast.error(res.status.message);
                                    resolve();
                                }
                            });
                    } else {
                        toast.error(status.message);
                        resolve();
                    }
                });
            }
        });
    };

    const doRefuseOrder = () => {
        return new Promise((resolve) => {
            Swal.fire({
                // title: "Anda yakin?",
                html: "Dengan menekan tombol <strong>Ok</strong>, anda telah menyetujui untuk menolak pesanan secara rampung.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Ok",
                cancelButtonText: "Batal",
                reverseButtons: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    customerApi
                        .refuseOrder({ orderId }, token)
                        .then((res) => {
                            const { status } = res;
                            if (status.code === 200) {
                                toast.success("Pesanan berhasil ditolak");
                                doHandleFetch();
                                resolve();
                            } else {
                                toast.success(status.message);
                                resolve();
                            }
                        })
                        .catch((err) => {
                            resolve();
                            toast.error("Terdapat kesalahan pada server");
                        });
                } else {
                    resolve();
                }
            });
        });
    };

    const doHandleUploadBadProductImg = (files, orderProductId) => {
        const formData = new FormData();
        formData.append("file", files[orderProductId]);
        formData.append("for", "bastBadCondition");
        customerApi.uploadImage(formData, token).then((res) => {
            if (res.status.code === 200) {
                customerApi.uploadImageBast({ fileName: res.data, orderProductId }, token).then((res) => {
                    doHandleFetch();
                });
            }
        });
    };

    const doHandleUploadMultiple = (files) => {
        const formData = new FormData();
        formData.append("orderId", orderId);
        for (let i = 0; i < files.length; i++) {
            formData.append(`files[]`, files[i]);
        }
        customerApi.uploadMultipleImage(formData, token).then((res) => {
            doHandleFetch();
            doOpen("ebast");
        });
    };

    const doHandleSendEbast = (req, filesGoodCondition, filesBadCondition, penaltyPrice, penaltyDay) => {
        return new Promise((resolve) => {
            const formData = new FormData();
            const arrFilesBadCondition = Object.keys(filesBadCondition);
            if (arrFilesBadCondition.length > 0) {
                arrFilesBadCondition.forEach((item) => {
                    formData.append(`filesBadCondition[][${item}]`, filesBadCondition[item]);
                });
            }

            if (filesGoodCondition.length > 0) {
                for (let i = 0; i < filesGoodCondition.length; i++) {
                    formData.append(`filesGoodCondition[]`, filesGoodCondition[i]);
                }
            }

            formData.append("eBast", JSON.stringify(req));
            formData.append("orderId", orderId);
            formData.append("penaltyDay", penaltyDay);
            formData.append("penaltyPrice", penaltyPrice);
            formData.append("bastCetak", 1);
            if (
                filesGoodCondition.length < 1 &&
                req.filter((item) => item.status === "rampung").length !== state.transactionDetail.items.length
            ) {
                toast.error("Upload minimal 1 foto dengan ukuran max. 5 MB per transaksi");
                return resolve();
            }

            customerApi.sendEbast(formData, token).then((res) => {
                const { code, message } = res.status;
                if (code === 200) {
                    toast.success(message);
                } else {
                    toast.error(message);
                }
                doHandleFetch();
                resolve();
            });
        });
    };

    const updateEbast = (type, amountGoodCondition,orderProductId,orderIdx) => {
        return new Promise((resolve) => {
            const formData = new FormData();
           

            formData.append("type", type); 
            formData.append("amountGoodCondition", amountGoodCondition); 
            formData.append("orderProductId", orderProductId);
            formData.append("orderId", orderIdx);
            customerApi.updateEbast(formData, token).then((res) => {
                const { code, message } = res.status;
                if (code === 200) {
                    // toast.success(message); 
                    setsuccessPreviewEbast(true)
                    customerApi.getOrder(orderId, token).then((res) => {
                        const { data, status } = res;
                        if (status.code === 200) {
                            setOpenVa(data.status.name.toLowerCase().includes("belum dibayar")); 
            
                            dispatch({ type: FETCH_ORDER_DETAIL_SUCCESS, transactionDetail: data });
                            setReviewStore({ ...reviewStore, mallId: data.mall.id });
                        } else {
                            dispatch({ type: FETCH_ORDER_DETAIL_SUCCESS, transactionDetail: null });
                        }
                    });
                } else {
                    setsuccessPreviewEbast(true)
                    customerApi.getOrder(orderId, token).then((res) => {
                        const { data, status } = res;
                        if (status.code === 200) {
                            setOpenVa(data.status.name.toLowerCase().includes("belum dibayar"));
            
                            if (data.isProductUncategorized) {
                                Swal.fire({
                                    title: "Transaksi tertunda",
                                    text: "hubungi penyedia untuk melakukan perubahan kategori pada produk",
                                    icon: "info",
                                    allowOutsideClick: false,
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        props.history.push("/account/orders");
                                    }
                                });
                            }
            
                            dispatch({ type: FETCH_ORDER_DETAIL_SUCCESS, transactionDetail: data });
                            setReviewStore({ ...reviewStore, mallId: data.mall.id });
                        } else {
                            dispatch({ type: FETCH_ORDER_DETAIL_SUCCESS, transactionDetail: null });
                        }
                    });
                    // toast.error(message);
                }
                // setTimeout(() => { 
                //     doHandleFetch();
                //     resolve(); 
                // }, 200);
            });
           
        });
    };
    const doHandlePreviewEbast = (req, filesGoodCondition, filesBadCondition, penaltyPrice, penaltyDay) => {
        return new Promise((resolve) => {
            const formData = new FormData();
            const arrFilesBadCondition = Object.keys(filesBadCondition);
            if (arrFilesBadCondition.length > 0) {
                arrFilesBadCondition.forEach((item) => {
                    formData.append(`filesBadCondition[][${item}]`, filesBadCondition[item]);
                });
            }

            if (filesGoodCondition.length > 0) {
                for (let i = 0; i < filesGoodCondition.length; i++) {
                    formData.append(`filesGoodCondition[]`, filesGoodCondition[i]);
                }
            }

            formData.append("eBast", JSON.stringify(req));
            formData.append("orderId", orderId);
            formData.append("penaltyDay", penaltyDay);
            formData.append("penaltyPrice", penaltyPrice); 
            formData.append("bastCetak", 0);
            if (
                filesGoodCondition.length < 1 &&
                req.filter((item) => item.status === "rampung").length !== state.transactionDetail.items.length
            ) 
            {
                toast.error("Upload minimal 1 foto dengan ukuran max. 5 MB per transaksi ");
                return resolve();
            }
            customerApi.sendEbast(formData, token).then((res) => {
                const { code, message } = res.status;
                if (code === 200) {
                    // toast.success(message); 
                    setsuccessPreviewEbast(true)
                    customerApi.getOrder(orderId, token).then((res) => {
                        const { data, status } = res;
                        if (status.code === 200) {
                            setOpenVa(data.status.name.toLowerCase().includes("belum dibayar"));
            
                            if (data.isProductUncategorized) {
                                Swal.fire({
                                    title: "Transaksi tertunda",
                                    text: "hubungi penyedia untuk melakukan perubahan kategori pada produk",
                                    icon: "info",
                                    allowOutsideClick: false,
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        props.history.push("/account/orders");
                                    }
                                });
                            }
            
                            dispatch({ type: FETCH_ORDER_DETAIL_SUCCESS, transactionDetail: data });
                            setReviewStore({ ...reviewStore, mallId: data.mall.id });
                        } else {
                            dispatch({ type: FETCH_ORDER_DETAIL_SUCCESS, transactionDetail: null });
                        }
                    });
                } else {
                    setsuccessPreviewEbast(true)
                    customerApi.getOrder(orderId, token).then((res) => {
                        const { data, status } = res;
                        if (status.code === 200) {
                            setOpenVa(data.status.name.toLowerCase().includes("belum dibayar"));
            
                            if (data.isProductUncategorized) {
                                Swal.fire({
                                    title: "Transaksi tertunda",
                                    text: "hubungi penyedia untuk melakukan perubahan kategori pada produk",
                                    icon: "info",
                                    allowOutsideClick: false,
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        props.history.push("/account/orders");
                                    }
                                });
                            }
            
                            dispatch({ type: FETCH_ORDER_DETAIL_SUCCESS, transactionDetail: data });
                            setReviewStore({ ...reviewStore, mallId: data.mall.id });
                        } else {
                            dispatch({ type: FETCH_ORDER_DETAIL_SUCCESS, transactionDetail: null });
                        }
                    });
                    // toast.error(message);
                }
                //  doHandleFetch();
                //  resolve();
            });
           
        });
    };
    const doHandleProcessToPayment = () => {
        return new Promise((resolve) => {
            Swal.fire({
                // title: "Anda yakin?",
                text: "Dengan menekan tombol ok, anda telah menyetujui menerima barang sesuai eBAST dan lanjut proses pembayaran.",
                // text: "Dengan menekan tombol ok, Lanjut konfirmasi pembayaran.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Ok",
                cancelButtonText: "Batal",
                reverseButtons: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    customerApi
                        .processToPayment({ orderId }, token)
                        .then((res) => {
                            const { status } = res;
                            if (status.code === 200) {
                                resolve();
                                toast.success("Lanjut ke pembayaran");
                            } else {
                                resolve();
                                toast.error(status.message);
                            }
                            doHandleFetch();
                            doOpen("ebast");
                        })
                        .catch((err) => {
                            doHandleFetch();
                            resolve();
                        });
                } else {
                    resolve();
                }
            });
        });
    };

    const doOpenTrackShipping = () => {
        customerApi.getTracking(orderId, token).then((res) => {
            setTracking(res.data);

            doOpen("track");
        });
    };

    const doHandleChangeQty = (value, productId) => {
        const { transactionDetail } = state;
        const findProduct = transactionDetail.items.find((item) => item.productId === productId);
        if (findProduct !== undefined) {
            findProduct["qty"] = 1;
            if (value > 0) {
                findProduct["qty"] = value;
            }
            // const findIndex = transactionDetail.items.indexOf(findProduct);

            let assignProductsUpdate = productsUpdated;
            const findIndex = assignProductsUpdate.indexOf(findProduct);

            
            if (findIndex > -1) {
                assignProductsUpdate[findIndex] = findProduct;
            } else {
                assignProductsUpdate = [...assignProductsUpdate, findProduct]
            }
            
            setProductsUpdated(assignProductsUpdate);

            const indexOfTrxDetail = transactionDetail.items.indexOf(findProduct);
            transactionDetail.items[indexOfTrxDetail] = findProduct;
            
            dispatch({
                type: FETCH_ORDER_DETAIL_SUCCESS,
                transactionDetail: {
                    ...transactionDetail,
                    items: transactionDetail.items,
                },
            });
        }
    };

    const doApplyChangeQty = (item, disabled = false) => {
        return new Promise((resolve) => {
            if (productsUpdated.length > 0) {
                const data = {
                    orderId,
                    orderItems: productsUpdated.map(item => (
                        {
                            orderProductId: item.orderProductId,
                            qtyReq: item.qty,
                            isDisabled: disabled,
                        }
                    ))
                }
                customerApi.applyChangeQtyOrder(data, token)
                    .then((res) => {
                        if (res.status.code === 200) {
                            if (state.transactionDetail.status.name.toLowerCase() === "pesanan baru") {
                                toast.success("Pesanan berhasil diubah", {
                                    toastId: "ubah",
                                });
                                setOpenEdit(false)
                            } else {
                                toast.success("Permintaan perubahan pesanan telah terkirim", {
                                    toastId: "ubah",
                                });
                                setOpenEdit(false)
                            }
                            doHandleFetch();
                        } else {
                            toast.error(res.status.message, {
                                toastId: "error",
                            });
                        }
                        setProductsUpdated([]);
                        resolve();
                    }).catch(res => {
                        toast.error("Pesanan gagal diubah", {
                            toastId: "ubah",
                        });
                        resolve()
                    })
            } else {
                resolve()
            }
        });
    };

    const doHandleDeleteProduct = (item, disabled) => {
        Swal.fire({
            // title: "Anda yakin?",
            text: "Anda yakin ingin menghapus produk?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ok",
            cancelButtonText: "Batal",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                doApplyChangeQty(item, disabled);
                /*
                hapus produk
                */
            }
        });
    };

    if (state.transactionDetailIsLoading) {
        return <BlockLoader />;
    }
    if (state.transactionDetail === null) {
        content = (
            <div className="block block-empty w-100">
                <div className="container">
                    <div className="block-empty__body">
                        <div className="block-empty__message">Data order tidak ditemukan</div>
                    </div>
                </div>
            </div>
        );
    } else {
        const {
            invoice,
            downloadDocument,
            id,
            isCancelOrder,
            isConfirmPayment,
            // isEbast,
            orderDate,
            nextStep,
            orderHistory,
            orderStatusId,
            isSendComplaint,
            billingDetail,
            isReview,
            shippingPayment,
            paymentMethodSelected,
            confirmPayment,
            isEbastConfirmPayment,
            proofPayment,
            isProofPayment,
            isAcceptOrder,
            isEbastComplete,
            isEbastCetak,
            
            totalBarang,
            totalQtyBaik,
            totalQtyBuruk,
            totalQtyTerima,

            isSendEbast,
            mall,
            isApplyCancel,
            isFormBatal,
            isAjukanBatal,
            btnAjukanBatalProses,
            btnAjukanBatalBast,
            formBatalSatdik,
            formBatalPenyedia,
            isGenerateEbast,
            note,
            isUploadTax,
            paymentMethod,
            status,
            shippingAddress,
            paymentHistory,
            items,
            isTracking,
            complaint,
            descriptionTotal,
        } = state.transactionDetail;

        const waitPayment = (
            <Modal isOpen={openVa} centered toggle={() => setOpenVa(!openVa)}>
                <ModalBody>
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        <h4>Kode Bayar</h4>
                        <h3 className="border p-2">{billingDetail.virtualAccountNumber} </h3>
                        <small>Kode ini berlaku 3 Bulan </small>
                        <div><br/>
                            <span className="ml-2 border p-2" style={{ cursor: "pointer" }} onClick={doHandleCopy}>
                                <i class="far fa-copy"></i>
                                {copy ? "Tersalin" : "Salin"}
                            </span>
                            <span>&nbsp;</span>
                            <span className="ml-2 border p-2" style={{ cursor: "pointer" }}>
                                <a
                                    href={`whatsapp://send?text=Semangat Pagi, Yth SATDIK SIPLah Eureka, berikut no. Kode Bayar ${billingDetail.virtualAccountNumber} untuk orderan ID ${invoice} an. SATDIK ${shippingAddress.to}. Terimakasih`}
                                    data-action="share/whatsapp/share"
                                >
                                    <i class="fab fa-whatsapp"></i> Kirim ke whatsapp
                                </a>
                            </span>
                        </div>
                        {paymentMethod.toString().toLowerCase().includes("bri") && (
                            <h6 className="mt-4">
                                <i className="fa fa-info-circle mr-1" aria-hidden="true"></i>
                                <span>Pembayaran akan dikenakan biaya admin sebesar Rp 3.500</span>
                            </h6>
                        )}
                    </div>
                </ModalBody>
            </Modal>
        );

        const checkIsDisabled = () => {
            return items.filter((i) => i.requestChange.isDisabled === true).length < items.length && items.length > 1;
        };

        const rowButton = (item, index) => {
            if (status.name.toLowerCase().includes("pesanan baru") || status.name.toLowerCase().includes("diproses")) {
                return (
                    <div style={{ width: "200px" }}>
                        {item.isApplyChange && (
                            <>
                                {/* {isCollapseOpen(`edit-${item.productId}`) ? (
                                    <>
                                        <AsyncAction
                                            action={() => doApplyChangeQty(item)}
                                            render={({ run, loading }) => (
                                                <button
                                                    type="button"
                                                    onClick={run}
                                                    className={classNames("btn btn-primary btn-xs mr-1", {
                                                        "btn-loading": loading,
                                                    })}
                                                >
                                                    Simpan
                                                </button>
                                            )}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => toggleCollapse(`edit-${item.productId}`)}
                                            className={classNames("btn btn-dark btn-xs mr-1")}
                                        >
                                            Batal
                                        </button>
                                    </>
                                ) : 
                                (
                                    <button
                                        type="button"
                                        onClick={() => toggleCollapse(`edit-${item.productId}`)}
                                        class="btn btn-primary btn-xs mr-1"
                                    >
                                        Edit
                                    </button>
                                )} */}

                                {checkIsDisabled() && (
                                    <button
                                        onClick={() => doHandleDeleteProduct(item, true)}
                                        type="button"
                                        name=""
                                        id=""
                                        class="btn btn-danger btn-xs"
                                    >
                                        Hapus
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                );
            } else if (isReview) {
                return (
                    <div style={{ width: "130px" }}>
                        <button
                            className="btn btn-xs btn-primary"
                            onClick={() => toggleReviewCollapse(`review-${index}`)}
                        >
                            Beri Ulasan
                        </button>
                    </div>
                );
            } else {
                return <div style={{ width: "135px" }}></div>;
            }
        };

        content = (
            <>
                <h6 style={{ cursor: "pointer" }} onClick={() => history.push('/account/orders')} className="mb-3">
                    <ArrowLeft className="float-left mr-2" /> Kembali
                </h6>

                <div className="card">
                    {complaint.filter((item) => item.isResolved === false).length > 0 && (
                        <div class="alert alert-danger" role="alert">
                            Terdapat komplain yang belum diselesaikan.{" "}
                            <strong
                                className="text-primary"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    setComplaintFor("newOrder");
                                    doOpen("complaint");
                                }}
                            >
                                {" "}
                                Klik disini
                            </strong>{" "}
                            untuk melihat komplain.
                        </div>
                    )}
                    <div className="order-header">
                        <div className="order-header__actions">
                            {isTracking && (
                                <button className="btn btn-xs btn-secondary" onClick={doOpenTrackShipping}>
                                    Track Pengiriman
                                </button>
                            )}
                            <button className="btn btn-xs btn-secondary ml-1" onClick={() => doOpen("rincian")}>
                                Rincian
                            </button>
                        </div>
                        <h5 className="order-header__title">Invoice : {invoice}</h5>
                        <div className="order-header__subtitle">{orderDate}</div>
                        <div className="d-md-flex d-sm-block flex-md-row justify-content-md-between align-items-md-center mt-3">
                            <div className="order-header__subtitle">
                                <div>Status</div>
                                {status.name=='Ditutup' ?
                                
                                <span style={{ fontSize: "13px" }} className="badge badge-danger">
                                    {status.name}
                                </span>
                                : 
                                <span style={{ fontSize: "13px" }} className="badge badge-primary">
                                    {status.name}
                                </span>
                                
                                }
                            </div>
                            <div className="order-header__subtitle text-md-right">
                                Langkah Selanjutnya
                                {status.name=='Ditutup' ?
                                
                                <div
                                    className="font-weight-bold text-danger"
                                    dangerouslySetInnerHTML={{ __html: nextStep }}
                                />
                                : 
                                <div
                                    className="font-weight-bold text-primary"
                                    dangerouslySetInnerHTML={{ __html: nextStep }}
                                />
                                
                                }
                                
                                {isConfirmPayment && (
                                    // <div className="col-md-6 px-2 mt-2">
                                    <button
                                        className="btn btn-block btn-primary custome"
                                        name="paymentConfirmed"
                                        onClick={doOpen}
                                    >
                                        Konfirmasi Pembayaran
                                    </button>
                                    // </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="my-3">
                        {Object.keys(state.transactionDetail.eBast).length !== 0 && orderStatusId < 6 && (
                            <ModalEbast
                                isSendEbast={isSendEbast}
                                doHandleProcessToPayment={doHandleProcessToPayment}
                                isEbastConfirmPayment={isEbastConfirmPayment} 
                                doHandleSendEbast={doHandleSendEbast}
                                doHandlePreviewEbast={doHandlePreviewEbast}
                                updateEbast={updateEbast}
                                successPreviewEbast={successPreviewEbast}
                                doHandleUploadMultiple={doHandleUploadMultiple}
                                doHandleUploadBadProductImg={doHandleUploadBadProductImg}
                                doHandleSendPenalty={doHandleSendPenalty}
                                doAcceptOrder={doAcceptOrder}
                                doRefuseOrder={doRefuseOrder}
                                isEbastComplete={isEbastComplete}
                                isEbastCetak={isEbastCetak}
                                istotalBarang={totalBarang}
                                istotalQtyBaik={totalQtyBaik}
                                istotalQtyBuruk={totalQtyBuruk}
                                istotalQtyTerima={totalQtyTerima} 
                                isConfirmPayment={isConfirmPayment} 
                                invoice={invoice}
                                items={items}
                                eBast={state.transactionDetail.eBast}
                                isOpen={modal.ebast}
                                toggle={doOpen}
                            ></ModalEbast>
                        )}
                    </div>
                    
                    <div className="card-divider" />
                    <div className="card-table">
                        <div className="table-responsive">
                            <table className="table table-responsive">
                                <thead>
                                    <tr>
                                        <th>Produk</th>
                                        <th />
                                        <th>Qty</th>
                                        <th>Harga DPP</th>
                                        <th>Pajak per item</th>
                                        <th>Sub Total</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <>
                                            <tr>
                                                <td>
                                                    <img
                                                        src={item.image}
                                                        alt=""
                                                        height="60px"
                                                        style={{ width: "50px", height: "50px", objectFit: "contain" }}
                                                    />
                                                </td>
                                                <td>
                                                    <div style={{ width: "310px" }}>
                                                        <p>{item.name}</p>
                                                        {item.badges.map((item) => (
                                                            <div
                                                                key={item}
                                                                className="product-card__badge product-card__badge--hot w-sm-50"
                                                            >
                                                                {item}
                                                            </div>
                                                        ))}
                                                        {item.statusRequest !== null && (
                                                            <small className="d-block font-italic bg-warning text-center">
                                                                {item.requestChange.isDisabled
                                                                    ? `Permintaan hapus produk (${item.statusRequest})`
                                                                    : `Permintaan ubah jumlah produk menjadi ${item.requestChange.qty} (
                                                        ${item.statusRequest})`}
                                                            </small>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    { openEdit === false ?
                                                        <>
                                                        <span>{item.qty}</span>
                                                        </>
                                                    :
                                                   ( item.isApplyChange ? (
                                                        <InputNumber
                                                            min={1}
                                                            onChange={(value) =>
                                                                doHandleChangeQty(value, item.productId)
                                                            }
                                                            value={Number(item.qty)}
                                                        />
                                                    ) : (
                                                        <>
                                                            <span>{item.qty}</span>
                                                        </>
                                                    ))
                                                }
                                                    
                                                </td>
                                                <td>
                                                    <div style={{ width: '140px' }}>
                                                        {item.isCrossPrice ? (
                                                            <>
                                                                <small style={{ textDecoration: "line-through" }}>
                                                                    {item.crossPrice}
                                                                </small>{" "}
                                                                <span>{item.priceCurrencyFormat}</span>
                                                            </>
                                                        ) : (
                                                            item.priceCurrencyFormat
                                                        )}
                                                    </div>
                                                    {/* {item.priceCurrencyFormat} */}
                                                </td>
                                                <td>
                                                    {/* {item.ppnType !== "include" ? ( */}
                                                    <div style={{ width: '140px' }}>
                                                        {item.ppnCurrencyFormat}
                                                    </div>
                                                    {/* ) : (
                                                        <span class="badge badge-primary">{item.ppnType}</span>
                                                    )} */}
                                                </td>
                                                <td>
                                                    <div style={{ width: '140px' }}>
                                                        {item.totalPriceCurrencyFormat}
                                                    </div>
                                                </td>
                                                <td>{rowButton(item, index)}</td>
                                            </tr>
                                            {isReviewCollapseOpen(`review-${index}`) && isReview && (
                                                <ModalReview
                                                    doHandleAddProductReview={doHandleAddProductReview}
                                                    item={item}
                                                    index={index}
                                                    toggle={() => toggleReviewCollapse(`review-${index}`)}
                                                    isOpen={isReviewCollapseOpen(`review-${index}`)}
                                                />
                                            )}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="card-divider mb-3"></div>
                    
 

                    <div className="card-divider mb-3 mt-3"></div>
                    <div className="container">
                        {descriptionTotal.map((item) => (
                            <>
                                {item[0] !== "Total" && (
                                    <div className="row justify-content-md-between" style={{ marginBottom: "-10px" }}>
                                        <div className="col-md-6">
                                            <strong>{item[0]}</strong>
                                        </div>
                                        <div className="col-md-3 text-md-right">
                                            <p>{item[1]}</p>
                                        </div>
                                    </div>
                                )}
                            </>
                        ))}
                    </div>
                    <div className="card-divider my-3" />
                    <div className="container">
                        {descriptionTotal.map((item) => (
                            <>
                                {item[0] === "Total" && (
                                    <div className="row justify-content-between">
                                        <div className="col-md-6">
                                            <strong>{item[0]}</strong>
                                        </div>
                                        <div className="col-md-3  text-md-right">
                                            <p>{item[1]}</p>
                                        </div>
                                    </div>
                                )}
                            </>
                        ))}
                    </div>
                </div>

                {/* {isEbast && eBast} */}
                <div className="row mt-3 no-gutters mx-n2">
                    <div className="col-sm-6 col-12 px-2 d-flex">
                        <div className="card address-card address-card--featured flex-grow-1">
                            <div className="address-card__body">
                                <div className="address-card__badge address-card__badge--muted">Detail Tagihan</div>
                                <div className="address-card__row">
                                    <div className="address-card__row-title">Metode Pembayaran</div>
                                    <div className="address-card__row-content">{billingDetail.paymentMethod}</div>
                                </div>
                                <div className="address-card__row">
                                    <div className="address-card__row-title">Kode Bayar</div>
                                    <div className="address-card__row-content">
                                        {billingDetail.virtualAccountNumber}{" "}
                                        {!billingDetail.virtualAccountNumber
                                            .toLowerCase()
                                            .includes(
                                                "nomor va akan muncul setelah ebast terisi dan klik lanjut ke proses pembayaran"
                                            ) && (
                                                <span
                                                    onClick={() => setOpenVa(!openVa)}
                                                    className="text-primary"
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    Lihat
                                                </span>
                                            )}
                                    </div>
                                </div>
                                <div className="address-card__row">
                                    <div className="address-card__row-title">Lama Pembayaran</div>
                                    <div className="address-card__row-content">{billingDetail.paymentDue}</div>
                                </div>
                                <div className="address-card__row">
                                    <div className="address-card__row-title">Ekspedisi</div>
                                    <div className="address-card__row-content">{billingDetail.shipping}</div>
                                </div>
                                <div className="address-card__row">
                                    <div className="address-card__row-title">Penyedia</div>
                                    <div className="address-card__row-content">{mall.name}</div>
                                </div>
                                <div className="address-card__row">
                                    <div className="address-card__row-title">Total Tagihan</div>
                                    <div className="address-card__row-content">{billingDetail.totalCurrencyFormat}</div>
                                </div>

                                <div className="address-card__row">
                                    <div className="address-card__row-title">Catatan</div>
                                    <div className="address-card__row-content">{note || "-"} </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-12 px-2 mt-sm-0 mt-3">
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
                        {isReview && (
                            <div className="card address-card address-card--featured my-2">
                                <div className="address-card__body">
                                    <div className="address-card__badge address-card__badge--muted">Ulasan Toko</div>
                                    <div class="form-group">
                                        <select
                                            class="form-control"
                                            name=""
                                            id=""
                                            onChange={(e) => setReviewStore({ ...reviewStore, rate: e.target.value })}
                                        >
                                            <option>Pilih Bintang</option>
                                            {[1, 2, 3, 4, 5].map((item) => (
                                                <option value={item}>{item}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <textarea
                                            class="form-control"
                                            placeholder="Berikan ulasan untuk toko"
                                            name=""
                                            onChange={(e) => setReviewStore({ ...reviewStore, note: e.target.value })}
                                            id=""
                                            rows="3"
                                        ></textarea>
                                    </div>
                                    <AsyncAction
                                        action={doHandleAddReviewStore}
                                        render={({ run, loading }) => (
                                            <button
                                                type="button"
                                                onClick={run}
                                                className={classNames("btn btn-primary btn-block", {
                                                    "btn-loading": loading,
                                                })}
                                            >
                                                Kirim Ulasan Toko
                                            </button>
                                        )}
                                    />

                                    {/* <button
                                        className="btn btn-block btn-dark "
                                        name="paymentConfirmed"
                                        onClick={() => doOpen("review")}
                                    >
                                        Berikan Ulasan Produk
                                    </button> */}
                                </div>
                            </div>
                        )}

                        <div className="card address-card address-card--featured mt-2">
                            <div className="address-card__body">
                                <div className="address-card__badge address-card__badge--muted">
                                    Unduh Berkas
                                </div>
                                <div className="row justify-content-between align-items-center mt-2">
                                    {downloadDocument.map((item) => (
                                        <div className="col-md-6 mb-2">
                                            <a
                                                className="btn btn-dark custom btn-block"
                                                href={validateUrl(item.value) ? item.value : ""}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ fontSize: '14px' }}
                                            >
                                                {item.name}
                                            </a>
                                        </div>
                                    ))}
                                    {isProofPayment && (
                                        <>
                                            <div className="col-md-6 mb-2">
                                                <a
                                                    className="btn btn-dark custom btn-block"
                                                    href={proofPayment}
                                                    style={{ fontSize: "90%" }}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Cetak Bukti Bayar
                                                </a>
                                            </div>
                                            <div className="col-md-6 mb-2">
                                                <button
                                                    className="btn  btn-dark custom btn-block"
                                                    onClick={() => doOpen("paymentHistory")}
                                                    style={{ fontSize: "90%" }}
                                                >
                                                    Riwayat Bayar
                                                </button>
                                            </div>
                                        </>
                                    )}
                                    
                                    {formBatalSatdik != '' && (
                                        <>
                                            <div className="col-md-12 mb-2">
                                                <a
                                                    className="btn btn-info custom btn-block"
                                                    href={'https://siplah.eurekabookhouse.co.id/assets/uplod/form_batal/'+formBatalSatdik}
                                                    style={{ fontSize: "90%" }}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Cetak Form Batal Satdik
                                                </a>
                                            </div> 
                                        </>
                                    )}
                                    
                                    {formBatalPenyedia != '' && (
                                        <>
                                            <div className="col-md-12 mb-2">
                                                <a
                                                    className="btn btn-info custom btn-block"
                                                    href={'https://siplah.eurekabookhouse.co.id/assets/uplod/form_batal/'+formBatalPenyedia}
                                                    style={{ fontSize: "90%" }}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Cetak Form Batal Penyedia
                                                </a>
                                            </div> 
                                        </>
                                    )}
                                    
                                    {isUploadTax && (
                                        <div className="col-12 mt-2">
                                            <div class="custom-file">
                                                <input
                                                    type="file"
                                                    class="custom-file-input"
                                                    name="tax"
                                                    onChange={(e) => setTax(e.target.files[0])}
                                                />
                                                <label class="custom-file-label" for="customFile">
                                                    Pilih Bukti Pajak
                                                </label>
                                            </div>
                                            {tax?.name &&
                                                <label className="mb-0 mt-1 d-block">{tax?.name}</label>
                                            }
                                            <small className="text-muted d-block">* Maksimal 3mb</small>
                                            <button disabled={loadingPajak} className={"btn btn-sm btn-primary mt-1"} onClick={doUploadTax}>
                                                {loadingPajak ? "Loading..." :
                                                    'Upload Pajak'
                                                }
                                            </button>
                                        </div>
                                    )}
                                    
                                    
                                </div>
                            </div>
                        </div>
                        
                        <div className="card address-card address-card--featured mt-2">
                            <div className="address-card__body">
                                <div className="address-card__badge address-card__badge--muted">
                                Upload Form Pembatalan
                                </div>
                                <div className="row justify-content-between align-items-center mt-2">

                                {isFormBatal === true && (
                                        <div className="col-12 mt-2">   
                                            <a
                                                className="btn btn-dark custom btn-block mt-1"
                                                href={`https://siplah.eurekabookhouse.co.id/api/order-doc/form-batal/${invoice}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ fontSize: '14px' }}
                                            > Unduh Form Pembatalan
                                            </a> 
                                            <hr/>
                                            <div class="custom-file">
                                                <input
                                                    type="file"
                                                    class="custom-file-input"
                                                    name="tax"
                                                    onChange={(e) => setTax(e.target.files[0])}
                                                />
                                                <label class="custom-file-label" for="customFile">
                                                    Pilih Form Pembatalan
                                                </label>
                                            </div>
                                            {tax?.name &&
                                                <label className="mb-0 mt-1 d-block">{tax?.name}</label>
                                            }
                                            <small className="text-muted d-block">* Maksimal 3mb</small>
                                            <button disabled={loadingBatal} className={"col-md-12 btn btn-sm btn-primary mt-1"} onClick={doUploadBatal}>
                                                {loadingPajak ? "Loading..." :
                                                    'Upload Form Pembatalan'
                                                }
                                            </button>
                                        </div>
                                    )}
                                      {isAjukanBatal === true && (
                                        <div className="col-12 mt-2">   
                                            <a
                                                className="btn btn-dark custom btn-block mt-1"
                                                href={`https://siplah.eurekabookhouse.co.id/api/order-doc/form-batal/${invoice}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ fontSize: '14px' }}
                                            > Unduh Form Pembatalan
                                            </a> 
                                            <hr/>
                                            <div class="custom-file">
                                                <input
                                                    type="file"
                                                    class="custom-file-input"
                                                    name="tax"
                                                    onChange={(e) => setTax(e.target.files[0])}
                                                />
                                                <label class="custom-file-label" for="customFile">
                                                    Pilih Form Pembatalan
                                                </label>
                                            </div>
                                            {tax?.name &&
                                                <label className="mb-0 mt-1 d-block">{tax?.name}</label>
                                            }
                                            <small className="text-muted d-block">* Maksimal 3mb</small>
                                            <button disabled={loadingBatal} className={"col-md-12 btn btn-sm btn-primary mt-1"} onClick={doUploadBatal}>
                                                {loadingPajak ? "Loading..." :
                                                    'Upload Form Pembatalan'
                                                }
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {!status.name.toLowerCase().includes("pesanan dibekukan") && (
                        <>
                        {/* Batalkan Orderan Baru */}
                        {isCancelOrder && (
                            <div className="col-md-6 px-2 mt-2">
                                <button
                                    className="btn btn-block btn-danger"
                                    onClick={() => setOpenReason(true) }
                                    // doOpen('reason')
                                >
                                    Batalkan Pesanan
                                </button>
                            </div>
                        )}

                            {isApplyCancel && (
                                <div className="col-md-6 px-2 mt-2">
                                    <button className="btn btn-block btn-danger" 
                                    
                                    onClick={() => doOpen('reasonProses')}
                                    // onClick={doHandleCancellationProposed}
                                    >
                                        
                                        Batalkan Pesanan
                                    </button>
                                </div>
                            )}
                            
                            {btnAjukanBatalProses === true && (
                                <div className="col-md-6 px-2 mt-2">
                                    <button
                                        className="btn btn-block btn-danger"
                                        onClick={() => doOpen('AjukanReason')}
                                    >
                                        Pengajuan Pembatalan
                                    </button>
                                </div>
                            )}

                            {btnAjukanBatalBast === true &&  (
                                <div className="col-md-6 px-2 mt-2">
                                    <button
                                        className="btn btn-block btn-danger"
                                        onClick={() => doOpen('AjukanReasonOne')}
                                    >
                                        Pengajuan Pembatalan
                                    </button>
                                </div>
                            )}


                        </>
                    )}
                    {/* {(status.name.toLowerCase().includes("diproses") ||
                        status.name.toLowerCase().includes("pesanan baru") ||
                        status.name.toLowerCase().includes("sampai") ||
                        status.name.toLowerCase().includes("belum ebast") ||
                        status.name.toLowerCase().includes("dibayar") ||
                        isAcceptOrder) &&
                        complaint.filter((item) => item.isResolved === false).length < 1 && ( */}
                    <div className="col-md-6 px-2 mt-2">
                        <button
                            className="btn btn-block btn-warning"
                            onClick={() => {
                                setComplaintFor("newOrder");
                                doOpen("complaint");
                            }}
                        >
                            Komplain
                        </button>
                    </div>
                    {isConfirmPayment && (
                        <div className="col-md-6 px-2 mt-2">
                            <button
                                className="btn btn-block btn-primary custome"
                                name="paymentConfirmed"
                                onClick={doOpen}
                            >
                                Konfirmasi Pembayaran
                            </button>
                        </div>
                    )}

                    {!status.name.toLowerCase().includes("pesanan dibekukan") && (
                        <>
                            {isAcceptOrder && (
                                <>
                                    <div className="col-md-6 px-2 mt-2">
                                        <AsyncAction
                                            action={doRefuseOrder}
                                            render={({ run, loading }) => (
                                                <button
                                                    type="button"
                                                    onClick={run}
                                                    className={classNames("btn btn-danger btn-block", {
                                                        "btn-loading": loading,
                                                    })}
                                                >
                                                    Tolak Pesanan
                                                </button>
                                            )}
                                        />
                                    </div>
                                    <div
                                        className={classNames("px-2 mt-2", {
                                            "col-md-6":
                                                complaint.filter((item) => item.isResolved === false).length > 0,
                                            "col-md-12":
                                                complaint.filter((item) => item.isResolved === false).length === 0,
                                        })}
                                    >
                                        <AsyncAction
                                            action={doAcceptOrder}
                                            render={({ run, loading }) => (
                                                <button
                                                    type="button"
                                                    onClick={run}
                                                    className={classNames("btn btn-primary btn-block", {
                                                        "btn-loading": loading,
                                                    })}
                                                >
                                                    Terima Pesanan
                                                </button>
                                            )}
                                        />
                                    </div>
                                </>
                            )}
                            {isGenerateEbast && (
                                <div className="col-md-6 px-2 mt-2">
                                    <AsyncAction
                                        action={doHandleGenerateEbast}
                                        render={({ run, loading }) => (
                                            <button
                                                type="button"
                                                onClick={run}
                                                className={classNames("btn btn-primary btn-block", {
                                                    "btn-loading": loading,
                                                })}
                                            >
                                                Lanjut eBAST (Berita Acara Serah Terima)
                                            </button>
                                        )}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
                {waitPayment}
                <ModalPayment
                    invoice={invoice}
                    paymentMethodSelected={paymentMethodSelected}
                    doSendConfirmPayment={doSendConfirmPayment}
                    paymentMethod={paymentMethod}
                    totalPriceCurrencyFormat={billingDetail.totalCurrencyFormat}
                    isOpen={modal["paymentConfirmed"]}
                    updateConfirmPayment={updateConfirmPayment}
                    setUpdateConfirmPayment={setUpdateConfirmPayment}
                    data={confirmPayment}
                    toggle={doOpen}
                />


                {/* <Modal isOpen={modal["konfirmCancel"]} size="md" toggle={() => doOpen("konfirmCancel")}> */}
                <Modal isOpen={openKonfirmBatal} centered toggle={() => setOpenKonfirmBatal(!openKonfirmBatal)}>
                    <ModalBody>
                    <div class="text-center p-3" style={{color:'#0e336d'}}>  <h5 >Konfirmasi Pembatalan</h5> </div>
                        <div class="text-left p-3" style={{color:'#0e336d'}}>
                        <p>Barang yang dibatalkan/ditolak akan masuk kembali ke halaman Keranjang/Checkout. </p>                                  
                        </div>
                        
                        
                        <div className='d-flex justify-content-end w-100'> 
                            {/* <button type="button" class="btn btn-secondary" onClick={() => doOpen("reason")} style={{marginRight:10}} >Tutup</button> */}
                            <button type="button" class="btn btn-danger" onClick={() => doHandleCancelOrder(id)}>Lanjut Batal</button>
                        </div>
                    </ModalBody>
                </Modal>

                <Modal isOpen={modal["rincian"]} size="md" toggle={() => doOpen("rincian")}>
                    <ModalBody>
                        <VerticalTimeline layout="1-column-left" className="vertical-timeline-custom-line">
                            {orderHistory.map((item, index) => (
                                <VerticalTimelineElement
                                    className="vertical-timeline-element--work"
                                    contentStyle={{
                                        background: index !== 0 ? "whitesmoke" : "rgb(33, 150, 243)",
                                        color: index !== 0 ? "grey" : "white",
                                    }}
                                    contentArrowStyle={{
                                        borderRight:
                                            index === 0 ? "7px solid  rgb(33, 150, 243)" : "7px solid  whitesmoke",
                                    }}
                                    date={item.createdAt}
                                    iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
                                >
                                    <h5
                                        className="vertical-timeline-element-title"
                                        style={{
                                            color: index === 0 ? "white" : "",
                                        }}
                                    >
                                        {item.title}
                                    </h5>
                                </VerticalTimelineElement>
                            ))}
                        </VerticalTimeline>
                    </ModalBody>
                </Modal>

                <Modal isOpen={modal["track"]} size="md" toggle={() => doOpen("track")}>
                    <ModalBody>
                        {tracking.length > 0 ? (
                            <VerticalTimeline layout="1-column-left" className="vertical-timeline-custom-line">
                                {tracking.reverse().map((item, index) => (
                                    <VerticalTimelineElement
                                        className="vertical-timeline-element--work"
                                        contentStyle={{
                                            background: index !== 0 ? "whitesmoke" : "rgb(33, 150, 243)",
                                            color: index !== 0 ? "grey" : "white",
                                        }}
                                        contentArrowStyle={{
                                            borderRight:
                                                index === 0 ? "7px solid  rgb(33, 150, 243)" : "7px solid  whitesmoke",
                                        }}
                                        date={`${item.time}`}
                                        iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
                                    >
                                        <h6
                                            className="vertical-timeline-element-title"
                                            style={{
                                                color: index === 0 ? "white" : "",
                                            }}
                                        >
                                            {item.status}
                                        </h6>
                                    </VerticalTimelineElement>
                                ))}
                            </VerticalTimeline>
                        ) : (
                            <h5>Data tidak ditemukan</h5>
                        )}
                    </ModalBody>
                </Modal>

                <ModalComplaint
                    orderStatusId={orderStatusId}
                    doHandleComplaintResolve={doHandleComplaintResolve}
                    doHandleSendMessageComplaint={doHandleSendMessageComplaint}
                    isSendComplaint={isSendComplaint}
                    complaint={complaint}
                    status={status}
                    invoice={invoice}
                    doSendComplaint={doSendComplaint}
                    items={items}
                    shippingPayment={shippingPayment}
                    total={billingDetail.totalCurrencyFormat}
                    complaintFor={complaintFor}
                    complaintCategory={state.transactionDetail.complaintCategory}
                    isOpen={modal["complaint"]}
                    toggle={doOpen}
                />
                {modal["paymentHistory"] && (
                    <ModalPaymentHistory
                        toggle={() => doOpen("paymentHistory")}
                        paymentHistory={paymentHistory}
                        isOpen={modal["paymentHistory"]}
                    />
                )}
                {/* toggle={() => doOpen('reason')} */}
                    {/* POP UP SEBELUM DI PROSES / PESANAN BARU */}
                {/* <Modal  isOpen={modal['reason']} centered toggle={() => doOpen("reason")} class="modal">  */} 
                <Modal isOpen={openReason} centered toggle={() => setOpenReason(!openReason)} class="modal"> 
                    <ModalHeader>
                        <h5>Alasan Pembatalan Pesanan</h5>
                    </ModalHeader>
                    <ModalBody>
                        {state.transactionDetail.reasonTypeCancelOrder.map(item => (
                            <div class="form-check mb-3">
                                <label class="form-check-label">
                                    <input type="radio" onChange={e => setReasonType(e.target.value)} class="form-check-input" name="reasonType" id="" value={item.value} />
                                    {item.name}
                                </label>
                            </div>
                        ))}
                        { reasonType =='CANCELLATION_OTHER' ?
                            <div class="form-check mb-3" >
                                <input
                                type="text"
                                name="penaltyPrice" 
                                class="form-control " 
                                prefix={"Masukan Alasan lainnya "}  
                                onChange={ e => setReasonValue(e.target.value)}
                                />
                            </div>
                            
                            :
                            <></>
                        }
                        <div className='d-flex justify-content-end w-100'> 
                            {/* <button type="button" class="btn btn-secondary" onClick={() => doOpen("reason")} style={{marginRight:10}} >Batal</button> */}
                            <button type="button" class="btn btn-danger" onClick={() => {
                                setOpenReason(false)
                                setOpenKonfirmBatal(true)
                            }}
                                >Batal Pesanan</button>
                        </div>
                    </ModalBody>
                </Modal>

                <Modal isOpen={modal['reasonProses']} centered  toggle={() =>  doOpen("reasonProses")} class="modal">
                    <ModalHeader>
                        <h5>Alasan Pembatalan Pesanan</h5>
                    </ModalHeader>
                    <ModalBody>
                        {state.transactionDetail.reasonTypeCancelOrder.map(item => (
                            <div class="form-check mb-3">
                                <label class="form-check-label">
                                    <input type="radio" onChange={e => {setReasonType(e.target.value); setReasonValue(item.name)}} class="form-check-input" name="reasonType" id="" value={item.value} />
                                    {item.name}
                                </label>
                            </div>
                        ))}
                        { reasonType =='CANCELLATION_OTHER' ?
                            <div class="form-check mb-3" >
                                <input
                                type="text"
                                name="penaltyPrice" 
                                class="form-control " 
                                prefix={"Masukan Alasan lainnya "}  
                                onChange={ e => setReasonValue(e.target.value)}
                                />
                            </div>
                            
                            :
                            <></>
                        }
                        <hr/> 
                        <div className='d-flex justify-content-end w-100'>  
                            <button type="button" class="btn btn-primary" onClick={() => doHandleCancellationProposed(id)}>Kirim</button>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={modal['AjukanReason']} centered  toggle={() =>  doOpen("AjukanReason")} class="modal">
                    <ModalHeader>
                        <h5>Alasan Pengajuan Pembatalan</h5>
                    </ModalHeader>
                    <ModalBody>
                        {state.transactionDetail.reasonTypeAjukanBatalProses.map(item => (
                            <div class="form-check mb-3">
                                <label class="form-check-label">
                                    <input type="radio" onChange={e => {setReasonType(e.target.value); setReasonValue(item.name)}} class="form-check-input" name="reasonType" id="" value={item.value} />
                                    {item.name}
                                </label>
                            </div>
                        ))}
                        { reasonType =='CLOSING_OTHER' ?
                            <div class="form-check mb-3" >
                                <input
                                type="text"
                                name="penaltyPrice" 
                                class="form-control " 
                                prefix={"Masukan Alasan lainnya "}  
                                onChange={ e => setReasonValue(e.target.value)}
                                />
                            </div>
                            
                            :
                            <></>
                        }
                        
                        <div className='d-flex justify-content-end w-100'> 
                            {/* <button type="button" class="btn btn-danger" onClick={() =>  doOpen("AjukanReason")}   style={{marginRight:10}}>Batal</button> */}
                             
                            <button type="button" class="btn btn-primary" onClick={() => doHandleAjukanBatalMitra(id)}>Kirim</button>
                        </div>
                    </ModalBody>
                </Modal>


                <Modal isOpen={modal['AjukanReasonOne']} centered toggle={() => doOpen("AjukanReasonOne")} class="modal">
                    <ModalHeader>
                        <h5>Alasan Pengajuan Pembatalan</h5>
                    </ModalHeader>
                    <ModalBody>
                        {state.transactionDetail.reasonTypeAjukanBatal.map(item => (
                            <div class="form-check mb-3">
                                <label class="form-check-label">
                                    <input type="radio" onChange={e => {setReasonType(e.target.value); setReasonValue(item.name)}}  class="form-check-input" name="reasonType" id={item.value} value={item.value} />
                                    {item.name}
                                </label>
                            </div>
                        ))}
                        { reasonType =='CLOSING_OTHER' ?
                            <div class="form-check mb-3" >
                                <input
                                type="text"
                                name="penaltyPrice" 
                                class="form-control " 
                                prefix={"Masukan Alasan lainnya "}  
                                onChange={ e => setReasonValue(e.target.value)}
                                />
                            </div>
                            
                            :
                            <></>
                        }
                        <hr/> 
                        <div className='d-flex justify-content-end w-100'> 
                            {/* <button type="button" class="btn btn-danger" onClick={() => doOpen("AjukanReasonOne")}  style={{marginRight:10}}>Batal</button> */}
                            
                         
                            <button type="button" class="btn btn-primary" onClick={() => {doHandleAjukanBatal(id); doOpen("AjukanReasonOne") }}>Kirim</button>
                        </div>
                    </ModalBody>
                </Modal>
            </>
        );
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>{`Detail Pesanan — ${theme.name}`}</title>
            </Helmet>
            {content}
        </React.Fragment>
    );
}

const mapStateToProps = (state) => ({ customer: state.customer });
const mapDispatchToProps = {
    addMiniCart,
};


export default connect(mapStateToProps, mapDispatchToProps)(AccountPageOrderDetails);
