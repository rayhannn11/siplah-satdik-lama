/* eslint-disable no-unused-expressions */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
// react
import React, { useEffect, useState } from "react";

// application
import Megamenu from "./Megamenu";
import Menu from "./Menu";
import { ArrowRoundedRight6x9Svg } from "../../svg";

// data stubs
import categoryApi from "../../api/category";
import BlockLoader from "../blocks/BlockLoader";
import { categoryAdd } from "../../store/category";
import { connect } from "react-redux";

function DepartmentsLinks(props) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const { categoryAdd } = props;

    useEffect(() => {
        let canceled = false;
        setLoading(true);
        categoryApi.getCategories().then((result) => {
            if (canceled) {
                return;
            }
            setLoading(false);

            setCategories(
                result.data.map((item) => ({
                    ...item,
                    submenu: {
                        type: "megamenu",
                        menu: {
                            size: "xl",
                            columns: item.submenu.menu
                                .map((item2) => ({
                                    size: 3,
                                    links: item2.submenu.map((item3) => ({
                                        title: item3.title,
                                        url: item3.url,
                                        links: item3.submenu.map((item4) => ({
                                            title: item4.title,
                                            url: item4.url,
                                            links: item4.submenu,
                                        })),
                                    })),
                                }))
                                .sort((a, b) => b.links.length > a.links.length),
                        },
                    },
                }))
            );
            // setCategories(result.data);
            // console.log(
            //     "🚀 ~ file: DepartmentsLinks.jsx ~ line 54 ~ categoryApi.getCategories ~ result.data",
            //     JSON.stringify(result.data)
            // );
            categoryAdd(result.data);
        });

        return () => {
            canceled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const linksList = categories.map((department, index) => {
        let arrow = null;
        let submenu = null;
        let itemClass = "";

        if (department.submenu) {
            arrow = <ArrowRoundedRight6x9Svg className="departments__link-arrow" />;
        }

        if (department.submenu && department.submenu.type === "menu") {
            itemClass = "departments__item--menu";
            submenu = (
                <div className="departments__menu">
                    <Menu items={department.submenu.menu} />
                </div>
            );
        }

        if (department.submenu && department.submenu.type === "megamenu") {
            submenu = (
                <div className={`departments__megamenu departments__megamenu--${department.submenu.menu.size}`}>
                    <Megamenu menu={department.submenu.menu} location="department" />
                </div>
            );
        }

        return (
            <li key={index} className={`departments__item ${itemClass}`}>
                <a style={{ cursor: "pointer" }}>
                    {department.title}
                    {arrow}
                </a>
                {submenu}
            </li>
        );
    });

    if (loading && categories.length === 0) {
        return <BlockLoader />;
    }

    return <ul className="departments__links">{linksList}</ul>;
}

const mapDispatchToProps = {
    categoryAdd,
};

export default connect(null, mapDispatchToProps)(DepartmentsLinks);
