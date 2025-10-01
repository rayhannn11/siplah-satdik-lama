import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import categoryApi from "../../api/category";
import { ArrowRoundedRight6x9Svg } from "../../svg";
import BlockLoader from "../blocks/BlockLoader";

let sub = [];
let active = [0,0,0];
const DepartmentsLinkCustom = (props) => {
    const [loading, setLoading] = useState(true),
        [categories, setCategories] = useState([]);
    const [submenu, setSubmenu] = useState([]);
    const [linkActive, setLinkActive] = useState([]);
    const { handleTransitionEnd, handleClose } = props;

    useEffect(() => {
        let canceled = false;
        setLoading(true);
        categoryApi.getCategories().then((result) => {
            // console.log("🚀 ~ file: DepartmentsLinkCustom.jsx ~ line 21 ~ categoryApi.getCategories ~ result", result.data[0])
            if (canceled) {
                return;
            }
            setCategories(
                result.data.map((item) => ({
                    ...item,
                    isActive: false,
                    submenu: item.submenu.menu,
                }))
            );
            setLoading(false);
                    // categoryAdd(result.data);
        });

        return () => {
            canceled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        let linksItem = document.querySelectorAll(".departments_links_item");
        linksItem.forEach((item) => {
            item.classList.remove("active");
        });

        linkActive.forEach((item) => {
            let elm = document.getElementById(`${item.id}`);
            if (elm) {
                elm.classList.add("active");
            }
        });
    }, [linkActive]);

    const setActiveItem = (menu) => {
        let dataActive = { parentId: Number(menu.parentId), id: Number(menu.id) };
        let indexActive = active.findIndex((item) => Number(item.parentId) === Number(menu.parentId));
        if (indexActive > -1) {
            active[indexActive] = dataActive;
            if (active.length - 1 !== indexActive) {
                active.pop();
            }
            active = [...active];
            setLinkActive(active);
        } else {
            active = [...active, dataActive];
            setLinkActive(active);
        }
    };

    const onHover = (menu) => {
        setActiveItem(menu);

        let content = null;
        if (menu.submenu && menu.submenu.length > 0) {
            content = <div className="departments_links_list">{menuLinks(menu.submenu)}</div>;
        }

        let data = {
            parentId: menu.id,
            title: menu.title,
            content: content,
        };

        if (menu.submenu) {
            if (Number(menu.parentId) === 0) {
                sub = [data];
                setSubmenu(sub);
            } else {
                if (sub.length > 0) {
                    if (sub[sub.length - 1].parentId === menu.parentId) {
                        if (menu.submenu.length > 0) {
                            sub = [...sub, data];
                            setSubmenu(sub);
                        }
                    } else {
                        const indexArr = sub.findIndex((item) => item.parentId === menu.parentId);
                        if (indexArr > -1) {
                            if (indexArr + 1 !== sub.length) {
                                sub.pop();
                                sub[indexArr + 1] = data;
                            } else {
                                sub[indexArr + 1] = data;
                            }
                            sub = [...sub];
                            setSubmenu(sub);
                        }
                    }
                }
            }
        }
    };

    const onLeave = (department) => {
        if (department.submenu === undefined || department.submenu.length === 0) {
            let indexActive = active.findIndex((item) => Number(item.parentId) === Number(department.parentId));
            active.splice(indexActive, 1);
            active = [...active];
            setLinkActive(active);
        }
    };

    const menuLinks = (departments) => {
        if (departments) {
            return departments.map((department, index) => {
                let arrow = null;
                let content = null;
                if (department.submenu) {
                    if (department.submenu.length > 0) {
                        arrow = (
                            <div className="icon">
                                <ArrowRoundedRight6x9Svg />
                            </div>
                        );
                    }
                }
                content = (
                    <Link
                    to={`/products/category/${department.id}/${department.url}`}
                        id={department.id}
                        onMouseEnter={() => {
                            onHover(department);
                        }}
                        onClick={() => {
                            handleClose();
                        }}
                        onMouseLeave={() => {
                            onLeave(department);
                        }}
                        className={classNames("departments_links_item")}
                    >
                        <div className="title">{department.title}</div>
                        {arrow}
                    </Link>
                );
                if (department.submenu && department.submenu.length > 0) {
                    content = (
                        <Link
                            id={department.id}
                            to={`/products/category/${department.id}/${department.url}`}
                            onMouseEnter={() => {
                                onHover(department);
                            }}
                            onMouseLeave={() => {
                                onLeave(department);
                            }}
                            className={classNames("departments_links_item")}
                        >
                            <div className="title">{department.title}</div>
                            {arrow}
                        </Link>
                    );
                }

                return content;
            });
        }
    };

    return (
        <div className="departments_links--custom" onTransitionEnd={handleTransitionEnd}>
            <div className="d-flex mb-0 departments_links_container">
                {loading ? (
                    <BlockLoader style={{ position: "static" }} />
                ) : (
                    <>
                        <div className="departments_links_list">{menuLinks(categories)} </div>
                        {submenu.map((item) => item.content)}
                    </>
                )}
            </div>
        </div>
    );
};

export default DepartmentsLinkCustom;
