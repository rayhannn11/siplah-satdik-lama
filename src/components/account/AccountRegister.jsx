import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import theme from "../../data/theme";

const AccountRegister = (props) => {
    return (
        <React.Fragment>
            <Helmet>
                <title>{`Daftar Penjual — ${theme.name}`}</title>
            </Helmet>

            <div className="block mt-3">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 d-flex">
                            <div className="card flex-grow-1 mb-md-0">
                                <div className="card-body">
                                    <img
                                        src="https://siplah.eurekabookhouse.co.id/assets/image/kemdikbud_anim.gif"
                                        alt=""
                                        className="w-50"
                                    />
                                    <h3 className="text-center">Daftar Penyedia SIPLah</h3>
                                    <h6 className="text-center mb-5">eurekabookhouse.co.id</h6>
                                    <form>
                                        <h5>1. Profil Toko</h5>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="nama-toko">Nama Toko</label>
                                                    <input
                                                        id="nama-toko"
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Nama toko"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div class="form-group">
                                                    <label for="jenisUsaha">Pilih Jenis Usaha</label>
                                                    <select class="form-control" id="jenisUsaha">
                                                        <option>Pilih Jenis Usaha</option>
                                                        <option>Individu</option>
                                                        <option>PT</option>
                                                        <option>CV</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div class="form-group">
                                                    <label for="kategoriUsaha">Pilih Kategori Usaha</label>
                                                    <select class="form-control" id="kategoriUsaha">
                                                        <option>Pilih Kategori Usaha</option>
                                                        <option>Koperasi</option>
                                                        <option>Usaha Mikro</option>
                                                        <option>Usaha Kecil</option>
                                                        <option>Usaha Menengah</option>
                                                        <option>Usaha Besar</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div class="form-group">
                                                    <label for="status">Status</label>
                                                    <select class="form-control" id="status">
                                                        <option>Pilih Status</option>
                                                        <option>NON PKP</option>
                                                        <option>PKP</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div class="form-group">
                                                    <label htmlFor="npwp">NPWP</label>
                                                    <input
                                                        id="npwp"
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Contoh : 99.999.999.9-999.999"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div class="form-group">
                                                    <label htmlFor="siup">SIUP/NIB</label>
                                                    <input
                                                        id="siup"
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="SIUP/NIB"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div class="form-group">
                                                    <label htmlFor="npwpScan">Scan NPWP</label>
                                                    <input id="npwpScan" type="file" className="form-control" />
                                                    <small className="form-text text-muted">
                                                        Gunakan file gambar berekstensi .jpg, maksimum ukuran 500kb
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                        <h5>2. Lokasi Toko</h5>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div class="form-group">
                                                    <label for="">Alamat Detail NPWP</label>
                                                    <input
                                                        type="text"
                                                        id=""
                                                        class="form-control"
                                                        placeholder="Alamat Detail NPWP"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div class="form-group">
                                                    <label for="">Provinsi</label>
                                                    <select class="form-control" id="">
                                                        <option>Pilih Provinsi</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div class="form-group">
                                                    <label for="">Kota/Kabupaten</label>
                                                    <select class="form-control" id="">
                                                        <option>Pilih Kota</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div class="form-group">
                                                    <label for="">Kecamatan</label>
                                                    <select class="form-control" id="">
                                                        <option>Pilih Kecamatan</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div class="form-group">
                                                    <label for="">Kode Pos</label>
                                                    <input
                                                        type="text"
                                                        id=""
                                                        class="form-control"
                                                        placeholder="Kode Pos"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <h5>3. Penanggung Jawab Toko</h5>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div class="form-group">
                                                    <label for="">Nama PIC</label>
                                                    <input
                                                        type="text"
                                                        class="form-control"
                                                        name=""
                                                        id=""
                                                        placeholder="Nama PIC"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div class="form-group">
                                                    <label for="">Jabatan PIC</label>
                                                    <input
                                                        type="text"
                                                        class="form-control"
                                                        name=""
                                                        id=""
                                                        placeholder="Jabatan PIC"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div class="form-group">
                                                    <label for="">Nomor Telepon</label>
                                                    <input
                                                        type="text"
                                                        class="form-control"
                                                        name=""
                                                        id=""
                                                        placeholder="No Telepon"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <h5>4. Bank Toko</h5>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div class="form-group">
                                                    <label for="">Nama Bank</label>
                                                    <select class="form-control" name="" id="">
                                                        <option>Pilih Bank</option>
                                                        <option>Mandiri</option>
                                                        <option>Bank Pribadi</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div class="form-group">
                                                    <label for="">Cabang Bank</label>
                                                    <input
                                                        type="text"
                                                        class="form-control"
                                                        name=""
                                                        id=""
                                                        placeholder="Cabang Bank"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div class="form-group">
                                                    <label for="">Nomor Rekening</label>
                                                    <input
                                                        type="text"
                                                        class="form-control"
                                                        name=""
                                                        id=""
                                                        placeholder="Nomor Rekening"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div class="form-group">
                                                    <label for="">Bank Holder</label>
                                                    <input
                                                        type="text"
                                                        class="form-control"
                                                        name=""
                                                        id=""
                                                        placeholder="Bank Holder"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <h5>5. Login Pengguna</h5>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div class="form-group">
                                                    <label for="">Email Toko</label>
                                                    <input
                                                        type="email"
                                                        class="form-control"
                                                        name=""
                                                        id=""
                                                        placeholder="Email Toko"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div class="form-group">
                                                    <label for="">Password</label>
                                                    <input
                                                        type="password"
                                                        class="form-control"
                                                        name=""
                                                        id=""
                                                        placeholder="Password"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div class="form-group">
                                                    <label for="">Password Konfirmasi</label>
                                                    <input
                                                        type="password"
                                                        class="form-control"
                                                        name=""
                                                        id=""
                                                        placeholder="Password Konfirmasi"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div class="form-check">
                                                    <label className="form-check-label">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            name=""
                                                            id=""
                                                            value="checkedValue"
                                                        />
                                                        Saya Setuju terhadap{" "}
                                                        <Link to="/site/terms-and-conditions">
                                                            Ketentuan Umum dan Persetujuan Penyedia
                                                        </Link>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-block mt-2 mt-md-3 mt-lg-4"
                                        >
                                            Daftar
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default AccountRegister;
