import React, { useEffect, useState } from "react";
import IconTrash from "../icons/IconTrash";
import InputNumber from "../shared/InputNumber";

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
import AsyncAction from "../shared/AsyncAction";
import Swal from "sweetalert2";
import customerApi from "../../api/customer";
import RequestPostLoader from "../shared/RequestPostLoader";
import { Collapse } from "reactstrap";
import { url } from "../../services/utils";

function buildQuery(options) {
    const params = {};

    if (options.page !== 1) {
        params.page = options.page;
    }

    return queryString.stringify(params, { encode: false });
}

const ShopPageCart = (props) => {
    const { token } = props.customer;
    const { cartRemoveItem, cartListFetch, cartQuantityUpdate, cartListFetchSuccess, cart, customer } = props;
    const [sendRequest, setSendRequest] = useState(false);
    const [seeProductPackets, setSeeProductPackets] = useState({});
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
        if (customer.position.toLowerCase().includes("bendahara")) {
            Swal.fire({
                icon: "info",
                title: "Peringatan",
                html: `Akun Bendahara BOS tidak dapat melakukan checkout`,
            });
        }
        cartListFetch();
        cartListFetchSuccess(cart.options, token);
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
        return new Promise((resolve) => {
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

    const doHandleCheckout = (cart) => {
        if (process.env.REACT_APP_IS_MAINTENANCE === "true") {
            return Swal.fire({
                icon: "info",
                title: "Maintenance",
                showCancelButton: false,
                html: `mohon maaf proses order tidak bisa dilanjutkan dikarenakan sedang tahap sinkronisasi ke DJP`,
            });
        }
        props.addCheckout(cart);
        props.history.push(
            `/shop/checkoutArkas/${localStorage.getItem("idCheckOut") || cart.id}?from=${localStorage.getItem(
                "checkout_from"
            )}`
        );
        // props.history.push("/shop/checkout");
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
                }
            });
            resolve();
        });
    };

    const handleChangeQty = (product, qty) => {
        const req = { productId: product.id, qty };
        cartQuantityUpdate(req, token, cart);
    };

    if (sendRequest) {
        return <RequestPostLoader />;
    }

    if (cart.cartListIsLoading) {
        return <BlockLoader />;
    }

    if (cart.cartList.items.length === 1 && cart.cartList.items[0].product.length === 1) {
        optionCart = { ...cart, options: { page: 1, limit: 3 } };
    } else {
        optionCart = { ...cart };
    }

    if (cart.cartList.items.length === 0) {
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
                    {cart.cartList.items.map((item) => (
                        <div className="col-12 mt-2">
                            <div class="card">
                                <div
                                    // style={{ background: "#0E336D" }}
                                    className="card-header d-flex flex-row justify-content-between align-items-center"
                                >
                                    <h6 className="text-dark">
                                        <div className="row justify-content-center align-items-center">
                                            <div className="col-2">
                                                <i
                                                    class="fas fa-store"
                                                    style={{ fontSize: "30px", marginRight: "60px" }}
                                                ></i>
                                            </div>
                                            <div className="col-10">
                                                <Link to={`/store/${item.mall.slug}`} className="text-dark d-block">
                                                    {item.mall.name}
                                                </Link>
                                                <small>
                                                    <i class="fas fa-map-marker-alt"></i> {`${item.mall.province}`}
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
                                                {item.product.map((product) => (
                                                    <>
                                                        <tr>
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
                                                                <p style={{ marginBottom: 0 }}>{product.name}</p>
                                                                <small
                                                                    className="d-block"
                                                                    style={{ color: "#0E336D", fontSize: "14px" }}
                                                                >
                                                                    {product.brand}
                                                                </small>
                                                                {product.badges.map(
                                                                    (item) =>
                                                                        item.toLowerCase() === "het" && (
                                                                            <div
                                                                                key={item}
                                                                                className={classNames("w-sm-50", {
                                                                                    "product-card__badge product-card__badge--sale":
                                                                                        item.toLowerCase() === "grosir",
                                                                                    "product-card__badge product-card__badge--hot":
                                                                                        item.toLowerCase() === "nego" ||
                                                                                        item.toLowerCase() === "het",
                                                                                })}
                                                                            >
                                                                                {item}
                                                                            </div>
                                                                        )
                                                                )}
                                                                {product.packet.length > 0 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            toggleCollapse(`collapse-${product.id}`)
                                                                        }
                                                                        name=""
                                                                        id=""
                                                                        class="btn btn-primary btn-sm"
                                                                    >
                                                                        Lihat Paket
                                                                    </button>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {product.isCrossPrice ? (
                                                                    <>
                                                                        <small
                                                                            style={{ textDecoration: "line-through" }}
                                                                        >
                                                                            {product.crossPrice}
                                                                        </small>{" "}
                                                                        <span>{product.priceCurrencyFormat}</span>
                                                                        {product.badges.map(
                                                                            (item) =>
                                                                                item.toLowerCase() !== "het" && (
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
                                                                    <span class="badge badge-primary">
                                                                        {product.ppnType}
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {product.badges.findIndex((b) => b === "nego") !==
                                                                -1 ? (
                                                                    Number(product.qty)
                                                                ) : (
                                                                    <InputNumber
                                                                        min={1}
                                                                        max={product.stock}
                                                                        value={Number(product.qty)}
                                                                        onChange={(qty) =>
                                                                            handleChangeQty(product, qty)
                                                                        }
                                                                    />
                                                                )}
                                                            </td>
                                                            <td>{product.subTotalUnitCurrencyFormat}</td>
                                                            <td>
                                                                <AsyncAction
                                                                    action={() => doHandleRemoveItemCart(product)}
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
                                                                                <IconTrash style={{ width: "25px" }} />
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
                                                                                        <th>#</th>
                                                                                        <th>Gambar</th>
                                                                                        <th>Produk</th>
                                                                                        <th>Jumlah</th>
                                                                                        <th></th>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {product.packet.map(
                                                                                            (item, index) => (
                                                                                                <tr>
                                                                                                    <td>{++index}</td>
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
                                                                                                    <td>{item.name}</td>
                                                                                                    <td>
                                                                                                        {item.quantity}
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
                                                                                                            Lihat Detail
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
                                                ))}
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
                                        {isCreateOrder() && !customer.position.toLowerCase().includes("bendahara") && (
                                            <div className="col-md-4">
                                                {item.isCompare ? (
                                                    <AsyncAction
                                                        action={() => doHandleCreateCompare(item.mall.id)}
                                                        render={({ run, loading }) => (
                                                            <button
                                                                type="button"
                                                                className={classNames("btn btn-warning btn-block", {
                                                                    "btn-loading": loading,
                                                                })}
                                                                onClick={run}
                                                            >
                                                                Buat Perbandingan
                                                            </button>
                                                        )}
                                                    />
                                                ) : (
                                                    <button
                                                        className="btn btn-primary btn-block custome my-2 "
                                                        onClick={() => doHandleCheckout(item)}
                                                    >
                                                        Lanjutkan ke halaman check out
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="row justify-content-center align-items-center mt-3">
                    <div className="col-12">
                        <Pagination
                            current={cart.cartList.page || cart.options.page}
                            total={cart.cartList.pages}
                            onPageChange={(page) => {
                                if (cart.cartList.pages === 1) {
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
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopPageCart);
