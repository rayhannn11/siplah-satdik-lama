// react
import React, { useState } from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";

// application
import { ArrowRoundedLeft7x11Svg, ArrowRoundedRight7x11Svg } from "../../svg";
import { Link } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

function BlockHeader(props) {
    const { title, groups, onPrev, onNext, onGroupClick, viewMore, linkViewMore } = props;
    let { arrows } = props;
    const [showButton, setShowButton] = useState(true);
    const [showMessage, setShowMessage] = useState(false);

    if (arrows) {
        arrows = (
            <div className="block-header__arrows-list">
                <button className="block-header__arrow block-header__arrow--left" type="button" onClick={onPrev}>
                    <ArrowRoundedLeft7x11Svg />
                </button>
                <button className="block-header__arrow block-header__arrow--right" type="button" onClick={onNext}>
                    <ArrowRoundedRight7x11Svg />
                </button>
            </div>
        );
    }

    let groupsList;

    if (groups.length > 0) {
        groupsList = groups.map((group, index) => {
            const classes = classNames("block-header__group", {
                "block-header__group--active": group.current,
            });

            return (
                <li key={index}>
                    <button type="button" className={classes} onClick={() => onGroupClick(group)}>
                        {group.name}
                    </button>
                </li>
            );
        });

        groupsList = <ul className="block-header__groups-list">{groupsList}</ul>;
    }

    return (
        <div className="block-header">
            {viewMore ? (
                <div>
                    {showButton && (
                        <Link className="compare-table__product-link" to={linkViewMore}>
                            <h3 className="block-header__title custom">{title}</h3>
                        </Link>
                    )}
                    <CSSTransition
                        in={showMessage}
                        timeout={100}
                        classNames="alert"
                        unmountOnExit
                        onEnter={() => setShowButton(false)}
                        onExited={() => setShowButton(true)}
                        onMouseLeave={() => setShowMessage(false)}
                    >
                        <Link className="compare-table__product-link" to={linkViewMore}>
                            <h3 className="block-header__title">Lihat Selengkapnya</h3>
                        </Link>
                    </CSSTransition>
                </div>
            ) : (
                <h3 className="block-header__title">{title}</h3>
            )}

            <div className="block-header__divider" />
            {groupsList}
            {arrows}
        </div>
    );
}

BlockHeader.propTypes = {
    title: PropTypes.string,
    arrows: PropTypes.bool,
    viewMore: PropTypes.bool,
    linkViewMore: PropTypes.string,
    groups: PropTypes.array,
    onNext: PropTypes.func,
    onPrev: PropTypes.func,
    onGroupClick: PropTypes.func,
};
BlockHeader.defaultProps = {
    groups: [],
    onGroupClick: () => {},
};

export default BlockHeader;
