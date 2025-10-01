const faqData = [
    {
        title: 'Pertanyaan Umum', data: [
            {
                question: "Apa itu Platform SIPLah-EUREKA?",
                answer: "SIPLah adalah platform teknologi milik Kemendikbud yang menyediakan sistem untuk mendukung kegiatan Pengadaan Barang dan Jasa dengan konsep pasar daring, dan salah satunya dioperasikan oleh PT Eurekabookhouse.",
            },
            {
                question: "Apa manfaat menggunakan SIPLah-EUREKA?",
                answer: " Produk di siplah eureka dapat memenuhi kebutuhan pembelanjaan dana BOS dan sumber dana lain.",
            },
            {
                question: "Mengapa harus menggunakan SIPLah-EUREKA?",
                answer: `Karena SIPLah-Eureka memiliki jaringan penyedia di seluruh indonesia dan
            memiliki 3 top kategori, antara lain :
            <ol>
                <li>Kebutuhan Sekolah.</li>
                <li>Buku Sekolah.</li>
                <li>Aplikasi Pembelajaran Digital.</li>
            </ol>`,
            },
            {
                question: "Siapa yang saja yang dapat menggunakan SIPLah-EUREKA?",
                answer: ` SIPLah-EUREKA dapat digunakan oleh :
            <ol>
                <li>
                    Penyedia barang dan jasa yang telah terdaftar untuk berjualan
                    sebagai bagian dari SIPLah-EUREKA sesuai dengan kebutuhan Satuan
                    Pendidikan.
                </li>
                <li>
                    Satuan Pendidikan yang telah terdaftar di Kemendikbudristek sebagai
                    sekolah penerima bantuan Dana BOS dari pemerintah untuk melakukan
                    proses pembelian barang dan jasa sesuai dengan kebutuhan Satuan
                    Pendidikan.
                </li>
                <li>
                    Pengawas, untuk melakukan proses pengecekan atau pemeriksaan
                    terhadap segala transaksi yang terjadi di platform SIPLah-EUREKA.
                </li>
            </ol>`,
            },
            {
                question: "Dimana bisa mengakses SIPLah-EUREKA?",
                answer: "  SIPLah-EUREKA dapat diakses pada laman https://siplah.eurekabookhouse.co.id.",
            },
            {
                question: "Kapan waktu yang tepat menggunakan SIPLah-EUREKA?",
                answer: `SIPLah-EUREKA dapat digunakan setiap saat karena SIPLah adalah platform
            daring.`,
            },
        ]
    },
    {
        title: 'Pertanyaan Pembayaran',
        data: [
            { question: 'Apa saja tipe pembayaran SIPLah-EUREKA?', answer: `siplah eureka memiliki 2 tipe pembayaran, yaitu dengan menggunakan virtual account BRI dan BPD. dan nantinya sekolah tidak perlu lagi melakukan konfirmasi atau upload bukti pembayaran, karena ketika sekolah membayar menggunakan no virtual account BRI atau BPD, itu akan otomatis terkonfirmasi di sistem siplah eureka.` },
            { question: 'Apakah Satuan Pendidikan bisa membayar dari beberapa tagihan menjadi satu kali transfer pada SIPLah-EUREKA?', answer: `Satuan Pendidikan tidak bisa membayar dari beberapa tagihan menjadi satu kali transfer, pembayaran harus ditransfer sesuai dengan nomor masing-masing invoice dan jumlah pada invoice tersebut.` },
            {
                question: 'Bagaimana proses perbandingan dapat dilakukan pada SIPLah-EUREKA?', answer: `Jika total belanja (tidak terbatas satu barang) >50jt maka pembeli harus melakukan perbandingan dengan ketentuan berikut:
                    <ol>
                    <li>
                    total belanja  > 50jt dan < 200jt maka pembeli harus melakukan perbandingan, minimal 1 merchant pembanding (1 merchant utama dan 1 merchant pembanding).
                    </li>
                    <li>
                    total belanja > 200jt
                    maka pembeli harus melakukan perbandingan, minimal 2 merchant pembanding
                    ( 1 merchant utama dan 2 merchant pembanding).
                    </li>
                    <li>
                    jika perbandingan berupa paket maka harus dengan list barang yang sama 
                    (misal Satuan Pendidikan ingin membeli paket A (laptop, printer mouse),  maka semua produk dalam 1 paket harus dilakukan perbandingan.
                    </li>
                    </ol> ` },
            {
                question: 'Bagaimana proses negosiasi yang dapat dilakukan pada SIPLah-EUREKA?', answer: `cara melakukan negosiasi : 
                    <ol>
                        <li>
                            pergi ke halaman detail produk yang ingin dinego.
                        </li>
                        <li>
                            klik tombol nego, kemudian akan muncul pop up yang berisi form input.
                        </li>
                        <li>
                            isi semua form input yang tersedia (untuk inputan spesifikasi lainnya dapat dikosongkan).
                        </li>
                        <li> setelah form input sudah terisi, klik tombol kirim negosiasi.
                        </li>   
                        <li>
                            setelah negosiasi terkirim, sekolah bisa menuggu tanggapan dari penyedia.
                        </li>
                        <li>
                            ika penyedia menerima negosiasi dari sekolah, sekolah bisa langsung menambahkan produk ke dalam keranjang.
                        </li>
                        <li>
                            dan jika penyedia ingin bernegosiasi terlebih dahulu dengan sekolah, sekolah bisa bernegosiasi kembali atau menolak dan menerima negosiasi dari penyedia.
                        </li>
                    </ol>` },
            { question: 'Dokumen apa saja yang akan diterima sebagai bukti pembayaran?', answer: `Dokumen yang akan diterima setelah pembayaran adalah sebagai berikut: Invoice, Bukti setor / Bukti Transfer.` },
            { question: 'Siapa saja yang menjadi partner pembayaran SIPLah-EUREKA?', answer: `Partner pembayaran SIPLah-EUREKA adalah BRI dan BPD Jateng.` }
        ]
    },
    {
        title: 'Pertanyaan Logistik',
        data: [
            { question: 'Siapa saja yang menjadi partner logistik SIPLah-EUREKA?', answer: 'Partner Logistik SIPLah-EUREKA adalah PT. Transaka.' },
            { question: 'Dimana saja lokasi yang dapat dijangkau layanan SIPLah-EUREKA?', answer: 'Lokasi yang dapat dijangkau oleh layanan SIPLah-EUREKA adalah Seluruh Indonesia karena menggunakan ekspedisi yang dapat menjangkau hingga ke daerah terpencil.' },
            {
                question: 'Berapa lama waktu pengiriman pesanan hingga sampai ke sekolah dengan menggunakan SIPLah-EUREKA?',
                answer: `<ol>
                    <li>
                        Reguler (2-6 hari).
                    </li>
                    <li>
                        Cargo (7 hari).
                    </li>
                </ol>`},
            {
                question: 'Apa yang harus dilakukan setelah transaksi berhasil dan barang sudah diterima?',
                answer: `Satuan Pendidikan wajib melakukan pengecekan pesanan apakah sudah sesuai atau belum, jika sudah sesuai maka Satuan Pendidikan wajib membuat e-BAST, melakukan pembayaran melalui SIPLah-Eureka, yang kemudian akan diteruskan ke Penyedia.`
            },
        ]
    },
    {
        title: 'Pertanyaan Perpajakan',
        data: [
            { question: 'Siapa yang membayar pajak ketika terjadi Satuan Pendidikanan di SIPLah-EUREKA?', answer: `Tergantung kesepakatan antara satuan pendidikan dan penyedia.` },
            {
                question: 'Bagaimana sistem pemungutan pajak ketika melakukan transaksi di SIPLah-EUREKA?',
                answer: `
                <ol>
                    <li>
                        penyedia yang dikenakan pajak, akan melakukan upload bukti faktur pajak disistem penyedia Siplah-Eureka dan akan muncul dihalaman detail order satdik.
                    </li>
                    <li>
                        pembayaran pajak dilakukan diluar sistem Siplah-Eureka.
                    </li>
                </ol>` },
            {
                question: 'Apakah semua barang di SIPLah-EUREKA sudah termasuk pajak?', answer: `<ol>
                <li>
                    barang yang include pajak dari penyedia tidak akan tertera ppn 0 di invoice.
                </li>
                <li>
                    barang yang exlude pajak dari penyedia akan tertera ppn nya di invoice.
                </li></ol>` },
        ]
    },
    {
        title: 'Pertanyaan Denda',
        data: [
            {
                question: 'Bagaimana mekanisme pengenaan denda pada Pengadaan di SIPLah-EUREKA? ', answer: `Mekanisme pengenaan denda merujuk pada Peraturan Presiden nomor 16 tahun 2018. Pengenaan denda dilakukan dengan adanya kesepakatan antara Satuan Pendidikan dan Penyedia sebelum melakukan transaksi barang dan jasa dengan menggunakan fitur chat.
<br/>
                mekanisme pengenaan denda sudah ada disistem Siplah-Eureka pada saat pembuatan dan pengisian eBAST.` },
        ]
    },
    {
        title: 'Pertanyaan Kendala Teknis',
        data: [
            {
                question: 'Mengapa tidak dapat melakukan login?',
                answer: `Gagal login yang dialami oleh Satuan Pendidikan dapat terjadi karena:
                <ol>
                    <li>Akun Dapodik yang digunakan Satuan Pendidikan bukan Akun Kepala Sekolah dan Akun Bendahara/Pelaksana PBJ.</li>
                    <li>Akun Satuan Pendidikan belum di-update, silakan melakukan pemutakhiran data di aplikasi Dapodik.</li>
                    <li>Salah memasukkan password/lupa password. </li>
                    <li>Server SIPLah-BIZONE sedang mengalami gangguan atau server Dapodik sedang dalam perbaikan.</li>
                    <li>Jika masih belum bisa, mohon hubungi dinas daerah setempat.</li>
                </ol>` },
            {
                question: 'Bagaimana cara melakukan filter produk berdasarkan kategori produk pada SIPLah-EUREKA?',
                answer: `Klik list kategori pada laman SIPLah-Eureka.`
            },
            {
                question: 'Apa yang harus dilakukan jika ada fitur yang tidak muncul pada SIPLah-EUREKA?',
                answer: `Silakan menghungi customer service SIPLah-Eureka.`
            },
            {
                question: 'Dimana bisa mengakses pusat bantuan SIPLah-EUREKA?',
                answer: `Dapat diakses melalui telepon customer service di 021-8779 6010.`
            },
        ]
    },
]
export default faqData;