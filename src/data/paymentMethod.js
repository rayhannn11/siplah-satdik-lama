const paymentMethod = [
    {
        bank: 'BRI', guide: [
            {
                title: 'Melalui ATM BRI',
                steps: [`Masukan kartu ATM dan PIN BRI  
                Anda`, `Pilih menu Transaksi Lain >  
                Pembayaran > Lainnya > BRIVA`, `Masukan Kode BRIVA untuk  
                pembayaran tagihan Anda yang  
                akan dibayarkan. (Contoh:  
                230740000110810)`, `Pada halaman konfirmasi,  
                pastikan detail pembayaran  
                sudah sesuai (nomor BRIVA dan  
                jumlah pembayaran)`, `Ikuti instruksi untuk  
                menyelesaikan transaksi `, `Simpan struk transaksi sebagai  
                bukti pembayaran`]
            },
            {
                title: 'Melalui Internet Banking BRI',
                steps: [`Login pada alamat Internet Banking BRI  
            <a href='https://ib.bri.co.id/' target="_blank" rel="noopener noreferrer">https://ib.bri.co.id/</a>`, `Masukan  
            Username dan Password`, `Pilih menu Pembayaran > BRIVA`, `Masukan Kode BRIVA untuk  
            pembayaran tagihan Anda yang akan  
            dibayarkan. (Contoh: 230740000110810)`, `Pada halaman konfirmasi, pastikan  
            detail pembayaran sudah sesuai (nomor  
            BRIVA dan jumlah pembayaran)`, `Ikuti instruksi untuk menyelesaikan  
            transaksi`, `Simpan resi transaksi sebagai bukti  
            pembayaran`]
            },
            {
                title: 'Melalui Mobile Banking BRI',
                steps: [`Login pada aplikasi Mobile Banking  BRI`, `Pilih menu Info > Info BRIVA`, `Masukan Kode BRIVA untuk pembayaran  
                tagihan Anda yang akan dibayarkan.  
                (Contoh : 230740000110810)`, `Masukan PIN`, `Ikuti instruksi untuk menyelesaikan  
                transaksi`, `Simpan Notifikasi S M S  sebagai bukti  
                pembayaran `]
            },
            {
                title: 'Melalui Teller BRI ',
                steps: [`Datang ke Teller BRI di seluruh Unit  
                Kerja BANK BRI terdekat dengan  
                membawa nomor BRIVA : <ol type='a'><li>Mengisi form sesuai ketentuan  
                BANK BRI</li><li>Teller menerima form dan uang  
                sesuai dengan tagihan yang akan  
                dibayarkan</li></ol>`, `Teller BRI memproses pembukuan  
                pembayaran melalui BRIVA`, `Teller memberikan bukti transaksi  
                yang sudah tervalidasi`]
            },
            {
                title: 'Melalui ATM Bank Lain',
                steps: [`Masukan kartu ATM dan PIN BRI  Anda`, `Pilih menu Transaksi Lain > Transfer >  
                Ke Rek Bank Lain`, `Masukan kode bank (002)`, `Masukan nominal yang akan dibayarkan  
                (sesuai tagihan)`, `Masukan Kode BRIVA untuk pembayaran  
                tagihan Anda yang akan dibayarkan.  
                (Contoh: 230740000110810)`, `Pilih Rekening yang akan  didebet`, `Pada halaman konfirmasi, pastikan  
                detail pembayaran sudah sesuai (nomor  
                BRIVA dan jumlah pembayaran)`, `Ikuti instruksi untuk menyelesaikan  
                transaks`, `Simpan struk transaksi sebagai bukti  
                pembayaran`]
            },
            {
                title: 'Melalui Teller Bank Lain',
                steps: [`Nasabah melakukan pembayaran melalui Teller Bank dengan mengisi Slip Pemindah bukuan (Transfer)`, `Masukan nama Bank tujuan : <b>Bank BRI</b>`, `Masukan nomor rekening tujuan dengan nomor Virtual Account`, `Masukan jumlah pembayaran sesuai nominal`, `Nasabah mendapat <i>copy slip</i> pemindah bukuan sebagai Bukti Bayar`]
            },
        ]
    }

]
export default paymentMethod