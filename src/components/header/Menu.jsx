// react
import React, { useMemo } from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";

// application
import AppLink from "../shared/AppLink";
import { ArrowRoundedRight6x9Svg } from "../../svg";

const Menu = (props) => {
    const { withIcons, items, onClick } = props;

    const renderLink = (item, content) => {
        let link;

        if (item.submenu) {
            if (item.submenu.length === 0) {
                link = (
                    <AppLink {...item.props} to={`/products/category/${item.url}`} onClick={() => onClick(item)}>
                        {content}
                    </AppLink>
                );
            } else {
                link = (
                    <button type="button" onClick={() => onClick(item)}>
                        {content}
                    </button>
                );
            }
        } else {
            link = (
                <AppLink {...item.props} to={`/products/category/${item.url}`} onClick={() => onClick(item)}>
                    {content}
                </AppLink>
            );
        }

        return link;
    };

    const itemsList = items.map((item, index) => {
        let arrow;
        let submenu;
        let icon;

        if (item.submenu && item.submenu.length) {
            arrow = <ArrowRoundedRight6x9Svg className="menu__arrow" />;
        }

        if (item.submenu && item.submenu.length) {
            submenu = (
                <div className="menu__submenu">
                    <Menu items={item.submenu} />
                </div>
            );
        }

        if (withIcons && item.icon) {
            icon = (
                <div className="menu__icon">
                    <img src={item.icon} srcSet={item.icon_srcset} alt="" />
                </div>
            );
        }

        return (
            <li key={index}>
                {renderLink(
                    item,
                    <React.Fragment>
                        {icon}
                        {item.title}
                        {arrow}
                    </React.Fragment>
                )}
                {submenu}
            </li>
        );
    });

    const classes = classNames(`menu menu--layout-classic`, {
        "menu--with-icons": withIcons,
    });

    return useMemo(() => <ul className={classes}>{itemsList}</ul>, [classes, itemsList]);
};

Menu.propTypes = {
    /** one of ['classic', 'topbar'] (default: 'classic') */
    layout: PropTypes.oneOf(["classic", "topbar"]),
    /** default: false */
    withIcons: PropTypes.bool,
    /** array of menu items */
    items: PropTypes.array,
    /** callback function that is called when the item is clicked */
    onClick: PropTypes.func,
};

Menu.defaultProps = {
    layout: "classic",
    withIcons: false,
    items: [],
    onClick: () => {},
};

export default Menu;
