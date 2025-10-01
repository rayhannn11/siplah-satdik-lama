// react
import React from "react";

// third-party
import PropTypes from "prop-types";

// application
import AppLink from "../shared/AppLink";
import Collapse from "../shared/Collapse";
import { ArrowRoundedDown12x7Svg } from "../../svg";
import { connect } from "react-redux";
import { useMemo } from "react";

function MobileLinks(props) {
    const { links, level, onItemClick } = props;

    const handleItemClick = (item) => {
        if (onItemClick) {
            onItemClick(item);
        }
    };

    const linksList = links.map((link, index) => {
        let item;

        if (link.type === "link" || link.type === "button" || link.type === "href") {
            item = (
                <Collapse
                    toggleClass="mobile-links__item--open"
                    render={({ toggle, setItemRef, setContentRef }) => {
                        let arrow;
                        let subLinks;
                        let linkOrButton;

                        if (link.children && link.children.length > 0) {
                            arrow = (
                                <button className="mobile-links__item-toggle" type="button" onClick={toggle}>
                                    <ArrowRoundedDown12x7Svg className="mobile-links__item-arrow" />
                                </button>
                            );

                            subLinks = (
                                <div className="mobile-links__item-sub-links" ref={setContentRef}>
                                    <MobileLinks links={link.children} level={level + 1} onItemClick={onItemClick} />
                                </div>
                            );
                        }

                        if (link.type === "link") {
                            linkOrButton = (
                                <AppLink
                                    to={link.url}
                                    external={link.external}
                                    className="mobile-links__item-link"
                                    onClick={() => handleItemClick(link)}
                                >
                                    {link.label}
                                </AppLink>
                            );
                        } else {
                            linkOrButton = (
                                <button
                                    type="button"
                                    className="mobile-links__item-link"
                                    onClick={() => handleItemClick(link)}
                                >
                                    {link.label}
                                </button>
                            );
                        }

                        return (
                            <div className="mobile-links__item" ref={setItemRef}>
                                <div className="mobile-links__item-title">
                                    {linkOrButton}
                                    {arrow}
                                </div>
                                {subLinks}
                            </div>
                        );
                    }}
                />
            );
        } else if (link.type === "divider") {
            item = <div className="mobile-links__divider" />;
        }
        return <li key={index}>{item}</li>;
    });

    return useMemo(
        () => <ul className={`mobile-links mobile-links--level--${level}`}>{linksList}</ul>,
        [level, linksList]
    );
}

MobileLinks.propTypes = {
    links: PropTypes.array,
    level: PropTypes.number,
    onItemClick: PropTypes.func,
};

MobileLinks.defaultProps = {
    links: [],
    level: 0,
};

const mapStateToProps = (state) => ({ auth: state.auth });

export default connect(mapStateToProps, null)(MobileLinks);
