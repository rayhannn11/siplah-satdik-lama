/* eslint-disable arrow-body-style */
// eslint-disable-next-line no-unused-vars
import qs from "query-string";

const bankApi = {
    /**
     * Himbara checkout posting API
     *
     * @param {number} orderId - Order ID for the transaction
     * @param {string?} token - Authorization token
     *
     * @return {Promise<object>}
     */
    himbara_checkout_posting: (orderId, token) => {
        const params = {
            bank: 'bank_himbara',
            type: 'va',
            methode: 'autoCollection'
        };

        const body = {
            order_id: orderId
        };

        return fetch(`${process.env.REACT_APP_URL_SIPLAH}gateway?${qs.stringify(params)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token || ''
            },
            body: JSON.stringify(body)
        }).then((response) => response.json());
    }
};

export default bankApi;
