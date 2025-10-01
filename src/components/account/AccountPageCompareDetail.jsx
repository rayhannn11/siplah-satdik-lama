// react
import React, { useEffect, useReducer, useRef } from "react";
// third-party
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

// data stub
import theme from "../../data/theme";
// application
import { ArrowLeft } from "../../svg";
import BlockHeader from "../shared/BlockHeader";
import StroykaSlick from "../shared/StroykaSlick";
import { FETCH_COMPARE_DETAIL, FETCH_COMPARE_DETAIL_SUCCESS } from "../../data/constant";
import BlockLoader from "../blocks/BlockLoader";
import customerApi from "../../api/customer";
import { connect } from "react-redux";

const slickSettings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 400,
    slidesToShow: 2,
    slidesToScroll: 2,
    responsive: [
        {
            breakpoint: 1199,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
            },
        },
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 767,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 575,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
    ],
};

const initialState = {
    compareDetail: null,
    compareDetailIsLoading: true,
};

function reducer(state, action) {
    switch (action.type) {
        case FETCH_COMPARE_DETAIL:
            return { ...state, compareDetailIsLoading: true };
        case FETCH_COMPARE_DETAIL_SUCCESS:
            return { ...state, compareDetailIsLoading: false, compareDetail: action.compareDetail };
        default:
            throw new Error();
    }
}

const AccountPageCompareDetail = (props) => {
    const slickRef = useRef();
    const [state, dispatch] = useReducer(reducer, initialState);
    const { id } = useParams();
    const { token } = props.customer;

    let content;

    useEffect(() => {
        dispatch({ type: FETCH_COMPARE_DETAIL });
        customerApi.getCompareDetail(id, token).then((res) => {
            const { data } = res;
            console.log("85: "+res);

            dispatch({ type: FETCH_COMPARE_DETAIL_SUCCESS, compareDetail: data });
        });
        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleNextClick = () => {
        if (slickRef.current) {
            slickRef.current.slickNext();
        }
    };

    const handlePrevClick = () => {
        if (slickRef.current) {
            slickRef.current.slickPrev();
        }
    };

    const setSlickRef = (ref) => {
        slickRef.current = ref;
    };

    if (state.compareDetailIsLoading) {
        return <BlockLoader />;
    }
    if (state.compareDetail === null || Object.keys(state.compareDetail) === 0) {
        content = (
            <div className="row justify-content-center align-items-center h-50">
                <div className="col-6">
                    <h4>Data Tidak Ditemukan</h4>
                </div>
            </div>
        );
    } else {
        const { subTitle, compareList } = state.compareDetail;

        content = (
            <>
                <div className="card">
                    <h5 className="text-center mt-4">Detail Perbandingan</h5>
                    <h6 className="text-center" dangerouslySetInnerHTML={{ __html: subTitle }} />
                    <div className="card-body">
                        <div className="block block-brands">
                            <BlockHeader arrows title={""} onNext={handleNextClick} onPrev={handlePrevClick} />
                            <StroykaSlick ref={setSlickRef} {...slickSettings}>
                                {compareList.map((item) => (
                                    <div className="p-3">
                                        <div class="card w-100">
                                            <div class="card-header">
                                                <h6 className="text-primary">{item.mall.name}</h6>
                                                <small>{item.mall.location}</small>
                                            </div>
                                            <div className="card-divider" />
                                            {item.mall.product.map((p, index) => {
                                                if (p === null) {
                                                    return (
                                                        <>
                                                            {index !== 0 && <div className="card-divider" />}
                                                            <div className="row my-0">
                                                                <div className="col-md-12 py-4">
                                                                    <p className="text-center">Barang tidak ada</p>
                                                                </div>
                                                            </div>
                                                        </>
                                                    );
                                                }
                                                return (
                                                    <>
                                                        {index !== 0 && <div className="card-divider" />}
                                                        <div className="row my-2">
                                                            <div className="col-md-4">
                                                                <img
                                                                    src={p.image}
                                                                    alt={p.name}
                                                                    style={{
                                                                        width: "100%",
                                                                        height: "75px",
                                                                        marginLeft: "16px",
                                                                        objectFit: "contain",
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="col-md-8">
                                                                <h6
                                                                    style={{
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                        wordBreak: "break-all",
                                                                        whiteSpace: "nowrap",
                                                                        marginBottom: "0px",
                                                                    }}
                                                                >
                                                                    {p.name}
                                                                </h6>
                                                                <h6>
                                                                    {p.priceCurrencyFormat} x{p.qty}
                                                                </h6>
                                                            </div>
                                                        </div>
                                                    </>
                                                );
                                            })}
                                            <div className="card-divider" />
                                            <div className="card-footer">
                                                <div className="d-flex my-2 justify-content-between align-items-center">
                                                    <h6>Lama Pengiriman</h6>
                                                    <h6>{item.longDelivery}</h6>
                                                </div>
                                                <div className="d-flex my-2 justify-content-between align-items-center">
                                                    <h6>Jasa Pengiriman</h6>
                                                    <h6>
                                                        {item.shippingName}({item.shippingCostCurrencyFormat})
                                                    </h6>
                                                </div>
                                                <div className="d-flex my-2 justify-content-between align-items-center">
                                                    <h6>Pembungkus</h6>
                                                    <h6>{item.wrapping}</h6>
                                                </div>
                                                <div className="d-flex my-2 justify-content-between align-items-center">
                                                    <h6>Garansi</h6>
                                                    <h6>{item.warranty}</h6>
                                                </div>
                                                <div className="d-flex my-2 justify-content-between align-items-center">
                                                    <h6>Total</h6>
                                                    <h6 className="float-left ">{item.totalCurrencyFormat}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </StroykaSlick>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>{`Detail Perbandingan — ${theme.name}`}</title>
            </Helmet>
            <h6 style={{ cursor: "pointer" }} className="mb-3" onClick={() => props.history.push("/account/compare")}>
                <ArrowLeft className="float-left mr-2" /> Kembali ke Perbandingan
            </h6>
            {content}
        </>
    );
};

const mapStateToProps = (state) => ({ customer: state.customer });

export default connect(mapStateToProps, null)(AccountPageCompareDetail);
