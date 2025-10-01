import React, { useState } from "react";

// third-party
import PropTypes from "prop-types";
import { Collapse } from "reactstrap";
import { ArrowRoundedDown7x5Svg } from "../../svg";
import { Link } from "react-router-dom";

const CardCompare = (props) => {
    const { selected, item } = props;
    const [state, setState] = useState({});
    const toggleDropdown = (targetName) => {
        if (!state[targetName]) {
            setState({
                ...state,
                [targetName]: {
                    tooltipOpen: true,
                },
            });
        } else {
            setState({
                ...state,
                [targetName]: {
                    tooltipOpen: !state[targetName].tooltipOpen,
                },
            });
        }
    };

    const isDropdownOpen = (targetName) => {
        return state[targetName] ? state[targetName].tooltipOpen : false;
    };

    const toggleCollapse = (targetName) => {
        if (!state[targetName]) {
            setState({
                [targetName]: {
                    tooltipOpen: true,
                },
            });
        } else {
            setState({
                [targetName]: {
                    tooltipOpen: !state[targetName].tooltipOpen,
                },
            });
        }
    };

    const isCollapseOpen = (targetName) => {
        return state[targetName] ? state[targetName].tooltipOpen : false;
    };

    return (
        <div class="card mb-3">
            <div
                className="card-header d-flex justify-content-between align-items-center"
                style={{
                    maxHeight: "60px",
                }}
            >
                <Link to="/store/CV Gupala" className="card-text font-weight-bold">
                    CV Gupala
                </Link>
                {selected ? (
                    <span class="badge badge-secondary">Terpilih</span>
                ) : (
                    ""
                    // <Dropdown isOpen={isDropdownOpen(`dropdown-${1}`)} toggle={() => toggleDropdown(`dropdown-${1}`)}>
                    //     <DropdownToggle className="custom border-0">
                    //         <Ellipsis />
                    //     </DropdownToggle>
                    //     <DropdownMenu>
                    //         <DropdownItem>Pilih</DropdownItem>
                    //         <DropdownItem>Hapus</DropdownItem>
                    //     </DropdownMenu>
                    // </Dropdown>
                )}
            </div>
            <div className="card-divider" />
            <div className="card-body">
                <div className="row my-3">
                    <div className="col-4">
                        <img
                            src="https://cdn.eurekabookhouse.co.id/ebh/product/all/0023710820.jpg"
                            alt=""
                            style={{ width: "75px" }}
                        />
                    </div>
                    <div className="col-8">
                        <small className="font-weight-bold">
                            BK SISWA TEMATIK TERPADU 1E: PENGALAMANKU/K13N-PENILAIAN
                        </small>
                        <br />
                        <small>Harga Barang : Rp 10.000</small> <br />
                        <small>Jumlah Barang : 2</small> <br />
                        <small>Total : Rp 10.000</small>
                        {/* <div className="row justify-content-between align-items-center mt-3">
                            <div className="col-10">
                                <InputNumber min={1} onChange={() => {}} />
                            </div>
                            <div className="col-">
                                <IconTrash />
                            </div>
                        </div> */}
                    </div>
                </div>
                {/* <button className="btn btn-md  btn-outline-secondary btn-block">Tambah Produk</button> */}
            </div>
            <div className="card-divider" />
            <div className="card-footer">
                <div className="d-flex justify-content-between align-items-center">
                    <div for="" className="font-weight-bold">
                        Kurir Pengiriman
                    </div>

                    <div for="" className="font-weight-bold">
                        JNE - Rp200.000
                    </div>

                    {/* <div>
                        <p className="font-weight-bold float-left mr-2">Rp 200.000</p>
                        <ArrowRoundedDown7x5Svg className="mt-2" />
                    </div> */}
                </div>
                <div
                    className="d-flex justify-content-between align-items-center"
                    style={{
                        cursor: "pointer",
                    }}
                    onClick={() => toggleCollapse(`collapse-${1}`)}
                >
                    <p className="font-weight-bold">Total Pesanan</p>
                    <div>
                        <p className="font-weight-bold float-left mr-2">Rp 200.000</p>
                        <ArrowRoundedDown7x5Svg className="mt-2" />
                    </div>
                </div>
                <Collapse isOpen={isCollapseOpen(`collapse-${1}`)}>
                    <div className="d-flex justify-content-between align-items-center">
                        <small>Jumlah barang</small>
                        <small className="font-weight-bold">1 barang</small>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                        <small>Berat</small>
                        <small className="font-weight-bold">15 kg</small>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                        <small>Sub Total</small>
                        <small className="font-weight-bold">Rp 8,090,910</small>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                        <small>PPN</small>
                        <small className="font-weight-bold">Rp 809,090 </small>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                        <small>Ongkos Kirim</small>
                        <small className="font-weight-bold">Rp 870,000</small>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                        <small>Diskon Ongkir</small>
                        <small className="font-weight-bold">-Rp 870,000</small>
                    </div>
                </Collapse>
            </div>
        </div>
    );
};

CardCompare.propTypes = {
    item: PropTypes.object,
    selected: PropTypes.bool,
};

export default CardCompare;
