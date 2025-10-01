const config = {
    getConfig: () => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}config`).then((res) => res.json());
    },
    getConfigNego: (slug, token) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH}config/modal_add_nego/${slug}`, {
            headers: { Authorization: token },
            method: "get",
        }).then((res) => res.json());
    },
};

export default config;
