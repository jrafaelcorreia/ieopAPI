
const axios = require("axios");

exports.get = async (req, res) => {
    try {
        const token =  await this.connect1();
        const url = "https://my.jasminsoftware.com/api/292267/292267-0001/salescore/customerParties";

        const config = {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        };

        const customers = await axios.get(url, config);
        return res.send(customers.data);
    }
    catch (e) {
        res.send(e);


    }
}

exports.getById = async (req, res) => {
    try {
        const id = req.params.id;
        const token =  await this.connect1();
        const url = `https://my.jasminsoftware.com/api/292267/292267-0001/salescore/customerParties/${id}`;

        const config = {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        };

        const customer = await axios.get(url, config);
        return res.send(customer.data);
    }
    catch (err) {
        res.send(err);
        return;
    }
}

exports.create = async (req, res) => {
    try {
        const token =  await this.connect1();
        const url = "https://my.jasminsoftware.com/api/292267/292267-0001/salescore/customerParties"
        const payload = {
            "name": "Joaquim Alberto",
            "isExternallyManaged": false,
            "currency": "EUR",
            "isPerson": false,
            "country": "PT"
        }

        axios.defaults.headers.common = { 'Authorization': 'Bearer ' + token }
        const result = await  axios.post(url, payload);
        res.send("OK!")
    } catch (err) {
        res.send(err);
        return;
    }
    res.send("OK!");
}

exports.connect1 = async () => {
    const result = await axios.post(
        "https://identity.primaverabss.com/connect/token",
        {
            grant_type: "client_credentials",
            scope: "application",
        },
        {
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            },
            auth: {
                username: 'IEOP2022IPVC',
                password: '4a0a39b4-d6bf-439c-b576-084d72cf7939',
            },
        }
    );
    return result.data.access_token; //only send token
}