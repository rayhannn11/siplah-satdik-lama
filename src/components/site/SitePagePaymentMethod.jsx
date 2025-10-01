import React from "react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Collapse, ListGroup, ListGroupItem } from "reactstrap";
import paymentMethod from "../../data/paymentMethod";
import theme from "../../data/theme";

const SitePagePaymentMethod = () => {
    const [open, setOpen] = useState({});
    const toggleCollapse = (targetName) => {
        if (!open[targetName]) {
            setOpen({
                [targetName]: {
                    collapseOpen: true,
                },
            });
        } else {
            setOpen({
                [targetName]: {
                    collapseOpen: !open[targetName].collapseOpen,
                },
            });
        }
    };

    const isCollapseOpen = (targetName) => {
        return open[targetName] ? open[targetName].collapseOpen : false;
    };
    return (
        <div className="block about-us mb-0 pb-5" style={{backgroundColor:'#E5E5E5'}}>
            <Helmet>
                <title>{`Cara Pembayaran — ${theme.name}`}</title>
            </Helmet>
            <div className="about-us__image" style={{ backgroundImage: 'url("images/aboutus.jpg")' }} />
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-xl-10">
                        <div className="about-us__body"  style={{
                            borderRadius:'20px',boxShadow:'10px 10px 5px -5px rgba(0,0,0,.3)'}}>
                            <h1 className="about-us__title text-primary">Cara Pembayaran</h1>
                            <ListGroup>
                                {paymentMethod.map((item, index) => (
                                    <ListGroupItem
                                        style={{ cursor: "pointer",backgroundColor:'rgb(255, 98, 33)',color:'white' }}
                                        onClick={() => toggleCollapse(`${item.bank.toLowerCase()}-${index}`)}
                                    >
                                        <div className="d-flex justify-content-between">
                                            <h6>{item.bank}</h6>
                                            <div>
                                                {isCollapseOpen(`${item.bank.toLowerCase()}-${index}`) ? (
                                                    <i class="fa fa-minus" aria-hidden="true"></i>
                                                ) : (
                                                    <i class="fa fa-plus" aria-hidden="true"></i>
                                                )}
                                            </div>
                                        </div>
                                        <Collapse isOpen={isCollapseOpen(`${item.bank.toLowerCase()}-${index}`)}>
                                            {item.guide.map(({ title, steps }) => (
                                                <div className="mb-2 p-2">
                                                    <h6>{title}</h6>
                                                    <ol>
                                                        {steps.map((item) => (
                                                            <li dangerouslySetInnerHTML={{ __html: item }}></li>
                                                        ))}
                                                    </ol>
                                                </div>
                                            ))}
                                        </Collapse>
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SitePagePaymentMethod;
