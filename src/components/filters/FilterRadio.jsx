// react
import React from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';

function FilterRadio(props) {
    const { data, value, onChangeValue } = props;

    const updateValue = (newValue) => {
        onChangeValue({ filter: data, value: newValue });
    };

    const handleChange = (event) => {
        if (event.target.checked && event.target.value !== value) {
            updateValue(event.target.value);
        }
    };

    const itemsList = data.items.map((item) => {
        let count;

        if (item.count) {
            count = <span className="filter-list__counter">{item.count}</span>;
        }

        const itemClasses = classNames('filter-list__item', {
            'filter-list__item--disabled': item.count === 0,
        });

        return (
            <label
                key={item.slug}
                className={itemClasses}
            >
                <span className="filter-list__input input-radio">
                    <span className="input-radio__body">
                        <input
                            className="input-radio__input"
                            type="radio"
                            name={data.slug}
                            value={item.slug}
                            checked={value === item.slug}
                            disabled={item.count === 0}
                            onChange={handleChange}
                        />
                        <span className="input-radio__circle" />
                    </span>
                </span>
                <span className="filter-list__title">{item.name}</span>
                {count}
            </label>
        );
    });

    return (
        <div className="filter-list">
            <div className="filter-list__list">
                {itemsList}
            </div>
        </div>
    );
}

FilterRadio.propTypes = {
    /**
     * Filter object.
     */
    data: PropTypes.object,
    /**
     * Value.
     */
    value: PropTypes.string,
    /**
     * Change value callback.
     */
    onChangeValue: PropTypes.func,
};

export default FilterRadio;
