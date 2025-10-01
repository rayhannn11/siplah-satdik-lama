import qs from "query-string";
const storeApi = {
    getNewProducts: (options = {}, filters = {}, keyword, token) => {
        const params = {
            limit: options.limit || 10,
            page: options.page || 1,
        };

        // Add keyword to params if provided
        if (keyword) {
            params.keyword = keyword;
        }

        // Add sort option if provided
        if (options.sort) {
            params.sort = options.sort;
        }

        // Add location filters if provided
        if (options.locationName) {
            params.filter_province = options.locationName;
        }
        if (options.locationId) {
            params.filter_locationId = options.locationId;
        }
        if (options.categoryId) {
            params.filter_categoryId = options.categoryId;
        }
        if (options.longitude) {
            params.longitude = options.longitude;
        }
        if (options.latitude) {
            params.latitude = options.latitude;
        }

        // Add filters to params
        Object.keys(filters).forEach((slug) => {
            params[`filter_${slug}`] = filters[slug];
        });

        return fetch(`https://siplah.eurekabookhouse.co.id/api/product/shortProduct?${qs.stringify(params)}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: token || "",
            },
        }).then((res) => res.json());
    },
    getStores: (options = {}, filters = {}, keyword, token) => {
        const params = { ...options, keyword };

        Object.keys(filters).forEach((slug) => {
            params[`filter_${slug}`] = filters[slug];
        });
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}mall?${qs.stringify(params)}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: token || "",
            },
        }).then((res) => res.json());
    },
    getStore: (slug) => {
        const params = { slug };
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}mall?${qs.stringify(params)}`).then((res) => res.json());
    },

    addReviewStore: (req, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}mall/review`, {
            method: "post",
            headers: { "Content-Type": "application/json", Authorization: token },
            body: JSON.stringify(req),
        }).then((res) => res.json());
    },
    searchStore: (keyword) => {
        return fetch(`https://siplahstagingapi.eurekagroup.id/penyedia/get-cv?page=1&limit=5&keyword=${keyword}`, {
            method: "get",
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());
    },
    uploadExcel: (file, mall_id) => {
        const formdata = new FormData();
        formdata.append("file", file);
        formdata.append("mall_id", mall_id);
        return fetch(`https://siplahstagingapi.eurekagroup.id/penyedia/uploadCSV`, {
            method: "POST",
            body: formdata,
        }).then((res) => res.json());
    },
};

export default storeApi;
