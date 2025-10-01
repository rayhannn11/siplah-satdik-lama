// react
import React from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';

// application
import { Check12x9Svg } from '../../svg';
import { colorType } from '../../services/color';

function FilterColor(props) {
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

    const itemsList = data.items.map((item) => (
        <div key={item.slug} className="filter-color__item">
            <span
                className={classNames('filter-color__check input-check-color', {
                    'input-check-color--white': colorType(item.color) === 'white',
                    'input-check-color--light': colorType(item.color) === 'light',
                })}
                style={{ color: item.color }}
            >
                <label className="input-check-color__body">
                    <input
                        className="input-check-color__input"
                        type="checkbox"
                        value={item.slug}
                        checked={value.includes(item.slug)}
                        disabled={item.count === 0}
                        onChange={handleChange}
                    />
                    <span className="input-check-color__box" />
                    <Check12x9Svg className="input-check-color__icon" />
                    <span className="input-check-color__stick" />
                </label>
            </span>
        </div>
    ));

    return (
        <div className="filter-color">
            <div className="filter-color__list">
                {itemsList}
            </div>
        </div>
    );
}

FilterColor.propTypes = {
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

export default FilterColor;
