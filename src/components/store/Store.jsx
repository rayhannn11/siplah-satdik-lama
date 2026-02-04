import React, { useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import theme from "../../data/theme";
import storeApi from "../../api/store";
import { FETCH_DETAIL_STORE, FETCH_DETAIL_STORE_SUCCESS } from "../../data/constant";
import BlockLoader from "../blocks/BlockLoader";
import ShopProducts from "../shop/ShopProducts";
import ModalChat from "../shared/ModalChat";
import { connect } from "react-redux";
import Rating from "../shared/Rating";
import ModalMallReviews from "../shared/ModalMallReviews";

const initialState = {
    store: null,
    storeIsLoading: true,
};

function reducer(state, action) {
    switch (action.type) {
        case FETCH_DETAIL_STORE:
            return { ...state, storeIsLoading: true };

        case FETCH_DETAIL_STORE_SUCCESS:
            return { ...state, storeIsLoading: false, store: action.store };

        default:
            throw new Error();
    }
}

const Store = (props) => {
    const { slug } = useParams();
    const [state, dispatch] = useReducer(reducer, initialState);
    const [isOpen, setIsOpen] = useState(false);
    const [openReviews, setOpenReviews] = useState(false);

    const { store, storeIsLoading } = state;

    useEffect(() => {
        dispatch({ type: FETCH_DETAIL_STORE });
        storeApi.getStore(slug).then((res) => {
            const { data, status } = res;
            if (status.code === 200) {
                dispatch({ type: FETCH_DETAIL_STORE_SUCCESS, store: data });
            } else {
                dispatch({ type: FETCH_DETAIL_STORE_SUCCESS, store: null });
            }
        });
        return () => { };
    }, [slug]);

    const doOpenModal = () => {
        setIsOpen(!isOpen);
    };

    if (storeIsLoading) {
        return <BlockLoader />;
    }

    if (store == null) {
        return (
            <div className="block block-empty ">
                <div className="container">
                    <div className="block-empty__body">
                        <div className="block-empty__message">Toko Tidak Ditemukan</div>
                        <div className="block-empty__actions">
                            <Link to="/store" className="btn btn-primary btn-sm">
                                Cari Toko
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-4" style={{ backgroundColor: 'rgb(236, 236, 237)' }}>
            <Helmet>
                <title>{`${store.name} — ${theme.name}`}</title>
            </Helmet>
            <div className="container">
                <div className="card shadow" style={{ borderRadius: '20px' }}>
                    <div
                        style={{
                            display: "block",
                            width: "100%",
                            maxWidth: "1200px",
                            maxHeight: "100%",
                            position: "relative",
                            paddingTop: "30.25%",
                            overflow: "hidden",
                            backgroundColor: "rgb(255,247,241)",
                            borderTopLeftRadius: '20px',
                            borderTopRightRadius: '20px',
                            borderBottom: "2px solid #F0F0F0",
                        }}
                    >
                        <img
                            alt=""
                            src={store.image.header}
                            style={{
                                display: "block",
                                position: "absolute",
                                height: "100%",
                                objectFit: "contain",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%,-50%)",
                            }}
                        />
                    </div>
                    <div className="card-body position-relative" style={{ borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px', backgroundColor: 'rgb(255,247,241)' }}>
                        <div
                            className="rounded-circle shadow d-flex justify-content-center position-absolute img-profile__store bg-white"
                            style={{
                                background: ` no-repeat center/75% url(${store.image.primary})`,
                            }}
                        ></div>
                        <div className="row">
                            <div className="col-md-4">
                                <h4 className="m-0">{store.name}</h4>
                                <span>
                                    {store.location.province} | Total {store.totalProduct} Produk
                                </span>
                            </div>
                            <div className="offset-md-2 col-md-4">
                                {props.auth && (
                                    <button className="btn btn-sm btn-primary d-block mt-1" onClick={doOpenModal}>
                                        Chat Penjual
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <small className="store-info__title mt-2">Nama PIC</small>
                                <small className="mt-0 text-uppercase">{store.pic.name}</small>
                                <small className="store-info__title mt-2">Telp PIC</small>
                                <small className="mt-0">{store.pic.phone}</small>
                                <small className="store-info__title mt-2">Jabatan PIC</small>
                                <small className="mt-0 text-uppercase">{store.pic.position}</small>
                            </div>
                            <div className="col-md-6">
                                <small className="store-info__title">Alamat Toko</small>
                                <small className="mt-0">{store.location.address}</small>
                                <small className="store-info__title">Email Toko</small>
                                <small className="mt-0">{store.email}</small>
                                <small className="store-info__title">Jenis Usaha</small>
                                <small className="mt-0">{store.type}</small>
                                <small className="store-info__title">Rating Toko</small>
                                <div className="product__rating mt-2">
                                    <div className="product__rating-stars">
                                        <Rating value={store.averageRating} />
                                    </div>
                                    <div
                                        className="product__rating-legend"
                                        style={{ color: "blue", cursor: "pointer" }}
                                        onClick={() => setOpenReviews(!openReviews)}
                                    >
                                        <u>({`${store.totalRating} Ulasan`})</u>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ModalMallReviews storeId={store.id} toggle={setOpenReviews} isOpen={openReviews} />
            </div>
            <ShopProducts forAct="store" storeData={store} />
            {props.auth && isOpen && <ModalChat isOpen={isOpen} toggle={doOpenModal} store={store} />}
        </div>
    );
};

const mapStateToProps = (state) => ({ auth: state.auth });

export default connect(mapStateToProps, null)(Store);
