import React from "react";
import { connect } from "react-redux";

const AccountPageDetailSchool = (props) => {
    const { customer } = props;
    const { school } = customer;
    const { headmaster, bendahara } = school;

    return (
        <div class="card">
            <div class="card-header">
                <h4 className="card-title text-center">Data Sekolah</h4>
            </div>
            <div class="card-body">
                <div className="row">
                    <div className="col-md-3 text-center col-sm-12 mb-3">
                        <img
                            alt="logo kemdikbud"
                            src="https://siplah.eurekabookhouse.co.id/assets/image/logo-kemdikbud.png"
                            style={{ height: "150px" }}
                        />
                    </div>
                    <div className="col-md-9 col-sm-12">
                        <table class="table table-striped table-responsive-sm">
                            <tbody>
                                <tr>
                                    <th scope="row">Nama Sekolah </th>
                                    <td>:</td>
                                    <td>{school.name || "-"}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Email Sekolah </th>
                                    <td>:</td>
                                    <td>{school.email || "-"}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Telp Sekolah </th>
                                    <td>:</td>
                                    <td>{school.telephone || "-"}</td>
                                </tr>
                                <tr>
                                    <th scope="row">NPSP Sekolah </th>
                                    <td>:</td>
                                    <td>{school.npsn || "-"}</td>
                                </tr>
                                <tr>
                                    <th scope="row">NPWP Sekolah</th>
                                    <td>:</td>
                                    <td>{school?.npwp || "-"}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Alamat Sekolah</th>
                                    <td>:</td>
                                    <td>
                                        {school?.location?.address}, {school?.location?.village},{" "}
                                        {school?.location?.district?.name},{school?.location?.city.name},{" "}
                                        {school?.location?.province?.name} {school?.location?.postalCode}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Zona</th>
                                    <td>:</td>
                                    <td>{school?.location?.zone}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-12 mb-2">
                        <hr />
                    </div>
                    <div className="col-md-6 col-sm-12">
                        <h6>Kepala Sekolah</h6>
                        <table className="table table-striped ">
                            <tbody>
                                <tr>
                                    <th scope="row">Nama</th>
                                    <td>:</td>
                                    <td>{headmaster.name || "-"}</td>
                                </tr>
                                <tr>
                                    <th scope="row">NIP</th>
                                    <td>:</td>
                                    <td>{headmaster.nip || "-"}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Email</th>
                                    <td>:</td>
                                    <td>{headmaster.email || "-"}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="col-md-6 col-sm-12">
                        <h6>Bendahara Sekolah</h6>
                        <table className="table table-striped ">
                            <tbody>
                                <tr>
                                    <th scope="row">Nama</th>
                                    <td>:</td>
                                    <td>{bendahara.name || "-"}</td>
                                </tr>
                                <tr>
                                    <th scope="row">NIP</th>
                                    <td>:</td>
                                    <td>{bendahara.nip || "-"}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Email</th>
                                    <td>:</td>
                                    <td>{bendahara.email || "-"}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        customer: state.customer,
    };
};

export default connect(mapStateToProps, null)(AccountPageDetailSchool);
