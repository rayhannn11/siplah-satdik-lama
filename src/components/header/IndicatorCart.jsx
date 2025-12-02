// react
import React from "react";

// third-party
import classNames from "classnames";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

// application
import AsyncAction from "../shared/AsyncAction";
import Indicator from "./Indicator";
import { Cart20Svg } from "../../svg";
import { cartRemoveItem } from "../../store/cart";
import { url } from "../../services/utils";
import { addMiniCart } from "../../store/mini-cart";
import Swal from "sweetalert2";
import IconTrash from "../icons/IconTrash";

function IndicatorCart(props) {
    const { miniCart, cart, cartRemoveItem, customer } = props;
    let dropdown;
    let optionCart;
    console.log(miniCart, "mini cart length");

    const doHandleRemoveItemCart = (item) => {
        return new Promise((resolve) => {
            Swal.fire({
                title: "Anda yakin ingin menghapus produk ini?",
                // text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Hapus",
                reverseButtons: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    cartRemoveItem(item, customer?.token, optionCart);
                    // Swal.fire("", "", "success");
                }
            });
            resolve();
        });
    };

    if (cart.cartList != null) {
        if (cart.cartList.items.length === 1 && cart.cartList.items[0].product.length === 1) {
            optionCart = { ...cart, options: { page: 1, limit: 3 } };
        } else {
            optionCart = { ...cart };
        }
    }

    if (miniCart.items !== undefined && miniCart.items.product !== undefined) {
        const items = miniCart.items.product.map((item) => {
            let options;
            let image;

            // Check if the product is tax exempt based on ppnType field
            const isTaxExempt = item.ppnType === "non" || Number(item.ppn) === 0;

            if (item.image) {
                image = (
                    <div className="product-image dropcart__product-image">
                        <Link to={url.product(item)} className="product-image__body">
                            <img className="product-image__img" src={item.image} alt="" />
                        </Link>
                    </div>
                );
            }

            const removeButton = (
                <AsyncAction
                    action={() => doHandleRemoveItemCart(item)}
                    render={({ run, loading }) => {
                        const classes = classNames("dropcart__product-remove btn btn-light btn-sm btn-svg-icon", {
                            "btn-loading": loading,
                        });

                        return (
                            <button type="button" onClick={run} className={classes}>
                                <IconTrash />
                                <small className="text-danger d-block text-center">hapus</small>
                            </button>
                        );
                    }}
                />
            );

            // Display prices and tax information
            let priceDisplay;
            if (isTaxExempt) {
                const roundedPrice = item.priceCurrencyFormat;
                priceDisplay = (
                    <div className="dropcart__product-meta">
                        <span className="dropcart__product-quantity">{item.qty}</span>
                        {" × "}
                        <span className="dropcart__product-price">{roundedPrice}</span>
                        <div style={{ fontSize: "11px", marginTop: "3px" }}>
                            <div style={{ color: "#28a745" }}>Bebas Pajak</div>
                            <div>DPP PPh: {roundedPrice}</div>
                            <div>DPP Nilai Lain: Rp.0</div>
                            <div>PPN 12%: {item.ppnCurrencyFormat || "Rp0"}</div>
                        </div>
                    </div>
                );
            } else {
                priceDisplay = (
                    <div className="dropcart__product-meta">
                        <span className="dropcart__product-quantity">{item.qty}</span>
                        {" × "}
                        <span className="dropcart__product-price">{item.priceCurrencyFormat}</span>
                        <div style={{ fontSize: "11px", marginTop: "3px" }}>
                            <div>
                                DPP PPh: Rp{" "}
                                {(Math.floor(Number(item.itemPrice) / 1.11) * Number(item.qty)).toLocaleString("id-ID")}
                            </div>
                            <div>
                                DPP Nilai Lain: Rp{" "}
                                {(
                                    Math.floor(Number(item.itemPrice / 1.11) * (11 / 12)) * Number(item.qty)
                                ).toLocaleString("id-ID")}
                            </div>
                            <div>PPN 12%: {item.ppnCurrencyFormat}</div>
                            <small>
                                *PPN yang dikenakan telah menggunakan perhitungan terbaru sesuai dengan{" "}
                                <a
                                    target="_blank"
                                    href="https://jdih.kemenkeu.go.id/api/download/ad276b82-94bd-4197-b409-af33e2842cd6/2024pmkeuangan131.pdf"
                                >
                                    PMK No. 131 Tahun 2024
                                </a>
                                *
                            </small>
                        </div>
                    </div>
                );
            }

            return (
                <div key={item.id} className="dropcart__product">
                    {image}
                    <div className="dropcart__product-info">
                        <div className="dropcart__product-name">
                            <Link to={url.product(item)}>{item.name}</Link>
                        </div>
                        {options}
                        {priceDisplay}
                    </div>
                    {removeButton}
                </div>
            );
        });
        dropdown = (
            <div className="dropcart">
                <div className="dropcart__products-list">{items}</div>

                <div className="dropcart__totals">
                    <table>
                        <tbody>
                            <tr>
                                <th>Total</th>
                                <td>{miniCart.items.totalCurrencyFormat}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="dropcart__buttons">
                    <Link className="btn btn-secondary" to="/shop/cart">
                        Lihat Keranjang
                    </Link>
                </div>
            </div>
        );
    } else {
        dropdown = (
            <div className="dropcart">
                <div className="dropcart__empty">Keranjang belanja anda kosong</div>
            </div>
        );
    }

    return <Indicator url="/shop/cart" dropdown={dropdown} value={miniCart?.total || 0} icon={<Cart20Svg />} />;
}

const mapStateToProps = (state) => ({
    cart: state.cart,
    miniCart: state.miniCart,
    customer: state.customer,
});

const mapDispatchToProps = {
    cartRemoveItem,
    addMiniCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(IndicatorCart);
