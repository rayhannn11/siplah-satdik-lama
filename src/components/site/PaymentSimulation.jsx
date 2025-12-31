import React, { useState, useEffect, useRef } from "react";

const PaymentSimulation = () => {
    const [invoice, setInvoice] = useState("");
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const debounceRef = useRef(null);
    const [showCheckBtn, setShowCheckBtn] = useState(true);

    // =============================
    //  🔥 Debounce 2 Detik Check VA
    // =============================
    // useEffect(() => {
    //     if (!invoice) {
    //         setInfo(null);
    //         return;
    //     }

    //     clearTimeout(debounceRef.current);
    //     debounceRef.current = setTimeout(() => {
    //         doHandleCheck();
    //     }, 2000);

    //     return () => clearTimeout(debounceRef.current);
    // }, [invoice]);

    // =============================
    //  ⚡ API Inquiry (CHECK VA)
    // =============================
    const doHandleCheck = () => {
        if (!invoice) return;

        setLoading(true);

        fetch(
            "https://payment.eurekabookhouse.co.id:8443/sandbox/gateway?bank=satdik_sandbox&type=va&methode=inquiry",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ virtualAccountNo: invoice }),
            }
        )
            .then((res) => res.json())
            .then((res) => {
                if (res.code === 200) {
                    setInfo(res.data);
                    setShowCheckBtn(false); // ⬅️ hide button setelah success
                } else {
                    setInfo(null);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    // =============================
    //  💰 API Payment (POSTING)
    // =============================
    const doHandleSendPayment = () => {
        if (!info?.order_id) return;

        setLoading(true);

        fetch(
            "https://payment.eurekabookhouse.co.id:8443/sandbox/gateway?bank=satdik_sandbox&type=va&methode=posting",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order_id: info.order_id }),
            }
        )
            .then((res) => res.json())
            .then((res) => {
                const success = Number(res.code) === 200;

                setAlertMessage(`
                    <div class="alert alert-${success ? "success" : "danger"}" role="alert">
                        <strong>${res.message}</strong>
                    </div>
                `);

                setLoading(false);
            });
    };

    // =============================
    //  🎨 INLINE STYLING (Professional)
    // =============================
    const boxStyle = {
        padding: "20px",
        borderRadius: "10px",
        background: "#ffffff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        marginTop: "20px",
    };

    const labelStyle = {
        fontWeight: "600",
        marginBottom: "5px",
        display: "block",
    };

    const infoRow = {
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 0",
        borderBottom: "1px solid #eee",
    };

    const infoVal = { fontWeight: "600", color: "#333" };

    return (
        <div className="container pt-5" style={{ maxHeight: "100vh" }}>
            <h4 className="text-center mb-4">Simulasi Pembayaran Virtual Account BRI</h4>

            <div className="col-12">
                <div dangerouslySetInnerHTML={{ __html: alertMessage }} />

                {/* INPUT VA */}
                <label style={labelStyle}>Masukan Virtual Account</label>

                <input
                    type="text"
                    className="form-control"
                    placeholder="Masukan Virtual Account ..."
                    value={invoice}
                    onChange={(e) => {
                        setInvoice(e.target.value);
                        setShowCheckBtn(true); // jika VA diganti, tampilkan lagi tombol cek
                        setInfo(null);
                    }}
                    style={{ fontSize: "16px", padding: "10px", borderRadius: "8px" }}
                />

                {/* BUTTON CHECK VIRTUAL ACCOUNT */}
                {showCheckBtn && (
                    <button
                        disabled={!invoice || loading}
                        onClick={doHandleCheck}
                        style={{
                            width: "100%",
                            padding: "12px",
                            fontSize: "16px",
                            fontWeight: 600,
                            marginTop: "12px",
                            borderRadius: "8px",
                            background: !invoice ? "#ccc" : "#007bff",
                            color: "white",
                            cursor: !invoice ? "not-allowed" : "pointer",
                            border: "none",
                        }}
                    >
                        {loading ? "Checking..." : "Check Virtual Account"}
                    </button>
                )}

                {/* LOADING */}
                {loading && (
                    <div style={{ marginTop: "15px", fontWeight: 600, color: "#007bff" }}>
                        Checking Virtual Account...
                    </div>
                )}

                {/* INFORMASI DETAIL */}
                {info && (
                    <div style={boxStyle}>
                        <h5 style={{ fontWeight: 700, marginBottom: "15px" }}>Informasi Pembayaran</h5>

                        <div style={infoRow}>
                            <span>Order ID:</span>
                            <span style={infoVal}>{info.order_id}</span>
                        </div>

                        <div style={infoRow}>
                            <span>Total Pembayaran:</span>
                            <span style={infoVal}>Rp {Number(info.total).toLocaleString()}</span>
                        </div>

                        <div style={infoRow}>
                            <span>Invoice:</span>
                            <span style={infoVal}>{info.invoice}</span>
                        </div>

                        <div style={infoRow}>
                            <span>Status Order:</span>
                            <span style={{ ...infoVal, color: info.status_order === "paid" ? "green" : "red" }}>
                                {info.status_order}
                            </span>
                        </div>

                        <div style={infoRow}>
                            <span>Nama Sekolah:</span>
                            <span style={infoVal}>{info.shipping_company}</span>
                        </div>

                        <button
                            onClick={doHandleSendPayment}
                            disabled={loading}
                            className="btn btn-success mt-3 w-100"
                            style={{ padding: "10px", fontSize: "16px", fontWeight: 600 }}
                        >
                            {loading ? "Memproses..." : "Bayar"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentSimulation;
