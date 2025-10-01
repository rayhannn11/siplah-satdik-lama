// react
import React from "react";

// third-party
import PropTypes from "prop-types";

function ProductTabSpecification(props) {
    const { specification } = props;
    if (!specification || typeof specification !== "object") {
        return (
            <div className="spec">
                <h3 className="spec__header">Spesifikasi</h3>
                <div className="spec__row">Data spesifikasi tidak tersedia</div>
            </div>
        );
    }

    const objKey = Object.keys(specification);
    const sections = objKey.map((section, index) => {
        return (
            <div key={index} className="spec__row">
                <div className="spec__name">
                    {section
                        .replace(/([a-z])([A-Z])/g, "$1 $2")
                        .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()))}
                </div>
                <div className="spec__value">{specification[section] || "-"}</div>
            </div>
        );
    });

    return (
        <div className="spec">
            <h3 className="spec__header">Spesifikasi</h3>
            {sections}
        </div>
    );
}

ProductTabSpecification.propTypes = {
    specification: PropTypes.object,
};

export default ProductTabSpecification;
