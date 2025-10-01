// react
import React, { Fragment } from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// application
import { ArrowRoundedLeft6x9Svg } from "../../svg";
import { url } from "../../services/utils";

function FilterCategory(props) {
    const { data, onChangeValue } = props;

    const updateValue = (newValue) => {
        onChangeValue({ filter: data, value: newValue.slug });
        onChangeValue({ filter: { ...data, slug: "categoryId" }, value: newValue.id });
    };

    const handleChange = (value) => {
        updateValue(value);
    };

    const categoriesList = data.items.map((category) => {
        const itemClasses = classNames("filter-categories__item font-weight-bold", {
            "filter-categories__item--current": data.value === category.slug,
        });

        return (
            <Fragment key={category.id}>
                <li className={itemClasses}>
                    <span style={{ cursor: "pointer" }} onClick={() => handleChange(category)}>
                        {category.name}
                    </span>
                </li>

                {category.children &&
                    category.children.map((child) => (
                        <li key={child.id} className="filter-categories__item filter-categories__item--child">
                            <span style={{ cursor: "pointer" }} onClick={() => handleChange(child)}>
                                {child.name}
                            </span>
                        </li>
                    ))}
            </Fragment>
        );
    });

    if (data.value) {
        categoriesList.unshift(
            <li key="[shop]" className="filter-categories__item filter-categories__item--parent">
                <ArrowRoundedLeft6x9Svg className="filter-categories__arrow" />
                <Link to={url.catalog()}>All Products</Link>
            </li>
        );
    }

    return (
        <div className="filter-categories">
            <ul className="filter-categories__list">{categoriesList}</ul>
        </div>
    );
}

FilterCategory.propTypes = {
    /**
     * Filter object.
     */
    data: PropTypes.object,
};

export default FilterCategory;
