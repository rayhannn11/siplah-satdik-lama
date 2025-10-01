import React from "react";
import { Helmet } from "react-helmet-async";
import faqData from "../../data/faq";
import theme from "../../data/theme";

const FaqContent = ({ title, data }) => {
    return (
        <div className="text-justify">
            <h5>{title}</h5>
            <ol>
                {data.map(({ question, answer }) => (
                    <li className="font-weight-bold">
                        <h6>{question}</h6>
                        <p className="font-weight-normal" dangerouslySetInnerHTML={{ __html: answer }}></p>
                    </li>
                ))}
            </ol>
        </div>
    );
};

const SitePageFaq = () => {
    return (
        <div className="block about-us mb-0 pb-5" style={{backgroundColor:'#E5E5E5'}}>
            <Helmet>
                <title>{`FAQ — ${theme.name}`}</title>
            </Helmet>
            <div className="about-us__image" style={{ backgroundImage: 'url("images/aboutus.jpg")' }} />
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-xl-10">
                        <div className="about-us__body" style={{
                            borderRadius:'20px',boxShadow:'10px 10px 5px -5px rgba(0,0,0,.3)'}}>
                            <h1 className="about-us__title text-primary">FAQ</h1>
                            {faqData.map(({ title, data }) => (
                                <FaqContent title={title} data={data} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SitePageFaq;
