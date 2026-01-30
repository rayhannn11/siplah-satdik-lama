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
    const [searchDebounceTimer, setSearchDebounceTimer] = useState(null);
    const toggle = () => {
        setModal(!modal);
        if (!modal) {
            // Reset state when opening modal
            setSearchTerm("");
            setStores([]);
            setSelectedStore(null);
            setSelectedFile(null);
        }
    };
    const [selectedStore, setSelectedStore] = useState(null);
    const [total, setTotal] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadResult, setUploadResult] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [noResultsFound, setNoResultsFound] = useState(false);

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

    // Debounced search effect
    useEffect(() => {
        // Clear existing timer
        if (searchDebounceTimer) {
            clearTimeout(searchDebounceTimer);
        }

        // Only search if there's a search term and modal is open
        if (searchTerm.trim() && modal) {
            setIsLoading(true);
            setNoResultsFound(false);

            const timer = setTimeout(() => {
                fetchCariProdut();
            }, 500); // 500ms debounce delay

            setSearchDebounceTimer(timer);
        } else {
            setStores([]);
            setNoResultsFound(false);
        }

        // Cleanup function
        return () => {
            if (searchDebounceTimer) {
                clearTimeout(searchDebounceTimer);
            }
        };
    }, [searchTerm, modal]);

    const fetchCariProdut = async () => {
        try {
            const response = await fetch(
                `https://siplahstagingapi.eurekagroup.id/v1/mitra/penyedia/get-cv?page=1&limit=10&keyword=${encodeURIComponent(searchTerm)}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();

            // Check if response has the expected structure
            if (result && result.pagination && Array.isArray(result.pagination.data)) {
                setStores(result.pagination.data);
                setNoResultsFound(result.pagination.data.length === 0);
            } else {
                setStores([]);
                setNoResultsFound(true);
            }
        } catch (error) {
            console.error("Error fetching stores:", error);
            setStores([]);
            setNoResultsFound(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchs = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Reset stores when clearing search
        if (!value.trim()) {
            setStores([]);
            setNoResultsFound(false);
            setIsLoading(false);
        }
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
                `https://siplahstagingapi.eurekagroup.id/v1/mitra/penyedia/createCV?mall_id=${selectedStore.mall_id}&total=${total}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
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
                `https://siplahstagingapi.eurekagroup.id/v1/mitra/penyedia/cari-csv-product-mitra?mall_id=${selectedStore.mall_id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
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

                    <Modal isOpen={modal} toggle={toggle} className="modal-lg" backdrop="static">
                        <ModalHeader toggle={toggle} className="bg-primary text-white border-0">
                            <div className="d-flex align-items-center">
                                <i className="fa fa-shopping-cart mr-2"></i>
                                <span className="font-weight-bold">Pembelian Jumlah Banyak</span>
                            </div>
                        </ModalHeader>
                        <ModalBody className="p-4">
                            <div className="row">
                                {/* Search Store Section */}
                                <div className="col-md-6 mb-4">
                                    <div className="card h-100 shadow-sm border-0">
                                        <div className="card-body">
                                            <h5 className="card-title mb-3 d-flex align-items-center">
                                                <div
                                                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mr-2"
                                                    style={{ width: "32px", height: "32px" }}
                                                >
                                                    <i className="fa fa-search" style={{ fontSize: "14px" }}></i>
                                                </div>
                                                <span className="font-weight-bold">Cari Toko/CV</span>
                                            </h5>

                                            <div className="form-group position-relative mb-4">
                                                <div className="input-group">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text bg-white border-right-0">
                                                            <i className="fa fa-search text-muted"></i>
                                                        </span>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="form-control border-left-0 pl-0"
                                                        placeholder="Ketik nama toko atau CV..."
                                                        value={searchTerm}
                                                        onChange={handleSearchs}
                                                        style={{
                                                            fontSize: "14px",
                                                            boxShadow: "none",
                                                        }}
                                                    />
                                                    {searchTerm && (
                                                        <div className="input-group-append">
                                                            <button
                                                                className="btn btn-light border"
                                                                type="button"
                                                                onClick={() => {
                                                                    setSearchTerm("");
                                                                    setStores([]);
                                                                    setNoResultsFound(false);
                                                                }}
                                                                style={{ borderLeft: "none" }}
                                                            >
                                                                <i className="fa fa-times text-muted"></i>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Loading State */}
                                                {isLoading && (
                                                    <div className="text-center mt-3 py-4">
                                                        <div
                                                            className="spinner-border text-primary mb-2"
                                                            role="status"
                                                            style={{ width: "2.5rem", height: "2.5rem" }}
                                                        >
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                        <div className="text-muted small">Mencari toko...</div>
                                                    </div>
                                                )}

                                                {/* Search Results Dropdown */}
                                                {!isLoading && stores.length > 0 && (
                                                    <div
                                                        className="position-absolute w-100 mt-2 shadow-lg"
                                                        style={{
                                                            maxHeight: "320px",
                                                            overflowY: "auto",
                                                            background: "white",
                                                            border: "1px solid #e0e0e0",
                                                            borderRadius: "8px",
                                                            zIndex: 1000,
                                                        }}
                                                    >
                                                        {stores.map((store, index) => (
                                                            <div
                                                                key={store.mall_id}
                                                                className={`p-3 ${
                                                                    index !== stores.length - 1 ? "border-bottom" : ""
                                                                }`}
                                                                style={{
                                                                    cursor: "pointer",
                                                                    transition: "all 0.2s ease",
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.currentTarget.style.backgroundColor = "#f8f9fa";
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.currentTarget.style.backgroundColor = "white";
                                                                }}
                                                                onClick={() => {
                                                                    setSearchTerm(store.name);
                                                                    setSelectedStore(store);
                                                                    setStores([]);
                                                                    setNoResultsFound(false);
                                                                }}
                                                            >
                                                                <div className="d-flex align-items-center">
                                                                    {store.image ? (
                                                                        <img
                                                                            src={store.image}
                                                                            alt={store.name}
                                                                            className="mr-3 rounded"
                                                                            style={{
                                                                                width: "48px",
                                                                                height: "48px",
                                                                                objectFit: "cover",
                                                                                border: "2px solid #f0f0f0",
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <div
                                                                            className="mr-3 bg-gradient-primary text-white d-flex align-items-center justify-content-center rounded"
                                                                            style={{
                                                                                width: "48px",
                                                                                height: "48px",
                                                                                background:
                                                                                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                                            }}
                                                                        >
                                                                            <i className="fa fa-store"></i>
                                                                        </div>
                                                                    )}
                                                                    <div className="flex-grow-1">
                                                                        <div className="font-weight-bold text-dark mb-1">
                                                                            {store.name}
                                                                        </div>
                                                                        {store.nama_bank && (
                                                                            <small className="text-muted d-block">
                                                                                <i className="fa fa-university mr-1"></i>
                                                                                {store.nama_bank} - {store.atas_nama}
                                                                            </small>
                                                                        )}
                                                                    </div>
                                                                    <i className="fa fa-chevron-right text-muted"></i>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* No Results */}
                                                {!isLoading && noResultsFound && searchTerm.trim() && (
                                                    <div className="alert alert-warning mt-3 mb-0">
                                                        <div className="d-flex align-items-center">
                                                            <i className="fa fa-info-circle mr-2"></i>
                                                            <div>
                                                                <strong>Tidak ada hasil</strong>
                                                                <p className="mb-0 small">
                                                                    Toko "{searchTerm}" tidak ditemukan
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Selected Store Display */}
                                            {selectedStore && (
                                                <div
                                                    className="mt-3 p-3 border rounded shadow-sm"
                                                    style={{ backgroundColor: "#f8f9fa" }}
                                                >
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <h6 className="font-weight-bold text-success mb-0">
                                                            <i className="fa fa-check-circle mr-1"></i>
                                                            Toko Terpilih
                                                        </h6>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => {
                                                                setSelectedStore(null);
                                                                setSearchTerm("");
                                                                setSelectedFile(null);
                                                            }}
                                                            style={{ padding: "2px 8px", fontSize: "12px" }}
                                                        >
                                                            <i className="fa fa-times"></i>
                                                        </button>
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        {selectedStore.image ? (
                                                            <img
                                                                src={selectedStore.image}
                                                                alt={selectedStore.name}
                                                                className="mr-3 rounded"
                                                                style={{
                                                                    width: "60px",
                                                                    height: "60px",
                                                                    objectFit: "cover",
                                                                    border: "2px solid #28a745",
                                                                }}
                                                            />
                                                        ) : (
                                                            <div
                                                                className="mr-3 bg-success text-white d-flex align-items-center justify-content-center rounded"
                                                                style={{
                                                                    width: "60px",
                                                                    height: "60px",
                                                                }}
                                                            >
                                                                <i className="fa fa-store"></i>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="font-weight-bold text-dark">
                                                                {selectedStore.name}
                                                            </div>
                                                            {selectedStore.nama_bank && (
                                                                <small className="text-muted d-block">
                                                                    <i className="fa fa-university mr-1"></i>
                                                                    {selectedStore.nama_bank}
                                                                </small>
                                                            )}
                                                            {selectedStore.nomor_rekening && (
                                                                <small className="text-muted d-block">
                                                                    <i className="fa fa-credit-card mr-1"></i>
                                                                    {selectedStore.nomor_rekening} -{" "}
                                                                    {selectedStore.atas_nama}
                                                                </small>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Template Section */}
                                {selectedStore && (
                                    <div className="col-md-6 mb-4">
                                        <div className="card h-100 shadow-sm border-0">
                                            <div className="card-body">
                                                <h5 className="card-title mb-3 d-flex align-items-center">
                                                    <div
                                                        className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center mr-2"
                                                        style={{ width: "32px", height: "32px" }}
                                                    >
                                                        <i
                                                            className="fa fa-file-excel"
                                                            style={{ fontSize: "14px" }}
                                                        ></i>
                                                    </div>
                                                    <span className="font-weight-bold">Template & Upload</span>
                                                </h5>

                                                <div className="alert alert-info border-0 mb-3">
                                                    <small>
                                                        <i className="fa fa-info-circle mr-1"></i>
                                                        Download template, isi data produk, lalu upload kembali
                                                    </small>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="font-weight-bold small text-muted mb-2">
                                                        TOKO YANG DIPILIH
                                                    </label>
                                                    <div
                                                        className="p-2 border rounded d-flex align-items-center"
                                                        style={{ backgroundColor: "#f8f9fa" }}
                                                    >
                                                        <i className="fa fa-store text-primary mr-2"></i>
                                                        <span className="font-weight-bold">{selectedStore.name}</span>
                                                    </div>
                                                </div>

                                                <div className="d-grid gap-2">
                                                    <input
                                                        type="file"
                                                        id="fileUpload"
                                                        style={{ display: "none" }}
                                                        onChange={handleFileChange}
                                                        accept=".xlsx,.xls,.csv"
                                                    />

                                                    <Button
                                                        color="warning"
                                                        onClick={handleDownloadTemplate}
                                                        className="mb-2 shadow-sm"
                                                        block
                                                    >
                                                        <i className="fa fa-download mr-2"></i>
                                                        Download Template CSV
                                                    </Button>

                                                    <Button
                                                        color="info"
                                                        onClick={handleDownloadTemplateKatalog}
                                                        className="mb-3 shadow-sm"
                                                        block
                                                    >
                                                        <i className="fa fa-download mr-2"></i>
                                                        Download Katalog Produk
                                                    </Button>

                                                    {selectedFile ? (
                                                        <div className="alert alert-success border-0 mb-0">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div className="d-flex align-items-center">
                                                                    <i
                                                                        className="fa fa-file-excel mr-2"
                                                                        style={{ fontSize: "24px" }}
                                                                    ></i>
                                                                    <div>
                                                                        <div className="font-weight-bold small">
                                                                            {selectedFile.name}
                                                                        </div>
                                                                        <small className="text-muted">
                                                                            {(selectedFile.size / 1024).toFixed(2)} KB
                                                                        </small>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        document.getElementById("fileUpload").click();
                                                                    }}
                                                                    className="btn btn-sm btn-outline-primary"
                                                                >
                                                                    <i className="fa fa-edit mr-1"></i>
                                                                    Ganti
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            color="success"
                                                            onClick={() =>
                                                                document.getElementById("fileUpload").click()
                                                            }
                                                            className="shadow-sm"
                                                            block
                                                        >
                                                            <i className="fa fa-upload mr-2"></i>
                                                            Upload File Pesanan
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Info Alert */}
                            {!selectedStore && (
                                <div className="alert alert-primary border-0 mb-0">
                                    <div className="d-flex align-items-start">
                                        <i className="fa fa-lightbulb mr-2 mt-1"></i>
                                        <div>
                                            <strong>Cara Menggunakan:</strong>
                                            <ol className="mb-0 pl-3 mt-2" style={{ fontSize: "14px" }}>
                                                <li>Cari dan pilih toko/CV yang ingin Anda pesan</li>
                                                <li>Download template CSV dan katalog produk</li>
                                                <li>Isi template dengan kode produk dan jumlah yang diinginkan</li>
                                                <li>Upload file yang sudah diisi</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </ModalBody>
                        <ModalFooter className="border-top">
                            <Button color="secondary" onClick={toggle} className="px-4">
                                <i className="fa fa-times mr-1"></i>
                                Batal
                            </Button>
                            {selectedFile && (
                                <Button
                                    color="success"
                                    onClick={functionUploadExcel}
                                    disabled={isUploading}
                                    className="px-4 shadow-sm"
                                >
                                    {isUploading ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm mr-2"
                                                role="status"
                                                aria-hidden="true"
                                            ></span>
                                            Memproses...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa fa-check mr-2"></i>
                                            Proses Upload
                                        </>
                                    )}
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
                                                        0,
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
