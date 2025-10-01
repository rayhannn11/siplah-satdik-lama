// react
import React, { useCallback, useEffect, useReducer, useState } from "react";

// third-party
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import classNames from "classnames";
import queryString from "query-string";
import Select from "react-select";


// application
import Pagination from "../shared/Pagination";
import BlockLoader from "../blocks/BlockLoader";

// data stubs
import theme from "../../data/theme";
import { FETCH_ORDER_LIST, FETCH_ORDER_LIST_SUCCESS, FETCH_MALL_LIST, FETCH_MALL_LIST_SUCCESS, SET_FILTER_VALUE, SET_OPTION_VALUE } from "../../data/constant";
import customerApi from "../../api/customer";
import storeApi from "../../api/store";
import { connect } from "react-redux";
// import DateRangePicker from "react-bootstrap-daterangepicker";

const initialState = { 
    mallList : null,
    orderList: null,
    orderListIsLoading: true,
    filters: { type: "all", date: `${new Date().toLocaleDateString()}-${new Date().toLocaleDateString()}` },
    options: {},
    keyword:'', 
};

function parseQueryOptions(location) {
    const query = queryString.parse(location);

    const optionValues = {
        page: 1,
        limit: 10,
        status: 0,
    };

    if (typeof query.page === "string") {
        optionValues.page = parseFloat(query.page);
    }

    if (query.status) {
        optionValues.status = query.status;
    }

    return optionValues;
}

function parseQueryFilters(location) {
    const query = queryString.parse(location);
    const filterValues = {};

    Object.keys(query).forEach((param) => {
        const mr = param.match(/^filter_([-_A-Za-z0-9]+)$/);

        if (!mr) {
            return;
        }

        const filterSlug = mr[1];

        filterValues[filterSlug] = query[param];
    });

    return filterValues;
}

function parseQuery(location) {
    return [parseQueryOptions(location), parseQueryFilters(location)];
}

function buildQuery(options, filters) {
    const params = {};

    if (options.page !== 1) {
        params.page = options.page;
    }

    if (options.status !== 0) {
        params.status = options.status;
    }
    if (options.keyword !== "") {
        params.keyword = options.keyword;
    }

    Object.keys(filters)
        .filter((x) => x !== "category" && !!filters[x])
        .forEach((filterSlug) => {
            params[`filter_${filterSlug}`] = filters[filterSlug];
        });

    return queryString.stringify(params, { encode: false });
}

function reducer(state, action) {
    switch (action.type) {
        case FETCH_MALL_LIST:
            return {
                ...state,
                orderListIsLoading: true,
            };
        case FETCH_ORDER_LIST_SUCCESS:
            return {
                ...state,
                orderListIsLoading: false,
                orderList: action.orderList,
            };
        case FETCH_MALL_LIST_SUCCESS:
            return {
                ...state,
                orderListIsLoading: false,
                mallList: action.mallList,
            };

        case SET_FILTER_VALUE:
            return {
                ...state,
                options: { ...state.options, page: 1 },
                filters: { ...state.filters, [action.filter]: action.value },
            };
        case SET_OPTION_VALUE:
            return {
                ...state,
                options: { ...state.options, page: 1, [action.option]: action.value },
            };

        default:
            throw new Error();
    }
}

function init(state) {
    const [options, filters] = parseQuery(window.location.search);

    return { ...state, options, filters };
}

