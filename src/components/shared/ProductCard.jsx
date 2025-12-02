// react
import React from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

// application
import AsyncAction from "./AsyncAction";
import Rating from "./Rating";
import { cartAddItem } from "../../store/cart";
import { Quickview16Svg } from "../../svg";
import { compareAddItem } from "../../store/compare";
import { quickviewOpen } from "../../store/quickview";
import { url } from "../../services/utils";
import { wishlistAddItem } from "../../store/wishlist";

function ProductCard(props) {
    const {
        mainProduct,
        product,
        doHandleChooseProduct,
        layout,
        quickviewOpen,
        cartAddItem,
        dispatch,
        customer,
        forAct,
    } = props;
    let zone = "";
    console.log(product, "compare");
    zone = customer?.school?.location?.zone ?? null;
    // console.log(product.ppnTagItem);
    // if (Object.keys(customer).length > 0) {
    //     zone = customer?.school?.location?.zone;
    // }

    const containerClasses = classNames("product-card", {
        "product-card--layout--grid product-card--size--sm": layout === "grid-sm",
        "product-card--layout--grid product-card--size--nl": layout === "grid-nl",
        "product-card--layout--grid product-card--size--lg": layout === "grid-lg",
        "product-card--layout--list": layout === "list",
        "product-card--layout--horizontal": layout === "horizontal",
    });

    let badges = product?.badges?.map((item, index) => {
        return (
            <div
                key={index}
                className={classNames("product-card__badge", {
                    "product-card__badge--sale": item.includes("het") || item.includes("paket"),
                    "product-card__badge--hot": item.includes("grosir"),
                    "product-card__badge--new": item.includes("new") || item.includes("ppn"),
                })}
            >
                {item}
            </div>
        );
    });

    let image;

    badges = badges.length ? <div className="product-card__badges-list">{badges}</div> : null;

    if (product.images && product.images.length > 0) {
        if (forAct === "compare") {
            image = (
                <div className="product-card__image product-image">
                    <div className="product-image__body">
                        <img className="product-image__img" src={product.images[0]} alt="" />
                    </div>
                </div>
            );
        } else {
            image = (
                <div className="product-card__image product-image">
                    <Link to={url.product(product)} className="product-image__body">
                        <img className="product-image__img" src={product.images[0]} alt="" />
                    </Link>
                </div>
            );
        }
    }

    const handleAddCart = () => {
        if (customer?.token !== undefined && customer?.token !== "") {
            return cartAddItem(product, customer?.token);
        } else {
            return new Promise((resolve) => {
                props.history.push("/login");
                resolve();
            });
        }
    };
    const ppnRate = 0.12;

    const floorExcelLike = (number) => {
        const rounded = Math.round((number + Number.EPSILON) * 100) / 100;
        return Math.floor(rounded);
    };

    const dppPph = floorExcelLike(product.price.primary / 1.11);
    const dppNilaiLain = floorExcelLike((product.price.primary / 1.11) * (11 / 12));

    const ppn = Math.ceil(dppNilaiLain * ppnRate);

    const isDisabledCompare = mainProduct?.ppnType !== product?.ppnType;

    console.log(mainProduct, "mainProduct");

    return (
        <div className={containerClasses}>
            {forAct !== "compare" && (
                <AsyncAction
                    action={() => quickviewOpen(product.slug, product.mall.id, customer?.token)}
                    render={({ run, loading }) => (
                        <button
                            type="button"
                            onClick={run}
                            className={classNames("product-card__quickview", {
                                "product-card__quickview--preload": loading,
                            })}
                        >
                            <Quickview16Svg />
                        </button>
                    )}
                />
            )}
            {badges}
            {image}
            <div className="product-card__info">
                <div className="product-card__name">
                    {forAct === "compare" ? product.name : <Link to={url.product(product)}>{product.name}</Link>}
                </div>
                <div className="product-card__rating">
                    <Link to={`/store/${product.mall.slug}`}>
                        <small className="text-primary font-weight-bold">{`${product.mall.name} `}</small>
                    </Link>
                </div>

                <div className="product-card__rating mt-0">
                    <small className="d-block ">{`${product.mall.type}`}</small>
                </div>
                {forAct === "compare" && (
                    <div className="product-card__rating mt-0">
                        <small className="d-block">Stok : {`${product.stock}`}</small>
                    </div>
                )}
                <div className="product-card__rating mt-0">
                    <small className="font-weight-bold">
                        <i class="fas fa-map-marker-alt"></i> {`${product.mall.city}`}
                    </small>
                </div>
                <div className="product-card__rating">
                    <Rating value={product.rating} />
                    <div className=" product-card__rating-legend font-weight-bold">{`${product.review} Reviews`}</div>
                </div>
            </div>
            {product.stock === "0" && (
                <Link
                    to={url.product(product)}
                    className="d-flex justify-content-center align-items-center"
                    style={{
                        position: "absolute",
                        top: " 50%",
                        width: "100%",
                        height: "100%",
                        left: " 50%",
                        zIndex: 1,
                        transform: "translate(-50%, -50%)",
                        msTransform: "translate(-50%, -50%)",
                        textAlign: "center",
                        background: "rgba(0,0,0,.6)",
                        padding: "17px",
                        color: "white",
                        borderRadius: "20px",
                    }}
                >
                    <h5>Produk Kosong</h5>
                </Link>
            )}
            <div className="product-card__actions">
                <span className="font-weight-bold" style={{ color: "rgb(255, 98, 33)" }}>
                    {product.price.zone.length > 0 && props.auth
                        ? product.price.zone[zone - 1].priceCurrencyFormat
                        : product.price.primaryCurrencyFormat}
                </span>

                <div className="font-weight-bold mt-2" style={{ fontSize: "11px", color: "#6c757d" }}>
                    {product?.ppnType === "non" || product?.ppnTagItem === "" ? (
                        <>
                            <div style={{ color: "#28A745" }}>Bebas Pajak</div>
                            <div>DPP Nilai Lain: Rp 0</div>
                            <div>PPN 12%: Rp 0</div>
                            <div>DPP PPH: {product?.price.primary.toLocaleString("id-ID")}</div>
                        </>
                    ) : (
                        <>
                            <div style={{ color: "#a72828" }}>Harga Termasuk Pajak</div>

                            <div>DPP PPH: Rp {dppPph.toLocaleString("id-ID")}</div>
                            <div>DPP Nilai Lain: Rp {dppNilaiLain.toLocaleString("id-ID")}</div>
                            <div>
                                PPN {ppnRate * 100}%: Rp {ppn.toLocaleString("id-ID")}
                            </div>
                        </>
                    )}
                </div>

                <div className="product-card__buttons">
                    {forAct !== "compare" ? (
                        <AsyncAction
                            action={handleAddCart}
                            render={({ run, loading }) => (
                                <React.Fragment>
                                    <button
                                        type="button"
                                        onClick={run}
                                        disabled={product.stock === 0}
                                        className={classNames("btn btn-primary product-card__addtocart", {
                                            "btn-loading": loading,
                                        })}
                                    >
                                        Tambah ke keranjang
                                    </button>
                                </React.Fragment>
                            )}
                        />
                    ) : (
                        <>
                            <AsyncAction
                                action={() => doHandleChooseProduct(mainProduct, product, dispatch)}
                                render={({ run, loading }) => (
                                    <button
                                        type="button"
                                        onClick={run}
                                        className={classNames("btn product-card__addtocart", {
                                            "btn-primary": !isDisabledCompare,
                                            "btn-disabled": isDisabledCompare,
                                            "btn-loading": loading,
                                        })}
                                    >
                                        Pilih
                                    </button>
                                )}
                            />

                            {/* Nego */}
                            {/* {product.price.primary >= 50000000 ? (
                                <AsyncAction
                                    action={() => quickviewOpen(product.slug, product.mall.id, customer?.token)}
                                    render={({ run, loading }) => (
                                        <button
                                            type="button"
                                            onClick={run}
                                            disabled={isDisabledCompare}
                                            className={classNames("btn btn-danger product-card__addtocart", {
                                                "btn-loading": loading,
                                            })}
                                        >
                                            Nego
                                        </button>
                                    )}
                                />
                            ) : (
                                <AsyncAction
                                    action={() => quickviewOpen(product.slug, product.mall.id, customer?.token)}
                                    render={({ run, loading }) => (
                                        <button
                                            type="button"
                                            onClick={run}
                                            disabled={isDisabledCompare}
                                            className={classNames("btn btn-default product-card__addtocart", {
                                                "btn-loading": loading,
                                            })}
                                        >
                                            Nego
                                        </button>
                                    )}
                                />
                            )} */}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

ProductCard.propTypes = {
    /**
     * product object
     */
    product: PropTypes.object.isRequired,
    /**
     * product card layout
     * one of ['grid-sm', 'grid-nl', 'grid-lg', 'list', 'horizontal']
     */
    layout: PropTypes.oneOf(["grid-sm", "grid-nl", "grid-lg", "list", "horizontal"]),
};

const mapStateToProps = (state) => ({
    customer: state.customer,
    auth: state.auth,
});

const mapDispatchToProps = {
    cartAddItem,
    wishlistAddItem,
    compareAddItem,
    quickviewOpen,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductCard));
