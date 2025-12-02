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
                <div className="row" style={{ minWidth: "100%", fontSize: "18px" }}>
                    {state?.data?.total?.map((t, index) => (
                        <div className={classNames("p-2 border col-3")}>
                            <div className="d-flex flex-md-column flex-sm-row justify-content-center align-items-center">
                                <div dangerouslySetInnerHTML={{ __html: t.icon }} />
                                <div>
                                    <small className="pl-1">{t.name}</small>
                                    <span class="badge badge-primary ml-1">{t.value}</span>
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
