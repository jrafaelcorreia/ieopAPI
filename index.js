const express = require("express");
const request = require('request'); 
const parser = require("xml2js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


const PORT = 5000;


/**
 * 
 * PARAMS:
 *      nenhum
 * Result:
 *      status - booleano que indica o estado de sucesso ou insucesso
 * 
 */
app.get("/", function(req, res) {
    res.status(200).json({
        status: true,
        message: "Iniciei"
    });
})

app.post("/teste", function(requesto, resposta) {
    console.log("###########teste####################\n");
    if(typeof requesto.body.nif === "undefined") {
        resposta.status(200).json({
            status: false,
            message: "teste"
        });
        return;
    }

    var nif = requesto.body.nif;

    //Pedir um acces token   
    request({
      url: 'https://identity.primaverabss.com/core/connect/token',
      method: 'POST',
      auth: {
        user: 'IEOP2022IPVC', // TODO : put your application client id here
        pass: '36938944-74b2-41ee-8855-146244025132' // TODO : put your application client secret here
      },
      form: { 
        'grant_type': 'client_credentials',
        'scope': 'application',
      }
    }, function(err, res) {
      if (res) {

        var json = JSON.parse(res.body);
        var access_token = json.access_token;
   
        var url = `https://my.jasminsoftware.com/api/289715/289715-0001/cliente/'${nif}'`;

        request({
            url: url,
            method: "GET",


    });