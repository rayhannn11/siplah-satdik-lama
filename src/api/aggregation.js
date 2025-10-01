const aggregation = {
    allRequest: (data) => {
        const formData = new FormData()
        for (const key in data) {
            formData.append(key, data[key])
        }
        return fetch(`${process.env.REACT_APP_URL_SIPLAH_KEMDIKBUD}`, {
            method: 'post',
            body: formData
        }).then(res => res.json())
    },
    identity: () => {
        const formData = new FormData();
        formData.append('url', 'identity')
        formData.append('method', 'GET')
        return fetch(`${process.env.REACT_APP_URL_SIPLAH_KEMDIKBUD}`, {
            method: 'post',
            // headers: { 'Content-Type': 'application/json' },
            body: formData
        }).then(res => res.json())
    },
    loggedIn: (req, params) => {
        const { activity, school, user } = params
        const formData = new FormData()
        formData.append('url', `activities/${activity}/schools/${school}/users/${user}/events/logged_in`)
        formData.append('method', 'POST')
        formData.append('data', req)

        return fetch(`${process.env.REACT_APP_URL_SIPLAH_KEMDIKBUD}`, {
            method: 'post',
            body: formData
        }).then(response => response.json())
    },
    loggedOut: (req, params) => {
        const { activity, school, user } = params
        return fetch(`${process.env.REACT_APP_URL_SIPLAH_KEMDIKBUD}v1/activities/${activity}/schools/${school}/users/${user}/events/logged_out`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req)
        }).then(response => response.json())
    },
    chatSubmitted: (params, req) => {
        const { chat } = params
        return fetch(`${process.env.REACT_APP_URL_SIPLAH_KEMDIKBUD}v1/chats/${chat}/events/submitted`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req)
        }).then(response => response.json())
    },
    comparisonCreated: (req, params) => {
        const { comparison } = params
        return fetch(`${process.env.REACT_APP_URL_SIPLAH_KEMDIKBUD}v1/comparisons/${comparison}/events/created`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req)
        }).then(response => response.json())
    },
    negotiationStarted: (req, params) => {
        const { negotiation } = params
        return fetch(`${process.env.REACT_APP_URL_SIPLAH_KEMDIKBUD}v1/negotiations/${negotiation}/events/started`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req)
        }).then(response => response.json())

    },
    negotiationCountered: (req, params) => {
        const { negotiation } = params
        return fetch(`${process.env.REACT_APP_URL_SIPLAH_KEMDIKBUD}v1/negotiations/${negotiation}/events/countered`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req)
        }).then(response => response.json())
    },
    schoolCreated: (req, params) => {
        const { school } = params
        return fetch(`${process.env.REACT_APP_URL_SIPLAH_KEMDIKBUD}v1/schools/${school}/events/created`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req)
        }).then(response => response.json())

    },
    schoolStatusUpdated: (req, params) => {
        const { school } = params
        return fetch(`${process.env.REACT_APP_URL_SIPLAH_KEMDIKBUD}v1/schools/${school}/events/status_updated`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req)
        }).then(response => response.json())

    },
    orderCreated: (req, params) => {
        const { transaction } = params
        return fetch(`${process.env.REACT_APP_URL_SIPLAH_KEMDIKBUD}v1/transactions/${transaction}/events/created`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req)
        }).then(response => response.json())

    },
    infoUpdate: (req, params) => {
        const { transaction } = params
        return fetch(`${process.env.REACT_APP_URL_SIPLAH_KEMDIKBUD}v1/transactions/${transaction}/events/info_updated`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req)
        }).then(response => response.json())
    },
    orderCanceled: (req, params) => {
        const { transaction } = params
        return fetch(`${process.env.REACT_APP_URL_SIPLAH_KEMDIKBUD}v1/transactions/${transaction}/events/order_cancelled`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req)
        }).then(response => response.json())


    },
    cancellationProposed: (req, params) => {
        const { transaction } = params
        return fetch(`${process.env.REACT_APP_URL_SIPLAH_KEMDIKBUD}v1/transactions/${transaction}/events/order_rejected`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req)
        }).then(response => response.json())
    },
    complaintSubmitted: (req, params) => {
        const { transaction } = params
        return fetch(`${process.env.REACT_APP_URL_SIPLAH_KEMDIKBUD}v1/transactions/${transaction}/events/complaint_submitted`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req)
        }).then(response => response.json())
    },
    complaintResolved: (req, params) => {
        const { transaction } = params
        return fetch(`${process.env.REACT_APP_URL_SIPLAH_KEMDIKBUD}v1/transactions/${transaction}/events/complaint_resolved`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req)
        }).then(response => response.json())
    },
    orderReturned: (req, params) => {
        const { transaction } = params
        return fetch(`${process.env.REACT_APP_URL_SIPLAH_KEMDIKBUD}v1/transactions/${transaction}/events/order_returned`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req)
        }).then(response => response.json())
    },
    agreementUpdated: (req, params) => {
        const { transaction } = params
        return fetch(`${process.env.REACT_APP_URL_SIPLAH_KEMDIKBUD}v1/transactions/${transaction}/events/agreement_updated`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req)
        }).then(response => response.json())
    },
    orderReceived: (req, params) => {
        const { transaction } = params
        return fetch(`${process.env.REACT_APP_URL_SIPLAH_KEMDIKBUD}v1/transactions/${transaction}/events/order_received`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req)
        }).then(response => response.json())

    },
    testimonySubmitted: (req, params) => {
        const { transaction } = params
        return fetch(`${process.env.REACT_APP_URL_SIPLAH_KEMDIKBUD}v1/transactions/${transaction}/events/testimony_submitted`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req)
        }).then(response => response.json())

    },
    fundSources: (school) => {
        return fetch(`${process.env.REACT_APP_URL_SIPLAH_KEMDIKBUD}v1/funds/${school}`).then(response => response.json())
    },
}

export default aggregation