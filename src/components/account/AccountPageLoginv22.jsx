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
import { AUTH } from "../../store/auth/authActionTypes";

function AccountPageLogin22(props) {
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
                    // Simpan token ke localStorage
                    localStorage.setItem('token', token);
                    localStorage.setItem('auth', 'true');
    
                    customerApi.getMiniCart(token).then((res) => {
                        const { data } = res;
                        props.addMiniCart(data);
                    });
    
                    customerApi.getCustomer(token).then((res) => {
                        const { data } = res;
                        // Simpan data customer ke localStorage
                        localStorage.setItem('userData', JSON.stringify({...data, token}));
                        
                        props.customerAdd({ ...data, token });
                        // Kirim action dengan format yang sama seperti logout
                        props.loginCustomer({
                            type: AUTH,
                            auth: true,
                            isLogin: true // tambahkan flag untuk login
                        });
                        
                        toast.success("Login Berhasil");
                        setLoading(false);
                        props.history.push("/account/dashboard");
                    });
                } else {
                    setLoading(false);
                    // Bersihkan localStorage dan state jika login gagal
                    localStorage.removeItem('auth');
                    localStorage.removeItem('token');
                    localStorage.removeItem('userData');
                    
                    props.loginCustomer({
                        type: AUTH,
                        auth: false,
                        isLogout: true
                    });
                    props.customerAdd({});
                    
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
                                    <h4 className="card-title">Masuk untuk berbelanja</h4>
                                    <a
                                        href={process.env.REACT_APP_URL_LOGIN}
                                        style={{borderRadius: '10px',  color: 'white', marginTop: '10px', marginBottom: '10px'}} 
                                        className="btn btn-danger btn-block btn-lg"
                                        rel="noopener noreferrer"
                                    >
                                        <i class="fas fa-sign-in-alt"></i> Akun Dapodik
                                    </a>
                                    <h6 className="text-line">atau masuk dengan</h6>
                                    <form onSubmit={doLogin}>
                                        <div className="form-group">
                                            <label htmlFor="login-email">Email</label>
                                            <input
                                                id="login-email"
                                                onChange={doHandleChange}
                                                type="email"
                                                name="email"
                                                className="form-control"
                                                placeholder="Enter email"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="login-password">Kata Sandi</label>
                                            <input
                                                id="login-password"
                                                onChange={doHandleChange}
                                                name="password"
                                                type="password"
                                                className="form-control"
                                                placeholder="Password"
                                            />
                                        </div>
                                        {/* <AsyncAction
                                            action={doLogin} */}
                                        {/* render={({ run, loading }) => ( */}
                                        <button
                                            type="submit"
                                            style={{borderRadius: '10px',  color: 'white', marginTop: '10px', marginBottom: '10px'}} 
                                            className={classNames("btn btn-lg btn-block btn-primary", {
                                                "btn-loading": loading,
                                            })}
                                        >
                                            Login
                                        </button>
                                        {/* )}
                                        /> */}
                                    </form>
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
export default withRouter(connect(null, mapDispatchToProps)(AccountPageLogin22));
