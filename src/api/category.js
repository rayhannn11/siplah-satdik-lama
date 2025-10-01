const categoryApi = {
    getCategories: () => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}product/category`).then((res) => res.json());
    },
};

export default categoryApi;
