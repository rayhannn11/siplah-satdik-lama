// react
import React from "react";

// third-party
import { Helmet } from "react-helmet-async";

// data stubs
import theme from "../../data/theme";

function SiteTermsAndConditions() {
    return (
        <div className="block about-us mb-0 pb-5" style={{backgroundColor:'#E5E5E5'}}>
            <Helmet>
                <title>{`Syarat dan Ketentuan — ${theme.name}`}</title>
            </Helmet>
            <div className="about-us__image" style={{ backgroundImage: 'url("images/aboutus.jpg")' }} />
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-xl-10">
                        <div className="about-us__body text-justify" style={{
                            borderRadius:'20px',boxShadow:'10px 10px 5px -5px rgba(0,0,0,.3)'}}>
                            <h1 className="about-us__title text-primary">SYARAT & KETENTUAN</h1>
                            <div className="about-us__text typography text-justify">
                                <h5>Selamat datang di website siplah.eurekaBookhouse.co.id</h5>
                                <p>
                                    Pengguna disarankan membaca dengan seksama terkait Syarat & ketentuan yang
                                    ditetapkan di bawah ini karena dapat berdampak kepada hak dan kewajiban pengguna.
                                </p>
                                <p>
                                    Dengan mengakses dan/atau mempergunakan layanan Eureka Bookhouse, Pengguna
                                    menyatakan bahwa setiap data Pengguna adalah data yang benar dan sah, dan Pengguna
                                    memberikan persetujuan kepada Eureka Bookhouse untuk memperoleh, mengumpulkan,
                                    menyimpan, mengelola dan mempergunakan data tersebut sebagaimana tercantum dalam
                                    Kebijakan Privasi maupun Syarat dan Ketentuan di dalam situs Eureka Bookhouse.
                                </p>
                                <ol>
                                    <li>
                                        <h6>DEFINISI</h6>
                                        <p>
                                            Syarat & ketentuan dalam hal ini diartikan sebagai perjanjian antara
                                            pengguna dengan Eureka Bookhouse dimana di dalamnya dimuat seperangkat
                                            peraturan yang mengatur hak, kewajiban, tanggung jawab pengguna dan Eureka
                                            Bookhouse, tidak terkecuali tata cara penggunaan sistem layanan Eureka
                                            Bookhouse yang berisikan :
                                        </p>
                                        <ol>
                                            <li>Situs SIPLah Eureka Bookhouse adalah siplah.eurekaBookhouse.co.id.</li>
                                            <li>
                                                Pengguna adalah pihak yang menggunakan layanan Eureka Bookhouse,
                                                termasuk namun tidak terbatas pada pembeli, penjual ataupun pihak lain
                                                yang sekedar berkunjung ke Situs Eureka Bookhouse.
                                            </li>
                                            <li>
                                                Penjual adalah pengguna terdaftar yang membuka toko dan/atau melakukan
                                                penawaran atas suatu barang/produk kepada para pengguna situs Eureka
                                                Bookhouse.
                                            </li>
                                            <li>
                                                Pembeli adalah pengguna terdaftar yang melakukan permintaan atas
                                                barang/produk yang dijual oleh penjual di situs Eureka Bookhouse.
                                            </li>
                                            <li>
                                                Barang adalah benda fisik yang berwujud dan dapat diantar memenuhi
                                                kriteria pengiriman oleh perusahaan jasa pengiriman barang.
                                            </li>
                                            <li>
                                                Saldo penghasilan adalah fasilitas penampungan sementara atas dana milik
                                                penjual (bukan fasilitas penyimpanan dana), yang disediakan Eureka
                                                Bookhouse untuk menampung dana hasil penjualan barang/produk pada situs
                                                Eureka Bookhouse. Dana ini hanya dapat ditarik ke akun bank yang
                                                terdaftar dan tidak dapat digunakan kembali untuk melakukan pembelian
                                                pada situs Eureka Bookhouse.
                                            </li>
                                            <li>
                                                Rekening resmi Eureka Bookhouse adalah rekening bersama yang disepakati
                                                oleh Eureka Bookhouse dan para pengguna untuk proses transaksi jual beli
                                                di situs Eureka Bookhouse.
                                            </li>
                                        </ol>
                                    </li>
                                    <li>
                                        <h6>PRIVASI</h6>
                                        <p>
                                            Di Eureka Bookhouse, privasi pengguna sangatlah penting. Untuk melindungi
                                            hak-hak pengguna dengan lebih baik, silakan baca Kebijakan Privasi untuk
                                            memahami bagaimana Eureka Bookhouse mengumpulkan dan menggunakan informasi
                                            yang berkaitan dengan Akun Anda dan/atau penggunaan Layanan oleh Anda
                                            (“Informasi Pengguna”).
                                        </p>
                                        <p>
                                            <b>
                                                Dengan menggunakan layanan atau memberikan informasi di situs, pengguna:
                                            </b>
                                        </p>
                                        <ol>
                                            <li>
                                                Menyetujui dan mengakui bahwa hak kepemilikan atas informasi pengguna
                                                dimiliki secara bersama oleh pengguna dan Eureka Bookhouse;
                                            </li>
                                            <li>
                                                Menyetujui tindakan Eureka Bookhouse untuk mengumpulkan, menggunakan,
                                                mengungkapkan dan/atau mengolah Konten, data pribadi dan Informasi
                                                Pengguna sebagaimana dijelaskan dalam Kebijakan Privasi; dan
                                            </li>
                                            <li>
                                                Tidak akan, baik secara langsung maupun tidak langsung, mengungkapkan
                                                informasi pengguna kepada setiap pihak ketiga, atau sebaliknya
                                                memperbolehkan setiap pihak ketiga untuk mengakses atau menggunakan
                                                informasi pengguna, tanpa persetujuan tertulis sebelumnya dari Eureka
                                                Bookhouse.
                                            </li>
                                        </ol>
                                    </li>
                                    <li>
                                        <h6>IZIN TERBATAS</h6>
                                        <p>Dengan menggunakan atau mengakses layanan, pengguna setuju :</p>
                                        <ol>
                                            <li>
                                                Mematuhi hak cipta, merek dagang, merek layanan, yang berlaku lainnya
                                                yang melindungi Layanan, Situs dan Kontennya;
                                            </li>
                                            <li>
                                                Tidak menyalin, mendistribusikan, mempublikasikan ulang, mengirimkan,
                                                menampilkan secara terbuka, melakukan secara terbuka, mengubah,
                                                menyesuaikan, menyewa, menjual, atau membuat karya turunan dari bagian
                                                apapun dari Layanan, Situs atau Kontennya;
                                            </li>
                                            <li>
                                                Tidak akan menggunakan robot, spider atau perangkat otomatis maupun
                                                proses manual lain apapun untuk memantau atau menyalin konten Eureka
                                                Bookhouse, tanpa persetujuan tertulis sebelumnya dari kami (persetujuan
                                                tersebut dianggap diberikan untuk teknologi mesin pencari standar yang
                                                digunakan oleh situs web pencari Internet guna mengarahkan pengguna
                                                Internet ke situs web ini);
                                            </li>
                                            <li>
                                                Tidak akan me-mirror atau membingkai bagian apapun atau seluruh konten
                                                situs ini di server lain mana pun atau sebagai bagian dari situs web
                                                lain apapun.
                                            </li>
                                        </ol>
                                    </li>
                                    <li>
                                        <h6>AKUN</h6>
                                        <p>
                                            Akun yang dijelaskan di sini adalah akun pengguna (baik sebagai penjual
                                            dan/atau pembeli). Pengguna dengan ini menyatakan bahwa pengguna adalah
                                            orang yang mampu untuk mengikatkan dirinya dalam sebuah perjanjian yang sah
                                            menurut hukum.
                                        </p>
                                        <ol>
                                            <li>
                                                Pengguna tidak dipungut biaya pendaftaran apapun dari Eureka Bookhouse;
                                            </li>
                                            <li>
                                                Pengguna yang telah mendaftar berhak bertindak sebagai: Pembeli atau
                                                Penjual (memanfaatkan layanan buka toko).
                                            </li>
                                        </ol>
                                        <p>
                                            Pengguna, baik sebagai pembeli atau penjual, wajib mematuhi syarat dan
                                            ketentuan yang telah ditetapkan oleh situs Eureka Bookhouse, tidak
                                            terkecuali : menciptakan dan/atau menggunakan perangkat, software, fitur
                                            dan/atau alat lainnya yang bertujuan untuk melakukan manipulasi pada sistem
                                            Eureka Bookhouse, termasuk tidak terbatas manipulasi data toko, kegiatan
                                            otomatisasi dalam transaksi, jual-beli, promosi dan aktivitas lain yang
                                            secara wajar dapat masuk dalam penilaian sebagai tindakan manipulasi sistem;
                                        </p>
                                        <p>
                                            Dengan ini pengguna (penjual atau pembeli) menyatakan bahwa Eureka Bookhouse
                                            tidak bertanggung jawab atas kerugian ataupun kendala apapun yang timbul
                                            atas penyalahgunaan akun pengguna yang diakibatkan oleh kelalaian pengguna,
                                            termasuk memberikan atau memperlihatkan kode verifikasi (OTP), password atau
                                            email kepada pihak lain, meminjamkan atau memberikan akses akun kepada pihak
                                            lain, maupun kelalaian pengguna lainnya yang mengakibatkan kerugian ataupun
                                            kendala pada akun pengguna.
                                        </p>
                                    </li>
                                    <li>
                                        <h6>PASSWORD DAN KEAMANAN AKUN PENGGUNA</h6>
                                        <p>
                                            Selama pengguna (penjual dan/atau pembeli) menggunakan dan melakukan
                                            aktivitas di situs, maka pengguna setuju :
                                        </p>
                                        <ol>
                                            <li>
                                                Menjaga kerahasiaan kata sandi pengguna (termasuk ID dan password/kata
                                                sandi);
                                            </li>
                                            <li>
                                                Memberi tahu Eureka Bookhouse tentang penggunaan tanpa izin atas akun,
                                                ID pengguna dan/atau kata sandi pengguna. Eureka Bookhouse tidak akan
                                                bertanggung jawab untuk setiap kerugian atau kerusakan yang timbul dari
                                                penggunaan tanpa izin atas kata sandi pengguna atau kegagalan pengguna
                                                untuk mematuhi Bagian ini.
                                            </li>
                                            <li>Memastikan bahwa informasi akun pengguna akurat dan terkini;</li>
                                            <li>
                                                Atas kebijakannya sendiri, Eureka Bookhouse berhak menangguhkan atau
                                                mengakhiri akun pengguna apabila pengguna memilih ID pengguna yang
                                                dianggap tidak sopan atau tidak pantas oleh Eureka Bookhouse.
                                            </li>
                                            <li>
                                                Eureka Bookhouse dapat mengakhiri akun dan ID pengguna serta menghapus
                                                atau membuang setiap konten yang berkaitan dengan akun dan ID pengguna
                                                dari Situs. Dasar untuk pengakhiran tersebut dapat termasuk, tetapi
                                                tidak terbatas pada :
                                                <ol>
                                                    <li>Permintaan pengguna;</li>
                                                    <li>
                                                        Pelanggaran terhadap ketentuan atau semangat syarat & ketentuan
                                                        layanan ini;
                                                    </li>
                                                    <li>
                                                        Memiliki beberapa akun pengguna untuk alasan yang tidak sah;
                                                    </li>
                                                    <li>
                                                        Perilaku yang ilegal, menipu, melecehkan, memfitnah, mengancam
                                                        atau kasar;
                                                    </li>
                                                    <li>
                                                        Perilaku yang merugikan pengguna lain, pihak ketiga, atau
                                                        kepentingan bisnis Eureka Bookhouse .
                                                    </li>
                                                </ol>
                                            </li>
                                            <p>
                                                Pengguna dapat menghapus akun mereka jika mereka memberi tahu Eureka
                                                Bookhouse secara tertulis (termasuk melalui email di
                                                info@eurekabookhouse.co.id).
                                            </p>
                                            <p>
                                                Terlepas dari adanya penghapusan tersebut, pengguna tetap bertanggung
                                                jawab dan berkewajiban untuk setiap transaksi yang belum selesai (baik
                                                apakah dimulai sebelum atau setelah penghapusan tersebut), pengiriman
                                                produk, pembayaran untuk produk, atau hal semacam itu. Eureka Bookhouse
                                                tidak akan memiliki kewajiban, dan tidak akan bertanggung jawab atas
                                                setiap kerugian yang terjadi akibat tindakan yang diambil sesuai dengan
                                                bagian ini.
                                            </p>
                                        </ol>
                                    </li>
                                    <li>
                                        <h6>TRANSAKSI PEMBELIAN</h6>
                                        <p>
                                            <b>
                                                Pengguna sebagai pembeli wajib bertransaksi melalui prosedur transaksi
                                                yang telah ditetapkan oleh Eureka Bookhouse. Pembeli wajib melakukan
                                                pembayaran dengan menggunakan metode pembayaran yang telah ditentukan
                                                pihak Kemendikbud (transfer antar bank) dan kemudian Eureka Bookhouse
                                                akan meneruskan dana dari pembeli ke pihak penjual jika tahapan
                                                transaksi jual beli pada sistem Eureka Bookhouse telah dinyatakan
                                                selesai.
                                            </b>
                                        </p>
                                        <p>
                                            <b>Pengguna sebagai pembeli</b>
                                        </p>
                                        <p>
                                            Sebagai pembeli, pengguna mempunyai <b>hak</b> membeli barang/produk yang
                                            ditawarkan penjual di situs Eureka Bookhouse dan diwajibkan mengikuti
                                            prosedur/ketentuan yang berjalan di Eureka Bookhouse, termasuk meliputi :
                                        </p>
                                        <ol>
                                            <li>Wajib menggunakan data sekolah yang tersedia di Kemendikbud</li>
                                            <li>
                                                Melakukan transaksi pembelian melalui situs siplah.eurekabookhouse.co.id
                                            </li>
                                            <li>
                                                Dalam melakukan proses transaksi pembelian, pembeli diperbolehkan
                                                negosiasi dengan penjual menggunakan fitur negosiasi yang disediakan
                                                situs Eureka Bookhouse. Negosiasi bisa berupa terkait harga
                                                barang/produk, pengiriman barang/produk dan Terms of Payments (TOP)
                                                pembayaran;
                                            </li>
                                            <li>
                                                Kesepakatan yang terjadi antara pembeli dan penjual di fitur negosiasi,
                                                tidak menjadi tanggung jawab Eureka Bookhouse;
                                            </li>
                                            <li>
                                                Pembeli diperbolehkan melakukan komplain ke penjual lewat fitur komplain
                                                yang disediakan situs Eureka Bookhouse jika memang barang/produk yang
                                                dipesan tidak sesuai dengan data pesanan yang tersimpan dalam sistem
                                                situs Eureka Bookhouse. Batas waktu komplain maksimal 3 (tiga) hari
                                                setelah barang/produk diterima;
                                            </li>
                                            <li>
                                                Tranksaksi dinyatakan selesai ketika pembeli melakukan pembayaran ke
                                                penjual sesuai dengan surat pernyataan kesanggupan pembayaran dan
                                                penjual menerima dana penghasilan/pembayaran dari pembeli melalui situs
                                                Eureka Bookhouse;
                                            </li>
                                            <li>
                                                Pembeli, penjual dan situs Eureka Bookhouse mendapatkan akses
                                                mengunduh/menyimpan histori yang tersimpan di fitur negosiasi atau
                                                komplain;
                                            </li>
                                            <li>
                                                Atas kebijakannya sendiri, Eureka Bookhouse berhak menggunakan data
                                                histori antara pembeli dan penjual yang tersimpan di fitur negosiasi
                                                atau komplain jika diminta/diperlukan untuk kepentingan Negara.
                                            </li>
                                        </ol>
                                        <p>
                                            Saat melakukan pencarian, pemesanan, negosiasi dan pembelian barang, pembeli
                                            menyetujui bahwa :
                                        </p>
                                        <ol>
                                            <li>
                                                Pembeli bertanggung jawab untuk membaca, memahami, dan menyetujui
                                                informasi/deskripsi keseluruhan barang (termasuk didalamnya namun tidak
                                                terbatas pada warna, kualitas, fungsi, dan lainnya) sebelum membuat
                                                tawaran, negosiasi atau komitmen untuk membeli;
                                            </li>
                                            <li>
                                                Pembeli memahami dan menyetujui bahwa ketersediaan stok barang dapat
                                                berubah sewaktu-waktu dan merupakan tanggung jawab penjual yang
                                                menawarkan barang tersebut;
                                            </li>
                                            <li>
                                                Pembeli mengakui bahwa Eureka Bookhouse tidak menjamin warna produk pada
                                                situs Eureka Bookhouse akan akurat seperti warna pada barang asli yang
                                                dijual penjual, karena hal tersebut tergantung pada monitor komputer
                                                pembeli;
                                            </li>
                                            <li>
                                                Pembeli diharuskan melampirkan surat pernyataan kesanggupan pembayaran
                                                (Terms of Payments/TOP) yang akan dilakukan ke penjual setelah
                                                barang/produk yang dipesan sampai ke tujuan pembeli;
                                            </li>
                                            <li>
                                                Pembeli memahami sepenuhnya dan menyetujui bahwa Pembeli wajib melakukan
                                                pembayaran ke rekening resmi dari situs Eureka Bookhouse (yang tertera
                                                saat melakukan check out);
                                            </li>
                                            <li>
                                                Segala transaksi yang dilakukan antar pembeli dan penjual selain melalui
                                                Rekening Resmi Eureka Bookhouse dan/atau tanpa sepengetahuan Eureka
                                                Bookhouse (melalui fasilitas/jaringan pribadi, pengiriman pesan,
                                                pengaturan transaksi khusus diluar situs Eureka Bookhouse atau upaya
                                                lainnya tidak terkecuali lewat COD (Cash On Delivery) atau tunai
                                                langsung ke penjual) tanpa perantara situs Eureka Bookhouse maka tidak
                                                menjadi tanggung jawab Eureka Bookhouse;
                                            </li>
                                            <li>
                                                Pengguna masuk ke dalam kontrak yang mengikat secara hukum untuk membeli
                                                barang ketika pengguna membeli suatu barang;
                                            </li>
                                            <li>
                                                Konfirmasi pembayaran dengan setoran tunai wajib disertai dengan berita
                                                pada slip setoran berupa nomor invoice dan nama. Konfirmasi pembayaran
                                                dengan setoran tunai tanpa keterangan tidak akan diterima oleh Eureka
                                                Bookhouse dan transaksi tidak bisa dinyatakan selesai;
                                            </li>
                                            <li>
                                                Pembeli (dalam hal ini diwakilkan Kepala Sekolah atau Bendahara Sekolah)
                                                menyetujui jika pembeli wajib menandatangani Berita Acara Serah Terima
                                                barang/produk yang dikirimkan oleh penjual;
                                            </li>
                                            <li>
                                                Pembeli juga wajib mengirimkan Berita Acara Serah Terima barang/produk
                                                yang sudah ditandatangani ke situs Eureka Bookhouse di fitur yang sudah
                                                disediakan;
                                            </li>
                                            <li>
                                                Pembeli menyetujui tidak memberitahukan atau menyerahkan bukti
                                                pembayaran dan/atau data pembayaran kepada pihak lain selain Eureka
                                                Bookhouse. Jika pembeli memberitahukan dan/atau menyerahkan bukti serta
                                                data pembayaran kepada pihak lain, maka hal tersebut akan menjadi
                                                tanggung jawab pembeli;
                                            </li>
                                            <li>
                                                Pembeli wajib melakukan konfirmasi penerimaan barang, setelah menerima
                                                kiriman barang yang dibeli. Eureka Bookhouse memberikan batas waktu 2
                                                (dua) hari setelah pengiriman berstatus "terkirim" pada sistem Eureka
                                                Bookhouse, untuk pembeli melakukan konfirmasi penerimaan Barang;
                                            </li>
                                            <li>
                                                Atas kebijakannya sendiri, Eureka Bookhouse akan mengirimkan dana pihak
                                                pembeli yang sudah dikirimkan ke rekening resmi Eureka Bookhouse ke
                                                pihak Penjual jika transaksi sudah selesai (tidak ada komplain dari
                                                pembeli dan pembeli sudah mengirimkan Berita Acara Serah Terima yang
                                                sudah ditandatangani ke Eureka Bookhouse);
                                            </li>
                                            <li>
                                                Pembeli memahami dan menyetujui bahwa masalah keterlambatan proses
                                                pembayaran dan biaya tambahan adalah tanggung jawab pembeli secara
                                                pribadi;
                                            </li>
                                            <li>
                                                Eureka Bookhouse berwenang mengambil keputusan atas
                                                permasalahan-permasalahan transaksi yang belum terselesaikan akibat
                                                tidak adanya kesepakatan penyelesaian, baik antara penjual dan pembeli,
                                                dengan melihat bukti-bukti yang ada. Keputusan Eureka Bookhouse adalah
                                                keputusan akhir yang tidak dapat diganggu gugat dan mengikat pihak
                                                penjual dan pembeli untuk mematuhinya;
                                            </li>
                                            <li>
                                                Pembeli wajib melakukan pembayaran dengan nominal yang sesuai dengan
                                                jumlah tagihan yang tertera pada halaman pembayaran. Eureka Bookhouse
                                                tidak bertanggungjawab atas kerugian yang dialami pembeli apabila
                                                melakukan pembayaran yang tidak sesuai dengan jumlah tagihan yang
                                                tertera pada halaman pembayaran;
                                            </li>
                                            <li>
                                                Eureka Bookhouse memberikan kesempatan kepada pihak pembeli untuk
                                                melakukan komplain dengan batas waktu maksimal 3 (tiga) hari setelah
                                                barang diterima;
                                            </li>
                                            <li>
                                                Pembeli memahami sepenuhnya dan menyetujui bahwa invoice yang
                                                diterbitkan adalah atas nama penjual.
                                            </li>
                                        </ol>
                                    </li>
                                    <li>
                                        <h6>TRANSAKSI PENJUALAN</h6>
                                        <p>
                                            <b>
                                                Pengguna sebagai penjual wajib bertransaksi melalui prosedur transaksi
                                                yang telah ditetapkan oleh Eureka Bookhouse. Penjual setuju menerima
                                                pembayaran setelah barang dikirim dan sampai tujuan di tempat pembeli
                                                sesuai dengan ditentukan pihak Kemendikbud (transfer antar bank).
                                            </b>
                                        </p>
                                        <p>
                                            <b>Pengguna sebagai penjual/penyedia</b>
                                        </p>
                                        <p>
                                            Sebagai penjual/penyedia, pengguna mempunyai hak menjual barang/produk lewat
                                            toko yang dibuat/dibuka oleh penjual/penyedia di situs Eureka Bookhouse dan
                                            menolak atau menerima pesanan yang datang, namun tetap diwajibkan mengikuti
                                            prosedur/ketentuan yang berjalan di Eureka Bookhouse, termasuk meliputi :
                                        </p>
                                        <ol>
                                            <li>
                                                Melengkapi data diri (individu atau badan hukum) sesuai dengan ketentuan
                                                dari Kemendikbud, penjual/penyedia wajib untuk pembuatan akun di situs
                                                Eureka Bookhouse yang meliputi :
                                                <p>
                                                    <b>Individu :</b>
                                                    <ul>
                                                        <li>Nama Lengkap</li>
                                                        <li>Nomor Induk Kependudukan</li>
                                                        <li>Nomor Pokok Wajib Pajak (jika ada)</li>
                                                        <li>Alamat Lengkap</li>
                                                        <li>Nomor Telepon</li>
                                                        <li>Alamat Surel</li>
                                                        <li>Nomor Rekening</li>
                                                        <li>Reputasi</li>
                                                    </ul>
                                                </p>
                                                <p>
                                                    <b>Badan Hukum :</b>
                                                    <ul>
                                                        <li>Nama Resmi</li>
                                                        <li>Nomor Pokok Wajib Pajak</li>
                                                        <li>Alamat Lengkap</li>
                                                        <li>Nomor Telepon</li>
                                                        <li>Alamat Surel</li>
                                                        <li>Nomor Rekening</li>
                                                        <li>Reputasi</li>
                                                    </ul>
                                                </p>
                                            </li>
                                        </ol>
                                        <ol>
                                            <li>Menjual barang/produk di situs siplah.eurekaBookhouse.co.id;</li>
                                            <li>
                                                Penjual berhak melakukan pengaturan terhadap item-item yang akan
                                                diperdagangkan di etalase toko yang sudah didaftarkan di situr Eureka
                                                Bookhouse;
                                            </li>
                                            <li>
                                                Penjual diwajibkan memperdagangkan barang/produk yang asli dan original
                                                dan tidak diperbolehkan menjual barang/produk bajakan/KW
                                            </li>
                                            <li>
                                                Penjual dilarang keras melakukan duplikasi produk, duplikasi toko, atau
                                                tindakan-tindakan lain yang dapat diindikasikan sebagai usaha persaingan
                                                tidak sehat;
                                            </li>
                                            <li>
                                                Dalam melakukan proses transaksi jual-beli, penjual diperbolehkan
                                                melakukan negosiasi dengan pembeli dengan menggunakan fitur negosiasi
                                                yang disediakan situs Eureka Bookhouse. Negosiasi bisa berupa terkait
                                                harga barang/produk, pengiriman barang/produk dan Terms of Payments
                                                (TOP) pembayaran;
                                            </li>
                                            <li>
                                                Kesepakatan yang terjadi antara penjual dan pembeli di fitur negosiasi,
                                                tidak menjadi tanggung jawab Eureka Bookhouse;
                                            </li>
                                            <li>
                                                Penjual tidak memiliki hak untuk mengubah nama akun, nama toko dan/atau
                                                domain toko penjual;
                                            </li>
                                            <li>
                                                Penjual bertanggung jawab secara pribadi untuk menjaga kerahasiaan akun
                                                dan password untuk semua aktivitas yang terjadi dalam akun penjual,
                                                tidak terkecuali penarikan dana/saldo penjualan;
                                            </li>
                                            <li>
                                                Eureka Bookhouse memiliki kewenangan untuk menutup toko dan akun penjual
                                                baik secara sementara atau permanen jika ditemukan adanya tindakan
                                                kecurangan dalam bertransaksi (seperti melakukan proses transaksi ke
                                                toko sendiri dengan menggunakan akun pribadi) dan/atau pelanggaran
                                                terhadap syarat dan ketentuan yang sudah ditetapkan Eureka Bookhouse;
                                            </li>
                                        </ol>
                                        <b>Saat melakukan transaksi penjualan, penjual menyetujui bahwa :</b>
                                        <ol>
                                            <li>
                                                Tidak akan melakukan penawaran / menjual barang terlarang yang tidak
                                                sesuai dengan yang telah ditetapkan pada ketentuan "Jenis Barang";
                                            </li>
                                            <li>
                                                Barang/jasa yang dijual memiliki standar kualitas yang baik, 
                                                sesuai dengan deskripsi produk, memenuhi aturan PBJ Satdik, dan sesuai dengan kategori pajaknya. 
                                                Jika barang/jasa tidak sesuai dengan ketentuan yang berlaku, 
                                                maka penyedia bersedia menerima sanksi sesuai dengan UU dan aturan PBJ Satdik;
                                            </li>
                                            <li>
                                                Wajib memberikan foto dan informasi produk dengan lengkap dan jelas
                                                sesuai dengan kondisi dan kualitas produk yang dijualnya. Jika ditemukan
                                                ketidaksesuaian antara foto dan informasi produk yang diunggah oleh
                                                penjual dengan produk yang diterima oleh pembeli, maka Eureka Bookhouse
                                                berhak menahan dana transaksi dari pembeli;
                                            </li>
                                            <li>
                                                Tidak menuliskan deskripsi yang bersifat merugikan dan melanggar syarat
                                                & ketentuan yang telah dibuat oleh situs Eureka Bookhouse, termasuk
                                                namun tidak terbatas pada :
                                                <ol>
                                                    <li>Tidak menerima komplain;</li>
                                                    <li>Tidak menerima negosiasi;</li>
                                                    <li>Tidak menerima retur (penukaran barang);</li>
                                                    <li>
                                                        Pengiriman barang dilakukan sepihak (tanpa perantara situs
                                                        Eureka Bookhouse).
                                                    </li>
                                                </ol>
                                            </li>
                                            <li>
                                                Penjual diharuskan mengirimkan Berita Acara Serah Terima Barang (yang
                                                sudah di tandatangani penjual) kepada pembeli yang diselipkan dalam
                                                paket kiriman. Seperti yang dijelaskan di syarat & ketentuan situs
                                                Eureka Bookhouse dan keputusan Kemendikbud, transaksi penjualan akan
                                                dianggap selesai dan dana penghasilan akan dikirimkan ke penjual jika
                                                Berita Acara Serah Terima Barang ditandatangani penjual dan pembeli;
                                            </li>
                                            <li>
                                                Penjual wajib memberikan balasan untuk menerima atau menolak pesanan
                                                barang pihak Pembeli dalam batas waktu 2 hari terhitung sejak adanya
                                                notifikasi pesanan barang dari Eureka Bookhouse. Apabila dalam batas
                                                waktu tersebut tidak ada balasan dari penjual maka secara otomatis
                                                pesanan akan dibatalkan;
                                            </li>
                                            <li>
                                                Penjual wajib memasukan nomor resi pengiriman barang dalam batas waktu 2
                                                x 24 jam terhitung sejak adanya notifikasi pesanan barang dari Eureka
                                                Bookhouse;
                                            </li>
                                            <li>
                                                Eureka Bookhouse berwenang untuk menahan pembayaran dana penghasilan ke
                                                penjual apabila dalam transaksi ditemukan :
                                                <ol>
                                                    <li>
                                                        No resi pengiriman barang yang dimasukkan penjual tidak sesuai
                                                        dengan transaksi yang terjadi di situs Eureka Bookhouse;
                                                    </li>
                                                    <li>
                                                        Penjual mengirimkan barang melalui jasa kurir/logistic diluar
                                                        dari yang disediakan situs Eureka Bookhouse;
                                                    </li>
                                                    <li>
                                                        Adanya manipulasi transaksi yang dilakukan penjual untuk
                                                        keuntungan sepihak.
                                                    </li>
                                                </ol>
                                            </li>
                                            <li>
                                                Atas kebijakannya sendiri, Eureka Bookhouse berwenang mengambil
                                                keputusan atas permasalahan-permasalahan transaksi yang belum
                                                terselesaikan akibat tidak adanya kesepakatan penyelesaian, baik antara
                                                penjual dan pembeli, dengan melihat bukti-bukti yang ada. Keputusan
                                                Eureka Bookhouse adalah keputusan akhir yang tidak dapat diganggu gugat
                                                dan bersifat mengikat pihak penjual dan pembeli untuk mematuhinya;
                                            </li>
                                            <li>
                                                Penjual sepenuhnya memahami dan menyetujui bahwa Pajak Penghasilan
                                                Penjual akan dilaporkan dan diurus sendiri oleh masing-masing penjual
                                                sesuai dengan ketentuan pajak yang berlaku di peraturan
                                                perundang-undangan di Indonesia;
                                            </li>
                                            <li>
                                                Penjual menyetujui jika pembayaran akan dilakukan setelah barang dikirim
                                                dan/atau sesuai dengan surat kesanggupan pembayaran (Terms of
                                                Payments/TOP) yang akan diberikan oleh pembeli saat proses negosiasi
                                                (sebelum barang dipesan). Jika penjual tidak setuju dengan TOP yang
                                                diberikan pembeli, maka penjual diperbolehkan menolak pesanan;
                                            </li>
                                            <li>
                                                Eureka Bookhouse tidak bertanggung jawab sepenuhnya jika pembeli
                                                melakukan pembayaran melewati dari TOP yang telah disepakati penjual dan
                                                pembeli;
                                            </li>
                                            <li>
                                                Penjual sepenuhnya memahami dan menyetujui bahwa invoice yang
                                                diterbitkan adalah atas nama penjual.
                                            </li>
                                        </ol>
                                    </li>
                                    <li>
                                        <h6>HARGA BARANG</h6>
                                        <ol>
                                            <li>
                                                Harga Barang yang ditawarkan penjual dalam situs Eureka Bookhouse adalah
                                                harga normal yang sudah ditetapkan oleh penjual;
                                            </li>
                                            <li>Penjual dilarang memanipulasi harga barang dengan cara apapun;</li>
                                            <li>
                                                Penjual dilarang menetapkan harga yang tidak wajar pada barang yang
                                                ditawarkan melalui Situs Eureka Bookhouse;
                                            </li>
                                            <li>
                                                Pembeli memahami dan menyetujui bahwa tawar-menawar harga oleh penjual
                                                hanya bisa dilakukan lewat fitur negosiasi yang ada di dalam situs
                                                Eureka Bookhouse;
                                            </li>
                                            <li>
                                                Penjual memahami dan menyetujui sepenuhnya bahwa kesalahan ketik yang
                                                menyebabkan keterangan harga atau informasi lain menjadi tidak
                                                benar/sesuai adalah tanggung jawab penjual;
                                            </li>
                                            <li>
                                                Penjual dan pembeli memahami dan menyetujui bahwa setiap masalah
                                                dan/atau perselisihan yang terjadi akibat ketidaksepahaman antara
                                                penjual dan pembeli tentang harga bukan merupakan tanggung jawab Eureka
                                                Bookhouse;
                                            </li>
                                            <li>
                                                Dengan melakukan pemesanan melalui Eureka Bookhouse, Pembeli menyetujui
                                                untuk membayar total biaya yang harus dibayarkan sesuai dengan yang
                                                tertera dalam halaman pembayaran, yang terdiri dari harga barang dan
                                                ongkos kirim. Pembeli setuju untuk melakukan pembayaran melalui metode
                                                pembayaran yang telah ditetapkan yaitu transfer bank;
                                            </li>
                                            <li>
                                                Batasan harga maksimal satuan untuk barang yang dapat ditawarkan adalah
                                                Rp. 50.000.000,-
                                            </li>
                                            <li>
                                                Saat ini situs Eureka Bookhouse hanya melayani transaksi jual beli
                                                barang dalam mata uang Rupiah.
                                            </li>
                                        </ol>
                                    </li>
                                    <li>
                                        <h6>PEMBAYARAN</h6>
                                        <p>
                                            Pembeli dapat melakukan pembayaran melalui Anjungan Tunai Mandiri (ATM) atau
                                            transfer bank via internet (“Transfer Bank”) ke Rekening Resmi Eureka
                                            Bookhouse. Pembeli harus memberikan bukti transfer atau referensi transaksi
                                            pembayaran kepada Eureka Bookhouse untuk tujuan verifikasi sebagai
                                            konfirmasi pembayaran.
                                        </p>
                                    </li>
                                    <li>
                                        <h6>TARIF PENGIRIMAN</h6>
                                        <ol>
                                            <li>
                                                Penjual dan pembeli memahami dan menyetujui sepenuhnya jika tarif
                                                pengiriman sesuai dengan jasa logistik yang disepakati penjual dan
                                                pembeli;
                                            </li>
                                            <li>
                                                Eureka Bookhouse telah memberikan informasi tarif pengiriman kepada
                                                pembeli berdasarkan lokasi secara akurat, namun Eureka Bookhouse tidak
                                                menjamin keakuratan data tersebut dengan data yang ada di cabang
                                                setempat;
                                            </li>
                                            <li>
                                                Penjual dan pembeli memahami dan menyetujui jika ditemukan selisih biaya
                                                pengiriman barang, maka hal tersebut bukan merupakan tanggung jawab
                                                Eureka Bookhouse.
                                            </li>
                                        </ol>
                                    </li>
                                    <li>
                                        <h6>PENGIRIMAN</h6>
                                        <p>
                                            Dalam transaksi jual-beli yang terjadi di situs Eureka Bookhouse, pengiriman
                                            barang wajib menggunakan jasa perusahaan ekspedisi yang telah mendapatkan
                                            verifikasi rekanan Eureka Bookhouse yang dapat dipilih oleh pembeli.
                                        </p>
                                        <p>
                                            <b>
                                                Adapun ketentuan yang wajib disetujui oleh pengguna (penjual dan/atau
                                                pembeli), termasuk :
                                            </b>
                                            <ol>
                                                <li>
                                                    Penjual dilarang keras memberlakukan promosi / sistem bebas ongkos
                                                    kirim pada setiap barang yang dijual di dalam situs Eureka
                                                    Bookhouse;
                                                </li>
                                                <li>
                                                    Penjual dan pembeli memahami dan menyetujui bahwa setiap
                                                    permasalahan yang terjadi pada saat proses pengiriman barang oleh
                                                    penyedia jasa layanan pengiriman barang adalah merupakan tanggung
                                                    jawab penyedia jasa layanan pengiriman, bukan tanggung jawab Eureka
                                                    Bookhouse;
                                                </li>
                                                <li>
                                                    Penjual wajib mematuhi ketentuan yang ditetapkan oleh jasa layanan
                                                    pengiriman barang dan bertanggung jawab atas setiap barang yang
                                                    dikirimkan, dimana setiap ketentuan berkenaan dengan proses
                                                    pengiriman barang adalah sepenuhnya wewenang penyedia jasa layanan
                                                    pengiriman barang.
                                                </li>
                                                <li>
                                                    Jika terjadi proses Retur (pengembalian barang), maka baik penjual
                                                    dan pembeli diwajibkan untuk melakukan pengiriman barang langsung ke
                                                    masing-masing pembeli maupun penjual. Eureka Bookhouse tidak
                                                    menerima pengembalian atau pengiriman barang atas transaksi yang
                                                    dilakukan dalam kondisi apapun;
                                                </li>
                                            </ol>
                                        </p>
                                    </li>
                                    <li>
                                        <h6>JENIS BARANG</h6>
                                        <p>
                                            Adalah tanggung jawab Penjual untuk memastikan bahwa barang yang mereka jual
                                            mematuhi semua undang-undang dan sesuai dengan ketentuan dan kebijakan
                                            Eureka Bookhouse.
                                        </p>
                                        <p>
                                            Penjual wajib mematuhi
                                            <b> Kebijakan Jenis Barang Yang Dilarang Untuk Diperdagangkan</b> yang telah
                                            ditetapkan oleh situs Eureka Bookhouse.
                                        </p>
                                    </li>
                                    <li>
                                        <h6>PELEPASAN DANA PENJUAL</h6>
                                        <ol>
                                            <li>Pelepasan dana penjual akan diproses maksimal 2x24 jam hari kerja;</li>
                                            {/* <li>
                                                Untuk penarikan dana dengan tujuan nomor rekening
                                                <b> di luar bank DKI dan Mandiri</b>, apabila ada biaya tambahan yang
                                                dibebankan akan <b> menjadi tanggungan dari penyedia</b>;
                                            </li> */}
                                            <li>
                                                Jika Satdik melakukan pembayaran <b>dibawah jam 13:00</b>, maka akan <b>terverifikasi pada hari itu juga</b>.
                                            </li>
                                            <li>
                                                Jika Satdik melakukan pembayaran <b>jam 13:01 dan selebihnya</b>, maka akan <b>diverifikasi besok</b>.
                                            </li>
                                            <li>
                                                Semua layanan VA dikenakan biaya layanan VA sebesar Rp. 2.500,- yang dibebankan ke penyedia (merchant).
                                            </li>
                                            <li>
                                                Selain biaya poin 4, ada biaya transfer ke penyedia jika beda bank. Perbedaan bank yang dimaksud adalah bank penampung di Eureka Bookhouse dengan bank penyedia (merchant).
                                            </li>
                                            <li>
                                                Biaya transaksi merupakan biaya flat yang akan dikenakan oleh PPMSE ke Penyedia senilai Rp. 5.000,- per transaksi per invoice. Biaya transaksi hanya akan dikenakan jika Satdik membeli barang dengan kategori PPN yang nilai DPP nya diatas 1 juta rupiah.
                                            </li>
                                            <li>
                                                Jika ditemukan adanya dugaan pelanggaran terhadap Syarat dan Ketentuan
                                                Eureka Bookhouse, meliputi kecurangan, manipulasi atau kejahatan, maka
                                                penyedia (penjual dan/atau pembeli) memahami dan menyetujui bahwa Eureka
                                                Bookhouse berhak melakukan tindakan pemeriksaan, pembekuan, penundaan
                                                dan/atau pembatalan terhadap pelepasan dana yang dilakukan oleh
                                                penyedia;
                                            </li>
                                            <li>
                                                Pemeriksaan, pembekuan atau penundaan pelepasan dana sebagaimana yang
                                                dimaksud dalam poin 6 dapat dilakukan dalam jangka waktu yang tidak
                                                dapat ditentukan selama yang diperlukan oleh pihak Eureka Bookhouse.
                                            </li>
                                        </ol>
                                    </li>
                                    <li>
                                        <h6>PELANGGARAN TERHADAP SYARAT LAYANAN KAMI</h6>
                                        <p>
                                            Pelanggaran terhadap kebijakan ini dapat mengakibatkan berbagai tindakan,
                                            termasuk, dengan tidak terbatas pada, salah satu atau semua dari hal-hal
                                            berikut ini:
                                        </p>
                                        <ul>
                                            <li>Penghapusan daftar</li>
                                            <li>Batasan diberlakukan pada hak Akun</li>
                                            <li> Penangguhan dan pengakhiran akun</li>
                                            <li>Tuntutan pidana</li>
                                            <li>
                                                Tindakan perdata, termasuk dengan tidak terbatas pada klaim untuk
                                                kerugian dan/atau gantirugi sementara atau perintah ganti rugi oleh
                                                pengadilan.
                                            </li>
                                        </ul>
                                        <b>KETENTUAN LAIN</b>
                                        <p>
                                            Jika pengguna (penjual dan/atau pembeli) menggunakan semua fitur-fitur yang
                                            tersedia dalam situs Eureka Bookhouse, maka dengan ini pengguna menyatakan
                                            memahami dan menyetujui segala syarat dan ketentuan yang telah ditentukan.
                                        </p>
                                    </li>
                                    <li>
                                        <h6>GANTI RUGI</h6>
                                        <p>
                                            Pengguna (penjual dan/atau pembeli) akan melepaskan Eureka Bookhouse dari
                                            tuntutan ganti rugi dan menjaga Eureka Bookhouse (termasuk Induk Perusahaan,
                                            direktur, dan karyawan) dari setiap klaim atau tuntutan, termasuk biaya
                                            hukum yang wajar, yang dilakukan oleh pihak ketiga yang timbul dalam hal
                                            Anda melanggar perjanjian ini, penggunaan Layanan Eureka Bookhouse yang
                                            tidak semestinya dan/atau pelanggaran Anda terhadap hukum atau hak-hak pihak
                                            ketiga.
                                        </p>
                                    </li>
                                    <li>
                                        <h6>PILIHAN HUKUM</h6>
                                        <p>
                                            Tanpa memperhatikan pertentangan aturan hukum, perjanjian ini akan diatur
                                            oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Anda setuju
                                            bahwa tindakan hukum apapun atau sengketa yang mungkin timbul dari,
                                            berhubungan dengan, atau berada dalam cara apapun berhubungan dengan situs
                                            dan/atau Perjanjian ini akan diselesaikan secara eksklusif dalam yurisdiksi
                                            pengadilan Republik Indonesia.
                                        </p>
                                    </li>
                                    <li>
                                        <h6>PEMBAHARUAN</h6>
                                        <p>
                                            <b>
                                                Syarat & ketentuan yang berlaku saat ini mungkin akan di ubah dan/atau
                                                diperbaharui dari waktu ke waktu tanpa pemberitahuan sebelumnya. Dengan
                                                tetap mengakses dan menggunakan layanan Eureka Bookhouse, maka pengguna
                                                (penjual dan/atau pembeli) dianggap menyetujui perubahan-perubahan dalam
                                                Syarat & ketentuan.
                                            </b>
                                        </p>
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SiteTermsAndConditions;
