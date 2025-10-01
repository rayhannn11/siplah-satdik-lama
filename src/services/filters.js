const CheckFilterHandler = {
    type: "check",
    serialize: (value) => value.join(","),
    deserialize: (value) => (value ? value.split(",") : []),
    isDefaultValue: (filter, value) => value.length === 0,
    getDefaultValue: () => [],
};

const ColorFilterHandler = {
    type: "color",
    serialize: (value) => value.join(","),
    deserialize: (value) => (value ? value.split(",") : []),
    isDefaultValue: (filter, value) => value.length === 0,
    getDefaultValue: () => [],
};

const RadioFilterHandler = {
    type: "radio",
    serialize: (value) => value,
    deserialize: (value) => value,
    isDefaultValue: (filter, value) => RadioFilterHandler.getDefaultValue(filter) === value,
    getDefaultValue: (filter) => filter.items[0].slug,
};

const RangeFilterHandler = {
    type: "range",
    serialize: (value) => value.join("-"),
    deserialize: (value) => (value ? value.split("-").map(parseFloat) : undefined),
    isDefaultValue: (filter, value) => filter.min === value[0] && filter.max === value[1],
    getDefaultValue: (filter) => [filter.min, filter.max],
};

const DropdownFilterHandler = {
    type: "dropdown",
    serialize: (value) => value,
    deserialize: (value) => value,
    isDefaultValue: (filter, value) => DropdownFilterHandler.getDefaultValue(filter) === value,
    getDefaultValue: () => "",
};

const CategoryFilterHandler = {
    type: "category",
    serialize: (value) => value,
    deserialize: (value) => value,
    isDefaultValue: (filter, value) => CategoryFilterHandler.getDefaultValue(filter) === value,
    getDefaultValue: () => "",
};
const CategoryMallFilterHandler = {
    type: "category_mall",
    serialize: (value) => value,
    deserialize: (value) => value,
    isDefaultValue: (filter, value) => CategoryFilterHandler.getDefaultValue(filter) === value,
    getDefaultValue: () => "",
};

const handlers = [
    CheckFilterHandler,
    ColorFilterHandler,
    RadioFilterHandler,
    RangeFilterHandler,
    DropdownFilterHandler,
    CategoryFilterHandler, CategoryMallFilterHandler
];

export default function getFilterHandler(filter) {
    return handlers.find((x) => x.type === filter.type);
}
