// react
import React from "react";

// third-party
import Skeleton from "react-loading-skeleton";

// application
import FooterContacts from "./FooterContacts";
import FooterLinks from "./FooterLinks";
import ToTop from "./ToTop";

// data stubs
import FooterMethod from "./FooterMethod";
import { connect } from "react-redux";

function Footer(props) {
    const { images } = props.config;
    const bankImages = [
        "/images/bank/bank_bjb.jpg",
        "/images/bank/bank_bpd_bali.png",
        "/images/bank/bank_bsi.jpg",
        "/images/bank/bank_dki.png",
        "/images/bank/bank_jambi.jpg",
        "/images/bank/bank_jateng.png",
        "/images/bank/bank_jatim.png",
        "/images/bank/bank_kalbar.png",
        "/images/bank/bank_kalsel.png",
        "/images/bank/bank_kaltimtara.png",
        "/images/bank/bank_lampung.png",
        "/images/bank/bank_nagari.png",
        "/images/bank/bank_ntb_syariah.png",
        "/images/bank/bank_ntt.png",
        "/images/bank/bank_sulselbar.jpg",
        "/images/bank/bank_sulut_go.jpg",
        "/images/bank/bank_sumsel_babel.png",
        "/images/bank/bank_sumut.png",
    ];

    // const bankImages = [
    //     "/images/bank/bank_bjb.avif",
    //     "/images/bank/bank_bpd_bali.avif",
    //     "/images/bank/bank_bsi.avif",
    //     "/images/bank/bank_dki.avif",
    //     "/images/bank/bank_jambi.avif",
    //     "/images/bank/bank_jateng.avif",
    //     "/images/bank/bank_jatim.avif",
    //     "/images/bank/bank_kalbar.avif",
    //     "/images/bank/bank_kalsel.avif",
    //     "/images/bank/bank_kaltimtara.avif",
    //     "/images/bank/bank_lampung.avif",
    //     "/images/bank/bank_nagari.avif",
    //     "/images/bank/bank_ntb_syariah.avif",
    //     "/images/bank/bank_ntt.avif",
    //     "/images/bank/bank_sulselbar.avif",
    //     "/images/bank/bank_sulut_go.avif",
    //     "/images/bank/bank_sumsel_babel.avif",
    //     "/images/bank/bank_sumut.avif",
    // ];

    const paymentImages = [...images.payment, ...bankImages];
    console.log(paymentImages, "paymentImages");
    const informationLinks = [
        { title: "Tentang SIPLah", url: "/site/about" },
        { title: "Kebijakan Privasi", url: "/site/privacy-policy" },
        { title: "Kebijakan Produk", url: "/site/kebijakan-produk-siplah-eurekabookhouse-kemendikbud" },
        { title: "Syarat dan Ketentuan", url: "/site/terms-and-conditions" },
        { title: "FAQ", url: "/site/faq" },
        { title: "Cara Pembayaran", url: "/site/how-to-pay" },
        { title: "Tutorial", url: "/site/tutorial" },
        { title: "Bantuan", url: "/site/technical-support" },
    ];

    return (
        <div className="site-footer">
            <div className="container">
                <div className="site-footer__widgets">
                    <div className="row">
                        <div className="col-12 col-md-6 col-lg-3">
                            <FooterContacts />
                        </div>
                        <div className="col-12 col-md-3 col-lg-2">
                            <FooterLinks title="Informasi" items={informationLinks} />
                        </div>
                        <div className="col-12 col-md-6 col-lg-5">
                            {!images ? <Skeleton /> : <FooterMethod images={paymentImages} title="Pembayaran" />}
                        </div>
                        <div className="col-12 col-md-3 col-lg-2">
                            {!images ? <Skeleton /> : <FooterMethod images={images.shipping} title="Kerja sama" />}
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="site-footer__bottom d-flex justify-content-center"
                style={{ background: "rgb(112,113,118)" }}
            >
                <div className="site-footer__copyright text-white text-center">
                    Copyright &copy; 2019 - {new Date().getFullYear()} | Kementerian Pendidikan dan Kebudayaan. Hak
                    cipta dilindungi undang-undang
                    <br />
                    Dikembangkan oleh PT. Eureka Bookhouse versi 2.4.3 <br />
                </div>
            </div>
            <ToTop />
        </div>
    );
}
const mapStateToProps = (state) => ({ config: state.config });
export default connect(mapStateToProps, () => ({}))(Footer);
