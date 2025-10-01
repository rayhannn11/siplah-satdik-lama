import React from "react";
import { Helmet } from "react-helmet-async";
import theme from "../../data/theme";

const SitePageTechnicalSupport = () => {
    return (
        <div className="block about-us">
            <Helmet>
                <title>{`Bantuan Teknis — ${theme.name}`}</title>
            </Helmet>
            <div className="about-us__image" style={{ backgroundImage: 'url("images/aboutus.jpg")' }} />
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-xl-10">
                        <div className="about-us__body">
                            <h1 className="about-us__title">BANTUAN TEKNIS</h1>
                            <div className="text-center mb-5">
                                <p>
                                    Selamat datang di platform Eureka BookHouse, bagi Bapak atau Ibu mengalami kendala
                                    maupun kesulitan dalam SIPLah Eureka Mohon hubungi kontak dibawah ini:
                                </p>
                                <h3>021 - 8779 6010</h3>
                                <p className="mb-0">ekstensi 312</p>
                                <p>(Hanya Telepon)</p>
                            </div>
                            <div className="text-center">
                                <h3>0822-6025-5552</h3>
                                <p>(Telepon, SMS, atau Pesan Whatsapp)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SitePageTechnicalSupport;
