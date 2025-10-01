import React, { useState } from "react";
const PaymentSimulation = () => {
    const [invoice, setInvoice] = useState("");
    const [check, setCheck] = useState(true);
    const [totalPayment, setTotalPayment] = useState();
    const [alertMessage, setAlertMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const doHandleCheck = () => {
        setLoading(true);
        fetch(`https://siplah.eurekabookhouse.co.id/staging/testing/simulatorPaymentBri/${invoice}`, {
            method: "get",
            headers: { "Content-Type": "application/json" },
        })
            .then((res) => res.json())
            .then((res) => {
                setTotalPayment(res.data);
                setLoading(false);
                setCheck(!check);
            });
    };
    const doHandleSendPayment = () => {
        setLoading(true);
        fetch(`https://siplah.eurekabookhouse.co.id/staging/testing/simulatorPaymentBri`, {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ invoice }),
        })
            .then((res) => res.json())
            .then((res) => {
                const { status } = res;
                if (Number(status.code) === 200) {
                    setAlertMessage(`<div class="alert alert-success" role="alert">
                    <strong>Pembayaran Virtual Account ${invoice} berhasil.</strong> 
                    </div>`);
                } else {
                    setAlertMessage(` <div class="alert alert-danger" role="alert">
                    <strong>Pembayaran Virtual Account ${invoice} gagal</strong> 
                    </div>
                    `);
                }
                setLoading(false);
            });
    };
    return (
        <div className="container pt-5" style={{ maxHeight: "100vh" }}>
            <h4 className="text-center">Simulasi Pembayaran Virtual Account BRI</h4>
            <div className="row justify-content-center align-items-center">
                <div className="col-12">
                    <div dangerouslySetInnerHTML={{ __html: alertMessage }}></div>
                    <div class="form-group">
                        <label for="">Masukan Virtual Account : </label>
                        <input
                            type="text"
                            class="form-control"
                            value={invoice}
                            onChange={(e) => setInvoice(e.target.value)}
                            placeholder="Masukan Virtual Account ..."
                        />
                    </div>
                    {/* {totalPayment !== undefined && <h6>Total Pembayaran : {totalPayment || "Rp. 0"} </h6>} */}
                    <input
                        type="number"
                        style={{
                            width: "30%",
                            padding: "10px",
                            fontSize: "16px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            outline: "none",
                            transition: "border-color 0.3s",
                        }}
                        placeholder="Masukkan Total Pembayaran"
                        onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                    />

                    {/* {check ? (
                        <button type="button" class="btn btn-primary" onClick={doHandleCheck}>
                            {loading ? "Loading..." : "Cek Total"}
                        </button>
                    ) : ( */}
                    <button type="button" class="btn btn-primary ml-2" onClick={doHandleSendPayment}>
                        {loading ? "Loading..." : "Bayar"}
                    </button>
                    {/* )} */}
                </div>
            </div>
        </div>
    );
};

export default PaymentSimulation;
