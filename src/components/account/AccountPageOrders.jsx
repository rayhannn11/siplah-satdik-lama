// react
import React, { useCallback, useEffect, useReducer, useState } from "react";

// third-party
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import classNames from "classnames";
import queryString from "query-string";

// application
import Pagination from "../shared/Pagination";
import BlockLoader from "../blocks/BlockLoader";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
// data stubs
import theme from "../../data/theme";
import { FETCH_ORDER_LIST, FETCH_ORDER_LIST_SUCCESS, SET_FILTER_VALUE, SET_OPTION_VALUE } from "../../data/constant";
import customerApi from "../../api/customer";
import { connect } from "react-redux";
import storeApi from "../../api/store";
import { cartAddItem } from "../../store/cart";
import Swal from "sweetalert2";
// import DateRangePicker from "react-bootstrap-daterangepicker";

const initialState = {
    orderList: null,
    orderListIsLoading: true,
    filters: { type: "all", date: `${new Date().toLocaleDateString()}-${new Date().toLocaleDateString()}` },
    options: {},
};

function parseQueryOptions(location) {
    const query = queryString.parse(location);

    const optionValues = {
        page: 1,
        limit: 5,
        status: 0,
    };

    if (typeof query.page === "string") {
        optionValues.page = parseFloat(query.page);
    }

    if (query.status) {
        optionValues.status = query.status;
    }

    return optionValues;
}

function parseQueryFilters(location) {
    const query = queryString.parse(location);
    const filterValues = {};

    Object.keys(query).forEach((param) => {
        const mr = param.match(/^filter_([-_A-Za-z0-9]+)$/);

        if (!mr) {
            return;
        }

        const filterSlug = mr[1];

        filterValues[filterSlug] = query[param];
    });

    return filterValues;
}

function parseQuery(location) {
    return [parseQueryOptions(location), parseQueryFilters(location)];
}

function buildQuery(options, filters) {
    const params = {};

    if (options.page !== 1) {
        params.page = options.page;
    }

    if (options.status !== 0) {
        params.status = options.status;
    }
    if (options.keyword !== "") {
        params.keyword = options.keyword;
    }

    Object.keys(filters)
        .filter((x) => x !== "category" && !!filters[x])
        .forEach((filterSlug) => {
            params[`filter_${filterSlug}`] = filters[filterSlug];
        });

    return queryString.stringify(params, { encode: false });
}

function reducer(state, action) {
    switch (action.type) {
        case FETCH_ORDER_LIST:
            return {
                ...state,
                orderListIsLoading: true,
            };
        case FETCH_ORDER_LIST_SUCCESS:
            return {
                ...state,
                orderListIsLoading: false,
                orderList: action.orderList,
            };

        case SET_FILTER_VALUE:
            return {
                ...state,
                options: { ...state.options, page: 1 },
                filters: { ...state.filters, [action.filter]: action.value },
            };
        case SET_OPTION_VALUE:
            return {
                ...state,
                options: { ...state.options, page: 1, [action.option]: action.value },
            };

        default:
            throw new Error();
    }
}

function init(state) {
    const [options, filters] = parseQuery(window.location.search);

    return { ...state, options, filters };
}

