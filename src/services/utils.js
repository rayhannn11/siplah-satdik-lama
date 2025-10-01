export const url = {
    home: () => "/",

    catalog: () => "/shop/catalog",

    category: (category) => `/shop/catalog/${category.slug}`,

    product: (product) => `/product/${product.mall.id}/${product.slug}`,

    mall: (mall) => `/store/${mall.slug}`,
};

export function getCategoryParents(category) {
    return category.parent ? [...getCategoryParents(category.parent), category.parent] : [];
}
