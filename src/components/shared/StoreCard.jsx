// react
import React from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function StoreCard(props) {
    const { store, layout } = props;
    const cardClasses = classNames("post-card", {
        "post-card--layout--grid": ["grid-nl", "grid-lg"].includes(layout),
        "post-card--layout--list": ["list-nl", "list-sm"].includes(layout),
        "post-card--size--nl": ["grid-nl", "list-nl"].includes(layout),
        "post-card--size--lg": layout === "grid-lg",
        "post-card--size--sm": layout === "list-sm",
    });

    return (
        // <div className={cardClasses}>
        //     <div className="post-card__image">
        //         <Link to="/blog/post-classic">
        //             <img src={store.image} alt="" />
        //         </Link>
        //     </div>
        //     <div className="post-card__info">
        //         {/* <div className="post-card__category">{categories}</div> */}
        //         <div className="post-card__name">
        //             <Link to="/blog/post-classic">{store.name}</Link>
        //         </div>
        //         {/* <div className="post-card__date">{post.date}</div>
        //         <div className="post-card__content">
        //             In one general sense, philosophy is associated with wisdom, intellectual culture and a search for
        //             knowledge. In that sense, all cultures...
        //         </div>
        //         <div className="post-card__read-more">
        //             <Link to="/" className="btn btn-secondary btn-sm">
        //                 Read More
        //             </Link>
        //         </div> */}
        //     </div>
        // </div>
        <div key={store.id} className="block-brands__item">
            <Link to="/">
                <img src={store.image} alt="" />
                <h6>{store.name}</h6>
            </Link>
        </div>
    );
}

StoreCard.propTypes = {
    /**
     * post data object
     */
    store: PropTypes.object,
    /**
     * post card layout
     * one of ['grid-nl', 'grid-lg', 'list-nl', 'list-sm']
     */
    layout: PropTypes.oneOf(["grid-nl", "grid-lg", "list-nl", "list-sm"]),
};

export default StoreCard;
