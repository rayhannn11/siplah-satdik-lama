// react
import React from "react";

// third-party
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

// data stubs
import theme from "../../data/theme";

function SitePageNotFound() {
    return (
        <div className="block">
            <Helmet>
                <title>{`404 Page Not Found — ${theme.name}`}</title>
            </Helmet>

            <div className="container">
                <div className="not-found">
                    <div className="not-found__404">Oops! Error 404</div>

                    <div className="not-found__content">
                        <h1 className="not-found__title">Halaman Tidak Ditemukan</h1>

                        <Link to="/" className="btn btn-secondary btn-sm">
                            Kembali ke beranda
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SitePageNotFound;