const AccountPageOrders = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState, init);
    const [searchKeyword, setSearchKeyword] = useState("");
    const { token } = props.customer;
    const [modal, setModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [stores, setStores] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const toggle = () => setModal(!modal);
    const [selectedStore, setSelectedStore] = useState(null);
    const [total, setTotal] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadResult, setUploadResult] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);

    let content;

    const handleSearch = useCallback(() => {
        dispatch({ type: "SET_OPTION_VALUE", option: "keyword", value: searchKeyword });
    }, [dispatch, searchKeyword]);

    useEffect(() => {
        const query = buildQuery(state.options, state.filters);

        const location = `${window.location.pathname}${query ? "?" : ""}${query}`;
        window.history.replaceState(null, "", location);
    }, [state.options, state.filters]);

    useEffect(() => {
        dispatch({ type: FETCH_ORDER_LIST });
        customerApi.getOrders(state.options, token).then((res) => {
            const { data } = res;

            dispatch({ type: FETCH_ORDER_LIST_SUCCESS, orderList: data });
        });
    }, [state.options, token]);

    useEffect(() => {
        if (modal) {
            fetchCariProdut();
        }
    }, [modal, searchTerm]);

    const fetchCariProdut = async () => {
        setIsLoading(true);
        try {
            const response = await storeApi.searchStore(searchTerm);
            setStores(response.pagination.data);
        } catch (error) {
            console.error("Error fetching stores:", error);
        }
        setIsLoading(false);
    };

    const handleSearchs = (e) => {
        console.log(e);
        setSearchTerm(e.target.value);
    };

    // const handleEvent = (event, picker) => {
    //     setPrintDate({
    //         startDate: new Date(picker.startDate._d).toLocaleDateString(),
    //         endDate: new Date(picker.endDate._d).toLocaleDateString(),
    //     });
    // };
    const handleDownloadTemplate = async () => {
        try {
            if (!selectedStore) {
                alert("Pilih toko terlebih dahulu");
                return;
            }

            const response = await fetch(
                `https://siplahstagingapi.eurekagroup.id/penyedia/createCV?mall_id=${selectedStore.mall_id}&total=${total}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) throw new Error("Download gagal");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `template_order_${selectedStore.name}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error("Error:", error);
            alert("Gagal download template");
        }
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log(file);
        if (file) {
            setSelectedFile(file);
        }
    };
    const handleDownloadTemplateKatalog = async () => {
        try {
            if (!selectedStore) {
                alert("Pilih toko terlebih dahulu");
                return;
            }

            const response = await fetch(
                `https://siplahstagingapi.eurekagroup.id/penyedia/cari-csv-product-mitra?mall_id=${selectedStore.mall_id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) throw new Error("Download gagal");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `katalog_product_${selectedStore.name}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error("Error:", error);
            alert("Gagal download template");
        }
    };

    const doHandleChangeStatus = (id) => {
        dispatch({ type: SET_OPTION_VALUE, option: "status", value: id });
    };

    const functionAddCart = async () => {
        // setIsAddingToCart(true);
        const totalProducts = uploadResult.data.length;

        // Buat Sweet Alert untuk progress
        const Toast = Swal.mixin({
            toast: false,
            position: "center",
            showConfirmButton: false,
            width: "500px",
            padding: "2em",
        });

        try {
            await Toast.fire({
                title: "Memproses Pesanan",
                html: `
                    <div class="text-center">
                        <div class="mb-3">
                            <i class="fa fa-shopping-cart fa-3x text-primary"></i>
                        </div>
                        <div class="progress" style="height: 10px">
                            <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary"
                                 role="progressbar"
                                 style="width: 0%">
                            </div>
                        </div>
                        <div class="mt-3" id="product-info">
                            Mempersiapkan pesanan...
                        </div>
                        <div class="mt-2 text-muted" id="progress-text">
                            0/${totalProducts} produk
                        </div>
                    </div>
                `,
                didOpen: async () => {
                    try {
                        for (let index = 0; index < uploadResult.data.length; index++) {
                            const element = uploadResult.data[index];
                            const dataProduct = {
                                productId: element?.product_id,
                                qty: element?.qty_beli,
                            };

                            // Update progress bar dan text
                            const progress = ((index + 1) / totalProducts) * 100;
                            Swal.getHtmlContainer().querySelector(".progress-bar").style.width = `${progress}%`;
                            Swal.getHtmlContainer().querySelector("#product-info").textContent = `Menambahkan ${
                                element.name || element.model
                            }`;
                            Swal.getHtmlContainer().querySelector("#progress-text").textContent = `${
                                index + 1
                            }/${totalProducts} produk`;

                            await customerApi.addCart(dataProduct, token);

                            // Tambahkan delay kecil agar progress terlihat
                            await new Promise((resolve) => setTimeout(resolve, 500));
                        }

                        // Tampilkan success message
                        await Swal.fire({
                            icon: "success",
                            title: "Berhasil!",
                            text: `${totalProducts} produk telah ditambahkan ke keranjang`,
                            showConfirmButton: false,
                            timer: 2000,
                            // didClose: () => {
                            //     navigate('/cart');
                            // }
                        });
                        window.location.href = "/satdik/shop/cart";
                    } catch (error) {
                        console.error("Error adding to cart:", error);
                        Swal.fire({
                            icon: "error",
                            title: "Gagal",
                            text: "Terjadi kesalahan saat menambahkan produk ke keranjang",
                            confirmButtonText: "Tutup",
                        });
                    }
                },
            });
        } catch (error) {
            console.error("Error:", error);
        } finally {
            // setIsAddingToCart(false);
            // window.location.href = "/satdik/shop/cart";
            setShowResultModal(false);
        }
    };

    const functionUploadExcel = async () => {
        setIsUploading(true);
        try {
            const response = await storeApi.uploadExcel(selectedFile, selectedStore.mall_id);
            if (response.success) {
                setUploadResult(response);
                setShowResultModal(true);
            } else {
                alert("Upload gagal: " + response.message);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Terjadi kesalahan saat upload");
        } finally {
            setIsUploading(false);
        }
    };

    const handlePageChange = (page) => {
        dispatch({
            type: "SET_OPTION_VALUE",
            option: "page",
            value: page,
        });
    };

    if (state.orderListIsLoading) {
        return <BlockLoader />;
    }

    console.log(state.orderList.orders, "order page");

    if (state.orderList.orders.length > 0) {
        content = (
            <>
                <div className="row mt-3">
                    {state.orderList.orders.map((order) => (
                        <div className="col-12 mt-2">
                            <div className="card">
                                <div className="card-header pb-1 mb-0">
                                    <small className="text-muted ">{order.orderDate}</small>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        {order.status === "Pesanan Baru" ? (
                                            // <div className="col-md-4">
                                            //     <small className="text-muted">No Invoice</small>
                                            //     <h6>{order.invoice}</h6>
                                            // </div>
                                            <div className="col-md-4">
                                                <small className="text-muted">Order ID</small>
                                                <h6>{order.orderId}</h6>
                                            </div>
                                        ) : (
                                            <div className="col-md-4">
                                                <small className="text-muted">No Pesanan</small>
                                                <h6>
                                                    SP-{order.invoice.substring(0, 6)}
                                                    {order.invoice.slice(-6)}
                                                </h6>
                                            </div>
                                        )}
                                        <div className="col-md-4">
                                            <small className="text-muted">Pemesan</small>
                                            <h6>{order.customerName}</h6>
                                        </div>
                                        <div className="col-md-4 text-right">
                                            <small className="text-muted">status</small>
                                            <h6 className="text-success">{order.status}</h6>
                                        </div>
                                    </div>
                                    <div className="card-divider mt-3 mb-3"></div>
                                    <div className="row ">
                                        {order.items.map((item) => (
                                            <>
                                                <div className="col-md-2">
                                                    <img
                                                        src={item.image}
                                                        alt=""
                                                        style={{ width: "100%", height: "100px", objectFit: "contain" }}
                                                        srcset=""
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <p
                                                        style={{
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            wordBreak: "break-all",
                                                            whiteSpace: "nowrap",
                                                            marginBottom: "0",
                                                        }}
                                                    >
                                                        {item.name}
                                                    </p>
                                                    <Link
                                                        to={`/store/${order.mall.slug}`}
                                                        className="text-info"
                                                        style={{
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            wordBreak: "break-all",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        {order.mall.name}
                                                    </Link>
                                                    {item.badges.map((item) => (
                                                        <div
                                                            // style={{ margin: "0 0 0 74.5px" }}
                                                            key={item}
                                                            className="product-card__badge product-card__badge--hot w-sm-50"
                                                        >
                                                            {item}
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ))}
                                    </div>
                                    <div className="card-divider my-3" />
                                    {order.totalProduct - 1 > 0 && (
                                        <div className="col-md-12">
                                            <Link to={`/account/orders/${order.id}`}>
                                                <p className="text-center">
                                                    Lihat {order.totalProduct - 1} Produk Lainnya
                                                </p>
                                            </Link>
                                        </div>
                                    )}
                                    <div className="row">
                                        <div className="col-12 d-flex justify-content-between align-items-center">
                                            <div>
                                                <small className="text-muted">Total</small>
                                                <h6>{order.totalCurrencyFormat}</h6>
                                            </div>

                                            <Link to={`/account/orders/${order.id}`} className="btn btn-info">
                                                Lihat Detail
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-2">
                    <Pagination
                        current={state.options.page || state.orderList.page}
                        siblings={2}
                        total={state.orderList.pages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </>
        );
    } else {
        content = (
            <div className="block block-empty w-100">
                <div className="container">
                    <div className="block-empty__body">
                        <div className="block-empty__message">Data tidak ditemukan</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{`Riwayat Belanja — ${theme.name}`}</title>
            </Helmet>
            <h5>Riwayat Belanja</h5>
            <div className="container">
                <div className="row justify-content-between align-items-center">
                    <div className="col-md-4" style={{ color: "#FFF" }}>
                        <a
                            href={state.orderList.printOrderReport}
                            target="_blank"
                            className="btn btn-md btn-block btn-primary"
                            rel="noopener noreferrer"
                        >
                            <i className="fa fa-download mr-1" aria-hidden="true"></i>
                            Cetak Riwayat Pesanan
                        </a>

                        {/* <h6>Pilih tanggal untuk mencetak riwayat pesanan</h6>
                        <DateRangePicker
                            initialSettings={{
                                startDate: printDate.startDate,
                                endDate: printDate.enDate,
                            }}
                            onEvent={() => {}}
                            onApply={handleEvent}
                        >
                            <input id="daterangepicker" type="text" class="form-control" placeholder="Pilih tanggal" />
                        </DateRangePicker> */}
                    </div>
                    <div className="col-md-4" style={{ color: "#FFF" }}>
                        <a onClick={toggle} style={{ cursor: "pointer" }} className="btn btn-md btn-block btn-success">
                            <i className="fa fa-shopping-cart mr-1" aria-hidden="true"></i>
                            Beli Jumlah Banyak
                        </a>
                    </div>

                    <Modal isOpen={modal} toggle={toggle} className="modal-lg">
                        <ModalHeader toggle={toggle} className="bg-primary text-white">
                            <i className="fa fa-shopping-cart mr-2"></i>
                            Pembelian Jumlah Banyak
                        </ModalHeader>
                        <ModalBody>
                            <div className="row">
                                <div className="col-md-6 mb-4">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <h5 className="card-title mb-3">
                                                <i className="fa fa-search text-primary mr-2"></i>
                                                Cari Toko/CV
                                            </h5>
                                            <div className="form-group position-relative">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Masukkan nama toko atau CV..."
                                                    value={searchTerm}
                                                    onChange={handleSearchs}
                                                />

                                                {isLoading && (
                                                    <div className="text-center mt-2">
                                                        <div className="spinner-border text-primary" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </div>
                                                )}

                                                {!isLoading && stores.length > 0 && (
                                                    <div
                                                        className="position-absolute w-100 mt-1 shadow-sm"
                                                        style={{
                                                            maxHeight: "300px",
                                                            overflowY: "auto",
                                                            background: "white",
                                                            border: "1px solid #ddd",
                                                            borderRadius: "4px",
                                                            zIndex: 1000,
                                                        }}
                                                    >
                                                        {stores.map((store) => (
                                                            <div
                                                                key={store.mall_id}
                                                                className="p-3 border-bottom hover-bg-light"
                                                                style={{ cursor: "pointer" }}
                                                                onClick={() => {
                                                                    setSearchTerm(store.name);
                                                                    setSelectedStore(store);
                                                                    setStores([]);
                                                                }}
                                                            >
                                                                <div className="d-flex align-items-center">
                                                                    {store.image ? (
                                                                        <img
                                                                            src={store.image}
                                                                            alt={store.name}
                                                                            className="mr-3"
                                                                            style={{
                                                                                width: "40px",
                                                                                height: "40px",
                                                                                objectFit: "cover",
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <div
                                                                            className="mr-3 bg-secondary text-white d-flex align-items-center justify-content-center"
                                                                            style={{
                                                                                width: "40px",
                                                                                height: "40px",
                                                                                borderRadius: "4px",
                                                                            }}
                                                                        >
                                                                            <i className="fa fa-store"></i>
                                                                        </div>
                                                                    )}
                                                                    <div>
                                                                        <div className="font-weight-bold">
                                                                            {store.name}
                                                                        </div>
                                                                        {/* <small className="text-muted">
                                                                            ID: {store.mall_id}
                                                                        </small> */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {selectedStore && (
                                                    <div className="mt-3 p-3 border rounded">
                                                        <h6 className="font-weight-bold">Toko Terpilih:</h6>
                                                        <div className="d-flex align-items-center">
                                                            {selectedStore.image ? (
                                                                <img
                                                                    src={selectedStore.image}
                                                                    alt={selectedStore.name}
                                                                    className="mr-3"
                                                                    style={{
                                                                        width: "50px",
                                                                        height: "50px",
                                                                        objectFit: "cover",
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div
                                                                    className="mr-3 bg-secondary text-white d-flex align-items-center justify-content-center"
                                                                    style={{
                                                                        width: "50px",
                                                                        height: "50px",
                                                                        borderRadius: "4px",
                                                                    }}
                                                                >
                                                                    <i className="fa fa-store"></i>
                                                                </div>
                                                            )}
                                                            <div>
                                                                <div className="font-weight-bold">
                                                                    {selectedStore.name}
                                                                </div>
                                                                {/* <small className="text-muted">
                                                                    ID: {selectedStore.mall_id}
                                                                </small> */}
                                                            </div>
                                                        </div>
                                                        {/* <Button color="primary" className="mt-3" size="sm">
                                                            <i className="fa fa-shopping-cart mr-1"></i>
                                                            Pilih Toko Ini
                                                        </Button> */}
                                                    </div>
                                                )}

                                                {/* { searchTerm && stores.length === 0 && (
                                                    <div className="alert alert-warning mt-2">
                                                        Tidak ada toko ditemukan
                                                    </div>
                                                )} */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {selectedStore && (
                                    <div className="col-md-6 mb-4">
                                        <div className="card h-100">
                                            <div className="card-body">
                                                <h5 className="card-title mb-3">
                                                    <i className="fa fa-file-excel text-success mr-2"></i>
                                                    Template Excel
                                                </h5>
                                                <p className="text-muted mb-4">
                                                    Download template Excel untuk memudahkan input data pembelian dalam
                                                    jumlah banyak
                                                </p>
                                                <div className="mt-3 p-3 border rounded">
                                                    <h6 className="font-weight-bold">
                                                        Toko Terpilih: {selectedStore.name}
                                                    </h6>

                                                    {/* <div className="form-group mt-3">
                                                        <label>Jumlah Barang yang ingin di order:</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={total}
                                                            onChange={(e) => setTotal(e.target.value)}
                                                            placeholder="Masukkan jumlah barang yang ingin di order"
                                                            min="1"
                                                        />
                                                    </div> */}
                                                </div>
                                            </div>
                                            <>
                                                <input
                                                    type="file"
                                                    id="fileUpload"
                                                    style={{ display: "none" }}
                                                    onChange={handleFileChange}
                                                    accept=".xlsx,.xls,.csv"
                                                />
                                                <Button color="warning" onClick={handleDownloadTemplate}>
                                                    <i className="fa fa-download mr-1"></i>
                                                    Download Template CSV
                                                </Button>
                                                <Button
                                                    color="info"
                                                    onClick={handleDownloadTemplateKatalog}
                                                    className="mt-2"
                                                >
                                                    <i className="fa fa-download mr-1"></i>
                                                    Download Katalog Product
                                                </Button>

                                                {selectedFile ? (
                                                    <div className="mt-2 d-flex align-items-center">
                                                        <span className="mr-2">
                                                            <i className="fa fa-file mr-1" style={{ fontSize: 6 }}></i>
                                                            {selectedFile.name}
                                                        </span>
                                                        <a
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                document.getElementById("fileUpload").click();
                                                            }}
                                                            className="text-danger"
                                                        >
                                                            <i className="fa fa-edit"></i> Ganti
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        color="success"
                                                        onClick={() => document.getElementById("fileUpload").click()}
                                                        className="mt-2"
                                                    >
                                                        <i className="fa fa-upload mr-1"></i>
                                                        Upload Template Order Produk
                                                    </Button>
                                                )}
                                            </>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="alert alert-info mt-2">
                                <i className="fa fa-info-circle mr-2"></i>
                                Setelah mengisi template, Anda dapat mengunggah file Excel untuk memproses pembelian
                                secara otomatis
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            {selectedFile && (
                                <Button color="success" onClick={functionUploadExcel}>
                                    <i className="fa fa-check  mr-1"></i>
                                    Upload
                                </Button>
                            )}
                        </ModalFooter>
                    </Modal>

                    <div className="col-md-4">
                        <div className="site-header__search">
                            <div className="search search--location--header">
                                <div className="search__body">
                                    <div className="search__form">
                                        <input
                                            className="search__input"
                                            value={searchKeyword}
                                            onChange={(e) => setSearchKeyword(e.target.value)}
                                            placeholder="Cari invoice..."
                                            name="keyword"
                                            aria-label="Site search"
                                            type="text"
                                            autoComplete="off"
                                        />
                                        <button
                                            className="search__button search__button--type--submit text-light"
                                            type="submit"
                                            onClick={handleSearch}
                                        >
                                            Cari
                                            {/* <Search20Svg /> */}
                                        </button>
                                        <div className="search__border" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="nav-negotiation">
                    <div className="nav-content-negotiation">
                        {state.orderList.filters.map((item) => (
                            <div
                                className={classNames("nav-item-negotiation", {
                                    active: item.inActive,
                                    danger: item.type === "danger",
                                })}
                                name={item.id}
                                onClick={(e) => doHandleChangeStatus(item.id)}
                            >
                                {item.title}
                                <span className="badge badge-primary custom ml-2">{item.total}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {content}
            </div>
            <Modal
                isOpen={showResultModal}
                toggle={() => setShowResultModal(false)}
                className="modal-xl"
                style={{ maxWidth: "1200px", width: "90%" }}
            >
                <ModalHeader
                    toggle={() => setShowResultModal(false)}
                    style={{ backgroundColor: "#00afe8" }}
                    className="text-white"
                >
                    <i className="fa fa-check-circle mr-2"></i>
                    Data Berhasil Diproses
                </ModalHeader>
                <ModalBody>
                    {uploadResult && (
                        <div>
                            <div className="alert alert-success mb-4">
                                <div className="d-flex align-items-center">
                                    <i className="fa fa-info-circle mr-2 fa-2x"></i>
                                    <div>
                                        <h6 className="mb-1">Ringkasan Upload</h6>
                                        <p className="mb-0">
                                            Total {uploadResult.total_items} produk akan ditambahkan ke keranjang
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-bordered table-hover">
                                    <thead className="thead-light">
                                        <tr>
                                            <th style={{ width: "5%" }}>No</th>
                                            <th style={{ width: "15%" }}>Kode Produk</th>
                                            <th style={{ width: "25%" }}>Nama Produk</th>
                                            <th style={{ width: "15%" }}>Harga</th>
                                            <th style={{ width: "12%" }}>Tersedia</th>
                                            <th style={{ width: "12%" }}>Jumlah</th>
                                            <th style={{ width: "16%" }}>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {uploadResult.data.map((item, index) => (
                                            <tr key={item.model}>
                                                <td className="align-middle">{index + 1}</td>
                                                <td className="align-middle">{item.model}</td>
                                                <td className="align-middle">
                                                    <div>
                                                        <span className="text-wrap">{item.name}</span>
                                                    </div>
                                                </td>
                                                <td className="text-right align-middle">
                                                    Rp {parseInt(item.price).toLocaleString("id-ID")}
                                                </td>
                                                <td className="text-center align-middle">{item.stock_tersedia}</td>
                                                <td className="text-center align-middle">
                                                    <span className="badge badge-info px-3 py-2">{item.qty_beli}</span>
                                                </td>
                                                <td className="text-right align-middle">
                                                    <strong>
                                                        Rp{" "}
                                                        {(parseInt(item.price) * item.qty_beli).toLocaleString("id-ID")}
                                                    </strong>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-light">
                                        <tr>
                                            <td colSpan="5" className="text-right font-weight-bold">
                                                Total
                                            </td>
                                            <td className="text-center font-weight-bold">
                                                {uploadResult.data.reduce((sum, item) => sum + item.qty_beli, 0)}
                                            </td>
                                            <td className="text-right font-weight-bold">
                                                Rp{" "}
                                                {uploadResult.data
                                                    .reduce(
                                                        (sum, item) => sum + parseInt(item.price) * item.qty_beli,
                                                        0
                                                    )
                                                    .toLocaleString("id-ID")}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => setShowResultModal(false)}>
                        <i className="fa fa-times mr-1"></i>
                        Tutup
                    </Button>
                    <Button onClick={functionAddCart} color="success">
                        <i className="fa fa-shopping-cart mr-1"></i>
                        Lanjutkan ke Keranjang
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
};
const mapStateToProps = (state) => ({ customer: state.customer });
export default connect(mapStateToProps, null)(AccountPageOrders);
