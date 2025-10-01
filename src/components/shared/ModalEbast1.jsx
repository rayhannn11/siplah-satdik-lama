import React, { useState } from "react";

// third-party
import { Collapse } from "reactstrap";

import classNames from "classnames";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";
import AsyncAction from "./AsyncAction";
import ZoomImage from "./ZoomImage";
import Swal from "sweetalert2";

const ModalEbast = (props) => {
    const {
        // isOpen,
        // toggle,
        eBast,
        invoice,
        isEbastComplete,
        items,
        isSendEbast,
        // doHandleSendPenalty,
        isEbastConfirmPayment,
        doHandleSendEbast,
        doHandleProcessToPayment,
    } = props;
    const [fine, setFine] = useState({ value: eBast.penalty.price || "", floatValue: 0 });
    const [longDelay, setLongDelay] = useState(eBast.penalty.day ?? 0);
    const [total, setTotal] = useState(eBast.penalty.total ?? 0);
    const [file, setFile] = useState({}),
        [activeIndex, setActiveIndex] = useState(0);
    const [filesGoodCondition, setFilesGoodCondition] = useState([]);
    const [openHistoryBast, setOpenHistoryBast] = useState(false);
    const [cekList, setCekList] = useState(false);
    const [nameSelected, setNameSelected] = useState(eBast.history.length > 0 ? eBast.history[0].name : "");
    // const [historyEbastSelected, setHistoryEbastSelected] = useState(eBast.history[0].items ?? []);
    const [historyEbastSelected, setHistoryEbastSelected] = useState(
        eBast.history.length > 0 ? eBast.history[0].items : []
    );
    const [ebastContent, setEbastContent] = useState(
        items.map((item) => ({
            orderProductId: item.orderProductId,
            amountGoodCondition: eBast.history.length > 0 ? item.amountGoodConditionInputed : item.amountGoodCondition,
            amountBadCondition: eBast.history.length > 0 ? item.amountBadConditionInputed : item.amountBadCondition,
            qty: item.qty,
            note: item.note ?? "",
            amountBadError: false,
            amountGoodError: false,
            status: item.status,
        }))
    );

    const handleChangeFine = (value) => {
        if (!eBast.isSendPenalty) return;
        setFine(value);
        setTotal(Number(value.floatValue) * Number(longDelay));
    };
    
    function cekMengerti(){  
        setCekList(!cekList)
    };
    const doHandleChangeLongDelay = (e) => {
        if (!eBast.isSendPenalty) return;
        const { value } = e.target;
        setLongDelay(value);
        setTotal(Number(value) * Number(fine.floatValue));
    };
    const doHandleChange = (e, orderProductId) => {
        const { value, name } = e.target;
        const findData = findObjectInEbastContent({ orderProductId });
        if (name === "amountGoodCondition") {
            let valNumber = Number(value);
            if (valNumber > -1 && Number(findData.qty) >= valNumber + Number(findData.amountBadCondition)) {
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
                setEbastContent([
                    ...ebastContent.filter((e) => e.orderProductId !== orderProductId),
                    { ...findData, [name]: valNumber, amountBadError: false },
                ]);
            } else {
                let amountBadError = false;
                if (Number(findData.amountBadCondition) === Number(findData.qty)) {
                    amountBadError = false;
                } else if (valNumber + Number(findData.amountGoodCondition) > Number(findData.qty)) {
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
            setEbastContent([
                ...ebastContent.filter((e) => e.orderProductId !== orderProductId),
                { ...findData, [name]: value, orderProductId },
            ]);
        }
    };

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
    return (
        <>
            {/* <Modal isOpen={isOpen} size="xl" centered>
         <ModalHeader toggle={() => toggle("ebast")}> */}
            {/* <img
                src="https://siplah.eurekabookhouse.co.id/assets/image/siplah-logo-min.png"
                style={{ width: "150px" }}
                alt=""
            /> */}
            {/* </ModalHeader>
             <ModalBody> */}
            <div class="card">
                <div class="card-body">
                    <h4 class="card-title text-center mb-0">PEMERIKSAAN PESANAN</h4>
                    <p>
                        Hasil pemeriksaan akan mencetak BAST sebagaimana dibawah ini. Satuan Pendidikan harap kembali memeriksa keterangan pada dokumen berikut sebelum mencetak BAST untuk
                        memastkan kesesuaian pesanan. Setelah cetak, dokumen BAST bersifat <b>FINAL</b> , dan Satuan Pendidikan/Penyedia dihimbau untuk tidak melakukan perubahan apapun
                        terhadap dokumen final.
                    </p>
                    <hr/>
                    <h4 class="card-title text-center mb-0">BERITA ACARA SERAH TERIMA ONLINE</h4>
                    <p class="card-text text-center">No. {eBast.bastNumber} </p>
                    <p>
                        Pada hari ini, <br /> {eBast.date}, sesuai dengan:
                    </p>
                    <div>
                        <strong>Kode Pesanan</strong> : {invoice}
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
                                <th>Jumlah</th>
                                <th>Jumlah Baik</th>
                                <th>Jumlah Buruk</th>
                                <th>Foto Terima</th>
                                <th>
                                    Catatan
                                </th>
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
                                        {item.qty === item.amountGoodConditionInputed ? (
                                            item.amountGoodConditionInputed
                                        ) : (
                                            <div className="form-group" style={{ width: "165px" }}>
                                                <input
                                                    type="text"
                                                    max={item.qty}
                                                    className={classNames("form-control", {
                                                        "is-invalid": findObjectInEbastContent(item).amountGoodError,
                                                    })}
                                                    name={`amountGoodCondition`}
                                                    value={findObjectInEbastContent(item).amountGoodCondition}
                                                    onChange={(e) => doHandleChange(e, item.orderProductId)}
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
                                        {item.qty === item.amountGoodConditionInputed ? (
                                            item.amountBadConditionInputed
                                        ) : (
                                            <div className="form-group" style={{ width: "165px" }}>
                                                <input
                                                    type="text"
                                                    value={findObjectInEbastContent(item).amountBadCondition}
                                                    max={item.qty}
                                                    className={classNames("form-control", {
                                                        "is-invalid": findObjectInEbastContent(item).amountBadError,
                                                    })}
                                                    name={`amountBadCondition`}
                                                    onChange={(e) => doHandleChange(e, item.orderProductId)}
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
                                        {item.isUploadedBastBadCondition ? (
                                            <div style={{ width: "165px" }}>
                                                <ZoomImage index={index} images={[item.imageBastBadCondition]} />
                                            </div>
                                        ) : (
                                            ebastContent.find((e) => e.orderProductId === item.orderProductId)[
                                                "amountBadCondition"
                                            ] > 0 && (
                                                <div className="form-group" style={{ width: "165px" }}>
                                                    <input
                                                        type="file"
                                                        name={item.orderProductId}
                                                        className="form-control-file mt-2"
                                                        id=""
                                                        onChange={(e) => {
                                                            const { files, name } = e.target;
                                                            setFile({ ...file, [name]: files[0] });
                                                        }}
                                                        placeholder=""
                                                        aria-describedby="fileHelpId"
                                                    />
                                                    {/* <button
                                                            disabled={!file[item.orderProductId]}
                                                            onClick={() =>
                                                                doHandleUploadBadProductImg(file, item.orderProductId)
                                                            }
                                                            type="button"
                                                            class="btn btn-primary btn-block btn-sm mt-1"
                                                        >
                                                            <i class="fa fa-upload mr-2" aria-hidden="true"></i>
                                                            Upload
                                                        </button> */}
                                                    <small className="text-left">
                                                        <span className="text-danger">*</span>upload foto barang rusak.
                                                    </small>
                                                </div>
                                            )
                                        )}
                                    </td>
                                    <td>
                                        {item.qty === item.amountGoodConditionInputed ? (
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
                                            <span
                                                className={classNames("badge badge-pill", {
                                                    " badge-success": item.status === "rampung",
                                                    " badge-warning": item.status === "parsial",
                                                })}
                                            >
                                                {item.status}
                                            </span>
                                        </h5>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {items.filter((item) => item.status === "rampung").length !== items.length && (
                        <div class="form-group">
                            <label for="">Upload foto barang yang diterima dalam keadaan baik</label>
                            <input
                                type="file"
                                class="form-control-file"
                                name=""
                                onChange={(e) => setFilesGoodCondition(e.target.files)}
                                multiple={true}
                                placeholder=""
                            />
                            <small className="d-block mt-1">
                                <span className="text-danger">*</span> Upload minimal 1 foto saat update bast
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
                                <span className="text-danger">*</span>Berikan <b>DENDA</b> jika pengiriman penyedia terlalu
                                lama
                            </small>
                            <h6>Denda keterlambatan sesuai dengan peraturan yang berlaku</h6>
                        </div>

                        <div className="col-md-6 my-3 ">
                            <label>Denda</label>
                            <div class="input-group">
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
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Per Hari</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 my-3">
                            <label>Lama Keterlambatan</label>
                            <div class="input-group">
                                <input
                                    type="text"
                                    name="penaltyDay"
                                    disabled={!eBast.isSendPenalty}
                                    class="form-control "
                                    value={longDelay}
                                    onChange={doHandleChangeLongDelay}
                                    placeholder="Masukan lama keterlambatan"
                                />
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
                        {/* <div className="col-12 d-flex flex-row justify-content-end align-items-end">
                            <AsyncAction
                                action={() =>
                                    doHandleSendPenalty({ penaltyPrice: fine.floatValue, penaltyDay: longDelay })
                                }
                                render={({ run, loading }) => (
                                    <button
                                        type="button"
                                        title="kirim denda"
                                        onClick={run}
                                        className={classNames("btn btn-sm btn-danger", {
                                            "btn-loading": loading,
                                        })}
                                    >
                                        Kirim Denda
                                    </button>
                                )}
                            />
                        </div>
                   */}
                    </div>
                    <p>
                        Berita Acara Serah Terima ini berfungsi sebagai bukti serah terima hasil pekerjaan kepada{" "}
                        <strong>PIHAK KEDUA</strong>, untuk selanjutnya dicatat pada buku penerimaan barang sekolah.
                        Demikian Berita Acara Serah Terima ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana
                        seharusnya.
                    </p>
                    <hr/>
                    {isSendEbast && (
                        <div className="row">
                     { !isEbastComplete && (
                        <p style={{marginLeft:30, color:'#09539C'}}>
                        {/* <input type="radio" onChange={e =>setCekList(!cekList)} class="form-check-input"   />Dengan ini Satuan Pendidikan menyatakan bahwa pesanan telah sesuai dan <b>FINAL</b> sehingga BAST dapat dicetak atas pesanan ini. (Ceklist untuk melanjutkan) */}
                        
                        <input type="radio" onChange={cekMengerti} class="form-check-input"  checked={cekList}  />Dengan ini Satuan Pendidikan menyatakan bahwa pesanan telah sesuai dan <b>FINAL</b> sehingga BAST dapat dicetak atas pesanan ini. (Ceklist untuk melanjutkan)
                        </p>
                        )}   
                            { cekList === true ?
                            !isEbastComplete && (
                                <> 
                                
                                <div
                                    className={classNames("", {
                                        "col-md-12": !isEbastConfirmPayment,
                                        "col-md-6": isEbastConfirmPayment,
                                    })}
                                >
                                    {/* <AsyncAction
                                        action={() => {
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
                                                        doHandleSendEbast(
                                                            ebastContent,
                                                            filesGoodCondition,
                                                            file,
                                                            fine.floatValue,
                                                            longDelay
                                                        )
                                                    }
                                                });  
                                            } 
                                        }
                                        render={({ run, loading }) => (
                                            <button
                                                type="button"
                                                onClick={run}
                                                className={classNames("btn btn-block", {
                                                    "btn-loading": loading,
                                                    "btn-dark": historyEbastSelected.length > 0,
                                                    "btn-primary": historyEbastSelected.length === 0,
                                                })}
                                            >
                                                {historyEbastSelected.length > 0 ? "Update" : "Cetak"} eBAST
                                            </button>
                                        )}
                                    /> */}
                                    <button
                                                type="button"
                                                onClick={() => {
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
                                                            doHandleSendEbast(
                                                                ebastContent,
                                                                filesGoodCondition,
                                                                file,
                                                                fine.floatValue,
                                                                longDelay
                                                            )
                                                        }
                                                    });  
                                                 } 
                                                }
                                                className={classNames("btn btn-block", { 
                                                    "btn-dark": historyEbastSelected.length > 0,
                                                    "btn-primary": historyEbastSelected.length === 0,
                                                })}
                                            >
                                                {historyEbastSelected.length > 0 ? "Update" : "Cetak"} eBAST
                                            </button>
                                </div>
                                </>
                            )
                            :
                            <></>}
                            {isEbastConfirmPayment && (
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
            {/* </ModalBody>
        </Modal> */}
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
