export default [
    {
        type: "link",
        label: "Home",
        url: "/",
    },
    // {
    //     type: "link",
    //     label: "Kategori",
    //     url: "",
    //     children: [
    //         {
    //             type: "link",
    //             label: "Power Tools",
    //             url: "",
    //             children: [
    //                 { type: "link", label: "Engravers", url: "" },
    //                 { type: "link", label: "Wrenches", url: "" },
    //                 { type: "link", label: "Wall Chaser", url: "" },
    //                 { type: "link", label: "Pneumatic Tools", url: "" },
    //             ],
    //         },
    //         {
    //             type: "link",
    //             label: "Machine Tools",
    //             url: "",
    //             children: [
    //                 { type: "link", label: "Thread Cutting", url: "" },
    //                 { type: "link", label: "Chip Blowers", url: "" },
    //                 { type: "link", label: "Sharpening Machines", url: "" },
    //                 { type: "link", label: "Pipe Cutters", url: "" },
    //                 { type: "link", label: "Slotting machines", url: "" },
    //                 { type: "link", label: "Lathes", url: "" },
    //             ],
    //         },
    //     ],
    // },
    {
        type: "link",
        auth: true,
        label: "Akun",
        url: "/account",
        children: [
            { type: "link", label: "Dashboard", url: "/account/dashboard" },
            { type: "link", label: "Data Sekolah", url: "/account/detail" },
            { type: "link", label: "Lokasi Sekolah", url: "/account/address" },
            { type: "link", label: "Notifikasi", url: "/account/notification" },
            { type: "link", label: "Transaksi", url: "/account/orders" },
            { type: "link", label: "Negosiasi", url: "/account/negotiation" },
            { type: "link", label: "Perbandingan", url: "/account/compare" },
            { type: "link", label: "Komplain", url: "/account/complaint" },
        ],
    },
    {
        type: "button",
        label: "Login",
        auth: false,
        url: "",
        children: [
            {
                type: "link",
                label: "Sekolah",
                external: false,
                url: "/login",
            },
            {
                type: "link",
                label: "Penjual",
                external: true,
                url: "https://siplah.eurekabookhouse.co.id/penyedia/",
            },
        ],
    }, {
        type: 'link',
        label: 'Bantuan',
        url: '/site/technical-support'
    },
    {
        type: "button",
        label: "Logout",
        auth: true,
        url: "/",
    },
];
