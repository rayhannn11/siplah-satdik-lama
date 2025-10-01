// react
import React, { useState } from "react";

// third-party
import { Helmet } from "react-helmet-async";
import { withRouter } from "react-router-dom";
import classNames from "classnames";

// data stubs
import theme from "../../data/theme";
import customerApi from "../../api/customer";
import { loginCustomer } from "../../store/auth";
import { customerAdd } from "../../store/customer";
import { addMiniCart } from "../../store/mini-cart";
import { toast } from "react-toastify";
import { connect } from "react-redux";

function AccountPageLogin(props) {
    const [state, setState] = useState({});
    const [loading, setLoading] = useState(false);

    const doHandleChange = (e) => {
        const { value, name } = e.target;
        setState({ ...state, [name]: value });
    };
    const doLogin = (e) => {
        if (e !== undefined) {
            e.preventDefault();
        }
        setLoading(true);
        return new Promise((resolve) => {
            customerApi.login(state).then((res) => {
                const { data, status } = res;
                const token = data;
                if (status.code === 200) {
                    customerApi.getMiniCart(token).then((res) => {
                        const { data } = res;
                        props.addMiniCart(data);
                    });

                    customerApi.getCustomer(token).then((res) => {
                        const { data } = res;
                        props.customerAdd({ ...data, token });
                        props.loginCustomer(true);
                        toast.success("Login Berhasil");
                        setLoading(false);
                        props.history.push("/account/dashboard");
                    });
                } else {
                    setLoading(false);
                    toast.error("Login Gagal", { toastId: "logout" });
                }
                resolve();
            });
        });
    };

    return (
        <React.Fragment>
            <Helmet>
                <title>{`Login Customer — ${theme.name}`}</title>
            </Helmet>

            <div className="block mt-4">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 offset-md-2">
                            <div className="card flex-grow-1 mb-md-0">
                                <div className="card-body">
                                    <h5 className="card-title text-center">Masuk untuk berbelanja
                                    <h6 className="text-center" style={{color:'#0A6BB2'}}>Kepala Sekolah dan Bendahara BOS silakan login menggunakan akun Dapodik</h6>
                                    </h5> 
                                    {/* NEW LOGIN SDS */}
                                    
                                      
                                    <a
                                        // href='https://sds-sso.belajar.id/login/oauth/authorize?client_id=b7595b8daee1e3abc8a2&response_type=code&redirect_uri=https://siplah.eurekabookhouse.co.id/api/sds-eureka-pro&scope=read&state=y6lwrvg38w'
                                        href={process.env.REACT_APP_URL_LOGINSDS}
                                        style={{borderRadius: '10px',  color: 'white', marginTop: '10px', marginBottom: '10px', background: 'rgb(255,98,33)'}} 
                                        className="btn btn-block btn-lg"
                                        rel="noopener noreferrer"
                                    >
                                        <i class="fas fa-sign-in-alt"></i> Akun sebagai Pembeli
                                    </a> 
                                    <h6 className="text-line">atau </h6> 
                                    <a
                                        href={process.env.REACT_APP_URL_SELLER}
                                        style={{borderRadius: '10px',  color: 'white', marginTop: '10px', marginBottom: '10px', background: '#0A6BB2'}} 
                                        className="btn  btn-block btn-lg"
                                        rel="noopener noreferrer"
                                    >
                                        <i class="fas fa-sign-in-alt"></i> Akun Penjual di SIPLah
                                    </a> 
                                    <a
                                        href={process.env.REACT_APP_URL_PENGAWAS}
                                        style={{borderRadius: '10px',  color: 'white', marginTop: '10px', marginBottom: '10px' }} 
                                        className="btn btn-danger btn-block btn-lg"
                                        rel="noopener noreferrer"
                                    >
                                        <i class="fas fa-sign-in-alt"></i> Akun Pengawas SIPLah
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
const mapDispatchToProps = {
    loginCustomer,
    addMiniCart,
    customerAdd,
};
export default withRouter(connect(null, mapDispatchToProps)(AccountPageLogin));
