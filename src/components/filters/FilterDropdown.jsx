// react
import React from "react";

// third-party
import PropTypes from "prop-types";
function FilterDropdown(props) {
    const { data, value, onChangeValue, name } = props;

    const updateValue = (newValue) => {
        if (data.name === "Provinsi") {
            onChangeValue({ filter: { ...data, slug: "locationName" }, value: newValue.split("_")[0] });
            onChangeValue({ filter: { ...data, slug: "locationId" }, value: newValue.split("_")[1] });
            onChangeValue({ filter: data, value: newValue.split("_")[0] });
        } else {
            onChangeValue({ filter: data, value: newValue });
        }
    };

    const handleChange = (event) => {
        updateValue(event.target.value);
    };

    let itemsList = data.items.map((item, index) => {
        return (
            <>
                <option key={index} value={item.slug} selected={item.slug === value || item.name === value}>
                    {item.name}
                </option>
            </>
        );
    });

    if (data.name === "Provinsi") {
        itemsList = data.items.map((item, index) => {
            return (
                <>
                    <option
                        key={index}
                        value={`${item.name}_${item.code}`}
                        selected={item.isSelected}
                    >
                        {item.name}
                    </option>
                </>
            );
        });
    }

    return (
        <div className="filter-list">
            <div className="filter-list__list">
                <div class="form-group mt-2">
                    <select style={{borderRadius:'10px'}} class="form-control" name="" id="" onChange={handleChange}>
                        <option value="">Pilih {name}</option>
                        {itemsList}
                    </select>
                </div>
            </div>
        </div>
    );
}

FilterDropdown.propTypes = {
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

export default FilterDropdown;
