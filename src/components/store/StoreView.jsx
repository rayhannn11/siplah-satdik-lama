// react
import React, { useCallback } from "react";

// third-party
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link } from "react-router-dom";
import Select from "react-select";
import Pagination from "../shared/Pagination";
import { SET_OPTION_VALUE } from "../../data/constant";

function useSetOption(option, filter, dispatch) {
    const callback = useCallback(filter, []);

    return useCallback(
        (data) => {
            dispatch({
                type: SET_OPTION_VALUE,
                option,
                value: callback(data),
            });
        },
        [option, callback, dispatch]
    );
}

const StoreView = (props) => {
    const {
        storeList,
        isLoading,
        state,
        dispatch,
        doHandleChooseStore,
        doChangeProvince,
        doChangeCity,
        doChangeDistrict,
        doChangeKeywordValue,
        layout,
        options,
    } = props;

    let storeListItems;

    const handlePageChange = useSetOption("page", parseFloat, dispatch);

    const rootClasses = classNames("products-view", {
        "products-view--loading": isLoading,
    });

    if (storeList.items === undefined) {
        storeListItems = [];
    } else {
        if (layout === "modal") {
            storeListItems = storeList.items.map((item, index) => (
                <div className={`col-lg-6 mt-3`}>
                    <div class="card " style={{ borderRadius: "12px" }}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-5">
                                    <img src={item.image.primary} alt="" className="img-contain" />
                                </div>
                                <div className="col-7">
                                    <h5 className="font-weight-bold"style={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            wordBreak: " break-all",
                                            whiteSpace: "nowrap",
                                            marginBottom: "0px",
                                            textTransform:'uppercase'
                                        }}
                                    >
                                        {item.name}
                                    </h5>
                                    <h6 className="mb-0">{item.location.province}</h6>
                                    <div>
                                        <small>{item.totalProduct} Produk</small>
                                    </div>
                                    <button className="btn btn-primary" onClick={() => doHandleChooseStore(item)}>
                                        Pilih
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ));
        } else {
            storeListItems = storeList.items.map((item, index) => (
                <div className={`col-lg-6 mt-3`}>
                    <Link to={`/store/${item.slug}`} className="text-dark">
                        <div class="card shadow" style={{ borderRadius: "12px" }}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-5">
                                        <img src={item.image.primary} alt="" className="img-contain" />
                                    </div>
                                    <div className="col-7">
                                        <h5 style={{color:'rgb(255, 98, 33)'}} className="font-weight-bold text-uppercase">{item.name}</h5>
                                        <span className="text-secondary d-block">{item.location.city}</span>
                                        <small className="text-primary">{item.totalProduct} Produk</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            ));
        }
    }

    return (
        <>
            <div className="row mt-3">
                <div className="col-12">
                    <div class="card bg-danger border-0 shadow" style={{ borderRadius: '20px' }}>
                        <div class="card-body">
                            <div className="row align-items-center">
                                <div className="col-12 mb-2">
                                    <h4 className="text-white">Cari penyedia sesuai wilayah</h4>
                                </div>
                                <div className="col-lg-4 col-sm-6">
                                    <div class="form-group">
                                        <Select
                                            isClearable
                                            className="basic-single"
                                            classNamePrefix="select"
                                            value={state.selectedProvince}
                                            onChange={doChangeProvince}
                                            isLoading={state.provinceIsLoading}
                                            isSearchable={true}
                                            name={"province"}
                                            placeholder="Pilih Provinsi"
                                            options={state.provincesList}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-sm-6">
                                    <div class="form-group">
                                        <Select
                                            isClearable
                                            className="basic-single"
                                            classNamePrefix="select"
                                            value={state.selectedCity}
                                            onChange={doChangeCity}
                                            isLoading={state.cityIsLoading}
                                            isSearchable={true}
                                            name={"city"}
                                            isDisabled={state.citiesList == null}
                                            placeholder="Pilih Kabupaten/Kota"
                                            options={state.citiesList}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-4 col-sm-6 ">
                                    <div class="form-group">
                                        <Select
                                            isClearable
                                            className="basic-single"
                                            classNamePrefix="select"
                                            value={state.selectedDistrict}
                                            onChange={doChangeDistrict}
                                            isLoading={state.districtIsLoading}
                                            isSearchable={true}
                                            name={"district"}
                                            isDisabled={state.districtsList == null}
                                            placeholder="Pilih Kecamatan"
                                            options={state.districtsList}
                                        />
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div class="form-group">
                                        <input
                                            type="text"
                                            class="form-control"
                                            value={state.keyword}
                                            onChange={doChangeKeywordValue}
                                            placeholder="Cari Nama Toko ..."
                                            style={{ borderRadius: '10px' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={rootClasses}>
                <div className="products-view__loader" />
                {storeListItems.length > 0 ? (
                    <>
                        <div class="row">{storeListItems}</div>
                        <div className="products-view__pagination">
                            <Pagination
                                white={true}
                                current={options.page || storeList.page}
                                siblings={2}
                                total={storeList.pages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </>
                ) : (
                    <div className="row mt-3">
                        <div className="col-12">
                            <h3 className="text-center">Maaf, Toko Tidak Ditemukan</h3>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

StoreView.propTypes = {
    storeList: PropTypes.object,
    isLoading: PropTypes.bool,
    state: PropTypes.object,
    doChangeCity: PropTypes.func,
    doChangeDistrict: PropTypes.func,
    doChangeProvince: PropTypes.func,
    dispatch: PropTypes.func,
    layout: PropTypes.oneOf(["default", "modal"]),
    doChangeKeywordValue: PropTypes.func,
    options: PropTypes.object,
};

StoreView.defaultPropTypes = {
    isLoading: true,
};

export default StoreView;
