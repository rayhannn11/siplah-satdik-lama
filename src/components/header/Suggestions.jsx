// react
import React from "react";

// third-party
import classNames from "classnames";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

// application
import AsyncAction from "../shared/AsyncAction";
import { ArrowRoundedRight6x9Svg, Cart16Svg, LocationPin } from "../../svg";
import { cartAddItem } from "../../store/cart";
import { url } from "../../services/utils";
import BlockLoader from "../blocks/BlockLoader";

const Suggestions = React.memo((props) => {
    const { context, className, products, itemMalls, cartAddItem, isLoading, customer, query } = props;
    const rootClasses = classNames(`suggestions suggestions--location--${context}`, className);

    const handleAddCart = (product) => {
        if (customer.token !== undefined && customer.token !== "") {
            return cartAddItem(product, customer.token);
        } else {
            return new Promise((resolve) => {
                // window.open("https://sso.datadik.kemdikbud.go.id/app/3D1C4271-7C02-487E-B330-7294B7EB4564", "_self");
                props.history.push("/login");
                resolve();
            });
        }
    };

    // PPN rate - standard Indonesian VAT rate is 11%
    const ppnRate = 0.12;

    console.log(products, "search product");
    console.log(itemMalls, "search itemMalls");

    // Inside the products.map function in your Suggestions component

    const list =
        products &&
        products.map((product) => {
            // Get base price
            const price =
                typeof product.price.primary === "number"
                    ? product.price.primary
                    : parseFloat(product.price.primary || 0);

            // Check if product is tax exempt (you may need to adjust this condition based on your actual data structure)
            const isTaxExempt = product.taxExempt || product.isTaxExempt || !product.ppnTagItem || false;

            // PPN amount calculation
            const ppnAmount = isTaxExempt ? 0 : Math.ceil((price / 1.11) * 0.11);

            const dppPph = Math.floor(price / 1.11);

            const dppNilaiLain = Math.ceil((11 / 12) * Number(dppPph));
            const ppn = Math.ceil(dppNilaiLain * ppnRate);

            // Format price to show rounded amount without decimals if needed
            const formattedPrice = isTaxExempt
                ? `Rp ${Math.round(price).toLocaleString("id-ID")}`
                : product.price.primaryCurrencyFormat;

            return (
                <li key={product.id} className="suggestions__item">
                    {/* Product image section */}
                    {product.images && product.images.length > 0 && (
                        <div className="suggestions__item-image product-image">
                            <div className="product-image__body">
                                <img className="product-image__img" src={product.images[0]} alt="" />
                            </div>
                        </div>
                    )}

                    {/* Product info section */}
                    <div className="suggestions__item-info">
                        <Link className="suggestions__item-name" to={url.product(product)}>
                            {product.name}
                        </Link>
                        <div className="suggestions__item-meta">{product.mall?.name}</div>
                    </div>

                    {/* Price and PPN section */}
                    <div className="suggestions__item-price">
                        {formattedPrice}
                        <div className="suggestions__item-ppn" style={{ fontSize: "11px", color: "#6c757d" }}>
                            {isTaxExempt ? (
                                <>
                                    <div style={{ color: "#28A745" }}>Bebas Pajak</div>
                                    <div>DPP PPH: {formattedPrice}</div>
                                    <div>DPP Nilai Lain: Rp 0</div>
                                    <div>PPN 12%: Rp 0</div>
                                </>
                            ) : (
                                <>
                                    <div style={{ color: "#28A745" }}>Harga Termasuk Pajak</div>

                                    <div>DPP PPH: Rp {dppPph.toLocaleString("id-ID")}</div>
                                    <div>DPP Nilai Lain: Rp {dppNilaiLain.toLocaleString("id-ID")}</div>
                                    <div>
                                        PPN {ppnRate * 100}%: Rp {ppn.toLocaleString("id-ID")}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Add to cart button (for header context) */}
                    {context === "header" && (
                        <div className="suggestions__item-actions">
                            <AsyncAction
                                action={() => handleAddCart(product)}
                                render={({ run, loading }) => (
                                    <button
                                        type="button"
                                        onClick={run}
                                        title="Add to cart"
                                        className={classNames("btn btn-primary btn-sm btn-svg-icon", {
                                            "btn-loading": loading,
                                        })}
                                    >
                                        <Cart16Svg />
                                    </button>
                                )}
                            />
                        </div>
                    )}
                </li>
            );
        });

    const listToko =
        itemMalls &&
        itemMalls.map((mall) => (
            <li key={mall.id} className="suggestions__item">
                {mall.image && mall.image.primary && (
                    <div className="suggestions__item-image product-image">
                        <div className="product-image__body">
                            <img className="product-image__img" src={mall.image.primary} alt="" />
                        </div>
                    </div>
                )}
                <div className="suggestions__item-info">
                    <Link className="suggestions__item-name" to={`/store/${mall.slug}`}>
                        {mall.name}
                    </Link>
                    <div className="suggestions__item-meta">{mall.location?.city}</div>
                </div>
            </li>
        ));

    return (
        <div className={rootClasses}>
            {isLoading ? (
                <BlockLoader />
            ) : (
                <ul className="suggestions__list">
                    <li className="suggestions__item">
                        <div>BARANG</div>
                    </li>
                    {list && list.length > 0 ? (
                        <>
                            {list}
                            <li className="suggestions__item d-flex justify-content-center">
                                <Link
                                    to={`/products/search?keyword=${query}`}
                                    className="suggestions__item-name"
                                    style={{ color: "#0E336D" }}
                                >
                                    Lihat Produk Lainnya
                                </Link>
                            </li>
                        </>
                    ) : (
                        <li className="d-flex justify-content-center py-3">Produk tidak ditemukan</li>
                    )}

                    <li className="suggestions__item">
                        <div>TOKO</div>
                    </li>
                    {listToko && listToko.length > 0 ? (
                        <>
                            {listToko}
                            <li className="suggestions__item">
                                <Link
                                    to={`/store?keyword=${query}`}
                                    className="suggestions__item-name d-flex justify-content-between align-items-center w-100"
                                >
                                    <div style={{ color: "#0E336D" }}>Lihat Pencarian Toko "{query}" Lainnya</div>
                                    <ArrowRoundedRight6x9Svg />
                                </Link>
                            </li>
                        </>
                    ) : (
                        <li className="d-flex justify-content-center py-3">Toko tidak ditemukan</li>
                    )}
                </ul>
            )}
        </div>
    );
});

const mapStateToProps = (state) => ({ customer: state.customer });

const mapDispatchToProps = {
    cartAddItem,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Suggestions));
