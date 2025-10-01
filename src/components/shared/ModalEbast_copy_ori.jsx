import React, { useEffect, useState } from "react";

// third-party
import { Collapse } from "reactstrap";

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

const ModalEbast = (props) => {
    const {
        // isOpen,
        // toggle,
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

        istotalBarang,
        istotalQtyBaik,
        istotalQtyBuruk,
        istotalQtyTerima,
        loadingBaseQty,
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
    const [filesGoodCondition, setFilesGoodCondition] = useState(
        eBast.imageBastGoodCondition.length > 0 ? eBast.imageBastGoodCondition[0] : ""
    );
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

    useEffect(() => {}, [loadingBaseQty]);
    const handleChangeFine = (value) => {
        if (!eBast.isSendPenalty) return;
        setFine(value);
        setTotal(Number(value.floatValue) * Number(longDelay));
    };
    console.log(`ini dari modal loadingBaseQty`, loadingBaseQty);
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
    const doHandleChange = async (e, orderProductId) => {
        setloadingBaseQty(true);
        const { value, name } = e.target;
        console.log("value: " + value + "-" + name);
        const findData = findObjectInEbastContent({ orderProductId });
        if (name === "amountGoodCondition") {
            let valNumber = Number(value);
            if (valNumber > -1 && Number(findData.qty) >= valNumber + Number(findData.amountBadCondition)) {
                const tambah = valNumber == 0 ? 0 : valNumber;
                setQtyBaik(tambah);

                let assignProductsUpdate = productsUpdated;
                const findIndex = assignProductsUpdate.indexOf(findData);

                if (findIndex > -1) {
                    assignProductsUpdate[findIndex] = findData;
                } else {
                    assignProductsUpdate = [...assignProductsUpdate, findData];
                }
                console.log(`ini dari assignProductsUpdate`, assignProductsUpdate);
                setProductsUpdated(assignProductsUpdate);

                const TotalOK = Number(findData.amountGoodCondition) + Number(findData.amountBadCondition);
                if (TotalOK > 0) {
                    setDataValid(false);
                } else {
                    setDataValid(true);
                }
                setEbastContent([
                    ...ebastContent.filter((e) => e.orderProductId !== orderProductId),
                    { ...findData, [name]: valNumber, amountGoodError: false },
                ]);

                await updateEbast("qtybaik", Number(tambah), findData.orderProductId, eBast.bastID);
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
            setloadingBaseQty(true);
            if (valNumber > -1 && Number(findData.qty) >= valNumber + Number(findData.amountGoodCondition)) {
                const tambah = valNumber == 0 ? 0 : valNumber;
                setQtyRusak(tambah);

                let assignProductsUpdate = productsUpdated;
                const findIndex = assignProductsUpdate.indexOf(findData);

                if (findIndex > -1) {
                    assignProductsUpdate[findIndex] = findData;
                } else {
                    assignProductsUpdate = [...assignProductsUpdate, findData];
                }

                setProductsUpdated(assignProductsUpdate);

                Number(findData.qty);
                const TotalOK = Number(findData.amountGoodCondition) + Number(findData.amountBadCondition);
                if (TotalOK > 0) {
                    setDataValid(false);
                } else {
                    setDataValid(true);
                }

                updateEbast("qtyrusak", Number(tambah), findData.orderProductId, eBast.bastID);
                setEbastContent([
                    ...ebastContent.filter((e) => e.orderProductId !== orderProductId),
                    { ...findData, [name]: valNumber, amountBadError: false },
                ]);
            } else {
                setloadingBaseQty(true);
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
                        amountBadError: amountBadError,
                    },
                ]);
            }
        } else {
            setloadingBaseQty(true);
            setEbastContent([
                ...ebastContent.filter((e) => e.orderProductId !== orderProductId),
                { ...findData, [name]: value, orderProductId },
            ]);
        }
        setloadingBaseQty(false);
    };
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

    //             console.log(`ebastContent`,ebastContent)
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

    //            await updateEbast("qtyrusak", Number(tambah), findData.orderProductId, eBast.bastID);
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
    const waitPreview = (
        // isOpen={openPreview} centered toggle={() => setOpenPreview(!openPreview)}
        <Modal style={{ maxWidth: 900 }} isOpen={openPreview} centered toggle={() => setOpenPreview(!openPreview)}>
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
                                    <th>#</th>
                                    <th>Nama Barang/Jasa</th>
                                    <th>Jml Dipesan</th>
                                    <th className="bg-success bg-opacity-25">Jml Diterima Kondisi Baik</th>
                                    <th className="bg-danger bg-opacity-25">
                                        Jml Diterima Kondisi Rusak/Tidak diterima
                                    </th>
                                    <th>Catatan</th>
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
                                                {item.amountGoodConditionInputed}
                                            </p>
                                        </td>
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
                                                {item.amountBadConditionInputed}
                                            </p>
                                        </td>
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
                                                {item.note_terima}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
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
                        {istotalQtyTerima === istotalBarang && (
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
                                                    if (istotalQtyTerima === istotalBarang) {
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
    const findObjectInEbastContent = (obj) => ebastContent.find((d) => d.orderProductId === obj.orderProductId);

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
                                <th>#</th>
                                <th>Nama Barang</th>
                                <th>Jml Pesan</th>
                                <th className="bg-success bg-opacity-25">Jml Diterima Kondisi Baik</th>
                                <th className="bg-danger bg-opacity-25">Jml Diterima Kondisi Rusak/Tidak diterima</th>
                                {/* <th>Foto Terima</th> */}
                                <th>Catatan</th>
                                <th>Penerimaan</th>
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
                                            item.amountGoodConditionInputed
                                        ) : (
                                            <div className="form-group" style={{ width: "90px" }}>
                                                <input
                                                    type="number"
                                                    max={item.qty}
                                                    min={0}
                                                    className={classNames("form-control", {
                                                        "is-invalid": findObjectInEbastContent(item).amountGoodError,
                                                    })}
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
                                                onChange={(e) => doHandleChange(e, item.orderProductId)}
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
                            <input
                                type="file"
                                class="form-control-file"
                                name=""
                                onChange={(e) => setFilesGoodCondition(e.target.files)}
                                multiple={true}
                                placeholder=""
                            />
                            <small className="d-block mt-1">
                                <span className="text-danger">*</span>{" "}
                                <b>Upload minimal 1 foto dengan ukuran max. 5 MB per transaksi </b>
                            </small>
                            <small className="d-block mt-1">
                                <span className="text-danger">*</span>{" "}
                                <b>Tipe file yang dapat di unggah Jpeg, JPG, dan PNG</b>
                            </small>
                            <small className="d-block mt-1">
                                <span className="text-danger">*</span>{" "}
                                <b>Tekan CRTL+ Pilih foto untuk lebih dari 1 foto</b>
                            </small>
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
                            onClick={() => {
                                setIsLoading(true);
                                setFilesGoodCondition([]);

                                if (filesGoodCondition != "") {
                                    doHandlePreviewEbast(
                                        ebastContent,
                                        filesGoodCondition,
                                        file,
                                        fine.floatValue,
                                        longDelay
                                    );
                                    hit();
                                    setTimeout(() => {
                                        if (istotalQtyTerima != istotalBarang) {
                                            // if(!dataValid){
                                            setIsLoading(false);
                                            Swal.fire({
                                                text: "Jumlah Diterima baik dan Jumlah Rusak tidak valid.",
                                                icon: "warning",
                                                showCancelButton: false,
                                                confirmButtonColor: "#3085d6",
                                                confirmButtonText: "OK",
                                                reverseButtons: true,
                                            }).then((result) => {
                                                console.log("Line #983");
                                            });
                                        } else {
                                            if (filesGoodCondition == "") {
                                                setIsLoading(false);
                                                Swal.fire({
                                                    text: "Foto belum diupload, Upload minimal 1 foto barang dengan tipe file yang dapat di unggah Jpeg, JPG, dan PNG",
                                                    icon: "warning",
                                                    showCancelButton: false,
                                                    confirmButtonColor: "#3085d6",
                                                    confirmButtonText: "OK",
                                                    reverseButtons: true,
                                                }).then((result) => {});
                                            } else {
                                                console.log("Line #999");
                                                setIsLoading(false);
                                                setOpenPreview(!openPreview);
                                            }
                                        }
                                    }, 3000);
                                } else {
                                    setIsLoading(false);
                                    Swal.fire({
                                        text: "Foto belum diupload, Upload minimal 1 foto barang dengan tipe file yang dapat di unggah Jpeg, JPG, dan PNG",
                                        icon: "warning",
                                        showCancelButton: false,
                                        confirmButtonColor: "#3085d6",
                                        confirmButtonText: "OK",
                                        reverseButtons: true,
                                    }).then((result) => {
                                        console.log("Line #1012");
                                    });
                                }
                            }}
                            className={classNames("btn btn-warning custome btn-md btn-block cart__checkout-button")}
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
