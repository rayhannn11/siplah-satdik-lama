// react
import React, { useCallback } from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";

// application
import Collapse from "../shared/Collapse";
import FilterCategory from "../filters/FilterCategory";
import FilterCategoryTwo from "../filters/FilterCategoryTwo";
import FilterCheck from "../filters/FilterCheck";
import FilterColor from "../filters/FilterColor";
import FilterRadio from "../filters/FilterRadio";
import getFilterHandler from "../../services/filters";
import { ArrowRoundedDown12x7Svg } from "../../svg";
import FilterDropdown from "../filters/FilterDropdown";

const filterComponents = {
    category_mall: FilterCategory,
    category: FilterCategoryTwo,
    check: FilterCheck,
    radio: FilterRadio,
    color: FilterColor,
    dropdown: FilterDropdown,
};

function WidgetFilters(props) {
    const { dispatch, filters, values, title, offcanvas } = props;

    const handleValueChange = useCallback(
        ({ filter, value }) => {
            const handler = getFilterHandler(filter);
            if (handler) {
                if (filter.slug === "locationName" || filter.slug === "locationId" || filter.slug === "categoryId") {
                    dispatch({
                        type: "SET_OPTION_VALUE",
                        option: filter.slug,
                        value: handler.isDefaultValue(filter, value) ? undefined : handler.serialize(value),
                    });
                } else {
                    dispatch({
                        type: "SET_FILTER_VALUE",
                        filter: filter.slug,
                        value: handler.isDefaultValue(filter, value) ? undefined : handler.serialize(value),
                    });
                }
            }
        },
        [dispatch]
    );

    const handleResetFilters = () => {
        dispatch({ type: "RESET_FILTERS" });
    };

    const filtersList = filters
        .filter((filter) => filter.items.length > 0)
        .map((filter) => {
            let filterView;
            let { value } = filter;
            const handler = getFilterHandler(filter);

            if (handler && filter.slug in values) {
                value = handler.deserialize(values[filter.slug]) || handler.getDefaultValue(filter);
            }

            if (filter.slug === "province") {
                value = `${values["locationName"]}_${values["locationId"]}`;
            }

            const FilterComponent = filterComponents[filter.type];

            if (FilterComponent) {
                filterView = (
                    <FilterComponent name={filter.name} data={filter} value={value} onChangeValue={handleValueChange} />
                );
            }
            return (
                <div key={filter.slug} className="widget-filters__item">
                    <Collapse
                        toggleClass="filter--opened"
                        render={({ toggle, setItemRef, setContentRef }) => (
                            <div className="filter filter--opened" ref={setItemRef}>
                                <button type="button" className="filter__title" onClick={toggle}>
                                    {filter.name}
                                    <ArrowRoundedDown12x7Svg className="filter__arrow" />
                                </button>
                                <div className="filter__body" ref={setContentRef}>
                                    <div className="filter__container">{filterView}</div>
                                </div>
                            </div>
                        )}
                    />
                </div>
            );
        });

    const classes = classNames("widget-filters widget", {
        "widget-filters--offcanvas--always": offcanvas === "always",
        "widget-filters--offcanvas--mobile": offcanvas === "mobile",
    });

    return (
        <div className={classes} style={{ backgroundColor: "rgb(250,221,211)" }}>
            <div
                style={{
                    width: "100%",
                    height: "60px",
                    backgroundColor: "rgb(229,44,26)",
                    padding: "0 20px",
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                }}
                className="d-md-flex d-none align-items-center"
            >
                <h4 className="widget-filters__title widget__title text-white mb-0">{title}</h4>
            </div>

            <div className="widget-filters__list" style={{ padding: "0 20px" }}>
                {filtersList}
            </div>

            <div style={{ padding: "20px" }} className="widget-filters__actions d-flex mb-n2">
                <button
                    type="button"
                    style={{
                        background: "rgb(255, 98, 33) none repeat scroll 0% 0%",
                        color: "white",
                    }}
                    className="btn btn-sm"
                    onClick={handleResetFilters}
                >
                    Reset
                </button>
            </div>
        </div>
    );
}

WidgetFilters.propTypes = {
    /**
     * widget title
     */
    title: PropTypes.node,
    /**
     * Category page dispatcher.
     */
    dispatch: PropTypes.func,
    /**
     * Products list filters.
     */
    filters: PropTypes.array,
    /**
     * Products list filter values.
     */
    values: PropTypes.object,
    /**
     * indicates when sidebar bar should be off canvas
     */
    offcanvas: PropTypes.oneOf(["always", "mobile"]),
};

WidgetFilters.defaultProps = {
    offcanvas: "mobile",
};

export default WidgetFilters;
