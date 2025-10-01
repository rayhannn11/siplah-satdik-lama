import React from "react";
import PropTypes from "prop-types";

import { LazyLoadImage } from "react-lazy-load-image-component";

const FooterMethod = (props) => {
    console.log(props, "footer image");
    const isPayment = props.title === "Pembayaran";

    return (
        <div className="site-footer__widget footer-newsletter">
            <h5 className="footer-links__title">{props.title}</h5>
            <div className="row">
                {props.images.map((item, index) => {
                    const src = item.startsWith("/images") ? process.env.PUBLIC_URL + item : item;
                    return (
                        <div
                            key={index}
                            className="col-3 d-flex"
                            style={{
                                marginTop: "auto",
                                marginBottom: "auto",
                            }}
                        >
                            <img
                                src={src}
                                alt={`payment-${index}`}
                                style={{
                                    width: isPayment ? "80px" : "120px",
                                    height: "auto",
                                    objectFit: "contain",
                                    marginBottom: isPayment ? "6px" : "0px",
                                }}
                                onError={(e) => {
                                    // fallback kalau gambar gagal load
                                    e.target.onerror = null;
                                    e.target.src = process.env.PUBLIC_URL + "/images/fallback.png";
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

FooterMethod.propTypes = {
    title: PropTypes.string.isRequired,
    images: PropTypes.array.isRequired,
};

export default FooterMethod;
