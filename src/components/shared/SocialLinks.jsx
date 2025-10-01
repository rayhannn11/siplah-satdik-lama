// react
import React from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";

// data stubs
import theme from "../../data/theme";

function SocialLinks(props) {
    const { shape, className } = props;

    const classes = classNames(className, "social-links", {
        "social-links--shape--circle": shape === "circle",
        "social-links--shape--rounded": shape === "rounded",
    });

    const items = [
        { type: "facebook", url: theme.author.profile_url, icon: "fab fa-facebook-f" },
        { type: "twitter", url: theme.author.profile_url, icon: "fab fa-twitter" },
        { type: "youtube", url: theme.author.profile_url, icon: "fab fa-youtube" },
        { type: "instagram", url: theme.author.profile_url, icon: "fab fa-instagram" },
        { type: "rss", url: theme.author.profile_url, icon: "fas fa-rss" },
    ].map((item) => (
        <li key={item.type} className="social-links__item">
            <a
                className={`social-links__link social-links__link--type--${item.type}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
            >
                <i className={item.icon} />
            </a>
        </li>
    ));

    return (
        <div className={classes}>
            <ul className="social-links__list">{items}</ul>
        </div>
    );
}

SocialLinks.propTypes = {
    /**
     * rating value
     */
    shape: PropTypes.oneOf(["circle", "rounded"]),
    className: PropTypes.string,
};
SocialLinks.defaultProps = {
    shape: null,
};

export default SocialLinks;
