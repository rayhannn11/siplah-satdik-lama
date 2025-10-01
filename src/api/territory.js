const territory = {
    getProvince: () => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}master/province`).then((res) => res.json());
    },
    getCity: (id) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}master/city/${id}`).then((res) => res.json());
    },

    getDistrict: (id) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}master/district/${id}`).then((res) => res.json());
    },
};

export default territory;
