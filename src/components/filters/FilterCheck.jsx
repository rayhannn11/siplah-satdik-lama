// react
import React from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";

// application
import { Check9x7Svg } from "../../svg";

function FilterCheck(props) {
    const { data, value, onChangeValue } = props;

    const updateValue = (newValue) => {
        onChangeValue({ filter: data, value: newValue });
    };

    const handleChange = (event) => {
        if (event.target.checked && !value.includes(event.target.value)) {
            updateValue([...value, event.target.value]);
        }
        if (!event.target.checked && value.includes(event.target.value)) {
            updateValue(value.filter((x) => x !== event.target.value));
        }
    };

    const itemsList = data.items.map((item) => {
        let count;
        if (item.count) {
            count = <span className="filter-list__counter">{item.count}</span>;
        }

        const itemClasses = classNames("filter-list__item", {
            "filter-list__item--disabled": item.count === 0,
        });

        return (
            <label key={item.slug} className={itemClasses}>
                <span className="filter-list__input input-check">
                    <span className="input-check__body">
                        <input
                            className="input-check__input"
                            type="checkbox"
                            value={item.slug}
                            checked={value.includes(item.slug)}
                            disabled={item.count === 0}
                            onChange={handleChange}
                        />
                        <span className="input-check__box" />
                        <Check9x7Svg className="input-check__icon" />
                    </span>
                </span>
                <span className="filter-list__title">{item.name}</span>
                {count}
            </label>
        );
    });

    return (
        <div className="filter-list">
            <div className="filter-list__list">{itemsList}</div>
        </div>
    );
}

FilterCheck.propTypes = {
    /**
     * Filter object.
     */
    data: PropTypes.object,
    /**
     * Value.
     */
    value: PropTypes.arrayOf(PropTypes.string),
    /**
     * Change value callback.
     */
    onChangeValue: PropTypes.func,
};

export default FilterCheck;
