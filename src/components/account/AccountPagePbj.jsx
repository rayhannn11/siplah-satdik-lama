import React from "react";
import { Helmet } from "react-helmet-async";
import theme from "../../data/theme";

const AccountPagePbj = (props) => {
    return (
        <div className="card">
            <Helmet>
                <title>{`Perencanaan PBJ — ${theme.name}`}</title>
            </Helmet>

            <div className="card-header text-center">
                <h5>Dalam Pengembangan</h5>
            </div>
            {/* <div className="card-header text-center">
                <h5>Daftar Perencanaan RKAS</h5>
            </div>

            <div className="card-divider" />
            <div className="card-table">
                <div className="table-responsive" style={{ fontSize: "14px" }}>
                    <table className="table-bordered">
                        <thead className="text-center">
                            <tr>
                                <th rowSpan={2}>#</th>
                                <th rowSpan={2}>No. Rekening</th>
                                <th rowSpan={2}>Uraian</th>
                                <th rowSpan={2}>Jumlah (dalam Rp)</th>
                                <th colSpan={4}>Triwulan</th>
                                <th rowSpan={2}>Keterangan</th>
                            </tr>
                            <tr>
                                <th>I</th>
                                <th>II</th>
                                <th>III</th>
                                <th>IV</th>
                            </tr>
                        </thead>
                        <tbody>
                            {true ? (
                                [1, 2, 3].map((item) => (
                                    <tr>
                                        <td>{item}</td>
                                        <td>xxxxxxx</td>
                                        <td>Pengembangan kompetensi lulusan</td>
                                        <td>xxx</td>
                                        <td>xxx</td>
                                        <td>xxx</td>
                                        <td>xxx</td>
                                        <td>xxx</td>
                                        <td>-</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9}>
                                        <h6 className="text-center my-2">Data Tidak Ditemukan</h6>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div> */}
        </div>
    );
};

export default AccountPagePbj;
