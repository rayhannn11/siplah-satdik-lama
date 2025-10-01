export default [
    {
        id: 8132,
        date: "02 April, 2019",
        status: "Pending",
        total: "$2,719.00 for 5 item(s)",
    },
    {
        id: 7592,
        date: "28 March, 2019",
        status: "Pending",
        total: "$374.00 for 3 item(s)",
    },
    {
        id: 7192,
        date: "15 March, 2019",
        status: "Shipped",
        total: "$791.00 for 4 item(s)",
    },
    {
        id: 6321,
        date: "28 February, 2019",
        status: "Completed",
        total: "$57.00 for 1 item(s)",
    },
    {
        id: 6001,
        date: "21 February, 2019",
        status: "Completed",
        total: "$252.00 for 2 item(s)",
    },
    {
        id: 4120,
        date: "11 December, 2018",
        status: "Completed",
        total: "$3,978.00 for 7 item(s)",
    },
];

const responseOrdersList = {
    status: {
        code: 200,
        message: "tes",
    },
    data: {
        filters: [
            { title: "pesanan baru", slug: "pesanan-baru" },
            { title: "pesanan lama", slug: "pesanan-lama" },
            { title: "pesanan baru banget", slug: "pesanan-baru-banget" },
            { title: "pesanan lama banget", slug: "pesanan-lama-banget" },
        ],
        orders: [
            {
                id: 1,
                orderDate: "16 Agustus 2020 07.14 WIB ",
                invoice: "INV08123423478",
                pemesan: "Sekolah Kita",
                status: "menunggu konfiramasi",
                items: [
                    { img: ["adadad"], name: "adadadad", store: "Toko", total: "Rp. 300.000.000" },
                    { img: ["adadad"], name: "adadadad", store: "Toko", total: "Rp. 300.000.000" },
                    { img: ["adadad"], name: "adadadad", store: "Toko", total: "Rp. 300.000.000" },
                ],
            },
            {
                id: 2,
                orderDate: "16 Agustus 2020 07.14 WIB ",
                invoice: "INV08123423478",
                pemesan: "Sekolah Kita",
                status: "menunggu pembayaran",
                items: [
                    { img: ["adadad"], name: "adadadad", store: "Toko", total: "Rp. 300.000.000" },
                    { img: ["adadad"], name: "adadadad", store: "Toko", total: "Rp. 300.000.000" },
                    { img: ["adadad"], name: "adadadad", store: "Toko", total: "Rp. 300.000.000" },
                ],
            },
        ],
    },
};
