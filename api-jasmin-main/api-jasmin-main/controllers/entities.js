


/* JUST A TEST






const axios = require("axios");
const url = "salescore/customerParties";

exports.get = async (req, res) => {
    try {
        console.info("here!!!");
        const token =  await this.connect1();

        console.log(token);
        const url = "https://my.jasminsoftware.com/api/290738/290738-0001/salescore/customerParties";

        const config = {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        };

        console.log(token);

        const customers = await axios.get(url, config);

        console.log(customers.data);

        return res.send(customers.data);
    }
    catch (e) {


    }
}

exports.getById = async (req, res) => {
    try {
        const id = req.params.id;
        const token =  await this.connect1();

        console.log(token);
        const url = `https://my.jasminsoftware.com/api/290738/290738-0001/salescore/customerParties/${id}`;

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
        const url = "https://my.jasminsoftware.com/api/290738/290738-0001/salescore/customerParties"
        const payload = {
            "name": "Luís Malheiro Turbo",
            "isExternallyManaged": false,
            "currency": "EUR",
            "isPerson": false,
            "country": "PT"
        }

        console.log(token);

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

    console.log("token é aqui!")

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
                username: 'IPVCPRODBIO',
                password: '40fbaffc-d0e2-440e-b34e-b2e8752a41a0',
            },
        }
    );

    console.log(result.data);

    return result.data.access_token; //only send token
}

 */