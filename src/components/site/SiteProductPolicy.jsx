// react
import React from "react";

// third-party
import { Helmet } from "react-helmet-async";

// data stubs
import theme from "../../data/theme";

function SiteProductPolicy() {
    return (
        <div className="block about-us mb-0 pb-5" style={{backgroundColor:'#E5E5E5'}}>
            <Helmet>
                <title>{`Kebijakan Produk — ${theme.name}`}</title>
            </Helmet>
            <div className="about-us__image" style={{ backgroundImage: 'url("images/aboutus.jpg")' }} />
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-xl-10">
                        <div className="about-us__body" style={{
                            borderRadius:'20px',boxShadow:'10px 10px 5px -5px rgba(0,0,0,.3)'
                        }}>
                            <h1 className="about-us__title text-primary">Kebijakan Produk</h1>
                            <div className="about-us__text typography text-justify">
                                <h5>KEBIJAKAN JENIS BARANG YANG DILARANG UNTUK DIPERDAGANGKAN</h5>
                                <p>
                                    Adalah tanggung jawab Penjual untuk memastikan bahwa barang yang mereka jual
                                    mematuhi semua undang-undang dan sesuai dengan ketentuan dan kebijakan Eureka
                                    BookHouse.
                                </p>
                                <p>
                                    Berikut adalah pedoman singkat untuk penjual tentang barang yang dilarang
                                    diperdagangkan di Eureka BookHouse. Eureka BookHouse akan memperbarui pedoman ini
                                    dari waktu ke waktu bila diperlukan.
                                </p>
                                <ol className="text-justify">
                                    <li>
                                        <h6>PELANGGARAN TERHADAP PERSYARATAN LAYANAN KAMI</h6>
                                        <p>
                                            Jika penjual melakukan pelanggaran terhadap Kebijakan Barang yang Dilarang
                                            Untuk Diperdagangkan maka penjual harus siap dikenai berbagai tindakan yang
                                            merugikan, seperti:
                                        </p>
                                        <ul>
                                            <li>Pemblokiran produk</li>
                                            <li>Menonaktifkan akun dalam jangka waktu 30 hari</li>
                                            <li>Penangguhan dan pengakhiran akun</li>
                                            <li>Tindakan hukum</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <h6>DAFTAR BARANG YANG DILARANG UNTUK DIPERDAGANGKAN</h6>
                                        <ol>
                                            <li>Barang/produk tidak asli atau kw</li>
                                            <li>
                                                Bahan yang diklasifikasikan sebagai Bahan Berbahaya menurut Peraturan
                                                Menteri Perdagangan yang berlaku
                                            </li>
                                            <li>
                                                Dokumen-dokumen resmi seperti Sertifikat Toefl, Ijazah, Surat Dokter,
                                                Kwitansi, dan lain sebagainya
                                            </li>
                                            <li>
                                                Barang-barang yang berpotensi melanggar: Barang-barang termasuk tetapi
                                                tidak terbatas pada replika, barang palsu, dan tiruan produk atau barang
                                                tanpa izin yang mungkin membahayakan pengguna, melanggar hak cipta,
                                                merek dagang tertentu, atau hak kekayaan intelektual lainnya milik pihak
                                                ketiga
                                            </li>
                                            <li>
                                                Publikasi, buku, film, video dan/atau video game yang tidak mematuhi
                                                hukum yang berlaku
                                            </li>
                                            <li>
                                                Barang-barang yang memuat konten dengan materi yang berpotensi
                                                menciptakan atau mempromosikan kebencian atau menghasut atau
                                                menyalahgunakan anak-anak atas dasar kepentingan politik, agama, jenis
                                                kelamin, orientasi seksual, ras, etnis, usia, atau cacat tubuh
                                            </li>
                                            <li>
                                                Produk binatang dan satwa liar (termasuk, dengan tidak terbatas pada,
                                                binatang liar)
                                            </li>
                                            <li>Barang dengan label yang salah</li>
                                            <li>Barang curian</li>
                                            <li>Barang yang diembargo</li>
                                            <li>Bahan yang cabul, menghasut atau berbau makar</li>
                                            <li>
                                                Barang yang berkaitan dengan pemerintah atau Polisi seperti lencana,
                                                tanda pangkat atau seragam (Atribut kepolisian)
                                            </li>
                                            <li>Artefak dan barang antik</li>
                                            <li>Mata uang termasuk, dengan tidak terbatas pada, mata uang digital</li>
                                            <li>
                                                Senjata api, senjata seperti semprotan merica, replika, airsoft gun, dan
                                                senjata bius, dsb
                                            </li>
                                            <li>
                                                Peralatan telekomunikasi, pengawasan elektronik dan peralatan elektronik
                                                serupa seperti TV kabel, pelaras acakan, pemindai radar, perangkat
                                                kendali sinyal lalu lintas, perangkat penyadapan dan perangkat penyadap
                                                telepon
                                            </li>
                                            <li>
                                                Produk tembakau atau terkait tembakau, termasuk dengan tidak terbatas
                                                pada rokok elektronik
                                            </li>
                                            <li>Alkohol</li>
                                            <li>
                                                Makanan yang berbahaya bagi kesehatan manusia (mengandung zat terlarang
                                                atau zat yang melebihi proporsi yang diizinkan, makanan yang tercemar)
                                            </li>
                                        </ol>
                                    </li>
                                </ol>
                                <p>
                                    Makanan yang tidak termasuk ke dalam kategori Makanan yang Dilarang di atas harus
                                    mematuhi standar minimum dan pedoman berikut ini:
                                </p>
                                <ol type="a">
                                    <li>
                                        Tanggal kedaluwarsa – semua makanan harus diberi label tanggal kedaluwarsa atau
                                        "gunakan sebelum" dengan jelas dan benar. Makanan yang sudah kedaluwarsa tidak
                                        boleh didaftarkan.
                                    </li>
                                    <li>
                                        Wadah tertutup – semua makanan dan produk terkait yang dijual di Situs harus
                                        dikemas atau ditutup untuk memastikan Pembeli dapat mengidentifikasi bukti
                                        adanya sabotase atau cacat.
                                    </li>
                                    <li>
                                        Makanan yang mudah rusak - Pengguna yang mendaftarkan barang yang mudah rusak
                                        harus menuliskan secara jelas pada bagian deskripsi barang langkah-langkah yang
                                        akan mereka ambil untuk memastikan barang tersebut dikemas dengan baik.
                                    </li>
                                </ol>
                                <p>
                                    Apabila Anda melihat daftar yang melanggar kebijakan kami, silakan laporkan kepada
                                    kami lewat email di{" "}
                                    <a href="http://" target="_blank" rel="noopener noreferrer">
                                        eurekabookhouse@gmail.com
                                    </a>
                                    . Ketika pelanggaran kebijakan terjadi, kami akan mengirimkan email, pesan sistem
                                    dan pemberitahuan push kepada Penjual untuk memberi tahu mereka bahwa daftar telah
                                    dihapus dari Situs Web kami. Kami juga akan mengirimkan pemberitahuan push kepada
                                    Pembeli tentang daftar tersebut. Anda bertanggung jawab untuk memastikan bahwa
                                    Pengaturan telepon Anda memungkinkan Anda untuk menerima pemberitahuan push.
                                </p>
                                <p>
                                    Apabila Anda memiliki pertanyaan lebih lanjut, Anda dapat menghubungi kami di 021
                                    87796010.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SiteProductPolicy;
