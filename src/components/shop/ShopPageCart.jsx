import React, { useEffect, useState, useRef, useCallback } from "react";
import IconTrash from "../icons/IconTrash";
import InputNumber from "../shared/InputNumber";
import { toast } from "react-toastify";

// third-party
import classNames from "classnames";
import queryString from "query-string";
import Pagination from "../shared/Pagination";
import BlockLoader from "../blocks/BlockLoader";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { addCheckout } from "../../store/checkout";
import {
    cartListFetch,
    cartListFetchSuccess,
    cartQuantityUpdate,
    changeOptions,
    cartRemoveItem,
} from "../../store/cart";
import { customerAdd } from "../../store/customer";
import AsyncAction from "../shared/AsyncAction";
import Swal from "sweetalert2";
import customerApi from "../../api/customer";
import RequestPostLoader from "../shared/RequestPostLoader";
import { Collapse } from "reactstrap";
import { url } from "../../services/utils";

import { resetMiniCart } from "../../store/mini-cart";
import { resetFirstLogin } from "../../store/first-login/firstLoginActions";
import { logoutCustomer } from "../../store/auth/authActions";

// Custom hook for debounced API calls
const useDebounce = (callback, delay) => {
    const timeoutRef = useRef(null);

    const debouncedCallback = useCallback(
        (...args) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    );

    const cancel = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    return { debouncedCallback, cancel };
};

function buildQuery(options) {
    const params = {};

    if (options.page !== 1) {
        params.page = options.page;
    }

    return queryString.stringify(params, { encode: false });
}

