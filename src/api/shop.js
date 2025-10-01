/* eslint-disable arrow-body-style */
// eslint-disable-next-line no-unused-vars
import qs from "query-string";

const shopApi = {
    /**
     * Returns array of categories.
     *
     * @param {object?} options
     * @param {number?} options.depth
     *
     * @return {Promise<Array<object>>}
     */

    /**
     * Returns product.
     *
     * @param {string} slug
     *
     * @return {Promise<object>}
     */
    getProductBySlug: (slug, mallId, token) => {
        /**
         * This is what your API endpoint might look like:
         *
         * https://example.com/api/products/screwdriver-a2017.json
         *
         * where:
         * - screwdriver-a2017 = slug
         */
        const params = { mall: mallId };
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}product/${slug}?${qs.stringify(params)}`, {
            method: "get",
            headers: { Authorization: token || "" },
        }).then((response) => response.json());

        // This is for demonstration purposes only. Remove it and use the code above.
        // return getProductBySlug(slug);
    },
    /**
     * Returns array of related products.
     *
     * @param {string}  slug
     * @param {object?} options
     * @param {number?} options.limit
     *
     * @return {Promise<Array<object>>}
     */

    /**
     * Return products list.
     *
     * @param {object?} options
     * @param {number?} options.page
     * @param {number?} options.limit
     * @param {string?} options.sort
     * @param {Object.<string, string>?} filters
     *
     * @return {Promise<object>}
     */
    getProducts: (options = {}, filters = {}, slug, categoryId, token) => {
        const params = { ...options, categoryId };

        Object.keys(filters).forEach((slug) => {
            params[`filter_${slug}`] = filters[slug];
        });
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}product/${slug}?${qs.stringify(params)}`, {
            headers: { Authorization: token || "" },
        }).then((response) => response.json());
    },

    /**
     * Returns array of featured products.
     *
     * @param {object?} options
     * @param {number?} options.limit
     * @param {string?} options.category
     *
     * @return {Promise<Array<object>>}
     */

    getSuggestions: (keyword, options = {}, token) => {
        const params = { limit: options.limit || 5, keyword };

        return fetch(`https://siplah.eurekabookhouse.co.id/api/product/shortProduct?${qs.stringify(params)}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                Authorization: token || "",
            },
        }).then((res) => res.json());
    },
    getProductPacket: (id) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}backendseller/paket/paket_api/detailPacket/${id}`).then(
            (res) => res.json()
        );
    },
    getProductSearch: (keyword, options = {}, filters = {}, token) => {
        const params = { ...options, keyword };
        if (options.locationName) {
            params[`filter_province`] = options.locationName;
        }

        Object.keys(filters).forEach((slug) => {
            params[`filter_${slug}`] = filters[slug];
        });

        return fetch(`${process.env.REACT_APP_URL_SIPLAH}product/search/result?${qs.stringify(params)}`, {
            method: "get",
            headers: { Authorization: token || "" },
        }).then((res) => res.json());
    },
    addProductReview: (req, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}product/review`, {
            method: "post",
            headers: { "Content-Type": "application/json", Authorization: token },
            body: JSON.stringify(req),
        }).then((res) => res.json());
    },
    getProductReviews: (productId, options = { page: 1, limit: 10 }) => {
        const params = { ...options };
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}product/review/${productId}?${qs.stringify(params)}`).then(
            (res) => res.json()
        );
    },
    getMallReviews: (mallId, options = { page: 1, limit: 1 }) => {
        const params = { ...options };
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}mall/review/${mallId}?${qs.stringify(params)}`).then((res) =>
            res.json()
        );
    },
};
export default shopApi;
