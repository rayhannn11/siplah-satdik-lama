import React, { useEffect, useRef, useState } from "react";

// third-party
import { Collapse } from "reactstrap";

import { toast } from "react-toastify";

import classNames from "classnames";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";
import AsyncAction from "./AsyncAction";
import ZoomImage from "./ZoomImage";
import Swal from "sweetalert2";
import { Modal, ModalBody } from "reactstrap";
import validateUrl from "../../services/validateUrl";
import moment from "moment";
import perbaikanAPI from "../../api/perbaikan";
import customerApi from "../../api/customer";
import { FETCH_ORDER_DETAIL_SUCCESS } from "../../data/constant";

let testFetch = false;

const ModalEbast = (props) => {
    const {
        // isOpen,
        // toggle,
        billingDetail,
        eBast,
        invoice,
        isEbastComplete,
        isEbastCetak,
        isPreviewEbast,
        items,
        isSendEbast,
        // doHandleSendPenalty,
        isEbastConfirmPayment,
        doHandleSendEbast,
        doHandlePreviewEbast,
        successPreviewEbast,
        doHandleProcessToPayment,
        updateEbast,
        orderId,
        token,
        setOpenVa,
        dispatch,
        reviewStore,
        setReviewStore,
        istotalBarang,
        istotalQtyBaik,
        istotalQtyBuruk,
        istotalQtyTerima,
        loadingBaseQty,
        doHandleFetch,
        setloadingBaseQty,
    } = props;
    async function hit() {
        const order_id = invoice.slice(12);
        await perbaikanAPI.perhitunganOrder({ order_id: order_id });
    }
    const year = moment().format("YYYY");
    const [isLoading, setIsLoading] = useState(false);
    const [fine, setFine] = useState({ value: eBast.penalty.price || "", floatValue: 0 });
    const [longDelay, setLongDelay] = useState(eBast.penalty.day ?? 0);
    const [total, setTotal] = useState(eBast.penalty.total ?? 0);
    const [openPreview, setOpenPreview] = useState(false);
    const [file, setFile] = useState({}),
        [activeIndex, setActiveIndex] = useState(0);
    const [filesGoodCondition, setFilesGoodCondition] = useState(eBast.imageBastGoodCondition || []);
    // console.log(`eBast.imageBastGoodCondition`, eBast.imageBastGoodCondition, eBast);

    const [openHistoryBast, setOpenHistoryBast] = useState(false);
    const [cekList, setCekList] = useState(false);

    const [totalBarang, setTotalBarang] = useState(istotalBarang ?? 0);
    const [qtyBaik, setQtyBaik] = useState(0);
    const [qtyRusak, setQtyRusak] = useState(0);
    const [totalPesan, setTotalPesan] = useState(istotalQtyTerima ?? 0);
    const [tampil, setTampil] = useState(false);

    // const [dataValid, setDataValid] = useState(istotalQtyTerima !=  istotalBarang ? false : true);
    const [dataValid, setDataValid] = useState(totalPesan != totalBarang ? false : true);
    const [productsUpdated, setProductsUpdated] = useState([]);

    const [nameSelected, setNameSelected] = useState(eBast.history.length > 0 ? eBast.history[0].name : "");
    // const [historyEbastSelected, setHistoryEbastSelected] = useState(eBast.history[0].items ?? []);
    const [historyEbastSelected, setHistoryEbastSelected] = useState(
        eBast.history.length > 0 ? eBast.history[0].items : []
    );
    const [ebastContent, setEbastContent] = useState(
        items.map((item) => ({
            orderProductId: item.orderProductId,
            amountGoodCondition: istotalQtyTerima > 0 ? item.amountGoodConditionInputed : 0, //eBast.history.length > 0 ? item.amountGoodConditionInputed : item.amountGoodCondition,
            amountBadCondition: istotalQtyTerima > 0 ? item.amountBadConditionInputed : 0, // eBast.history.length > 0 ? item.amountBadConditionInputed : item.amountBadCondition,
            qty: item.qty,
            note: item.note ?? "",
            amountBadError: false,
            amountGoodError: false,
            status: item.status,
        }))
    );
    function tutupModal() {
        testFetch = false;
        doHandleFetch();
        console.log("ini mau nutup modal", testFetch);
    }
    // console.log(
    //     `istotalQtyTerima === istotalBarang`,
    //     istotalQtyTerima === istotalBarang,
    //     istotalQtyTerima,
    //     istotalBarang,
    //     `ebastContent`,
    //     ebastContent
    // );
    const totalQtyBaik = ebastContent.reduce((total, item) => total + item.amountGoodCondition, 0);

    const fileInputRef = useRef(null);
    useEffect(() => {}, [loadingBaseQty]);
    const handleChangeFine = (value) => {
        if (!eBast.isSendPenalty) return;
        setFine(value);
        setTotal(Number(value.floatValue) * Number(longDelay));
    };
    // console.log(`ini dari modal loadingBaseQty`, loadingBaseQty);
    function cekMengerti() {
        setCekList(!cekList);
    }
    const doHandleChangeLongDelay = (e) => {
        if (!eBast.isSendPenalty) return;
        const { value } = e.target;
        setLongDelay(value);
        setTotal(Number(value) * Number(fine.floatValue));
    };

    ///ini original
    // const doHandleChange = async (e, orderProductId) => {
    //     setloadingBaseQty(true);
    //     const { value, name } = e.target;
    //     console.log("value: " + value + "-" + name);
    //     const findData = findObjectInEbastContent({ orderProductId });
    //     if (name === "amountGoodCondition") {
    //         let valNumber = Number(value);
    //         if (valNumber > -1 && Number(findData.qty) >= valNumber + Number(findData.amountBadCondition)) {
    //             const tambah = valNumber == 0 ? 0 : valNumber;
    //             setQtyBaik(tambah);

    //             let assignProductsUpdate = productsUpdated;
    //             const findIndex = assignProductsUpdate.indexOf(findData);

    //             if (findIndex > -1) {
    //                 assignProductsUpdate[findIndex] = findData;
    //             } else {
    //                 assignProductsUpdate = [...assignProductsUpdate, findData];
    //             }
    //             console.log(`ini dari assignProductsUpdate`, assignProductsUpdate);
    //             setProductsUpdated(assignProductsUpdate);

    //             const TotalOK = Number(findData.amountGoodCondition) + Number(findData.amountBadCondition);
    //             if (TotalOK > 0) {
    //                 setDataValid(false);
    //             } else {
    //                 setDataValid(true);
    //             }
    //             setEbastContent([
    //                 ...ebastContent.filter((e) => e.orderProductId !== orderProductId),
    //                 { ...findData, [name]: valNumber, amountGoodError: false },
    //             ]);

    //             await updateEbast("qtybaik", Number(tambah), findData.orderProductId, eBast.bastID);

    //         } else {

    //             let amountGoodError = false;
    //             if (Number(findData.amountGoodCondition) === Number(findData.qty)) {
    //                 amountGoodError = false;
    //             } else if (valNumber + Number(findData.amountBadCondition) > Number(findData.qty)) {
    //                 amountGoodError = true;
    //             } else if (valNumber + Number(findData.amountBadCondition) === 0) {
    //                 amountGoodError = true;
    //             }
    //             setEbastContent([
    //                 ...ebastContent.filter((e) => e.orderProductId !== orderProductId),
    //                 {
    //                     ...findData,
    //                     [name]: Number(findData.qty) - Number(findData.amountBadCondition),
    //                     amountGoodError,
    //                 },
    //             ]);
    //         }
    //     } else if (name === "amountBadCondition") {
    //         let valNumber = Number(value);
    //         setloadingBaseQty(true);
    //         if (valNumber > -1 && Number(findData.qty) >= valNumber + Number(findData.amountGoodCondition)) {
    //             const tambah = valNumber == 0 ? 0 : valNumber;
    //             setQtyRusak(tambah);

    //             let assignProductsUpdate = productsUpdated;
    //             const findIndex = assignProductsUpdate.indexOf(findData);

    //             if (findIndex > -1) {
    //                 assignProductsUpdate[findIndex] = findData;
    //             } else {
    //                 assignProductsUpdate = [...assignProductsUpdate, findData];
    //             }

    //             setProductsUpdated(assignProductsUpdate);

    //             Number(findData.qty);
    //             const TotalOK = Number(findData.amountGoodCondition) + Number(findData.amountBadCondition);
    //             if (TotalOK > 0) {
    //                 setDataValid(false);
    //             } else {
    //                 setDataValid(true);
    //             }

    //             updateEbast("qtyrusak", Number(tambah), findData.orderProductId, eBast.bastID);
    //             setEbastContent([
    //                 ...ebastContent.filter((e) => e.orderProductId !== orderProductId),
    //                 { ...findData, [name]: valNumber, amountBadError: false },
    //             ]);
    //         } else {
    //             setloadingBaseQty(true);
    //             let amountBadError = false;
    //             if (Number(findData.amountBadCondition) === Number(findData.qty)) {
    //                 amountBadError = false;
    //                 setTampil(true);
    //             } else if (valNumber + Number(findData.amountGoodCondition) > Number(findData.qty)) {
    //                 amountBadError = true;
    //             } else if (valNumber + Number(findData.amountGoodCondition) === 0) {
    //                 amountBadError = true;
    //             }
    //             setEbastContent([
    //                 ...ebastContent.filter((e) => e.orderProductId !== orderProductId),
    //                 {
    //                     ...findData,
    //                     [name]: Number(findData.qty) - Number(findData.amountGoodCondition),
    //                     amountBadError: amountBadError,
    //                 },
    //             ]);
    //         }
    //     } else {
    //         setloadingBaseQty(true);
    //         setEbastContent([
    //             ...ebastContent.filter((e) => e.orderProductId !== orderProductId),
    //             { ...findData, [name]: value, orderProductId },
    //         ]);
    //     }
    //     setloadingBaseQty(false);
    // };

    const doHandleChange = async (e, orderProductId) => {
        setloadingBaseQty(true);
        const { value, name } = e.target;
        const findData = findObjectInEbastContent({ orderProductId });

        // Get existing updates from localStorage or initialize empty array
        const pendingUpdates = JSON.parse(localStorage.getItem("pendingEbastUpdates") || "[]");
        if (name === "amountGoodCondition") {
            let valNumber = Number(value);
            if (valNumber > -1 && Number(findData.qty) >= valNumber + Number(findData.amountBadCondition)) {
                const tambah = valNumber == 0 ? 0 : valNumber;
                setQtyBaik(tambah);

                // Update local state
                let assignProductsUpdate = productsUpdated;
                const findIndex = assignProductsUpdate.indexOf(findData);
                // console.log(`ini dari assignProductsUpdate`, productsUpdated, assignProductsUpdate);

                if (findIndex > -1) {
                    assignProductsUpdate[findIndex] = findData;
                } else {
                    assignProductsUpdate = [...assignProductsUpdate, findData];
                }
                setProductsUpdated(assignProductsUpdate);

                // Store update in localStorage
                const updateData = {
                    type: "qtybaik",
                    value: Number(tambah),
                    orderProductId: findData.orderProductId,
                    bastId: findData.bastID,
                };

                const existingUpdateIndex = pendingUpdates.findIndex(
                    (update) => update.orderProductId === orderProductId && update.type === "qtybaik"
                );

                if (existingUpdateIndex > -1) {
                    pendingUpdates[existingUpdateIndex] = updateData;
                } else {
                    pendingUpdates.push(updateData);
                }
                localStorage.setItem("pendingEbastUpdates", JSON.stringify(pendingUpdates));

                const TotalOK = Number(findData.amountGoodCondition) + Number(findData.amountBadCondition);
                setDataValid(TotalOK === 0);

                setEbastContent([
                    ...ebastContent.filter((e) => e.orderProductId !== orderProductId),
                    { ...findData, [name]: valNumber, amountGoodError: false },
                ]);
            } else {
                let amountGoodError = false;
                if (Number(findData.amountGoodCondition) === Number(findData.qty)) {
                    amountGoodError = false;
                } else if (valNumber + Number(findData.amountBadCondition) > Number(findData.qty)) {
                    amountGoodError = true;
                } else if (valNumber + Number(findData.amountBadCondition) === 0) {
                    amountGoodError = true;
                }
                setEbastContent([
                    ...ebastContent.filter((e) => e.orderProductId !== orderProductId),
                    {
                        ...findData,
                        [name]: Number(findData.qty) - Number(findData.amountBadCondition),
                        amountGoodError,
                    },
                ]);
            }
        } else if (name === "amountBadCondition") {
            let valNumber = Number(value);
            if (valNumber > -1 && Number(findData.qty) >= valNumber + Number(findData.amountGoodCondition)) {
                const tambah = valNumber == 0 ? 0 : valNumber;
                setQtyRusak(tambah);

                // Update local state
                let assignProductsUpdate = productsUpdated;
                const findIndex = assignProductsUpdate.indexOf(findData);

                if (findIndex > -1) {
                    assignProductsUpdate[findIndex] = findData;
                } else {
                    assignProductsUpdate = [...assignProductsUpdate, findData];
                }
                setProductsUpdated(assignProductsUpdate);
                // console.log(`filesGoodCondition`, filesGoodCondition);

                // Store update in localStorage
                const updateData = {
                    type: "qtyrusak",
                    value: Number(tambah),
                    orderProductId: findData.orderProductId,
                    bastId: findData.bastID,
                };

                const existingUpdateIndex = pendingUpdates.findIndex(
                    (update) => update.orderProductId === orderProductId && update.type === "qtyrusak"
                );

                if (existingUpdateIndex > -1) {
                    pendingUpdates[existingUpdateIndex] = updateData;
                } else {
                    pendingUpdates.push(updateData);
                }
                localStorage.setItem("pendingEbastUpdates", JSON.stringify(pendingUpdates));

                const TotalOK = Number(findData.amountGoodCondition) + Number(findData.amountBadCondition);
                setDataValid(TotalOK === 0);

                setEbastContent([
                    ...ebastContent.filter((e) => e.orderProductId !== orderProductId),
                    { ...findData, [name]: valNumber, amountBadError: false },
                ]);
            } else {
                let amountBadError = false;
                if (Number(findData.amountBadCondition) === Number(findData.qty)) {
                    amountBadError = false;
                    setTampil(true);
                } else if (valNumber + Number(findData.amountGoodCondition) > Number(findData.qty)) {
                    amountBadError = true;
                } else if (valNumber + Number(findData.amountGoodCondition) === 0) {
                    amountBadError = true;
                }
                setEbastContent([
                    ...ebastContent.filter((e) => e.orderProductId !== orderProductId),
                    {
                        ...findData,
                        [name]: Number(findData.qty) - Number(findData.amountGoodCondition),
                        amountBadError,
                    },
                ]);
            }
        } else if (name === "note") {
            const existingNoteIndex = pendingUpdates.findIndex(
                (update) => update.orderProductId === orderProductId && update.type === "note"
            );

            const noteUpdate = {
                type: "note",
                value: value,
                orderProductId: findData.orderProductId,
                bastId: findData.bastID,
            };

            if (existingNoteIndex > -1) {
                pendingUpdates[existingNoteIndex] = noteUpdate;
            } else {
                pendingUpdates.push(noteUpdate);
            }
            localStorage.setItem("pendingEbastUpdates", JSON.stringify(pendingUpdates));
            localStorage.setItem("saveNote", JSON.stringify(pendingUpdates));

            setEbastContent((prev) => [
                ...prev.filter((e) => e.orderProductId !== orderProductId),
                { ...findData, note: value },
            ]);
        }
        setloadingBaseQty(false);
    };

    const [fetchLagi, setfetchLagi] = useState(false);

    console.log(ebastContent.note, "ebast contett");
    const handlePreviewClick = async () => {
        try {
            setIsLoading(true);
            // console.log("Files before process:", filesGoodCondition);

            if (!filesGoodCondition || filesGoodCondition.length === 0) {
                console.log("ERROR: Tidak ada file yang dipilih");
                throw new Error("Foto belum diupload");
            }
            
            console.log("Validasi file berhasil, lanjut ke upload...");

            // console.log("otw di upload ya");
            // console.log("eBast.imageBastGoodCondition:", eBast.imageBastGoodCondition);
            console.log("Files yang akan diupload:", filesGoodCondition);
            console.log("Jumlah files:", filesGoodCondition?.length);
            
            let isError = false;

            try {
                const pendingUpdates = JSON.parse(localStorage.getItem("pendingEbastUpdates") || "[]");
                console.log("Processing updatess", pendingUpdates);

                // for (const update of pendingUpdates) {
                //     await updateEbast(update.type, update.value, update.orderProductId, eBast.bastID);
                // }

                for (const update of pendingUpdates) {
                    try {
                        const res = await updateEbast(update.type, update.value, update.orderProductId, eBast.bastID);
                        if (res.status.code !== 200) {
                            isError = true;
                            console.warn(`Update failed for orderProductId ${update.orderProductId}`);
                        }
                    } catch (err) {
                        isError = true;
                        console.error(`Exception in updateEbast for orderProductId ${update.orderProductId}`, err);
                    }
                }

                console.log("Updates completed");
                localStorage.removeItem("pendingEbastUpdates");
            } catch (updateError) {
                console.error("Error during updates:", updateError);
                throw updateError;
            }
            try {
                const orderRes = await customerApi.getOrder(orderId, token);

                if (orderRes.status.code === 200) {
                    const data = orderRes.data;

                    setOpenVa(data.status.name.toLowerCase().includes("belum dibayar"));
                    dispatch({ type: FETCH_ORDER_DETAIL_SUCCESS, transactionDetail: data });
                    setReviewStore({ ...reviewStore, mallId: data.mall.id });

                    if (!isError && data.isProductUncategorized) {
                        await Swal.fire({
                            title: "Transaksi tertunda",
                            text: "hubungi penyedia untuk melakukan perubahan kategori pada produk",
                            icon: "info",
                            allowOutsideClick: false,
                        });
                        props.history.push("/account/orders");
                    }
                } else {
                    dispatch({ type: FETCH_ORDER_DETAIL_SUCCESS, transactionDetail: null });
                }

                console.log(ebastContent);
                // console.log("Starting doHandlePreviewEbast");
                console.log("Data yang akan dikirim ke API:");
                console.log("- ebastContent:", ebastContent);
                console.log("- filesGoodCondition:", filesGoodCondition);
                console.log("- fine.floatValue:", fine.floatValue);
                console.log("- longDelay:", longDelay);
                
                await doHandlePreviewEbast(ebastContent, filesGoodCondition, {}, fine.floatValue, longDelay);
                console.log("doHandlePreviewEbast API call completed successfully");
                // console.log("doHandlePreviewEbast completed");
                setfetchLagi(true);
                doHandleFetch();
                // testFetch = true
                // await new Promise((resolve) => setTimeout(resolve, 3000));
                fetchLagiFunc();
                // if (totalQtyBaik !== istotalBarang) {
                //     if (istotalQtyTerima !== istotalBarang) {
                //         throw new Error("Jumlah Diterima baik dan Jumlah Rusak tidak valid.");
                //     }
                // }
                const itemsWithErrors = ebastContent
                    .map((ebastItem) => {
                        const originalItem = items.find((item) => item.orderProductId === ebastItem.orderProductId);

                        const qtyPesan = Number(originalItem.qty);
                        const qtyBaik = Number(ebastItem.amountGoodCondition);
                        const qtyRusak = Number(ebastItem.amountBadCondition);
                        const totalDiterima = qtyBaik + qtyRusak;

                        if (totalDiterima !== qtyPesan) {
                            return {
                                name: originalItem.name,
                                qtyPesan,
                                qtyBaik,
                                qtyRusak,
                                totalDiterima,
                                orderProductId: ebastItem.orderProductId,
                            };
                        }
                        return null;
                    })
                    .filter((item) => item !== null);

                if (itemsWithErrors.length > 0) {
                    const errorMessage = itemsWithErrors
                        .map(
                            (item) =>
                                `Barang: ${item.name}\n` +
                                `- Jumlah Dipesan: ${item.qtyPesan}\n` +
                                `- Jumlah Baik: ${item.qtyBaik}\n` +
                                `- Jumlah Rusak: ${item.qtyRusak}\n` +
                                `- Total Diterima: ${item.totalDiterima}`
                        )
                        .join("\n\n");

                    Swal.fire({
                        title: "Penerimaan Barang Tidak Sesuai",
                        html: `<pre style="text-align: left">Beberapa barang memiliki jumlah penerimaan yang tidak sesuai:\n\n${errorMessage}</pre>`,
                        icon: "warning",
                        showDenyButton: true,
                        showCancelButton: true,
                        confirmButtonText: "Update massal ke Qty Baik",
                        denyButtonText: "Update Manual",
                        cancelButtonText: "Batal",
                        denyButtonColor: "#3085d6",
                        confirmButtonColor: "#28a745",
                        cancelButtonColor: "#d33",
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            try {
                                for (const [index, item] of itemsWithErrors.entries()) {
                                    Swal.fire({
                                        title: `Sedang mengupdate... (${index + 1}/${itemsWithErrors.length})`,
                                        html: `
                                            <div>Barang: ${item.name}</div>
                                            <div>Qty Pesanan: ${item.qtyPesan}</div>
                                            <div>Mengupdate ke Qty Baik: ${item.qtyPesan}, Qty Rusak: 0</div>
                                        `,
                                        allowOutsideClick: false,
                                        didOpen: () => {
                                            Swal.showLoading();
                                        },
                                    });

                                    // Update ke server langsung
                                    await updateEbast("qtybaik", item.qtyPesan, item.orderProductId, eBast.bastID);
                                    await updateEbast("qtyrusak", 0, item.orderProductId, eBast.bastID);

                                    // Update state lokal
                                    await doHandleChange(
                                        {
                                            target: {
                                                name: "amountGoodCondition",
                                                value: item.qtyPesan.toString(),
                                            },
                                        },
                                        item.orderProductId
                                    );
                                    await doHandleChange(
                                        {
                                            target: {
                                                name: "amountBadCondition",
                                                value: "0",
                                            },
                                        },
                                        item.orderProductId
                                    );
                                }

                                // Refresh data setelah semua update selesai
                                await doHandleFetch();

                                // Tampilkan notifikasi sukses
                                Swal.fire({
                                    title: "Berhasil",
                                    text: `Berhasil mengupdate ${itemsWithErrors.length} barang`,
                                    icon: "success",
                                    timer: 1500,
                                });
                            } catch (error) {
                                console.error("Error updating quantities:", error);
                                Swal.fire({
                                    title: "Error",
                                    text: "Gagal mengupdate qty",
                                    icon: "error",
                                });
                            }
                        } else if (result.isDenied) {
                            // Update manual - tutup modal dan kembali ke halaman detail
                            testFetch = false;
                            await doHandleFetch();
                        }
                    });
                }
            } catch (previewError) {
                console.error("Error during preview:", previewError);
                throw previewError;
            }

            try {
                // console.log("Starting hit");
                // hit();
                // console.log("Hit completed");
            } catch (hitError) {
                console.error("Error during hit:", hitError);
                throw hitError;
            }

            console.log("sudah di upload ya");
            setOpenPreview(true);
            setIsLoading(false);
            fetchLagiFunc();
        } catch (error) {
            console.log("Error pada upload:", error);
            setIsLoading(false);
            setOpenPreview(false);
            const errorMessage =
                error.message ||
                "Foto belum diupload, Upload minimal 1 foto barang dengan tipe file yang dapat di unggah Jpeg, JPG, dan PNG";

            await Swal.fire({
                text: errorMessage,
                icon: "warning",
                showCancelButton: false,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
                reverseButtons: true,
            });
            return;
        }
    };

    const fetchLagiFunc = async () => {
        console.log(`ini function`, fetchLagi, openPreview, testFetch);
        testFetch = true;
        console.log(`testFetch`, testFetch);
        // setOpenPreview(true);
        doHandleFetch();

        setfetchLagi(false);
    };

    useEffect(() => {
        console.log("openPreview changed:", openPreview);
    }, [openPreview]);

    useEffect(() => {
        console.log("filesGoodCondition changed:", filesGoodCondition);
    }, [filesGoodCondition]);

    const findObjectInEbastContent = (obj) => ebastContent.find((d) => d.orderProductId === obj.orderProductId);

    const saveNotes = JSON.parse(localStorage.getItem("saveNote") || "[]");

    const findNoteFromLocalStorage = (orderProductId) => {
        return saveNotes.find((note) => String(note.orderProductId) === String(orderProductId));
    };

    console.log(totalQtyBaik);

    const waitPreview = (
        // isOpen={openPreview} centered toggle={() => setOpenPreview(!openPreview)}
        // <Modal style={{ maxWidth: 900 }} isOpen={testFetch  } centered toggle={() => setOpenPreview(!openPreview)}>
        <Modal style={{ maxWidth: 900 }} isOpen={testFetch === true} centered toggle={tutupModal}>
            <ModalBody>
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title text-center mb-0">DRAF BERITA ACARA SERAH TERIMA </h4>
                        <p class="card-text text-center">No. {eBast.bastNumber} </p>
                        <p>
                            Pada hari ini, <br /> {eBast.date}, sesuai dengan:
                        </p>

                        <table class="table table-responsive-sm">
                            <tbody>
                                <tr>
                                    <td className="border-top-none p-0">Nomor Surat Pesanan</td>
                                    <td className="border-top-none p-0">:</td>
                                    <td className="border-top-none p-0">
                                        SP-{invoice.substring(0, 6)}
                                        {invoice.slice(-6)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border-top-none p-0">Tanggal</td>
                                    <td className="border-top-none p-0">:</td>
                                    <td className="border-top-none p-0">{eBast.date}</td>
                                </tr>
                                <tr>
                                    <td className="border-top-none p-0">Nama Pekerjaan</td>
                                    <td className="border-top-none p-0">:</td>
                                    <td className="border-top-none p-0">Pemesanan di SIPLah</td>
                                </tr>
                                <tr>
                                    <td className="border-top-none p-0">Tahun</td>
                                    <td className="border-top-none p-0">:</td>
                                    <td className="border-top-none p-0">{year}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div></div>
                        <p>Yang bertanda tangan di bawah ini:</p>
                        <table class="table table-responsive-sm">
                            <tbody>
                                <tr>
                                    <td className="border-top-none p-0">Nama</td>
                                    <td className="border-top-none p-0">:</td>
                                    <td className="border-top-none p-0">{eBast.firstParty.name}</td>
                                </tr>
                                <tr>
                                    <td className="border-top-none p-0">Jabatan</td>
                                    <td className="border-top-none p-0">:</td>
                                    <td className="border-top-none p-0">{eBast.firstParty.position}</td>
                                </tr>
                                <tr>
                                    <td className="border-top-none p-0">Nama Perusahaan</td>
                                    <td className="border-top-none p-0">:</td>
                                    <td className="border-top-none p-0">{eBast.firstParty.companyName}</td>
                                </tr>
                                <tr>
                                    <td className="border-top-none p-0">Alamat Perusahaan</td>
                                    <td className="border-top-none p-0">:</td>
                                    <td className="border-top-none p-0">{eBast.firstParty.address}</td>
                                </tr>
                            </tbody>
                        </table>

                        <p className="mt-2">
                            Selanjutnya disebut <strong>Pihak Pertama</strong>.
                        </p>
                        <table class="table table-responsive-sm">
                            <tbody>
                                <tr>
                                    <td className="border-top-none p-0">Nama</td>
                                    <td className="border-top-none p-0">:</td>
                                    <td className="border-top-none p-0">{eBast.secondParty.name}</td>
                                </tr>
                                <tr>
                                    <td className="border-top-none p-0">Jabatan</td>
                                    <td className="border-top-none p-0">:</td>
                                    <td className="border-top-none p-0">{eBast.secondParty.position}</td>
                                </tr>
                                <tr>
                                    <td className="border-top-none p-0">Nama Sekolah</td>
                                    <td className="border-top-none p-0">:</td>
                                    <td className="border-top-none p-0">{eBast.secondParty.schoolName}</td>
                                </tr>
                                <tr>
                                    <td className="border-top-none p-0">Alamat Sekolah</td>
                                    <td className="border-top-none p-0">:</td>
                                    <td className="border-top-none p-0">{eBast.secondParty.address}</td>
                                </tr>
                                <tr>
                                    <td className="border-top-none p-0">No Telepon</td>
                                    <td className="border-top-none p-0">:</td>
                                    <td className="border-top-none p-0">{eBast.secondParty.phone || "-"}</td>
                                </tr>
                            </tbody>
                        </table>

                        <p className="mt-2">
                            Selanjutnya disebut <strong>Pihak Kedua</strong>.
                        </p>

                        <p>
                            <strong>PIHAK PERTAMA</strong> menyerahkan barang kepada <strong>PIHAK KEDUA</strong>, dan{" "}
                            <strong>PIHAK KEDUA</strong> menyatakan telah menerima barang dari{" "}
                            <strong>PIHAK PERTAMA</strong> dalam jumlah yang lengkap dan kondisi yang baik sesuai dengan
                            rincian berikut :
                        </p>
                        <table class="table table-responsive text-center">
                            <thead
                                style={{
                                    // display: "table",
                                    width: "100%",
                                    tableLayout: "fixed",
                                }}
                            >
                                <tr>
                                    <th style={{ width: '5%', padding: '12px 8px' }}>#</th>
                                    <th style={{ width: '25%', padding: '12px 8px' }}>Nama Barang</th>
                                    <th style={{ width: '10%', padding: '12px 8px' }}>Qty Pesan</th>
                                    <th style={{ 
                                        width: '12%',
                                        backgroundColor: '#10b981',
                                        color: 'white',
                                        fontWeight: '600',
                                        padding: '12px 8px',
                                        borderRadius: '0',
                                        position: 'relative',
                                        fontSize: '0.9rem'
                                    }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <i className="fas fa-check-circle" style={{ fontSize: '1rem' }}></i>
                                                <span>BAIK</span>
                                            </div>
                                            <small style={{ fontSize: '0.7rem', opacity: '0.9' }}>Diterima</small>
                                        </div>
                                    </th>
                                    <th style={{ 
                                        width: '12%',
                                        backgroundColor: '#f59e0b',
                                        color: 'white',
                                        fontWeight: '600',
                                        padding: '12px 8px',
                                        borderRadius: '0',
                                        position: 'relative',
                                        fontSize: '0.9rem'
                                    }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <i className="fas fa-times-circle" style={{ fontSize: '1rem' }}></i>
                                                <span>RUSAK</span>
                                            </div>
                                            <small style={{ fontSize: '0.7rem', opacity: '0.9' }}>Ditolak</small>
                                        </div>
                                    </th>
                                    <th style={{ width: '20%', padding: '12px 8px' }}>Catatan</th>
                                    <th style={{ width: '16%', padding: '12px 8px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody style={{ maxHeight: "50vh", overflow: "auto" }}>
                                {items.map((item, index) => {
                                    console.log(item, "modal");
                                    return (
                                        <tr>
                                            <td>{++index}</td>
                                            <td>
                                                <p
                                                    style={{
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        wordBreak: "break-all",
                                                        whiteSpace: "nowrap",
                                                        width: "165px",
                                                        marginBottom: "0",
                                                    }}
                                                >
                                                    {item.name}
                                                </p>
                                            </td>
                                            <td>{item.qty}</td>
                                            <td>
                                                {/* {item.qty === item.amountGoodConditionInputed ? ( */}
                                                {isEbastCetak == true ? (
                                                    item?.amountGoodConditionInputed
                                                ) : (
                                                    <div className="form-group" style={{ width: "90px" }}>
                                                        <input
                                                            type="number"
                                                            max={item.qty}
                                                            min={0}
                                                            className={classNames("form-control", {
                                                                "is-invalid": findObjectInEbastContent(item).amountGoodError,
                                                            })}
                                                            style={{
                                                                backgroundColor: '#ecfdf5',
                                                                border: '2px solid #10b981',
                                                                borderRadius: '6px',
                                                                textAlign: 'center',
                                                                fontWeight: '600',
                                                                color: '#065f46',
                                                                fontSize: '1.1em',
                                                                transition: 'all 0.2s ease',
                                                                boxShadow: 'none'
                                                            }}
                                                            onFocus={(e) => {
                                                                e.target.style.backgroundColor = '#ffffff';
                                                                e.target.style.borderColor = '#10b981';
                                                                e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                                                            }}
                                                            onBlur={(e) => {
                                                                e.target.style.backgroundColor = '#ecfdf5';
                                                                e.target.style.borderColor = '#10b981';
                                                                e.target.style.boxShadow = 'none';
                                                            }}
                                                            name={`amountGoodCondition`}
                                                            value={findObjectInEbastContent(item).amountGoodCondition}
                                                            onChange={(e) => {
                                                                console.log("ini dari klik");
                                                                setloadingBaseQty(true);
                                                                doHandleChange(e, item.orderProductId);
                                                            }}
                                                        />
                                                        {findObjectInEbastContent(item).amountGoodError && (
                                                            <div class="invalid-feedback">
                                                                Jumlah barang telah sesuai.
                                                                <br /> kurangi jumlah{" "}
                                                                <span className="font-weight-bold">barang buruk</span> agar bisa
                                                                menambah jumlah{" "}
                                                                <span className="font-weight-bold"> barang baik</span>.
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                {/* {item.qty === item.amountGoodConditionInputed ? ( */}
                                                {isEbastCetak == true ? (
                                                    item.amountBadConditionInputed
                                                ) : (
                                                    <div className="form-group" style={{ width: "90px" }}>
                                                        <input
                                                            type="number"
                                                            max={item.qty}
                                                            min={0}
                                                            value={findObjectInEbastContent(item).amountBadCondition}
                                                            className={classNames("form-control", {
                                                                "is-invalid": findObjectInEbastContent(item).amountBadError,
                                                            })}
                                                            style={{
                                                                backgroundColor: '#fef3c7',
                                                                border: '2px solid #f59e0b',
                                                                borderRadius: '6px',
                                                                textAlign: 'center',
                                                                fontWeight: '600',
                                                                color: '#92400e',
                                                                fontSize: '1.1em',
                                                                transition: 'all 0.2s ease',
                                                                boxShadow: 'none'
                                                            }}
                                                            onFocus={(e) => {
                                                                e.target.style.backgroundColor = '#ffffff';
                                                                e.target.style.borderColor = '#f59e0b';
                                                                e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                                                            }}
                                                            onBlur={(e) => {
                                                                e.target.style.backgroundColor = '#fef3c7';
                                                                e.target.style.borderColor = '#f59e0b';
                                                                e.target.style.boxShadow = 'none';
                                                            }}
                                                            name={`amountBadCondition`}
                                                            onChange={(e) => {
                                                                console.log("ini dari klikbad");
                                                                setloadingBaseQty(true);
                                                                doHandleChange(e, item.orderProductId);
                                                            }}
                                                        />
                                                        {findObjectInEbastContent(item).amountBadError && (
                                                            <div class="invalid-feedback">
                                                                Jumlah barang telah sesuai.
                                                                <br /> kurangi jumlah{" "}
                                                                <span className="font-weight-bold">barang baik</span> agar bisa
                                                                menambah jumlah{" "}
                                                                <span className="font-weight-bold"> barang buruk</span>.
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                {/* {item.qty === item.amountGoodConditionInputed ? ( */}
                                                {isEbastCetak == true ? (
                                                    <p style={{ width: "185px" }}> {item.note || "-"}</p>
                                                ) : (
                                                    <textarea
                                                        onChange={(e) => {
                                                            console.log(e.target.value, findObjectInEbastContent(item));
                                                            doHandleChange(e, item.orderProductId);
                                                        }}
                                                        name={"note"}
                                                        style={{ width: "250px" }}
                                                        value={findObjectInEbastContent(item).note}
                                                        className="form-control"
                                                        rows="3"
                                                    ></textarea>
                                                )}
                                            </td>
                                            <td>
                                                <h5>
                                                    {isEbastCetak == true ? (
                                                        <p> </p>
                                                    ) : (
                                                        <span
                                                            className={classNames("badge badge-pill", {
                                                                " badge-success": item.status === "rampung",
                                                                " badge-warning": item.status === "parsial",
                                                            })}
                                                        >
                                                            {item.status}
                                                        </span>
                                                    )}
                                                </h5>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <hr />
                        <p>
                            Berita Acara Serah Terima ini berfungsi sebagai bukti serah terima hasil pekerjaan kepada{" "}
                            <strong>PIHAK KEDUA</strong>, untuk selanjutnya dicatat pada buku penerimaan barang sekolah.
                            Demikian Berita Acara Serah Terima ini dibuat dengan sebenarnya untuk dipergunakan
                            sebagaimana seharusnya.
                        </p>
                        <hr />

                        <table class="table table-responsive-sm">
                            <tbody>
                                <tr>
                                    <td className="border-top-none p-0">PIHAK KEDUA</td>
                                    <td className="border-top-none p-0"> </td>
                                    <td className="border-top-none p-0">PIHAK PERTAMA</td>
                                </tr>
                                <tr>
                                    <td className="border-top-none p-0">... </td>
                                    <td className="border-top-none p-0"> </td>
                                    <td className="border-top-none p-0">... </td>
                                </tr>
                                <tr>
                                    <td className="border-top-none p-0">... </td>
                                    <td className="border-top-none p-0"> </td>
                                    <td className="border-top-none p-0">... </td>
                                </tr>
                                <tr>
                                    <td className="border-top-none p-0">NIP... </td>
                                    <td className="border-top-none p-0">PEMERIKSAAN BARANG </td>
                                    <td className="border-top-none p-0">... </td>
                                </tr>
                                <tr>
                                    <td className="border-top-none p-0"> </td>
                                    <td className="border-top-none p-0">... </td>
                                    <td className="border-top-none p-0"> </td>
                                </tr>
                                <tr>
                                    <td className="border-top-none p-0"> </td>
                                    <td className="border-top-none p-0">... </td>
                                    <td className="border-top-none p-0"> </td>
                                </tr>
                                <tr>
                                    <td className="border-top-none p-0"> </td>
                                    <td className="border-top-none p-0">NIP... </td>
                                    <td className="border-top-none p-0"> </td>
                                </tr>
                            </tbody>
                        </table>

                        <hr />
                        <h5 class="card-title text-center mb-0">LAMPIRAN</h5>
                        {eBast.imageBastGoodCondition.map((item, index) => (
                            <>
                                <img
                                    src={item}
                                    alt=""
                                    height="60px"
                                    style={{ height: "150px", objectFit: "contain" }}
                                />
                            </>
                        ))}
                        <hr />
                        {(totalQtyBaik === istotalBarang || istotalQtyTerima === istotalBarang) && (
                            <div className="row">
                                {/* {  isEbastCetak === false && filesGoodCondition !=''  && (/ */}
                                {isEbastCetak === false && (
                                    <p style={{ marginLeft: 30, color: "#09539C" }}>
                                        <>
                                            <input
                                                type="checkbox"
                                                onChange={cekMengerti}
                                                class="form-check-input"
                                                checked={cekList}
                                            />
                                            Dengan ini Satuan Pendidikan menyatakan bahwa pesanan telah sesuai dan{" "}
                                            <b>FINAL</b> sehingga BAST dapat dicetak atas pesanan ini dan selanjutnya
                                            melakukan pembayaran. (Ceklist untuk melanjutkan)
                                        </>
                                    </p>
                                )}
                                {cekList === true ? (
                                    isEbastCetak === false && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (
                                                        totalQtyBaik === istotalBarang ||
                                                        istotalQtyTerima === istotalBarang
                                                    ) {
                                                        Swal.fire({
                                                            text: "Apakah anda yakin mencetak BAST? Setelah melakukan BAST tidak dapat dibatalkan dan sekolah wajib membayar sesuai proforma invoice",
                                                            icon: "warning",
                                                            showCancelButton: true,
                                                            confirmButtonColor: "#3085d6",
                                                            cancelButtonColor: "#d33",
                                                            confirmButtonText: "Lanjutkan",
                                                            cancelButtonText: "Batal",
                                                            reverseButtons: true,
                                                        }).then((result) => {
                                                            if (result.isConfirmed) {
                                                                doHandleProcessToPayment();
                                                            }
                                                        });
                                                    } else {
                                                        Swal.fire({
                                                            text: "Quantity Terima Baik dan Quantity Rusak tidak valid",
                                                            icon: "warning",
                                                            showCancelButton: false,
                                                            confirmButtonColor: "#3085d6",
                                                            confirmButtonText: "OK",
                                                            reverseButtons: true,
                                                        }).then((result) => {});
                                                    }
                                                }}
                                                className={classNames(
                                                    "btn btn-primary custome btn-md btn-block cart__checkout-button"
                                                )}
                                            >
                                                Cetak eBAST
                                            </button>
                                        </>
                                    )
                                ) : (
                                    <></>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );

    const historyEbast = eBast.history.map((item, index) => {
        return (
            <div
                style={{ cursor: "pointer" }}
                className={classNames("list-group-item list-group-item-action", {
                    active: index === activeIndex,
                })}
                onClick={() => {
                    setNameSelected(item.name);
                    setHistoryEbastSelected(item.items);
                    setActiveIndex(index);
                }}
            >
                {item.name}
            </div>
        );
    });

    if (isLoading) {
        return (
            <div class="full-page-loader" style={{ background: "white", zIndex: 10000, opacity: 0.9 }}>
                <img width="200" src="./images/logo.png" alt="Siplah Eureka Logo" />
            </div>
        );
    }

    return (
        <>
            <div class="card">
                <div class="card-body">
                    <h4 class="card-title text-center mb-0">PEMERIKSAAN PESANAN</h4>
                    <p>
                        Hasil pemeriksaan akan mencetak BAST sebagaimana dibawah ini. Satuan Pendidikan harap kembali
                        memeriksa keterangan pada dokumen berikut sebelum mencetak BAST untuk memastkan kesesuaian
                        pesanan. Setelah cetak, dokumen BAST bersifat <b>FINAL</b> , dan Satuan Pendidikan/Penyedia
                        dihimbau untuk tidak melakukan perubahan apapun terhadap dokumen final.
                    </p>
                    <hr />
                    <h4 class="card-title text-center mb-0">DRAF BERITA ACARA SERAH TERIMA ONLINE </h4>
                    <p class="card-text text-center">No. {eBast.bastNumber} </p>
                    <p>
                        Pada hari ini, <br /> {eBast.date}, sesuai dengan:
                    </p>
                    <div>
                        <strong>Nomor Surat Pesanan</strong> : SP-{invoice.substring(0, 6)}
                        {invoice.slice(-6)}
                    </div>
                    <p>Yang bertanda tangan di bawah ini:</p>
                    <table class="table table-responsive-sm">
                        <tbody>
                            <tr>
                                <td className="border-top-none">Nama</td>
                                <td className="border-top-none">:</td>
                                <td className="border-top-none">{eBast.firstParty.name}</td>
                            </tr>
                            <tr>
                                <td className="border-top-none">Jabatan</td>
                                <td className="border-top-none">:</td>
                                <td className="border-top-none">{eBast.firstParty.position}</td>
                            </tr>
                            <tr>
                                <td className="border-top-none">Nama Perusahaan</td>
                                <td className="border-top-none">:</td>
                                <td className="border-top-none">{eBast.firstParty.companyName}</td>
                            </tr>
                            <tr>
                                <td className="border-top-none">Alamat Perusahaan</td>
                                <td className="border-top-none">:</td>
                                <td className="border-top-none">{eBast.firstParty.address}</td>
                            </tr>
                        </tbody>
                    </table>

                    <p className="mt-2">
                        Selanjutnya disebut <strong>Pihak Pertama</strong>.
                    </p>
                    <table class="table table-responsive-sm">
                        <tbody>
                            <tr>
                                <td className="border-top-none">Nama</td>
                                <td className="border-top-none">:</td>
                                <td className="border-top-none">{eBast.secondParty.name}</td>
                            </tr>
                            <tr>
                                <td className="border-top-none">Jabatan</td>
                                <td className="border-top-none">:</td>
                                <td className="border-top-none">{eBast.secondParty.position}</td>
                            </tr>
                            <tr>
                                <td className="border-top-none">Nama Sekolah</td>
                                <td className="border-top-none">:</td>
                                <td className="border-top-none">{eBast.secondParty.schoolName}</td>
                            </tr>
                            <tr>
                                <td className="border-top-none">Alamat Sekolah</td>
                                <td className="border-top-none">:</td>
                                <td className="border-top-none">{eBast.secondParty.address}</td>
                            </tr>
                            <tr>
                                <td className="border-top-none">No Telepon</td>
                                <td className="border-top-none">:</td>
                                <td className="border-top-none">{eBast.secondParty.phone || "-"}</td>
                            </tr>
                        </tbody>
                    </table>

                    <p className="mt-2">
                        Selanjutnya disebut <strong>Pihak Kedua</strong>.
                    </p>

                    <p>
                        <strong>PIHAK PERTAMA</strong> menyerahkan barang kepada <strong>PIHAK KEDUA</strong>, dan{" "}
                        <strong>PIHAK KEDUA</strong> menyatakan telah menerima barang dari{" "}
                        <strong>PIHAK PERTAMA</strong> dalam jumlah yang lengkap dan kondisi yang baik sesuai dengan
                        rincian berikut :
                    </p>

                    <table class="table table-responsive text-center">
                        <thead
                            style={{
                                // display: "table",
                                width: "100%",
                                tableLayout: "fixed",
                            }}
                        >
                            <tr>
                                <th style={{ width: '5%', padding: '12px 8px' }}>#</th>
                                <th style={{ width: '25%', padding: '12px 8px' }}>Nama Barang</th>
                                <th style={{ width: '10%', padding: '12px 8px' }}>Qty Pesan</th>
                                <th style={{ 
                                    width: '12%',
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    fontWeight: '600',
                                    padding: '12px 8px',
                                    borderRadius: '0',
                                    position: 'relative',
                                    fontSize: '0.9rem'
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <i className="fas fa-check-circle" style={{ fontSize: '1rem' }}></i>
                                            <span>BAIK</span>
                                        </div>
                                        <small style={{ fontSize: '0.7rem', opacity: '0.9' }}>Diterima</small>
                                    </div>
                                </th>
                                <th style={{ 
                                    width: '12%',
                                    backgroundColor: '#f59e0b',
                                    color: 'white',
                                    fontWeight: '600',
                                    padding: '12px 8px',
                                    borderRadius: '0',
                                    position: 'relative',
                                    fontSize: '0.9rem'
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <i className="fas fa-times-circle" style={{ fontSize: '1rem' }}></i>
                                            <span>RUSAK</span>
                                        </div>
                                        <small style={{ fontSize: '0.7rem', opacity: '0.9' }}>Ditolak</small>
                                    </div>
                                </th>
                                <th style={{ width: '20%', padding: '12px 8px' }}>Catatan</th>
                                <th style={{ width: '16%', padding: '12px 8px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody style={{ maxHeight: "50vh", overflow: "auto" }}>
                            {items.map((item, index) => (
                                <tr>
                                    <td>{++index}</td>
                                    <td>
                                        <p
                                            style={{
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                wordBreak: "break-all",
                                                whiteSpace: "nowrap",
                                                width: "165px",
                                                marginBottom: "0",
                                            }}
                                        >
                                            {item.name}
                                        </p>
                                    </td>
                                    <td>{item.qty}</td>
                                    <td>
                                        {/* {item.qty === item.amountGoodConditionInputed ? ( */}
                                        {isEbastCetak == true ? (
                                            item?.amountGoodConditionInputed
                                        ) : (
                                            <div className="form-group" style={{ width: "90px" }}>
                                                <input
                                                    type="number"
                                                    max={item.qty}
                                                    min={0}
                                                    className={classNames("form-control", {
                                                        "is-invalid": findObjectInEbastContent(item).amountGoodError,
                                                    })}
                                                    style={{
                                                        backgroundColor: '#ecfdf5',
                                                        border: '2px solid #10b981',
                                                        borderRadius: '6px',
                                                        textAlign: 'center',
                                                        fontWeight: '600',
                                                        color: '#065f46',
                                                        fontSize: '1.1em',
                                                        transition: 'all 0.2s ease',
                                                        boxShadow: 'none'
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.backgroundColor = '#ffffff';
                                                        e.target.style.borderColor = '#10b981';
                                                        e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.backgroundColor = '#ecfdf5';
                                                        e.target.style.borderColor = '#10b981';
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                    name={`amountGoodCondition`}
                                                    value={findObjectInEbastContent(item).amountGoodCondition}
                                                    onChange={(e) => {
                                                        console.log("ini dari klik");
                                                        setloadingBaseQty(true);
                                                        doHandleChange(e, item.orderProductId);
                                                    }}
                                                />
                                                {findObjectInEbastContent(item).amountGoodError && (
                                                    <div class="invalid-feedback">
                                                        Jumlah barang telah sesuai.
                                                        <br /> kurangi jumlah{" "}
                                                        <span className="font-weight-bold">barang buruk</span> agar bisa
                                                        menambah jumlah{" "}
                                                        <span className="font-weight-bold"> barang baik</span>.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        {/* {item.qty === item.amountGoodConditionInputed ? ( */}
                                        {isEbastCetak == true ? (
                                            item.amountBadConditionInputed
                                        ) : (
                                            <div className="form-group" style={{ width: "90px" }}>
                                                <input
                                                    type="number"
                                                    max={item.qty}
                                                    min={0}
                                                    value={findObjectInEbastContent(item).amountBadCondition}
                                                    className={classNames("form-control", {
                                                        "is-invalid": findObjectInEbastContent(item).amountBadError,
                                                    })}
                                                    style={{
                                                        backgroundColor: '#fef3c7',
                                                        border: '2px solid #f59e0b',
                                                        borderRadius: '6px',
                                                        textAlign: 'center',
                                                        fontWeight: '600',
                                                        color: '#92400e',
                                                        fontSize: '1.1em',
                                                        transition: 'all 0.2s ease',
                                                        boxShadow: 'none'
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.backgroundColor = '#ffffff';
                                                        e.target.style.borderColor = '#f59e0b';
                                                        e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.backgroundColor = '#fef3c7';
                                                        e.target.style.borderColor = '#f59e0b';
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                    name={`amountBadCondition`}
                                                    onChange={(e) => {
                                                        console.log("ini dari klikbad");
                                                        setloadingBaseQty(true);
                                                        doHandleChange(e, item.orderProductId);
                                                    }}
                                                />
                                                {findObjectInEbastContent(item).amountBadError && (
                                                    <div class="invalid-feedback">
                                                        Jumlah barang telah sesuai.
                                                        <br /> kurangi jumlah{" "}
                                                        <span className="font-weight-bold">barang baik</span> agar bisa
                                                        menambah jumlah{" "}
                                                        <span className="font-weight-bold"> barang buruk</span>.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        {/* {item.qty === item.amountGoodConditionInputed ? ( */}
                                        {isEbastCetak == true ? (
                                            <p style={{ width: "185px" }}> {item.note || "-"}</p>
                                        ) : (
                                            <textarea
                                                onChange={(e) => {
                                                    console.log(e.target.value, findObjectInEbastContent(item));
                                                    doHandleChange(e, item.orderProductId);
                                                }}
                                                name={"note"}
                                                style={{ width: "250px" }}
                                                value={findObjectInEbastContent(item).note}
                                                className="form-control"
                                                rows="3"
                                            ></textarea>
                                        )}
                                    </td>
                                    <td>
                                        <h5>
                                            {isEbastCetak == true ? (
                                                <p> </p>
                                            ) : (
                                                <span
                                                    className={classNames("badge badge-pill", {
                                                        " badge-success": item.status === "rampung",
                                                        " badge-warning": item.status === "parsial",
                                                    })}
                                                >
                                                    {item.status}
                                                </span>
                                            )}
                                        </h5>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* {items.filter((item) => item.status === "rampung").length !== items.length && ( */}
                    {isEbastCetak == false && (
                        <div class="form-group">
                            <label for="">Upload foto barang</label>
                            
                            {/* Enhanced Multi-Select File Upload Area */}
                            <div 
                                className="file-upload-area"
                                style={{
                                    border: '2px dashed #ccc',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    textAlign: 'center',
                                    backgroundColor: '#f9f9f9',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    minHeight: '120px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.borderColor = '#007bff';
                                    e.currentTarget.style.backgroundColor = '#e3f2fd';
                                }}
                                onDragLeave={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.borderColor = '#ccc';
                                    e.currentTarget.style.backgroundColor = '#f9f9f9';
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.borderColor = '#ccc';
                                    e.currentTarget.style.backgroundColor = '#f9f9f9';
                                    
                                    const files = Array.from(e.dataTransfer.files);
                                    console.log("Dropped files:", files);
                                    console.log("Dropped files length:", files.length);
                                    
                                    const maxSize = 1 * 1024 * 1024; // 1 MB dalam bytes
                                    const validFiles = [];

                                    for (let i = 0; i < files.length; i++) {
                                        const file = files[i];
                                        console.log(`Processing dropped file ${i}:`, file);
                                        console.log(`File type: ${typeof file}, instanceof File: ${file instanceof File}`);
                                        
                                        if (file.type.startsWith('image/')) {
                                            if (file.size > maxSize) {
                                                toast.error(`File "${file.name}" melebihi 1 MB, tidak akan diupload.`, {
                                                    autoClose: 3000,
                                                    position: "top-right",
                                                    hideProgressBar: false,
                                                    closeOnClick: true,
                                                    pauseOnHover: true,
                                                    draggable: true,
                                                    progress: undefined,
                                                });
                                            } else {
                                                validFiles.push(file);
                                            }
                                        }
                                    }

                                    console.log("Valid dropped files:", validFiles);
                                    
                                    // Menambahkan file baru ke file yang sudah ada (tidak menimpa)
                                    setFilesGoodCondition(prev => {
                                        const newFiles = [...(prev || []), ...validFiles];
                                        console.log("New filesGoodCondition after drop:", newFiles);
                                        return newFiles;
                                    });
                                }}
                            >
                                <i className="fas fa-cloud-upload-alt" style={{ fontSize: '2rem', color: '#007bff', marginBottom: '10px' }}></i>
                                <div>
                                    <strong>Klik untuk memilih foto</strong> atau drag & drop di sini
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                                    Pilih beberapa foto sekaligus (CTRL + klik untuk multiple selection)
                                </div>
                            </div>
                            
                            <input
                                type="file"
                                className="form-control-file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                    const files = e.target.files;
                                    const maxSize = 1 * 1024 * 1024; // 1 MB dalam bytes

                                    console.log("Files selected:", files);
                                    console.log("Files length:", files?.length);
                                    console.log("Files type:", typeof files);
                                    console.log("Files constructor:", files?.constructor?.name);

                                    const validFiles = [];

                                    for (let i = 0; i < files.length; i++) {
                                        const file = files[i];
                                        console.log(`Processing file ${i}:`, file);
                                        console.log(`File type: ${typeof file}, instanceof File: ${file instanceof File}`);
                                        console.log(`File properties:`, {
                                            name: file.name,
                                            size: file.size,
                                            type: file.type,
                                            lastModified: file.lastModified
                                        });

                                        if (file.size > maxSize) {
                                            toast.error(`File "${file.name}" melebihi 1 MB, tidak akan diupload.`, {
                                                autoClose: 3000,
                                                position: "top-right",
                                                hideProgressBar: false,
                                                closeOnClick: true,
                                                pauseOnHover: true,
                                                draggable: true,
                                                progress: undefined,
                                            });
                                        } else {
                                            validFiles.push(file);
                                        }
                                    }

                                    console.log("Valid files to be added:", validFiles);
                                    console.log("Previous filesGoodCondition:", filesGoodCondition);

                                    // Menambahkan file baru ke file yang sudah ada (tidak menimpa)
                                    setFilesGoodCondition(prev => {
                                        const newFiles = [...(prev || []), ...validFiles];
                                        console.log("New filesGoodCondition will be:", newFiles);
                                        return newFiles;
                                    });
                                }}
                                multiple
                                accept="image/*"
                            />

                            <div className="mt-2">
                                <small className="d-block">
                                    <span className="text-danger">*</span>{" "}
                                    <b>Upload minimal 1 foto dengan ukuran max. 1 MB per foto</b>
                                </small>
                                {/* <small className="d-block">
                                    <span className="text-danger">*</span>{" "}
                                    <b>Tipe file yang dapat di unggah: JPEG, JPG, dan PNG</b>
                                </small>
                                <small className="d-block">
                                    <span className="text-danger">*</span>{" "}
                                    <b>Gunakan CTRL + klik untuk memilih beberapa foto sekaligus</b>
                                </small> */}
                            </div>

                            {/* Enhanced Preview Section */}
                            {filesGoodCondition?.length > 0 && (
                                <div className="mt-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h6 className="mb-0">Foto yang dipilih ({filesGoodCondition.length})</h6>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => {
                                                console.log("Clearing all files");
                                                setFilesGoodCondition([]);
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = "";
                                                }
                                            }}
                                        >
                                            <i className="fas fa-trash"></i> Hapus Semua
                                        </button>
                                    </div>
                                    {/* Debug logging */}
                                    {console.log("Current filesGoodCondition:", filesGoodCondition)}
                                    {console.log("Files type check:", filesGoodCondition.map((f, i) => ({ index: i, type: typeof f, isFile: f instanceof File, constructor: f?.constructor?.name })))}
                                    <div className="row">
                                        {filesGoodCondition.map((file, index) => {
                                            // Validasi file sebelum membuat URL
                                            if (!file || !(file instanceof File)) {
                                                console.warn(`Invalid file at index ${index}:`, file);
                                                return null;
                                            }

                                            let previewUrl;
                                            try {
                                                previewUrl = URL.createObjectURL(file);
                                            } catch (error) {
                                                console.error(`Error creating object URL for file ${index}:`, error);
                                                return null;
                                            }

                                            return (
                                                <div key={index} className="col-md-3 col-sm-4 col-6 mb-3">
                                                    <div className="card">
                                                        <div 
                                                            style={{
                                                                position: 'relative',
                                                                height: '150px',
                                                                overflow: 'hidden'
                                                            }}
                                                        >
                                                            <img
                                                                src={previewUrl}
                                                                alt={`Preview-${index}`}
                                                                className="card-img-top"
                                                                style={{ 
                                                                    width: '100%', 
                                                                    height: '100%', 
                                                                    objectFit: 'cover' 
                                                                }}
                                                                onLoad={() => {
                                                                    // Cleanup object URL setelah gambar dimuat untuk mencegah memory leak
                                                                    URL.revokeObjectURL(previewUrl);
                                                                }}
                                                                onError={() => {
                                                                    console.error(`Error loading image for file ${index}`);
                                                                    URL.revokeObjectURL(previewUrl);
                                                                }}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => {
                                                                    const updatedFiles = filesGoodCondition.filter((_, i) => i !== index);
                                                                    setFilesGoodCondition(updatedFiles);
                                                                    if (updatedFiles.length === 0 && fileInputRef.current) {
                                                                        fileInputRef.current.value = "";
                                                                    }
                                                                }}
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: '5px',
                                                                    right: '5px',
                                                                    width: '30px',
                                                                    height: '30px',
                                                                    padding: '0',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    borderRadius: '50%'
                                                                }}
                                                                title="Hapus foto"
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </div>
                                                        <div className="card-body p-2">
                                                            <small className="text-muted d-block" style={{ fontSize: '0.8rem' }}>
                                                                {file.name || 'Unknown file'}
                                                            </small>
                                                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                                {file.size ? (file.size / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown size'}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }).filter(Boolean)} {/* Filter out null values */}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="card-divider my-4"></div>
                    {eBast.history.length > 0 && (
                        <button
                            className="btn  btn-outline-primary btn-sm"
                            onClick={() => setOpenHistoryBast(!openHistoryBast)}
                        >
                            Lihat History Ebast
                        </button>
                    )}
                    <Collapse isOpen={openHistoryBast} className="mt-2">
                        <div class="row">
                            <div class="col-4">
                                <div class="list-group" id="list-tab" role="tablist">
                                    {historyEbast}
                                </div>
                            </div>
                            <div class="col-8">
                                <div class="tab-content" id="nav-tabContent">
                                    <h6>{nameSelected}</h6>
                                    <div
                                        class="tab-pane fade show active"
                                        id="list-home"
                                        role="tabpanel"
                                        aria-labelledby="list-home-list"
                                    >
                                        <ul>
                                            {historyEbastSelected.map((item) => (
                                                <li className="mb-2">
                                                    <div dangerouslySetInnerHTML={{ __html: item }}></div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Collapse>

                    <div className="row my-3">
                        <div className="col-12">
                            <small className="text-muted">
                                <span className="text-danger">*</span>Berikan <b>DENDA</b> jika pengiriman penyedia
                                terlalu lama
                            </small>
                            <h6>Denda keterlambatan sesuai dengan peraturan yang berlaku</h6>
                        </div>

                        <div className="col-md-6 my-3 ">
                            <label>Denda</label>
                            <div class="input-group">
                                {isEbastCetak == true ? (
                                    <input
                                        type="text"
                                        name="penaltyPrice"
                                        disabled={true}
                                        class="form-control "
                                        value={fine.value}
                                        prefix={"Rp "}
                                    />
                                ) : (
                                    <NumberFormat
                                        isNumericString={true}
                                        className="form-control"
                                        value={fine.value}
                                        disabled={!eBast.isSendPenalty}
                                        name="penaltyPrice"
                                        prefix={"Rp "}
                                        thousandSeparator={true}
                                        onValueChange={handleChangeFine}
                                    />
                                )}
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Per Hari</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 my-3">
                            <label>Lama Keterlambatan</label>
                            <div class="input-group">
                                {isEbastCetak == true ? (
                                    <input
                                        type="text"
                                        name="penaltyDay"
                                        disabled={true}
                                        class="form-control "
                                        value={longDelay}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        name="penaltyDay"
                                        disabled={!eBast.isSendPenalty}
                                        class="form-control "
                                        value={longDelay}
                                        onChange={doHandleChangeLongDelay}
                                        placeholder="Masukan lama keterlambatan"
                                    />
                                )}
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Hari</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 mt-2 mb-0">
                            <div class="form-group">
                                <label for="">Total Denda</label>
                                <NumberFormat
                                    isNumericString={true}
                                    className="form-control"
                                    value={total}
                                    prefix={"Rp "}
                                    thousandSeparator={true}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    {waitPreview}
                    <p>
                        Berita Acara Serah Terima ini berfungsi sebagai bukti serah terima hasil pekerjaan kepada{" "}
                        <strong>PIHAK KEDUA </strong>, untuk selanjutnya dicatat pada buku penerimaan barang sekolah.
                        Demikian Berita Acara Serah Terima ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana
                        seharusnya.
                    </p>

                    {isPreviewEbast === true && (
                        <button
                            type="button"
                            disabled={loadingBaseQty}
                            onClick={async () => {
                                await handlePreviewClick();
                            }}
                            className="btn btn-warning custome btn-md btn-block cart__checkout-button"
                        >
                            {loadingBaseQty ? "Loading..." : "Preview eBAST"}
                        </button>
                    )}
                    <hr />
                    {isSendEbast && (
                        <div className="row">
                            {/* isEbastConfirmPayment */}
                            {isEbastCetak === true && (
                                <div className="col-md-6">
                                    <AsyncAction
                                        action={doHandleProcessToPayment}
                                        render={({ run, loading }) => (
                                            <button
                                                type="button"
                                                onClick={run}
                                                className={classNames("btn btn-primary btn-block", {
                                                    "btn-loading": loading,
                                                })}
                                            >
                                                Lanjut Konfirmasi Pembayaran <i class="fas fa-sign-in-alt"></i>
                                            </button>
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

ModalEbast.propTypes = {
    isOpen: PropTypes.bool,
    toggle: PropTypes.func,
    eBast: PropTypes.object,
    items: PropTypes.array,
};

ModalEbast.defaultPropTypes = {
    isOpen: false,
    items: [],
};

export default ModalEbast;
