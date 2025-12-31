// react
import React, { useEffect, useState } from "react";

// third-party
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import customerApi from "../../api/customer";
import classNames from "classnames";

// data stubs
import theme from "../../data/theme";
import BlockLoader from "../blocks/BlockLoader";

function AccountPageDashboard(props) {
    const { customer } = props;
    const school = customer?.school ?? null;
    const [state, setState] = useState({
        dataIsLoading: true,
        data: null,
    });

    useEffect(() => {
        setState({ ...state, dataIsLoading: true });
        customerApi.getDashboard(customer?.token).then((res) => {
            const { data } = res;

            setState({ ...state, dataIsLoading: false, data });
        });
        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customer?.token]);

    if (state.dataIsLoading) {
        return <BlockLoader />;
    }
    const logs = state?.data?.listLogs?.map((log, index) => (
        <>
            <li class="list-group-item border-0" key={index}>
                <small style={{ fontSize: "15px" }} className="font-weight-bold">
                    {log.text} {log.createdAt}
                </small>
                <small className="d-block">{log.userAgent}</small>
                <small>IP: {log.ip || "-"}</small>
            </li>
            {state.data.listLogs.length - 1 !== index && <div className="card-divider"></div>}
        </>
    ));

    return (
        <div className="dashboard">
            <Helmet>
                <title>{`Dashboard — ${theme.name}`}</title>
            </Helmet>

            <div className="dashboard__profile card profile-card">
                <div className="card-body profile-card__body">
                    <div className="profile-card__avatar">
                        <img src="https://siplah.eurekabookhouse.co.id/assets/uplod/default-avatar.png" alt="" />
                    </div>
                    <div className="profile-card__name">{customer?.name}</div>
                    <div className="profile-card__email">{customer?.email}</div>
                </div>
            </div>
            <div className="dashboard__address card address-card address-card--featured">
                <div className="address-card__body">
                    <div className="address-card__name">Data Sekolah</div>
                    <div className="address-card__row">
                        <div className="address-card__row-content">{school?.name}</div>
                        <div className="address-card__row-title my-2">
                            {school?.location?.address}, {school?.location?.village}, {school?.location?.city?.name},{" "}
                            {school?.location?.province?.name}
                        </div>
                        <div className="address-card__row-title">Zona : {school?.location?.zone}</div>
                    </div>
                    <div className="address-card__footer">
                        <Link to="/account/address">Lokasi Sekolah</Link>
                    </div>
                </div>
            </div>
            {/* order status */}
            <div className="container mt-2">
                <div
                    className="row"
                    style={{
                        minWidth: "100%",
                        fontSize: "18px",
                    }}
                >
                    {state?.data?.total?.map((t, index) => (
                        <div
                            key={index}
                            className="col-3 p-2"
                            style={{
                                borderRadius: "12px",
                                background: "#ffffff",
                                border: "1px solid #E5E7EB",
                                boxShadow: "0px 2px 6px rgba(0,0,0,0.03)",
                            }}
                        >
                            <div
                                className="d-flex flex-md-column flex-sm-row justify-content-center align-items-center text-center"
                                style={{
                                    gap: "10px",
                                    padding: "10px 0",
                                }}
                            >
                                {/* ICON */}
                                <div
                                    dangerouslySetInnerHTML={{ __html: t.icon }}
                                    style={{
                                        fontSize: "30px",
                                        color: "#6B7280", // gray-500 modern
                                    }}
                                />

                                {/* TEXT SECTION */}
                                <div style={{ lineHeight: "1.3" }}>
                                    {/* NAME */}
                                    <small
                                        style={{
                                            fontWeight: "600",
                                            display: "block",
                                            color: "#111827", // gray-900 modern
                                        }}
                                    >
                                        {t.name}
                                    </small>

                                    {/* BADGE */}
                                    <span
                                        className="badge"
                                        style={{
                                            fontSize: "14px",
                                            marginTop: "10px",
                                            marginBottom: "6px",
                                            padding: "7px 12px",
                                            borderRadius: "6px",
                                            background: "linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)", // blue → indigo
                                            color: "#ffffff",
                                            fontWeight: "600",
                                            letterSpacing: "0.3px",
                                            display: "inline-block",
                                        }}
                                    >
                                        {t.value}
                                    </span>

                                    {/* RP VALUE */}
                                    <div
                                        style={{
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            marginTop: "6px",
                                            color: "#10B981",
                                        }}
                                    >
                                        {t?.rupiah ?? "Rp0"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* log aktifitas */}
            <div className="profile-card dashboard__profile mt-2 card">
                <div className="card-header">
                    <h5>Log Aktifitas</h5>
                </div>
                <div className="card-divider"></div>
                <ul class="list-group border-0">{logs}</ul>
            </div>
            {/* daftar pengguna */}
            <div className="dashboard__address mt-2 card address-card address-card--featured">
                <div className="card-header">
                    <h5 className="card-title">Daftar Pengguna</h5>
                </div>
                <div className="card-divider"></div>
                <ul class="list-group border-0">
                    {state?.data?.listUsers?.map((user) => (
                        <>
                            <li class="list-group-item border-0">
                                <small style={{ fontSize: "15px" }} className="font-weight-bold">
                                    {user.name}
                                </small>
                                <small className="d-block">Jabatan: {user.position || "-"}</small>

                                <span
                                    className={classNames("badge badge-pill text-uppercase", {
                                        "badge-success": user.isActive,
                                        "badge-secondary": user.isActive === false,
                                    })}
                                >
                                    {user.isActive ? "Online" : "Offline"}
                                </span>
                            </li>
                            <div className="card-divider"></div>
                        </>
                    ))}
                </ul>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        customer: state.customer,
    };
};

export default connect(mapStateToProps, null)(AccountPageDashboard);