const AccountPageOrdersBulk = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState, init);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [mallDetails, setmallDetails] = useState({});
    const [nextPage, setnextPage] = useState("false");
    const [file, setFile] = useState(null);
    const { token } = props.customer;
    const { 
        isLoading,  
    } = props;
    
    let contentCari;
    let contentUtama;
    let content;

    const rootClasses = classNames("products-view", {
        "products-view--loading": isLoading,
    });

    const handleChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
          

        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch('https://jaja.id', {
              method: 'POST',
              body: formData,
            });
      
            if (response.ok) {
                // <Link to="/target-url" />
              console.log('File uploaded successfully');
            } else {
              console.error('File upload error', response);
            }
          } catch (error) {
            console.error('File upload error', error);
          }
    }

    const handleSearch = useCallback(() => {
        dispatch({ type: "SET_OPTION_VALUE", option: "keyword",  value: searchKeyword });
    }, [dispatch, searchKeyword]);

    useEffect(() => {
        const query = buildQuery(state.options, state.filters);

        const location = `${window.location.pathname}${query ? "?" : ""}${query}`;
        window.history.replaceState(null, "", location);
    }, [state.options, state.filters]);

    useEffect(() => {
        dispatch({ type: FETCH_MALL_LIST });
        storeApi.getStores(state.options, { ...state.filters }, searchKeyword,  token).then((res) => {
            const { data } = res;

            dispatch({ type: FETCH_MALL_LIST_SUCCESS, mallList: data });
        });
    }, [state.options, token]);

 
  
    const handlePageChange = (page) => {
        dispatch({
            type: "SET_OPTION_VALUE",
            option: "page",
            value: page,
        });
    };

    if (state.orderListIsLoading) {
        return <BlockLoader />;
    }

    if (state.mallList.items.length > 0) {
        contentCari = (
            <>
                <div className="row mt-3">
            {state.mallList.items.map((item, index) => (
                <div className={`col-lg-6 mt-3`} style={{ height : "304px !important"}}> 
                        <div class="card shadow" style={{ borderRadius: "12px",  height : "304px !important" }}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-2 " >
                                        <img src={item.image.primary} alt="" className="img-contain" style={{borderRadius: "100%"}}/>
                                    </div>
                                    <div className="col-10">
                                        <h5 style={{color:'#0E336D'}} className="font-weight-bold text-uppercase">{item.name}</h5>
                                        <small className="text-secondary d-block"><b>Alamat</b>: {item.location.address}</small>
                                        <small className="text-secondary d-block"><b>Kota</b>: {item.location.city}</small>
                                        <small className="text-secondary d-block"><b>Produk</b>: {item.totalProduct} produk</small>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-2 " > 
                                    </div>
                                    <div className="col-10">
                                        <hr/> 
                                            <button
                                                style={{borderRadius: '10px',  color: 'white'}} 
                                                class="btn mr-2 btn-primary btn-sm shadow"
                                                type="submit"
                                                onClick={(e)=>  (setnextPage("true"), setmallDetails(item) ) }
                                            >
                                                Pesan dari Penyedia ini
                                            </button> 
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                     
                </div>
            )) }
                </div>
                <hr/>
                <div className="mt-2">
                    <Pagination
                        current={state.options.page || state.orderList.page}
                        siblings={2}
                        total={state.mallList.pages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </>
        );
    } else {
        contentCari = (
            <div className="block block-empty w-100">
                <div className="container">
                    <div className="block-empty__body">
                        <div className="block-empty__message">Data tidak ditemukan</div>
                    </div>
                </div>
            </div>
        );
    }

    if ( nextPage ===  'false' ) {
        contentUtama = (
            <>
                <div className="container card" style={{padding: '10px'}}>
                    <h5>Belanja Sekaligus Banyak  </h5>
                    <p>Ikuti langkah-langkah dibawah ini untuk belanja banyak produk sekaligus </p>

                    <div className="row mt-3">
                        <div className="col-12">
                            <div class="card bg-danger border-0 shadow" style={{ borderRadius: '20px' }}>
                                <div class="card-body">
                                    <div className="row align-items-center">
                                        <div className="col-12 mb-2">
                                            <h4 className="text-white">1. Cari penyedia </h4>
                                            <p className="text-white">Anda hanya dapat belanja banyak produk dari satu penyedia </p>
                                        </div>
                                        

                                        <div className="col-9">
                                            <div class="form-group"> 
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    value={searchKeyword}
                                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                                    placeholder="Cari Nama Penyedia ..."
                                                    style={{ borderRadius: '10px' }}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="col-3">
                                            <div class="form-group">
                                                <button
                                                    style={{borderRadius: '10px',  color: 'white'}} 
                                                    class="btn mr-2 btn-primary shadow"
                                                    type="submit"
                                                    onClick={handleSearch}
                                                >
                                                    Cari Penyedia
                                                </button>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                
                    {contentCari}
            
                </div>
            </>
        );
    } else {
        contentUtama = (
            <div className="container card" style={{padding: '10px'}}>

                    <div class="form-group">
                    <button
                        style={{borderRadius: '10px',   color: 'white'}} 
                        class="btn mr-2 bg-secondary btn-sm shadow"
                        type="submit"
                        onClick={(e)=> setnextPage("false")}
                        >
                        {"Kembali Pilih Penyedia Lain"}
                    </button>
                                                
                                            </div>
                                    
                    <h5>1. Beli dari penyedia  </h5> 

                    <div className="row mt-3">
                        <div className="col-12">
                            <div class="card  border-0 shadow" style={{ borderRadius: '20px' }}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-3" >
                                        <img src={mallDetails.image.primary} alt="" className="img-contain"  />
                                    </div>
                                    <div className="col-9">
                                        <h5 style={{color:'#0E336D'}} className="font-weight-bold text-uppercase">{mallDetails.name}</h5>
                                        <h6 style={{color:'#0E336D'}} className="font-weight-bold text-uppercase">KODE: {mallDetails.code}</h6>
                                        <small className="text-secondary d-block"><b>Alamat</b>: {mallDetails.location.address}</small>
                                        <small className="text-secondary d-block"><b>Kota</b>: {mallDetails.location.city}</small> 
                                        <small className="text-secondary d-block"><b>Produk</b>: {mallDetails.totalProduct} produk</small>
                                    </div>
                                </div> 
                                
                            </div>
                            </div>
                        </div>
                    </div>
                    <hr/>  
                    <h5>2. Download file template dan katalog produk <b class="text-primary"> {mallDetails.name}</b></h5>
                    <span>Silakan download file template pemesanan dan katalog produk berikut ini :</span>
                    <div className="col-md-12" style={{color: '#FFF'}}>
                        <a
                            href={"https://siplah.eurekabookhouse.co.id/dokumentasi/File_Template_Pemesanan_Eureka.xlsx"}
                            target="_blank"
                            style={{borderRadius: '10px',  color: 'white', marginTop: '10px', marginBottom: '10px'}} 
                            class="btn mr-2 bg-primary shadow"
                            rel="noopener noreferrer"
                        > <small>
                            <i class="fa fa-download mr-1" aria-hidden="true" ></i>
                          Template Pemesanan.xls</small> 
                        </a> 
                        
                        <a
                            href={"https://siplah.eurekabookhouse.co.id/api/katalog/penyedia/"+mallDetails.code}
                            target="_blank"
                            style={{borderRadius: '10px',  color: 'white', marginTop: '10px', marginBottom: '10px'}} 
                            class="btn mr-2 bg-primary shadow"
                            rel="noopener noreferrer"
                        > <small>
                            <i class="fa fa-download mr-1" aria-hidden="true" ></i>
                          Katalog Produk.xls</small> 
                        </a> 
                    </div>
                    <span>Kemudian isi template pemesanan dengan lengkap.</span>
                    
                    <hr/>  
                    <h5>3. Unggah file template pemesanan</h5>
                    <p>Silakan unggah file template pemesanan yang telah diisi (max. 100 Produk):</p>
                           <div class="card bg-dark border-0 shadow" style={{ borderRadius: '20px' }}>
                                <div class="card-body">
                                    <div className="row align-items-center">
                                        <div className="col-12 mb-2">   
                                            <p className="text-white">File_Template_Pemesanan.xls </p>
                                        </div> 
                                        <div className="col-9">
                                            <div class="form-group"> 
                                                <input 
                                                    type="file" 
                                                    accept=".xlsx,.xls,.csv" 
                                                    class="form-control"
                                                    // value={file} 
                                                    onChange={handleChange}
                                                    placeholder="Pilih file tambah produk..."
                                                    style={{ borderRadius: '10px' }}
                                                />
                                            </div>
                                        </div>
                                         
                                    </div>
                                </div>
                            </div> 
                            <hr/>
                    <div className="col-md-12" style={{color: '#FFF'}}>
                      
                        
                    <button
                            style={{borderRadius: '10px',  color: 'white', marginTop: '10px', marginBottom: '10px'}} 
                            class="btn mr-2 bg-primary shadow"
                            rel="noopener noreferrer" 
                            type="submit"
                            onClick={handleFileUpload}
                        >
                        {"Tambah ke keranjang"}
                    </button>
                        
                    <button
                            style={{borderRadius: '10px',  color: 'white', marginTop: '10px', marginBottom: '10px'}} 
                            class="btn mr-2 bg-danger shadow"
                            rel="noopener noreferrer" 
                        onClick={(e)=> setnextPage("false")}
                        >
                        {"Batalkan"}
                    </button>
                        
                        
                    </div>
            
                </div>
        );
    }

   
    return (
        <>
            <Helmet>
                <title>{`Belanja Sekaligus Banyak`}</title>
            </Helmet>

            {contentUtama}


            
        </>
    );
};
const mapStateToProps = (state) => ({ customer: state.customer });
export default connect(mapStateToProps, null)(AccountPageOrdersBulk);