const ShopPageCart = (props) => {
    // const { token } = props?.customer;

    const token = props?.customer?.token || "";
    const { cartRemoveItem, cartListFetch, cartQuantityUpdate, cartListFetchSuccess, cart, customer } = props;
    const [sendRequest, setSendRequest] = useState(false);
    const [seeProductPackets, setSeeProductPackets] = useState({});

    // State for optimistic quantity updates
    const [optimisticQuantities, setOptimisticQuantities] = useState({});
    const [pendingUpdates, setPendingUpdates] = useState(new Set());
    const pendingApiCalls = useRef(new Map());

    let content;
    let optionCart;

    const toggleCollapse = (targetName) => {
        if (!seeProductPackets[targetName]) {
            setSeeProductPackets({
                [targetName]: {
                    tooltipOpen: true,
                },
            });
        } else {
            setSeeProductPackets({
                [targetName]: {
                    tooltipOpen: !seeProductPackets[targetName].tooltipOpen,
                },
            });
        }
    };

    const isCollapseOpen = (targetName) => {
        return seeProductPackets[targetName] ? seeProductPackets[targetName].tooltipOpen : false;
    };

    const isCreateOrder = () => {
        return new Date().getTime() >= new Date("2021-08-19").getTime();
    };

    useEffect(() => {
        const query = buildQuery(cart.options);
        const location = `${window.location.pathname}${query ? "?" : ""}${query}`;
        window.history.replaceState(null, "", location);
    }, [cart.options]);

    useEffect(() => {
        if (!isCreateOrder()) {
            Swal.fire({
                html: "<strong>Mohon maaf atas ketidaknyamanannya</strong>.<br/>dikarenakan ada migrasi ke versi terbaru.<br/> Transaksi baru bisa dilakukan kembali mulai tanggal 19 Agustus 2021.",
                icon: "info",
                allowOutsideClick: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    props.history.goBack();
                }
            });
        }
        // if (customer.position.toLowerCase().includes("bendahara")) {
        //     Swal.fire({
        //         icon: "info",
        //         title: "Peringatan",
        //         html: `Akun Bendahara BOS tidak dapat melakukan checkout`,
        //     });
        // }
        cartListFetch();
        cartListFetchSuccess(cart.options, token, props);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cart.options, token]);

    const doHandleCreateCompare = (mallId) => {
        if (process.env.REACT_APP_IS_MAINTENANCE === "true") {
            return Swal.fire({
                icon: "info",
                title: "Maintenance",
                showCancelButton: false,
                html: `mohon maaf proses order tidak bisa dilanjutkan dikarenakan sedang tahap sinkronisasi ke DJP`,
            });
        }
        return new Promise(async (resolve) => {
            const isValid = await checkToken();
            if (!isValid) return;
            if (cart.cartList.isHasCompare) {
                Swal.fire({
                    icon: "info",
                    title: "Peringatan",
                    showCancelButton: true,
                    cancelButtonText: "Batal",
                    html: `Terdapat perbandingan yang belum selesai<br>Perbandingan sebelumnya akan diubah jika ingin melanjutkan.`,
                    reverseButtons: true,
                }).then((res) => {
                    if (res.isConfirmed) {
                        setSendRequest(true);
                        customerApi.createCompare({ mallId }, token).then((res) => {
                            setSendRequest(false);
                            props.history.push("/shop/compare");
                            resolve();
                        });
                    } else {
                        resolve();
                    }
                });
            } else {
                setSendRequest(true);
                customerApi.createCompare({ mallId }, token).then((res) => {
                    setSendRequest(false);
                    props.history.push("/shop/compare");
                    resolve();
                });
            }
        });
    };

    const checkToken = async () => {
        Swal.fire({
            title: "Memeriksa sesi...",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            const res = await fetch("https://siplah.eurekabookhouse.co.id/api/dashboard", {
                method: "GET",
                headers: { Authorization: `${token}` },
            });

            const data = await res.json();
            console.log(data, "response");

            // ❌ Token invalid
            if (data?.status?.code === 401) {
                Swal.fire({
                    icon: "error",
                    title: "Sesi Berakhir",
                    text: "Silakan login kembali.",
                }).then(() => {
                    localStorage.clear();
                    props.customerAdd(null);
                    props.resetMiniCart();
                    props.resetFirstLogin();
                    props.logoutCustomer();

                    if (props.history) props.history.push("/login");
                });

                return false; // ⛔ hentikan proses berikutnya
            }

            Swal.close();
            return true; // token valid
        } catch (error) {
            console.log("Request gagal:", error);

            Swal.fire({
                icon: "error",
                title: "Terjadi Kesalahan",
                text: "Gagal menghubungi server.",
            }).then(() => {
                localStorage.clear();
                props.customerAdd(null);
                props.resetMiniCart();
                props.resetFirstLogin();
                props.logoutCustomer();

                if (props.history) props.history.push("/login");
            });

            return false; // ⛔ hentikan proses berikutnya
        }
    };

    const doHandleCheckout = async (cart) => {
        //     if (cart.product.length > 25) {
        //         return Swal.fire({
        //             icon: "info",
        //             title: "Jumlah Baris Produk Melebihi Batas",
        //             showCancelButton: false,
        //             html: `
        //   Maksimal <b>25 produk</b> dalam satu kali transaksi. Silakan kurangi jumlah item di keranjang Anda agar dapat melanjutkan ke proses checkout.
        // `,
        //         });
        //     }
        if (process.env.REACT_APP_IS_MAINTENANCE === "true") {
            return Swal.fire({
                icon: "info",
                title: "Maintenance",
                showCancelButton: false,
                html: `mohon maaf proses order tidak bisa dilanjutkan dikarenakan sedang tahap sinkronisasi ke DJP`,
            });
        }
        const isValid = await checkToken();
        if (!isValid) return;
        props.addCheckout(cart);
        props.history.push(`/shop/checkout/${cart.id}?from=cart&arkas=false`);
        // props.history.push("/shop/checkoutArkas");
        const ix = localStorage.getItem("pretransaction");
        if (ix != cart.id) {
            localStorage.setItem("shipping", "penyedia");
            localStorage.setItem("payment", "");
            localStorage.setItem("top", "");
            localStorage.setItem("wrapping", "");
            localStorage.setItem("cValid", 1);
        }
    };

    const doHandleRemoveItemCart = (item) => {
        return new Promise((resolve) => {
            Swal.fire({
                title: "Anda yakin ingin menghapus produk ini?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Hapus",
                reverseButtons: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    cartRemoveItem(item, token, optionCart);
                    // Swal.fire("", "", "success");
                    localStorage.setItem("pretransaction", "");
                }
            });
            resolve();
        });
    };

    // Debounced API call for quantity updates
    const debouncedQuantityUpdate = useCallback(
        async (productId, newQty, originalQty) => {
            try {
                setPendingUpdates((prev) => new Set(prev).add(productId));

                const response = await customerApi.changeQuantity({ productId, qty: newQty }, token);

                // Check if the API call was successful
                if (response.status && response.status.code !== 200) {
                    throw new Error(response.status.message || "Failed to update quantity");
                }

                // Refresh cart data after successful update
                await cartListFetchSuccess(cart.options, token);

                // Clear optimistic update since server data is now fresh
                setOptimisticQuantities((prev) => {
                    const newState = { ...prev };
                    delete newState[productId];
                    return newState;
                });
            } catch (error) {
                console.error("Failed to update quantity:", error);

                // Revert optimistic update on error
                setOptimisticQuantities((prev) => {
                    const newState = { ...prev };
                    delete newState[productId];
                    return newState;
                });

                toast.error(error.message || "Gagal memperbarui kuantitas. Kuantitas dikembalikan ke nilai semula.");
            } finally {
                setPendingUpdates((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(productId);
                    return newSet;
                });
                pendingApiCalls.current.delete(productId);
            }
        },
        [token, cart.options, cartListFetchSuccess]
    );

    const { debouncedCallback: debouncedApiCall } = useDebounce(debouncedQuantityUpdate, 400);

    const handleChangeQty = useCallback(
        (product, qty) => {
            // Validate quantity
            if (qty < 1) {
                toast.error("Kuantitas minimal adalah 1");
                return;
            }

            if (qty > product.stock) {
                toast.error("Kuantitas tidak boleh lebih dari stok");
                return;
            }

            const productId = product.id;
            const originalQty = product.qty;

            // Cancel any pending API call for this product
            if (pendingApiCalls.current.has(productId)) {
                // The debounce will handle canceling the previous timeout
            }

            // Immediately update UI with optimistic value
            setOptimisticQuantities((prev) => ({
                ...prev,
                [productId]: qty,
            }));

            // Store the API call reference
            pendingApiCalls.current.set(productId, { qty, originalQty });

            // Debounce the API call
            debouncedApiCall(productId, qty, originalQty);
        },
        [debouncedApiCall]
    );

    if (sendRequest) {
        return <RequestPostLoader />;
    }

    if (cart.cartListIsLoading) {
        return <BlockLoader />;
    }

    if (cart?.cartList?.items?.length === 1 && cart?.cartList?.items[0]?.product?.length === 1) {
        optionCart = { ...cart, options: { page: 1, limit: 3 } };
    } else {
        optionCart = { ...cart };
    }

    console.log(cart?.cartList?.items, "cart?.cartList?.items");

    if (cart?.cartList?.items?.length === 0) {
        content = (
            <div className="block block-empty ">
                <div className="container">
                    <div className="block-empty__body">
                        <div className="block-empty__message">Keranjang anda kosong</div>
                        <div className="block-empty__actions">
                            <Link to="/" className="btn btn-primary btn-sm">
                                Cari Produk
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        content = (
            <>
                <div className="row">
                    {cart?.cartList?.items?.map((item) => {
                        const hasNegoProduct = item.product?.some((p) => p.isNego === true);
                        return (
                            <div className="col-12 mt-2" key={item.id}>
                                <div className="card">
                                    <div
                                        // style={{ background: "#0E336D" }}
                                        className="card-header d-flex flex-row justify-content-between align-items-center"
                                    >
                                        <h6 className="text-dark">
                                            <div className="row justify-content-center align-items-center">
                                                <div className="col-2">
                                                    <i
                                                        className="fas fa-store"
                                                        style={{ fontSize: "30px", marginRight: "60px" }}
                                                    ></i>
                                                </div>
                                                <div className="col-10">
                                                    <Link to={`/store/${item.mall.slug}`} className="text-dark d-block">
                                                        {item.mall.name}
                                                    </Link>
                                                    <small>
                                                        <i className="fas fa-map-marker-alt"></i>{" "}
                                                        {`${item.mall.province}`}
                                                    </small>
                                                </div>
                                            </div>
                                        </h6>
                                    </div>
                                    {item.isCompare && (
                                        <div className="alert alert-warning" role="alert">
                                            <strong>{item.alertCompare}</strong>
                                        </div>
                                    )}
                                    <div className="card-table">
                                        <div className="table-responsive" style={{ fontSize: "14px" }}>
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Produk</th>
                                                        <th />
                                                        <th>Harga</th>
                                                        <th>Ppn</th>
                                                        <th>Jumlah</th>
                                                        <th>Total</th>
                                                        <th />
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {item.product.map((product) => {
                                                        // Use optimistic quantity if available, otherwise use server quantity
                                                        const currentQty =
                                                            optimisticQuantities[product.id] ?? product.qty;
                                                        const isUpdating = pendingUpdates.has(product.id);

                                                        return (
                                                            <>
                                                                <tr key={product.id}>
                                                                    <td>
                                                                        <img
                                                                            src={product.image}
                                                                            alt=""
                                                                            style={{
                                                                                width: "70px",
                                                                                height: "70px",
                                                                                objectFit: "contain",
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <p style={{ marginBottom: 0 }}>
                                                                            {product.name} <br />
                                                                            <small>
                                                                                {" "}
                                                                                Stok Tersedia: {product.stock}
                                                                            </small>
                                                                        </p>
                                                                        <p
                                                                            style={{
                                                                                margin: "4px 0px 4px 0px",
                                                                                fontSize: "12px",
                                                                                color: "#1951de",
                                                                            }}
                                                                        >
                                                                            {product.brand} <br />
                                                                        </p>
                                                                        <div
                                                                            className={`product-card__badge ${
                                                                                product?.ppnType === "non"
                                                                                    ? "product-card__badge--non"
                                                                                    : "product-card__badge--ppn"
                                                                            }`}
                                                                            style={{ fontSize: "12px" }}
                                                                        >
                                                                            {product?.ppnType === "non"
                                                                                ? "Bebas Pajak"
                                                                                : "Dikenakan Pajak"}
                                                                        </div>

                                                                        {product.badges.map(
                                                                            (item) =>
                                                                                item.toLowerCase() === "het" && (
                                                                                    <div
                                                                                        key={item}
                                                                                        className={classNames(
                                                                                            "w-sm-50",
                                                                                            {
                                                                                                "product-card__badge product-card__badge--sale":
                                                                                                    item.toLowerCase() ===
                                                                                                    "grosir",
                                                                                                "product-card__badge product-card__badge--hot":
                                                                                                    item.toLowerCase() ===
                                                                                                        "nego" ||
                                                                                                    item.toLowerCase() ===
                                                                                                        "het",
                                                                                            }
                                                                                        )}
                                                                                    >
                                                                                        {item}
                                                                                    </div>
                                                                                )
                                                                        )}
                                                                        {product.packet.length > 0 && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    toggleCollapse(
                                                                                        `collapse-${product.id}`
                                                                                    )
                                                                                }
                                                                                name=""
                                                                                id=""
                                                                                className="btn btn-primary btn-sm"
                                                                            >
                                                                                Lihat Paket
                                                                            </button>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {product.isCrossPrice ? (
                                                                            <>
                                                                                <small
                                                                                    style={{
                                                                                        textDecoration: "line-through",
                                                                                    }}
                                                                                >
                                                                                    {product.crossPrice}
                                                                                </small>{" "}
                                                                                <span>
                                                                                    {product.priceCurrencyFormat}
                                                                                </span>
                                                                                {product.badges.map(
                                                                                    (item) =>
                                                                                        item.toLowerCase() !==
                                                                                            "het" && (
                                                                                            <div
                                                                                                key={item}
                                                                                                className={classNames(
                                                                                                    "w-sm-50",
                                                                                                    {
                                                                                                        "product-card__badge product-card__badge--sale":
                                                                                                            item.toLowerCase() ===
                                                                                                            "grosir",
                                                                                                        "product-card__badge product-card__badge--hot":
                                                                                                            item.toLowerCase() ===
                                                                                                                "nego" ||
                                                                                                            item.toLowerCase() ===
                                                                                                                "het",
                                                                                                    }
                                                                                                )}
                                                                                            >
                                                                                                {item}
                                                                                            </div>
                                                                                        )
                                                                                )}
                                                                            </>
                                                                        ) : (
                                                                            product.priceCurrencyFormat
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {product.ppnType !== "include" ? (
                                                                            product.ppnCurrencyFormat
                                                                        ) : (
                                                                            <span className="badge badge-primary">
                                                                                {product.ppnType}
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {product.badges.findIndex(
                                                                            (b) => b === "nego"
                                                                        ) !== -1 ? (
                                                                            <div className="d-flex align-items-center">
                                                                                <span>{Number(currentQty)}</span>
                                                                                {isUpdating && (
                                                                                    <small className="ml-2 text-muted">
                                                                                        <i className="fas fa-spinner fa-spin"></i>{" "}
                                                                                        Menyimpan...
                                                                                    </small>
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            <div className="d-flex align-items-center">
                                                                                <InputNumber
                                                                                    min={1}
                                                                                    max={product.stock}
                                                                                    value={Number(currentQty)}
                                                                                    onChange={(qty) =>
                                                                                        handleChangeQty(product, qty)
                                                                                    }
                                                                                    disabled={isUpdating}
                                                                                />
                                                                                {isUpdating && (
                                                                                    <small className="ml-2 text-muted">
                                                                                        <i className="fas fa-spinner fa-spin"></i>
                                                                                    </small>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                    <td>{product.subTotalUnitCurrencyFormat}</td>
                                                                    <td>
                                                                        <AsyncAction
                                                                            action={() =>
                                                                                doHandleRemoveItemCart(product)
                                                                            }
                                                                            render={({ run, loading }) => (
                                                                                <div>
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={run}
                                                                                        className={classNames(
                                                                                            "btn product-card__addtocart",
                                                                                            {
                                                                                                "btn-loading": loading,
                                                                                            }
                                                                                        )}
                                                                                    >
                                                                                        <IconTrash
                                                                                            style={{ width: "25px" }}
                                                                                        />
                                                                                        <small className="d-block text-center text-danger">
                                                                                            hapus
                                                                                        </small>
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                {isCollapseOpen(`collapse-${product.id}`) && (
                                                                    <tr>
                                                                        <td colSpan={7}>
                                                                            <Collapse
                                                                                isOpen={isCollapseOpen(
                                                                                    `collapse-${product.id}`
                                                                                )}
                                                                            >
                                                                                <div className="card-table">
                                                                                    <div className="table-responsive">
                                                                                        <table className="table">
                                                                                            <thead>
                                                                                                <tr>
                                                                                                    <th>#</th>
                                                                                                    <th>Gambar</th>
                                                                                                    <th>Produk</th>
                                                                                                    <th>Jumlah</th>
                                                                                                    <th></th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                                {product.packet.map(
                                                                                                    (item, index) => (
                                                                                                        <tr key={index}>
                                                                                                            <td>
                                                                                                                {
                                                                                                                    ++index
                                                                                                                }
                                                                                                            </td>
                                                                                                            <td>
                                                                                                                <img
                                                                                                                    src={
                                                                                                                        item.image
                                                                                                                    }
                                                                                                                    alt=""
                                                                                                                    style={{
                                                                                                                        width: "70px",
                                                                                                                        height: "70px",
                                                                                                                        objectFit:
                                                                                                                            "contain",
                                                                                                                    }}
                                                                                                                />
                                                                                                            </td>
                                                                                                            <td>
                                                                                                                {
                                                                                                                    item.name
                                                                                                                }
                                                                                                            </td>
                                                                                                            <td>
                                                                                                                {
                                                                                                                    item.quantity
                                                                                                                }
                                                                                                            </td>
                                                                                                            <td>
                                                                                                                <Link
                                                                                                                    className="btn btn-secondary btn-sm"
                                                                                                                    to={url.product(
                                                                                                                        {
                                                                                                                            mall: {
                                                                                                                                id: item.mall_id,
                                                                                                                            },
                                                                                                                            slug: item.seo,
                                                                                                                        }
                                                                                                                    )}
                                                                                                                >
                                                                                                                    Lihat
                                                                                                                    Detail
                                                                                                                </Link>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    )
                                                                                                )}
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </div>
                                                                                </div>
                                                                            </Collapse>
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="card-divider" />
                                    <div className="card-footer">
                                        <div className="row justify-content-between align-items-center">
                                            <div className="col-md-4">
                                                <h6 className="mb-2">Total ({item.product.length} Barang)</h6>
                                                <h6>
                                                    <span className="float-left">{item.totalCurrencyFormat}</span>
                                                </h6>
                                            </div>
                                            {/* {isCreateOrder() && !customer.position.toLowerCase().includes("bendahara") && ( */}
                                            <div className="col-md-4">
                                                {item.isCompare ? (
                                                    <AsyncAction
                                                        action={() => {
                                                            if (hasNegoProduct) {
                                                                toast.warning(
                                                                    "Perbandingan tidak tersedia karena terdapat produk negosiasi."
                                                                );
                                                                return Promise.resolve();
                                                            }
                                                            return doHandleCreateCompare(item.mall.id);
                                                        }}
                                                        render={({ run, loading }) => (
                                                            <button
                                                                type="button"
                                                                className={classNames("btn btn-block", {
                                                                    "btn-loading": loading,
                                                                    "btn-secondary": hasNegoProduct, // abu-abu jika isNego
                                                                    "btn-warning": !hasNegoProduct, // kuning default
                                                                })}
                                                                onClick={run}
                                                            >
                                                                Buat Perbandingan
                                                            </button>
                                                        )}
                                                    />
                                                ) : (
                                                    (() => {
                                                        // Check if any products in this item are currently updating
                                                        const hasUpdatingProducts = item.product.some((product) =>
                                                            pendingUpdates.has(product.id)
                                                        );

                                                        return (
                                                            <button
                                                                className={classNames("btn btn-block custome my-2", {
                                                                    "btn-primary": !hasUpdatingProducts,
                                                                    "btn-secondary": hasUpdatingProducts,
                                                                })}
                                                                onClick={() => doHandleCheckout(item)}
                                                                disabled={hasUpdatingProducts}
                                                                title={
                                                                    hasUpdatingProducts
                                                                        ? "Menunggu pembaruan kuantitas selesai..."
                                                                        : ""
                                                                }
                                                            >
                                                                {hasUpdatingProducts ? (
                                                                    <>
                                                                        <i className="fas fa-spinner fa-spin mr-2"></i>
                                                                        Memperbarui kuantitas...
                                                                    </>
                                                                ) : (
                                                                    "Lanjutkan ke halaman check out"
                                                                )}
                                                            </button>
                                                        );
                                                    })()
                                                )}
                                            </div>
                                            {/* )} */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="row justify-content-center align-items-center mt-3">
                    <div className="col-12">
                        <Pagination
                            current={cart?.cartList?.page || cart?.options?.page}
                            total={cart?.cartList?.pages}
                            onPageChange={(page) => {
                                if (cart?.cartList?.pages === 1) {
                                    changeOptions(1);
                                } else {
                                    changeOptions(page);
                                }
                            }}
                        />
                    </div>
                </div>
            </>
        );
    }

    return <>{content}</>;
};

const mapStateToProps = (state) => ({ customer: state.customer, cart: state.cart });

const mapDispatchToProps = {
    cartRemoveItem,
    cartListFetch,
    cartListFetchSuccess,
    changeOptions,
    addCheckout,
    cartQuantityUpdate,
    resetMiniCart,
    resetFirstLogin,
    logoutCustomer,
    customerAdd,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopPageCart);
