// react
import React, { useEffect, useRef } from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// application
import { Cross20Svg } from "../../svg";
import { sidebarClose } from "../../store/sidebar";

function CategorySidebar(props) {
    const { children, sidebarClose, sidebarState, offcanvas } = props;

    const classes = classNames("block block-sidebar", {
        "block-sidebar--open": sidebarState.open,
        "block-sidebar--offcanvas--always": offcanvas === "always",
        "block-sidebar--offcanvas--mobile": offcanvas === "mobile",
    });

    const backdropRef = useRef(null);
    const bodyRef = useRef(null);

    useEffect(() => {
        const media = matchMedia("(max-width: 991px)");
        let changedByMedia = false;

        const onChange = () => {
            if (offcanvas === "mobile") {
                if (sidebarState.open && !media.matches) {
                    sidebarClose();
                }
                // this is necessary to avoid the transition hiding the sidebar
                if (!sidebarState.open && media.matches && changedByMedia) {
                    /** @var {HTMLElement} */
                    const backdrop = backdropRef.current;
                    /** @var {HTMLElement} */
                    const body = bodyRef.current;

                    backdrop.style.transition = "none";
                    body.style.transition = "none";

                    backdrop.getBoundingClientRect(); // force reflow

                    backdrop.style.transition = "";
                    body.style.transition = "";
                }
            }
        };

        if (media.addEventListener) {
            media.addEventListener("change", onChange);
        } else {
            media.addListener(onChange);
        }

        onChange();

        changedByMedia = true;

        return () => {
            if (media.removeEventListener) {
                media.removeEventListener("change", onChange);
            } else {
                media.removeListener(onChange);
            }
        };
    }, [offcanvas, sidebarState.open, sidebarClose]);

    useEffect(() => {
        if (sidebarState.open) {
            const width = document.body.clientWidth;

            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = `${document.body.clientWidth - width}px`;
        } else {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        }
    }, [sidebarState.open]);

    return (
        <div className={classes} {...props}>
            {/* eslint-disable-next-line max-len */}
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div className="block-sidebar__backdrop" ref={backdropRef} onClick={() => sidebarClose()} />
            <div className="block-sidebar__body" ref={bodyRef}>
                <div className="block-sidebar__header">
                    <div className="block-sidebar__title">Filter</div>
                    <button className="block-sidebar__close" type="button" onClick={() => sidebarClose()}>
                        <Cross20Svg />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

CategorySidebar.propTypes = {
    /**
     * indicates when sidebar bar should be off canvas
     */
    offcanvas: PropTypes.oneOf(["always", "mobile"]),
};

CategorySidebar.defaultProps = {
    offcanvas: "mobile",
};

const mapStateToProps = (state) => ({
    sidebarState: state.sidebar,
});

const mapDispatchToProps = {
    sidebarClose,
};

export default connect(mapStateToProps, mapDispatchToProps)(CategorySidebar);
