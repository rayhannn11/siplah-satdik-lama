import React, { useEffect, useReducer } from "react";
import { Link, useParams } from "react-router-dom";

import { FETCH_COMPARISON_REPORT, FETCH_COMPARISON_REPORT_SUCCESS } from "../../data/constant";
import customerApi from "../../api/customer";
import BlockLoader from "../blocks/BlockLoader";
import { connect } from "react-redux";
import { url } from "../../services/utils";

const initialState = {
    comparisonReport: null,
    comparisonReportIsLoading: true,
};

function reducer(state, action) {
    switch (action.type) {
        case FETCH_COMPARISON_REPORT:
            return { ...state, comparisonReportIsLoading: true };

        case FETCH_COMPARISON_REPORT_SUCCESS:
            return { ...state, comparisonReportIsLoading: false, comparisonReport: action.comparisonReport };

        default:
            throw new Error();
    }
}

const AccountPageComparisonReports = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { id } = useParams();
    const { customer } = props;

    useEffect(() => {
        dispatch({ type: FETCH_COMPARISON_REPORT });
        customerApi.getCompareReport(id, customer.token).then((res) => {
            const { data } = res;

            dispatch({ type: FETCH_COMPARISON_REPORT_SUCCESS, comparisonReport: data });
        });
        return () => {};
    }, [state.options, customer.token, id]);
    if (state.comparisonReportIsLoading) {
        return <BlockLoader />;
    }
    const { comparisonReport } = state;

    const productRowInfo = comparisonReport.compareList.map((item) => {
        let image;
        const { product } = item.mall;

        if (product.image) {
            image = (
                <div className="compare-table__product-image product-image">
                    <div className="product-image__body">
                        <img className="product-image__img" src={product.image} alt="" />
                    </div>
                </div>
            );
        }

        return (
            <td key={product.id}>
                <Link to={url.product({ ...product, mall: item.mall })} className="compare-table__product-link">
                    {image}
                    <div className="compare-table__product-name">{product.name}</div>
                </Link>
            </td>
        );
    });
    const productStore = comparisonReport.compareList.map((item) => {
        const { product } = item.mall;
        return (
            <td key={product.id}>
                <div>{item.mall.name}</div>
            </td>
        );
    });
    const productPrices = comparisonReport.compareList.map((item) => {
        const { product } = item.mall;
        return (
            <td key={product.id}>
                <div>{product.priceCurrencyFormat}</div>
            </td>
        );
    });
    const productSpecification = comparisonReport.compareList.map((item) => {
        const { product } = item.mall;
        return (
            <td key={product.id}>
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </td>
        );
    });
    const estimate = comparisonReport.compareList.map((item) => {
        const { product } = item.mall;
        return (
            <td key={product.id}>
                <div>{item.longDelivery}</div>
            </td>
        );
    });
    const address = comparisonReport.compareList.map((item) => {
        const { address, product } = item.mall;
        return (
            <td key={product.id}>
                <div>{address}</div>
            </td>
        );
    });

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="card-title text-center">BERITA ACARA HASIL PEMBANDINGAN</h5>
                <div className="card-divider my-3" />
                <p className="card-text">Nama Satuan Pendidikan : {customer.school.name}</p>
                <p className="card-text">
                    Hasil Pembandingan : <span dangerouslySetInnerHTML={{ __html: comparisonReport.subTitle }}></span>
                </p>
                <a
                    href={comparisonReport.printDocument}
                    className="btn btn-primary btn-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <i class="fa fa-download mr-1" aria-hidden="true"></i>
                    Unduh Dokumen
                </a>
            </div>
            <div className="card-divider my-3" />
            <div className="block">
                <div className="container">
                    <div className="table-responsive">
                        <table className="table compare-table">
                            <tbody>
                                <tr>
                                    <th>Produk</th>
                                    {productRowInfo}
                                </tr>
                                <tr>
                                    <th>Toko</th>
                                    {productStore}
                                </tr>
                                <tr>
                                    <th>Harga</th>
                                    {productPrices}
                                </tr>
                                <tr>
                                    <th>Spesifikasi</th>
                                    {productSpecification}
                                </tr>
                                <tr>
                                    <th>Estimasi Pengiriman</th>
                                    {estimate}
                                </tr>
                                <tr>
                                    <th>Alamat Calon Penyedia </th>
                                    {address}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    customer: state.customer,
});

export default connect(mapStateToProps, () => ({}))(AccountPageComparisonReports);
