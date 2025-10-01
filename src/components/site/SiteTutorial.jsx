import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Collapse, ListGroup, ListGroupItem } from "reactstrap";
import theme from "../../data/theme";

function content(props) {
    const { data, forAct, toggleCollapse, isCollapseOpen, className } = props;
    return (
        <>
            <h4 className={className}>{forAct}</h4>
            <ListGroup>
                {data.map((item, index) => (
                    <ListGroupItem
                        style={{ cursor: "pointer", backgroundColor: 'rgb(255, 98, 33)', color: 'white' }}
                        onClick={() =>
                            item.type_file === "video"
                                ? toggleCollapse(`${forAct.toLowerCase()}-${index}`)
                                : window.open(item.link, "_blank")
                        }
                    >
                        <div className="d-flex justify-content-between">
                            {item.type_file === "pdf" ? (
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-white">
                                    <h6>Unduh {item.name}</h6>
                                </a>
                            ) : (
                                <h6>{item.name}</h6>
                            )}
                            <div>
                                {item.type_file === "video" ? (
                                    <>
                                        {isCollapseOpen(`${forAct.toLowerCase()}-${index}`) ? (
                                            <i class="fa fa-minus" aria-hidden="true"></i>
                                        ) : (
                                            <i class="fa fa-plus" aria-hidden="true"></i>
                                        )}
                                    </>
                                ) : (
                                    <i class="fa fa-download" aria-hidden="true"></i>
                                )}
                            </div>
                        </div>
                        <Collapse isOpen={isCollapseOpen(`${forAct.toLowerCase()}-${index}`)}>
                            <div class="card border-0">
                                <div class="card-body">
                                    {item.type_file === "video" && (
                                        <iframe title={item.name} width="100%" height="315" src={item.link}></iframe>
                                    )}
                                </div>
                            </div>
                        </Collapse>
                    </ListGroupItem>
                ))}
            </ListGroup>
        </>
    );
}

const SiteTutorial = () => {
    const [tutorialsForSeller, setTutorialsForSeller] = useState([]);
    const [tutorialsForCustomer, setTutorialsForCustomer] = useState([]);
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
    useEffect(() => {
        var myHeaders = new Headers();

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            redirect: "follow",
        };

        fetch(`${process.env.REACT_APP_URL_SIPLAH}backendseller/tutorial`, requestOptions)
            .then((res) => res.json())
            .then((result) => {
                setTutorialsForCustomer(result.filter((item) => item.type_user === "pembeli"));
                setTutorialsForSeller(result.filter((item) => item.type_user === "penyedia"));
            })
            .catch((err) => console.error(err));
    }, []);
    return (
        <div className="block about-us mb-0 pb-5" style={{ backgroundColor: '#E5E5E5' }}>
            <Helmet>
                <title>{`Tutorial — ${theme.name}`}</title>
            </Helmet>
            <div className="about-us__image" style={{ backgroundImage: 'url("images/aboutus.jpg")' }} />
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-xl-10">
                        <div className="about-us__body" style={{
                            borderRadius: '20px', boxShadow: '10px 10px 5px -5px rgba(0,0,0,.3)'
                        }}>
                            <h1 className="about-us__title text-primary">Tutorial</h1>
                            {content({
                                className: "mb-3",
                                data: tutorialsForCustomer,
                                forAct: "Pembeli",
                                isCollapseOpen,
                                toggleCollapse,
                            })}
                            {content({
                                className: "mt-5 mb-3",
                                data: tutorialsForSeller,
                                forAct: "Penyedia",
                                isCollapseOpen,
                                toggleCollapse,
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default SiteTutorial;
