// react
import React, { useEffect } from "react";

import propTypes from "prop-types";
import { Link } from "react-router-dom";
import shopApi from "../../api/shop";
import { useState } from "react";
import { url } from "../../services/utils";

function ProductTabDescription(props) {
    const { productId, content } = props;
    const [productPackets, setProductPackets] = useState([]);

    useEffect(() => {
        shopApi.getProductPacket(productId).then((res) => {
            setProductPackets(res);
        });
        return () => {};

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]);

    return (
        <div className="typography">
            <h3>Deskripsi Produk</h3>
            <div dangerouslySetInnerHTML={{ __html: content }}></div>
            {productPackets.length > 0 && (
                <>
                    <h5>Daftar Paket</h5>
                    <div className="card-table">
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Gambar</th>
                                        <th>Nama Produk</th>
                                        <th>Harga</th>
                                        <th>Detail</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productPackets.map((item, index) => {
                                        const formatPrice = new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                            minimumFractionDigits: 0,
                                        }).format(item.price);

                                        return (
                                            <tr key={item.id}>
                                                <td>{++index}</td>
                                                <td>
                                                    <img
                                                        src={`https://cdn.eurekabookhouse.co.id/ebh/product/all/${item.image}`}
                                                        style={{
                                                            width: "70px",
                                                            height: "70px",
                                                            objectFit: "contain",
                                                        }}
                                                    />
                                                </td>
                                                <td>
                                                    <p className="mb-0">{item.name}</p>
                                                </td>
                                                <td>{formatPrice}</td>
                                                <td>
                                                    <Link
                                                        className="btn btn-primary btn-md fw-bold px-3 py-1 rounded"
                                                        to={url.product({ mall: { id: item.mall_id }, slug: item.seo })}
                                                    >
                                                        Lihat
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

ProductTabDescription.propTypes = {
    content: propTypes.string,
};

export default ProductTabDescription;
