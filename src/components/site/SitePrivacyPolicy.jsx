/* eslint-disable no-unused-expressions */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
// react
import React from "react";

// third-party
import { Helmet } from "react-helmet-async";

// data stubs
import theme from "../../data/theme";

function SitePrivacyPolicy() {
    return (
        <div className="block about-us mb-0 pb-5" style={{backgroundColor:'#E5E5E5'}}>
            <Helmet>
                <title>{`Kebijakan Privasi — ${theme.name}`}</title>
            </Helmet>
            <div className="about-us__image" style={{ backgroundImage: 'url("images/aboutus.jpg")' }} />
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-xl-10">
                        <div className="about-us__body text-justify" style={{
                            borderRadius:'20px',boxShadow:'10px 10px 5px -5px rgba(0,0,0,.3)'}}>
                            <h1 className="about-us__title text-primary">Kebijakan Privasi</h1>
                            <div className="about-us__text typography text-justify">
                                <h5>1. PENDAHULUAN</h5>
                                <p>
                                    Selamat datang di platform Eureka BookHouse, adanya Kebijakan Privasi ini adalah
                                    komitmen nyata dari Eureka BookHouse untuk menghargai dan melindungi setiap data
                                    atau informasi pribadi Pengguna situs www.eurekabookhouse.co.id, situs-situs
                                    turunannya, serta aplikasi Eureka BookHouse (selanjutnya disebut sebagai "Situs").
                                </p>
                                <p>
                                    Dengan mengakses dan/atau mempergunakan layanan Eureka BookHouse, Pengguna
                                    menyatakan bahwa setiap data Pengguna adalah data yang benar dan sah, dan Pengguna
                                    memberikan persetujuan kepada Eureka BookHouse untuk memperoleh, mengumpulkan,
                                    menyimpan, mengelola dan mempergunakan data tersebut sebagaimana tercantum dalam
                                    Kebijakan Privasi maupun Syarat dan Ketentuan di dalam situs Eureka BookHouse.
                                </p>
                                <ol>
                                    <li>
                                        "Data Pribadi" berarti data, baik benar maupun tidak, tentang individu yang
                                        dapat diidentifikasi dari data tersebut, atau dari data dan informasi lainnya
                                        yang dapat atau kemungkinan dapat diakses oleh suatu organisasi. Contoh umum
                                        data pribadi dapat mencakup nama, nomor identifikasi dan informasi kontak.
                                    </li>
                                    <li>
                                        Dengan menggunakan Layanan, mendaftarkan akun pada Eureka BookHouse, mengunjungi
                                        situs web Eureka BookHouse, atau mengakses Layanan, pengguna mengakui dan setuju
                                        bahwa pengguna menerima praktik, persyaratan, dan/atau kebijakan yang diuraikan
                                        dalam Kebijakan Privasi ini, dan pengguna dengan ini mengizinkan Eureka
                                        BookHouse untuk mengumpulkan, menggunakan, mengungkapkan dan/atau mengolah data
                                        pribadi pengguna seperti yang dijelaskan di sini.
                                    </li>
                                    <li>
                                        Jika pengguna tidak mengizinkan pengolahan data pribadi seperti yang dijelaskan
                                        dalam kebijakan privasi ini, mohon jangan menggunakan layanan Eureka BookHouse
                                        atau mengakses situs web Eureka BookHouse.
                                    </li>
                                </ol>
                                <p>
                                    Silakan baca Kebijakan Privasi ini dengan cermat untuk membantu pengguna membuat
                                    keputusan yang tepat sebelum memberikan data pribadi pengguna kepada Eureka
                                    BookHouse.
                                </p>
                            </div>
                            <div className="about-us__text typography text-justify mt-4">
                                <h5>2. PENGUMPULAN DAN PEROLEHAN DATA PRIBADI PENGGUNA</h5>
                                <p>
                                    Eureka BookHouse mengumpulkan data pribadi pengguna dengan tujuan untuk memproses
                                    transaksi pengguna, mengelola dan memperlancar proses penggunaan Situs, serta
                                    tujuan-tujuan lainnya selama diizinkan oleh peraturan perundang-undangan yang
                                    berlaku.
                                </p>
                                <ol>
                                    <li>
                                        Data yang diserahkan secara mandiri oleh pengguna, meliputi :
                                        <ol>
                                            <li>
                                                Nama pengguna (username), alamat email, nomor telepon, alamat, foto,
                                                password, dan lain-lain yang Eureka BookHouse dapat ketika pengguna
                                                membuat atau memperbarui akun Eureka BookHouse.
                                            </li>
                                            <li>
                                                Data pengguna ketika pengguna melakukan interaksi dengan pengguna
                                                lainnya melalui fitur negosiasi, fitur komplain, diskusi produk, ulasan,
                                                rating, Pusat Resolusi dan sebagainya.
                                            </li>
                                            <li>
                                                Data pengguna ketika pengguna menghubungi Eureka BookHouse melalui
                                                customer support dan/atau layanan konsumen.
                                            </li>
                                            <li>
                                                Data pengguna ketika pengguna melakukan pengisian survei yang dikirimkan
                                                oleh Eureka BookHouse.
                                            </li>
                                            <li>
                                                Data pengguna ketika pengguna menggunakan layanan pada situs, termasuk
                                                data transaksi (jenis produk, jumlah produk, keterangan/deskripsi
                                                produk, jumlah transaksi, tanggal dan waktu transaksi serta detil
                                                transaksi lainnya).
                                            </li>
                                            <li>
                                                Data pengguna ketika pengguna melakukan transaksi pembayaran melalu
                                                situs, namun tidak terbatas pada data rekening bank, kartu kredit,
                                                virtual account, instant payment, internet banking, gerai ritel .
                                            </li>
                                            <li>
                                                Data pengguna ketika pengguna menggunakan fitur yang membutuhkan izin
                                                akses terhadap perangkat Pengguna.
                                            </li>
                                        </ol>
                                    </li>
                                    <li>
                                        Data yang terekam pada ketika Pengguna mempergunakan Situs, meliputi :
                                        <ol>
                                            <li>
                                                Data lokasi alamat IP, lokasi Wi-Fi, Geo-Location dan sebagainya baik
                                                lokasi secara riil atau perkiraannya.
                                            </li>
                                            <li>
                                                Data waktu setiap pengguna melakukan aktivitas, tidak terkecuali
                                                aktivitas pendaftaran, login, transaksi, dan lain sebagainya.
                                            </li>
                                            <li>
                                                Data yang diperoleh menggunakan cookies, pixel tags, dan teknologi,
                                                seperti data interaksi Pengguna saat menggunakan Situs, meliputi pilihan
                                                yang disimpan, serta pengaturan yang dipilih.
                                            </li>
                                            <li>
                                                Data catatan pada server, tidak terkecuali data seperti tanggal dan
                                                waktu akses, fitur atau laman aplikasi yang dilihat pengguna, alamat IP
                                                perangkat, jenis peramban dan proses kerja aplikasi dan aktivitas sistem
                                                lainnya.
                                            </li>
                                            <li>
                                                Data perangkat, meliputi jenis perangkat yang digunakan pengguna ketika
                                                mengakses Situs, termasuk model perangkat keras, perangkat lunak,
                                                pengenal perangkat unik, nama file dan versinya, sistem operasi dan
                                                versinya, pilihan bahasa, pengenal iklan, nomor seri, informasi jaringan
                                                seluler, dan/atau informasi gerakan perangkat.
                                            </li>
                                        </ol>
                                    </li>
                                    <li>
                                        Data yang didapatkan dari sumber lain, meliputi:
                                        <ol>
                                            <li>
                                                Data pengguna yang didapatkan dari Mitra Eureka BookHouse dalam
                                                mengembangkan dan menyajikan layanan-layanan, tidak terkecuali mitra
                                                penyedia layanan pembayaran, logistik atau kurir, dan mitra-mitra
                                                lainnya.
                                            </li>
                                            <li>Sumber lain yang tersedia secara umum.</li>
                                        </ol>
                                    </li>
                                </ol>
                                <p>
                                    Eureka BookHouse memiliki kebijakan untuk menggabungkan data yang diperoleh dari
                                    sumber tersebut dengan data lain yang dimiliki.
                                </p>
                            </div>
                            <div className="about-us__text typography text-justify mt-4">
                                <h5>3. DATA PRIBADI APA YANG AKAN DIKUMPULKAN OLEH EUREKA BOOKHOUSE?</h5>
                                <ol>
                                    <li>
                                        Data pribadi yang mungkin dikumpulkan Eureka BookHouse tidak terbatas pada:
                                        <ol>
                                            <li>nama</li>
                                            <li>alamat email.</li>
                                            <li>nomor telepon.</li>
                                            <li>tanggal lahir.</li>
                                            <li>jenis kelamin.</li>
                                            <li>alamat tagihan.</li>
                                            <li>rekening bank dan informasi pembayaran.</li>
                                            <li>
                                                informasi lain apapun tentang Pengguna saat Pengguna mendaftarkan diri
                                                untuk menggunakan Layanan atau situs Eureka BookHouse, dan saat Pengguna
                                                menggunakan Layanan atau situs web, serta informasi yang berkaitan
                                                dengan bagaimana Pengguna menggunakan Layanan atau situs web Eureka
                                                BookHouse. dan
                                            </li>
                                            <li>seluruh data tentang konten yang digunakan Pengguna.</li>
                                        </ol>
                                    </li>
                                </ol>
                            </div>
                            <div className="about-us__text typography text-justify mt-4">
                                <h5>4. MEMBUAT AKUN PENGGUNA</h5>
                                <ol>
                                    <li>
                                        Dengan ini pengguna menyatakan bahwa pengguna adalah orang yang mampu untuk
                                        mengikatkan dirinya dalam sebuah perjanjian yang sah menurut hukum.
                                    </li>
                                    <li>
                                        Untuk menggunakan fungsi tertentu dari Layanan, pengguna harus membuat akun
                                        pengguna yang mengharuskan pengguna untuk menyerahkan data pribadi tertentu yang
                                        mewajibkan pengguna untuk memberikan nama dan alamat email pengguna serta nama
                                        pengguna yang pengguna pilih kepada Eureka BookHouse.
                                    </li>
                                    <li>
                                        Eureka BookHouse juga berhak menanyakan informasi tertentu tentang diri pengguna
                                        seperti nomor telepon, alamat email, alamat pengiriman, identifikasi foto,
                                        rincian rekening bank, umur, tanggal lahir, jenis kelamin dan minat pengguna.
                                        Setelah mengaktifkan akun, pengguna akan memilih nama pengguna dan kata sandi.
                                        Nama pengguna dan kata sandi pengguna akan digunakan agar pengguna dapat
                                        mengakses dan mengelola akun pengguna dengan aman.
                                    </li>
                                </ol>
                            </div>
                            <div className="about-us__text typography text-justify mt-4">
                                <h5>5. MELIHAT HALAMAN WEB</h5>
                                <p>
                                    Sama seperti kebanyakan situs web, komputer pengguna mengirimkan informasi yang
                                    mungkin termasuk data pribadi tentang pengguna yang dicatat oleh server web saat
                                    pengguna menjelajahi situs Eureka BookHouse. Ini biasanya termasuk dengan tidak
                                    terbatas pada alamat IP komputer, sistem operasi, nama/versi peramban pengguna,
                                    halaman web perujuk, halaman yang diminta, tanggal/waktu, dan terkadang "cookie"
                                    (yang dapat dinonaktifkan dengan menggunakan preferensi peramban pengguna) guna
                                    membantu situs mengingat kunjungan terakhir pengguna. Apabila pengguna login,
                                    informasi ini dikaitkan dengan akun pribadi pengguna. Informasi juga disertakan
                                    dalam statistik anonim untuk memungkinkan Eureka BookHouse memahami bagaimana
                                    pengunjung menggunakan situs Eureka BookHouse.
                                </p>
                            </div>
                            <div className="about-us__text typography text-justify mt-4">
                                <h5>6. COOKIES</h5>
                                <p>
                                    Dari waktu ke waktu Eureka BookHouse mungkin mengimplementasikan "cookies" atau
                                    fitur lainnya guna memungkinkan Eureka BookHouse atau pihak ketiga untuk
                                    mengumpulkan atau berbagi informasi yang akan membantu Eureka BookHouse meningkatkan
                                    Situs Eureka BookHouse dan Layanan yang Eureka BookHouse tawarkan, atau membantu
                                    Eureka BookHouse menawarkan layanan dan fitur baru. “Cookies” adalah
                                    pengidentifikasi yang Eureka BookHouse transfer ke komputer atau perangkat lunak
                                    pengguna yang memungkinkan Eureka BookHouse mengenali komputer atau perangkat
                                    pengguna dan memberi tahu Eureka BookHouse bagaimana dan kapan Layanan atau situs
                                    web digunakan atau dikunjungi, oleh berapa banyak orang serta melacak pergerakan
                                    dalam situs web Eureka BookHouse. Eureka BookHouse dapat menautkan informasi cookie
                                    ke data pribadi. Cookies juga tertaut pada informasi tentang barang yang telah
                                    pengguna pilih untuk dibeli dan halaman yang telah pengguna lihat. Informasi ini
                                    misalnya digunakan untuk memantau keranjang belanja pengguna. Cookies juga digunakan
                                    untuk mengirimkan konten yang sesuai dengan minat pengguna dan memantau penggunaan
                                    situs web.
                                </p>
                            </div>
                            <div className="about-us__text typography text-justify mt-4">
                                <h5>7. SURVEI PENGGUNA</h5>
                                <p>
                                    Dari waktu ke waktu, Eureka BookHouse mungkin meminta informasi dari Pengguna
                                    melalui survei. Partisipasi dalam survei ini sepenuhnya bersifat sukarela dan
                                    karenanya pengguna memiliki pilihan untuk mengungkapkan informasi pengguna kepada
                                    Eureka BookHouse atau tidak. Informasi yang diminta dapat mencakup, dengan tidak
                                    terbatas pada, informasi kontak (seperti alamat email pengguna), dan informasi
                                    demografis (seperti minat atau tingkat usia). Informasi survei akan digunakan untuk
                                    tujuan memantau atau meningkatkan penggunaan dan kepuasan Layanan serta tidak akan
                                    dialihkan ke pihak ketiga, selain kontraktor Eureka BookHouse yang membantu pengguna
                                    mengelola atau menindaklanjuti survei.
                                </p>
                            </div>
                            <div className="about-us__text typography text-justify mt-4">
                                <h5>8. PENGGUNAAN INFORMASI PENGGUNA</h5>
                                <p>
                                    Eureka BookHouse dapat mengumpulkan, menggunakan, mengungkapkan dan/atau mengolah
                                    data pribadi pengguna untuk tujuan-tujuan berikut ini:
                                </p>
                                <ol>
                                    <li>
                                        Memproses segala bentuk permintaan, aktivitas maupun transaksi yang dilakukan
                                        oleh Pengguna melalui Situs, termasuk untuk keperluan pengiriman produk kepada
                                        Pengguna.
                                    </li>
                                    <li>
                                        Menghubungi pengguna untuk membantu dan/atau menyelesaikan proses transaksi
                                        maupun proses penyelesaian kendala, baik melalui email, surat, telepon, fax, dan
                                        lain-lain.
                                    </li>
                                    <li>
                                        Menawarkan Penyediaan fitur-fitur untuk memberikan, mewujudkan, memelihara dan
                                        memperbaiki produk dan layanan Eureka BookHouse, termasuk:
                                        <ul>
                                            <li>
                                                Menawarkan, memperoleh, menyediakan, atau memfasilitasi layanan
                                                marketplace, maupun produk-produk lainnya melalui Situs.
                                            </li>
                                            <li>
                                                Memungkinkan fitur untuk ‘mempribadikan’ akun Pengguna, seperti Wishlist
                                                dan Toko Favorit. dan/atau
                                            </li>
                                            <li>
                                                Melakukan kegiatan internal yang diperlukan untuk menyediakan layanan
                                                pada situs/aplikasi Eureka BookHouse, seperti melakukan analisis data,
                                                pengujian, penelitian, dan untuk memantau dan menganalisis kecenderungan
                                                penggunaan dan aktivitas guna meningkatkan keamanan dan keamanan
                                                layanan-layanan pada Situs, serta mengembangkan fitur dan produk baru.
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        Membantu pengguna ketika berkomunikasi dengan Eureka BookHouse, meliputi :
                                        <ul>
                                            <li>Memeriksa dan mengatasi permasalahan pengguna.</li>
                                            <li>
                                                Mengarahkan pertanyaan Pengguna kepada petugas Layanan Pelanggan yang
                                                tepat untuk mengatasi permasalahan.
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        Memungkinkan melakukan monitoring terhadap transaksi-transaksi mencurigakan atau
                                        transaksi yang terindikasi mengandung unsur kecurangan atau pelanggaran terhadap
                                        Syarat dan Ketentuan atau ketentuan hukum yang berlaku, serta melakukan
                                        investigasi terhadap tindakan-tindakan yang diperlukan sebagai tindak lanjut
                                        dari hasil monitoring tersebut.
                                    </li>
                                    <li>
                                        Menggunakan menggunakan informasi tersebut untuk mempromosikan dan memproses
                                        kontes dan undian, memberikan hadiah, serta menyajikan iklan dan konten yang
                                        relevan tentang layanan Eureka BookHouse.
                                    </li>
                                    <li>
                                        Dalam keadaan tertentu, Eureka BookHouse mungkin perlu untuk menggunakan ataupun
                                        mengungkapkan data Pengguna untuk tujuan penegakan hukum atau untuk pemenuhan
                                        persyaratan hukum dan peraturan yang berlaku, termasuk dalam hal terjadinya
                                        sengketa atau proses hukum antara Pengguna dan Eureka BookHouse.
                                    </li>
                                </ol>
                            </div>
                            <div className="about-us__text typography text-justify mt-4">
                                <h5>9. BERBAGI INFORMASI DARI LAYANAN PENGGUNA</h5>
                                <p>
                                    Layanan Eureka BookHouse memungkinkan pengguna untuk berbagi informasi pribadi
                                    mereka kepada satu sama lain, dalam hampir semua kesempatan tanpa keterlibatan
                                    Eureka BookHouse, untuk menyelesaikan transaksi. Dalam transaksi biasa, pengguna
                                    dapat memiliki akses ke nama, ID pengguna, alamat email serta informasi kontak dan
                                    pos lainnya dari pengguna lainnya.
                                </p>
                            </div>
                            <div className="about-us__text typography text-justify mt-4">
                                <h5>10. PERLINDUNGAN INFORMASI PENGGUNA</h5>
                                <p>
                                    Eureka BookHouse menerapkan berbagai langkah pengamanan untuk memastikan keamanan
                                    data pribadi pengguna di sistem Eureka BookHouse. Data pribadi pengguna berada di
                                    belakang jaringan yang aman dan hanya dapat diakses oleh sejumlah kecil karyawan
                                    yang memiliki hak akses khusus ke sistem tersebut. Apabila pengguna berhenti
                                    menggunakan Situs, atau izin pengguna untuk menggunakan Situs dan/atau Layanan
                                    diakhiri, Eureka BookHouse dapat terus menyimpan, menggunakan dan/atau mengungkapkan
                                    data pribadi pengguna sesuai dengan Kebijakan Privasi.
                                </p>
                            </div>
                            <div className="about-us__text typography text-justify mt-4">
                                <h5>11. BERBAGI INFORMASI PENGGUNA KEPADA PIHAK LUAR</h5>
                                <p>
                                    Eureka BookHouse akan/mungkin perlu mengungkapkan data pribadi pengguna kepada
                                    penyedia layanan pihak ketiga, agen dan/atau afiliasi atau perusahaan terkait Eureka
                                    BookHouse, dan/atau pihak ketiga lainnya, untuk satu atau lebih Tujuan yang
                                    disebutkan di atas. Pihak ketiga tersebut termasuk, dengan tidak terbatas pada:
                                </p>
                                <ol>
                                    <li>Anak perusahaan, afiliasi dan perusahaan terkait Eureka BookHouse.</li>
                                    <li>
                                        Penyedia layanan, agen, dan pihak ketiga lainnya yang Eureka BookHouse gunakan
                                        untuk mendukung bisnis Eureka BookHouse. Ini termasuk tetapi tidak terbatas pada
                                        mereka yang menyediakan layanan administratif atau lainnya kepada Eureka
                                        BookHouse seperti, jasa pos, perusahaan telekomunikasi, perusahaan teknologi
                                        informasi dan pusat data.
                                    </li>
                                    <li>
                                        Terjadi penggabungan, restrukturisasi, reorganisasi, pembubaran atau penjualan
                                        atau pengalihan lainnya atas beberapa atau semua aset Eureka BookHouse, baik
                                        secara berkelanjutan atau sebagai bagian dari kepailitan, likuidasi atau proses
                                        serupa, di mana data pribadi yang dimiliki oleh Eureka BookHouse tentang
                                        Pengguna Layanan adalah salah satu aset yang dialihkan; atau kepada rekanan
                                        dalam suatu transaksi aset bisnis yang melibatkan Eureka BookHouse atau salah
                                        satu afiliasi atau perusahaan terkaitnya.
                                    </li>
                                </ol>
                            </div>
                            <div className="about-us__text typography text-justify mt-4">
                                <h5>12. BERBAGI INFORMASI PENGGUNA KEPADA PIHAK LUAR</h5>
                                <p>
                                    Eureka BookHouse akan/mungkin perlu mengungkapkan data pribadi pengguna kepada
                                    penyedia layanan pihak ketiga, agen dan/atau afiliasi atau perusahaan terkait Eureka
                                    BookHouse, dan/atau pihak ketiga lainnya, untuk satu atau lebih Tujuan yang
                                    disebutkan di atas. Pihak ketiga tersebut termasuk, dengan tidak terbatas pada:
                                </p>
                                <ol>
                                    <li>Anak perusahaan, afiliasi dan perusahaan terkait Eureka BookHouse.</li>
                                    <li>
                                        Penyedia layanan, agen, dan pihak ketiga lainnya yang Eureka BookHouse gunakan
                                        untuk mendukung bisnis Eureka BookHouse. Ini termasuk tetapi tidak terbatas pada
                                        mereka yang menyediakan layanan administratif atau lainnya kepada Eureka
                                        BookHouse seperti, jasa pos, perusahaan telekomunikasi, perusahaan teknologi
                                        informasi dan pusat data.
                                    </li>
                                    <li>
                                        Terjadi penggabungan, restrukturisasi, reorganisasi, pembubaran atau penjualan
                                        atau pengalihan lainnya atas beberapa atau semua aset Eureka BookHouse, baik
                                        secara berkelanjutan atau sebagai bagian dari kepailitan, likuidasi atau proses
                                        serupa, di mana data pribadi yang dimiliki oleh Eureka BookHouse tentang
                                        Pengguna Layanan adalah salah satu aset yang dialihkan; atau kepada rekanan
                                        dalam suatu transaksi aset bisnis yang melibatkan Eureka BookHouse atau salah
                                        satu afiliasi atau perusahaan terkaitnya.
                                    </li>
                                </ol>
                            </div>
                            <div className="about-us__text typography text-justify mt-4">
                                <h5>13. INFORMASI YANG DIKUMPULKAN OLEH PIHAK KETIGA</h5>
                                <ol>
                                    <li>
                                        Situs Eureka BookHouse menggunakan Google Analytics, sebuah layanan analisis web
                                        yang disediakan oleh Google, Inc. ("Google"). Google Analytics menggunakan
                                        cookies, yaitu file teks yang ditaruh di komputer pengguna, untuk membantu situs
                                        web menganalisis bagaimana pengguna menggunakan Situs. Informasi yang hasilkan
                                        oleh cookie akan dikirimkan ke dan disimpan oleh Google di server di Amerika
                                        Serikat. Google dapat mengalihkan informasi ini kepada pihak ketiga bila
                                        diwajibkan. Google tidak akan mengaitkan alamat IP pengguna dengan data lain
                                        apapun yang dimiliki oleh Google.
                                    </li>
                                    <li>
                                        Eureka BookHouse, dan pihak ketiga, dari waktu ke waktu dapat menyediakan
                                        unduhan aplikasi perangkat lunak untuk pengguna yang memungkinkan pihak ketiga
                                        untuk melihat informasi identifikasi pengguna, seperti nama, ID pengguna, Alamat
                                        IP komputer pengguna atau informasi lainnya seperti cookies.
                                    </li>
                                </ol>
                            </div>
                            <div className="about-us__text typography text-justify mt-4">
                                <h5>14. KEAMANAN DAN SITUS PIHAK KETIGA</h5>
                                <p>
                                    Saat pengguna melakukan pesanan atau mengakses data pribadi pengguna, Eureka
                                    BookHouse menawarkan penggunaan server yang aman. Eureka BookHouse menerapkan
                                    langkah pengamanan untuk menjaga keamanan data pribadi pengguna yang Eureka
                                    BookHouse miliki atau berada di bawah kendali Eureka BookHouse. Namun Eureka
                                    BookHouse tidak menjamin keamanan data pribadi dan/atau informasi lain yang pengguna
                                    berikan di situs pihak ketiga.
                                </p>
                            </div>
                            <div className="about-us__text typography text-justify mt-4">
                                <h5>15. PENGHAPUSAN INFORMASI PENGGUNA</h5>
                                <p>
                                    Informasi pengguna bisa dan dapat Eureka BookHouse hapus dengan syarat pengguna
                                    memilih keluar atau berhenti dan mencabut persetujuan.
                                </p>
                                <p>
                                    Untuk mengubah langganan email pengguna, silakan informasikan ke Eureka BookHouse
                                    dengan mengirimkan email ke <a href=""> eurekabookhouse@gmail.com</a>.
                                </p>
                                <p>
                                    Pengguna dapat mencabut persetujuan untuk pengumpulan, penggunaan dan/atau
                                    pengungkapan data pribadi pengguna yang Eureka BookHouse miliki atau berada di bawah
                                    kendali Eureka BookHouse dengan mengirimkan email ke
                                    <a href=""> eurekabookhouse@gmail.com</a>.
                                </p>
                                <p>
                                    Setelah Eureka BookHouse menerima instruksi pencabutan yang jelas dan memverifikasi
                                    identitas pengguna, Eureka BookHouse akan memproses permintaan pengguna untuk
                                    pencabutan persetujuan, dan setelahnya Eureka BookHouse tidak akan mengumpulkan,
                                    menggunakan dan/atau mengungkapkan data pribadi pengguna dengan cara yang tercantum
                                    dalam permintaan pengguna.
                                </p>
                            </div>
                            <div className="about-us__text typography text-justify mt-4">
                                <h5>16. PEMBARUAN KEBIJAKAN PRIVASI</h5>
                                <p>
                                    Eureka BookHouse dapat sewaktu-waktu melakukan perubahan atau pembaruan terhadap
                                    Kebijakan Privasi ini. Dengan tetap mengakses dan menggunakan layanan situs maupun
                                    layanan Eureka BookHouse lainnya, maka pengguna dianggap menyetujui
                                    perubahan-perubahan dalam Kebijakan Privasi.
                                </p>
                            </div>
                            <div className="about-us__text typography text-justify mt-4">
                                <h5>17. HUBUNGI EUREKA BOOKHOUSE</h5>
                                <p>
                                    Apabila pengguna memiliki pertanyaan terkait Kebijakan Privasi Eureka BookHouse,
                                    silakan jangan ragu-ragu untuk menghubungi:{" "}
                                    <a href=""> eurekabookhouse@gmail.com</a>
                                </p>
                            </div>
                            <div className="about-us__text typography text-justify mt-4">
                                <h5>18. SYARAT DAN KETENTUAN</h5>
                                <p>
                                    Silakan baca juga Syarat & Ketentuan yang menetapkan penggunaan, penafian, dan
                                    batasan tanggung jawab yang mengatur penggunaan Situs dan Layanan serta kebijakan
                                    terkait lainnya.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SitePrivacyPolicy;
