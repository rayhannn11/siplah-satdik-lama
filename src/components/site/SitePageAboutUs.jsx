// react
import React from "react";

// third-party
import { Helmet } from "react-helmet-async";

// data stubs
import theme from "../../data/theme";

function SitePageAboutUs() {
    return (
        <div className="block about-us mb-0 pb-5" style={{backgroundColor:'#E5E5E5'}}>
            <Helmet>
                <title>{`Tentang — ${theme.name}`}</title>
            </Helmet>
            <div className="about-us__image" style={{ backgroundImage: 'url("images/aboutus.jpg")' }} />
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-xl-10">
                        <div className="about-us__body text-justify" style={{
                            borderRadius:'20px',boxShadow:'10px 10px 5px -5px rgba(0,0,0,.3)'
                        }}>
                            <h1 className="about-us__title text-primary">Tentang SIPLah</h1>
                            <div className="about-us__text typography text-justify mb-4">
                                <p>
                                    TENTANG SIPLAH Kementerian Pendidikan dan Kebudayaan menyelenggarakan program
                                    Bantuan Operasional Sekolah (BOS) Reguler, yang selanjutnya disingkat BOS Reguler,
                                    yaitu program Pemerintah Pusat untuk penyediaan pendanaan biaya operasi personalia
                                    dan non-personalia bagi sekolah yang bersumber dari dana alokasi khusus nonfisik.
                                </p>
                                <p>
                                    Untuk itu, Kementerian Pendidikan dan Kebudayaan telah merancang suatu Sistem
                                    Informasi Pengadaan Sekolah (SIPLah) untuk digunakan dalam PBJ (Pengadaan Barang dan
                                    Jasa) sekolah yang dilakukan secara daring (Online Marketplace). SIPLah dirancang
                                    untuk memanfaatkan Sistem Pasar Daring (Online Marketplace) yang dioperasikan oleh
                                    pihak ketiga. Sistem pasar daring yang dapat dikategorikan sebagai SIPLah harus
                                    memiliki fitur tertentu untuk merealisasikan rencana kerja anggaran sekolah dan
                                    memenuhi kebutuhan Kementerian Pendidikan dan Kebudayaan dalam mengawasi penggunaan
                                    dana BOS sesuai dengan ketentuan yang berlaku.
                                </p>
                                <p>
                                    Penyaluran dana BOS Reguler dilakukan tiap triwulan, bagi wilayah dengan geografis
                                    yang sulit dijangkau, penyaluran dana BOS Reguler dilakukan tiap semester.
                                </p>
                            </div>
                            <div className="about-us__text typography text-justify">
                                <ol>
                                    <li>
                                        Sekolah sudah bisa melakukan login dan browsing/menjelajah katalog dengan
                                        melakukan pemutakhiran akun Dapodik terlebih dahulu. Panduan Pemutakhiran Akun
                                        Dapodik
                                    </li>
                                    <li>Keputusan Menteri tentang SIPLah Lihat Disini</li>
                                    <li>Surat Edaran SIPLah Lihat Disini</li>
                                    <li>Petunjuk Teknis Bantuan Operasional Sekolah Reguler Lihat Disini</li>
                                    <li>Katalog Sektoral Buku Nonteks 2019 Lihat Disini</li>
                                    <li>Pengadaan Barang/Jasa di Sekolah melalui SIPLah Lihat Disini</li>
                                </ol>
                                <p>
                                    Layanan SIPLah tersedia selama hari kerja Senin s.d. Sabtu dan selama jam kerja
                                    (09.00 – 17.00 WIB).
                                </p>
                                <p>
                                    Pusat Layanan SIPLah di Unit Layanan Terpadu, Gedung C Lantai 1, Kompleks Gedung
                                    Kementerian Pendidikan dan Kebudayaan, Jl Jend. Sudirman, Senayan, Jakarta.
                                </p>
                            </div>
                            <h5 className="mt-3">EKOSISTEM BISNIS</h5>
                            <p>
                                Pemilik SIPLah adalah Unit Kerja Pengadaan Barang/Jasa (UKPBJ) Kementerian Pendidikan
                                dan Kebudayaan.
                            </p>
                            <p>
                                PT Metraplasa adalah mitra SIPLah yang ditunjuk oleh Kementerian Pendidikan dan
                                Kebudayaan.
                            </p>
                            <p>Aplikasi SIPLah dapat digunakan oleh:</p>
                            <ol>
                                <li>
                                    Pelaku Usaha, individu atau badan hukum, sebagai Penyedia Barang dan Jasa Sekolah.
                                </li>
                                <li>
                                    Sekolah, yang diwakili Kepala Sekolah dan/atau Bendahara BOS, sebagai Pembeli Barang
                                    dan Jasa Sekolah.
                                </li>
                                <li>
                                    Direktorat Teknis Kementerian Pendidikan dan Kebudayaan sebagai Pengawas PBJ
                                    Sekolah.
                                </li>
                            </ol>
                            <p>Ekosistem Bisnis dalam SIPLah akan melibatkan peran dan institusi sebagai berikut:</p>
                            <ol>
                                <li>
                                    Pemilik SIPLah :
                                    <ol>
                                        <li>
                                            Unit Kerja Pengadaan Barang/Jasa (UKPBJ) Kementerian Pendidikan dan
                                            Kebudayaan.
                                        </li>
                                    </ol>
                                </li>
                                <li>
                                    Mitra SIPLah :
                                    <ol>
                                        <li>Mitra Sistem Pasar Daring.</li>
                                        <li>Mitra Sistem Pembayaran.</li>
                                    </ol>
                                </li>
                                <li>
                                    Pengguna SIPLah :
                                    <ol>
                                        <li>
                                            Pelaku Usaha, individu atau badan hukum, sebagai Penyedia Barang dan Jasa
                                            Sekolah Sekolah.
                                        </li>
                                        <li>
                                            Sekolah, yang diwakili Kepala Sekolah dan/atau Bendahara BOS, sebagai
                                            Pembeli Barang dan Jasa Sekolah Sekolah.
                                        </li>
                                        <li>
                                            Direktorat Teknis Kementerian Pendidikan dan Kebudayaan sebagai Pengawas PBJ
                                            Sekolah.
                                        </li>
                                    </ol>
                                </li>
                            </ol>
                            <h5 className="mt-3">SKEMA BISNIS</h5>
                            <p>Skema bisnis SIPLah adalah sebagai berikut:</p>
                            <ol>
                                <li>
                                    Sekolah dapat melakukan proses PBJ secara daring melalui SIPLah dengan metode
                                    pemilihan Pembelian Langsung dengan nilai paling banyak Rp50.000.000,- (lima puluh
                                    juta rupiah) per transaksi.
                                </li>
                                <li>
                                    Pembayaran oleh sekolah harus dilakukan secara non-tunai sesuai dengan ketentuan
                                    yang berlaku tentang BOS Non Tunai.
                                </li>
                                <li>
                                    Pembayaran secara non-tunai dilakukan melalui Mitra Sistem Pasar Daring dan harus
                                    diteruskan ke rekening milik Penyedia Barang dan Jasa Sekolah paling lambat 1 x 24
                                    jam setelah pembayaran diverifikasi Mitra Sistem Pasar Daring.
                                </li>
                                <li>
                                    Mitra Sistem Pasar Daring harus menyediakan layanan rekonsiliasi antara belanja dan
                                    pembayaran.
                                </li>
                                <li>
                                    Kementerian Pendidikan dan Kebudayaan tidak menerapkan skema insentif keuangan dalam
                                    bentuk apapun dengan Mitra Sistem Pasar Daring dan Pengguna SIPLah.
                                </li>
                                <li>
                                    Mitra Sistem Pasar Daring tidak diperkenakan melakukan pengenaan pungutan biaya
                                    dan/atau komisi dalam skema apapun kepada Pengguna SIPLah.
                                </li>
                                <li>
                                    Mitra Sistem Pasar Daring diperkenankan memperoleh manfaat baik finansial maupun non
                                    finansial dengan skema yang tidak membebani Pengguna dan Pemilik SIPLah.
                                </li>
                                <li>
                                    Sistem Informasi Pengadaan Sekolah (SIPLah) adalah sistem elektronik yang dapat
                                    digunakan oleh sekolah untuk melaksanakan proses Pengadaan Barang dan Jasa Sekolah
                                    (PBJ) secara daring yang dananya bersumber dari dana BOS.
                                </li>
                                <li>
                                    SIPLah memfasilitasi sekolah untuk mencari informasi dan melakukan pembelian Barang
                                    dan Jasa Sekolah, melakukan pemantauan pemenuhan pesanan, melaksanakan pembayaran
                                    non tunai, dan mengelola dokumentasi proses serta bukti transaksi PBJ.
                                </li>
                            </ol>
                            <p>
                                SIPLah menjadi media interaksi daring antara sekolah sebagai pembeli dengan penyedia
                                Barang dan Jasa Sekolah sebagai penjual. SIPLah menjadi alat bantu supervisi proses PBJ
                                oleh Kepala Sekolah dan/atau Bendahara Sekolah.
                            </p>
                            <p>
                                SIPLah memenuhi kebutuhan Kementerian Pendidikan dan Kebudayaan dalam melakukan
                                pengawasan atas proses pengadaan Barang dan Jasa Sekolah sekolah serta realisasi
                                penggunaan dana BOS sesuai dengan ketentuan yang berlaku.
                            </p>
                            <p>
                                SIPLah dapat meningkatkan akuntabilitas, transparansi dan efektifitas serta pengawasan
                                PBJ sekolah yang dananya bersumber dari Dana BOS Kementerian Pendidikan dan Kebudayaan.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SitePageAboutUs;
