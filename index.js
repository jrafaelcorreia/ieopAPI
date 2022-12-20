const express = require("express");
const request = require('request');

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

exports.teste = async () => {
app.post("/test", function(requesto, resposta) {
    res.status(200).json({
        status: true,
        message: "teste"
    });
    const connect = this.get(requesto,resposta);
})
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
                username: 'IEOP2223-IPVC',
                password: '2637f8d3-4be4-4e3a-bc4f-e79d04bf9f52',
            },
        }
    );
    return result.data.access_token; //only send token
}

exports.get = async (req, res) => {
    try {
        const token =  await this.connect1();
        const url = "https://my.jasminsoftware.com/api/291662/291662-0001/sales/orders";

        const config = {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        };

        const orders = await axios.get(url, config);
        return res.send(orders.data);
    }
    catch (error) {
        res.send(error);
        return;
    } 
}


app.get("/", function(req, res) {
    res.status(200).json({
        status: true,
        message: "Iniciei",
    });
    
})


app.post("/t", function(requesto, resposta) {
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
        user: 'IEOP2223-IPVC', // TODO : put your application client id here
        pass: '2637f8d3-4be4-4e3a-bc4f-e79d04bf9f52' // TODO : put your application client secret here
      },
      form: { 
        'grant_type': 'client_credentials',
        'scope': 'application',
      }
    }, function(err, res) {
      if (res) {

        var json = JSON.parse(res.body);
        var access_token = json.access_token;
   
        var url = `https://my.jasminsoftware.com/291662/291662-0001/salescore/customerParties/odata?$filter=CompanyTaxID eq '${nif}'`;

        request({
            url: url,
            method: "GET",
            headers: {
              "Authorization": `bearer ${access_token}`,
              'Content-Type': 'application/json'
          },
          form: {
              scope: 'application'
          }
      },
      function(err, res) {

          if(err) {
              resposta.status(200).json({
                  status: false,
                  message: "Erro ao obter nif"
              });
              return;
          }

          var json = JSON.parse(res.body);

          if(json.items.length > 0) {
              console.log("Sucesso");

              var idFazerPedidoNovo = json.items[0].partyKey;

              let url = `http://my.jasminsoftware.com/api/291662/291662-0001/salescore/customerParties/${idFazerPedidoNovo}`;
              request(
                  {url: url,
                  method: "GET",
                  headers: {
                      "Authorization": `bearer ${access_token}`,
                      'Content-Type': 'application/json'
                  },
                  form: {
                      scope: 'application'
                  }}, function(errFinal, respostaFinal) {
                      
                      if(errFinal) {
                          console.log(errFinal);
                          resposta.status(200).json({
                              status: false,
                              message: "Ocorreu um erro final"
                          }); 
                          return;
                      }
                      
                      var respostaJSON = JSON.parse(respostaFinal.body);

                      console.log({
                          identificador: respostaJSON.partyKey,
                          nif: respostaJSON.companyTaxId,
                          nome: respostaJSON.name,
                          email: respostaJSON.electronicMail
                      });

                      resposta.status(200).json({
                          status: true,
                          message: {
                              identificador: respostaJSON.partyKey,
                              nif: respostaJSON.companyTaxId,
                              nome: respostaJSON.name,
                              email: respostaJSON.electronicMail
                          }
                      });

                  });
              
          } else {
              resposta.status(200).json({
                  status: false,
                  message: "Não existe esse utente"
              });
          }

      });
    }
    else {
      resposta.status(200).json({
          status: false,
          message: "Ocorreu um erro ao fazer o pedido de autenticação"
      });
      return;
    }
  });
});

//POST CUSTOMER M
/**
*  Method: POST
*  endpoint: /createcliente
*  PARAMS:
*      Nome Próprio 
*      Data de Nascimento
*      E-mail 
*      Telefone
*      nif
* 
*  retorno:
*      status,
*      message: id
*/

app.post("/verificarstock", function(requesto, resposta) {
  console.log("########verififcar stock############\n")

  request({
      url: 'https://identity.primaverabss.com/core/connect/token',
      method: 'GET',
      auth: {
        user: 'IEOP2223-IPVC', // TODO : put your application client id here
        pass: '2637f8d3-4be4-4e3a-bc4f-e79d04bf9f52' // TODO : put your application client secret here
      },
      form: { 
        'grant_type': 'client_credentials',
        'scope': 'application',
      }
    }, function(err, res) {
      if (res) {
        var numProduto = json.items[0].partyKey;
          //fazer o pedido de criaçao de cliente
          var urlPedido = `https://my.jasminsoftware.com/api/291662/291662-0001/materialsmanagement/itemAdjustments/${numProduto}`;     

          var json = JSON.parse(res.body);
          var access_token = json.access_token;

          console.log(urlPedido);
          request.post({
              url: urlPedido,
              headers: {
                  "Authorization": `bearer ${access_token}`,
                  'Content-Type': 'application/json'
              },
              json: true,
              body: {
                  name: requesto.body.nome,
                  isExternallyManaged: false,
                  currency: "EUR",
                  isPerson: true,
                  country: "PT",
                  companyTaxId: requesto.body.nif,
                  electronicMail: requesto.body.email,
                  telephone: requesto.body.telefone
              }
          }, function(err, res) {
              if(err) {
                  resposta.status(200).json({
                      status: false,
                      message: "Ocorreu um erro ao inserir o utente"
                  });
                  return;
              } 

              console.log(res);

              if(res.statusCode != 201) {
                  console.log(res.statusCode);
                  resposta.status(200).json({
                      status: false,
                      message: "Ocorreu um erro ao criar o utente"
                  });
                  return;
              } 

              var urlNovo = `https://my.jasminsoftware.com/api/291662/291662-0001/salesCore/customerParties/${res.body}`;

              request(
                  {url: urlNovo,
                  method: "GET",
                  headers: {
                      "Authorization": `bearer ${access_token}`,
                      'Content-Type': 'application/json'
                  },
                  form: {
                      scope: 'application'
                  }}, function(err, respostaFinal) {
                      
                      if(err) {
                          resposta.status(200).json({
                              status: false,
                              message: "Ocorreu um erro final"
                          });
                          return;
                      }

                      var respostaJSON = JSON.parse(respostaFinal.body);

                      console.log({
                          identificador: respostaJSON.partyKey,
                          nif: respostaJSON.companyTaxId,
                          nome: respostaJSON.name,
                          email: respostaJSON.electronicMail
                      });

                      resposta.status(200).json({
                          status: true,
                          message: {
                              identificador: respostaJSON.partyKey,
                              nif: respostaJSON.companyTaxId,
                              nome: respostaJSON.name,
                              email: respostaJSON.electronicMail
                          }
                      });

                  });

      
          });
          
      } else {
        resposta.status(200).json({
            status: false,
            message: "Ocorreu um erro ao fazer o pedido de autenticação"
        });
        return;
      }
    });
});

//GET ESPECIALIDADE M
/**
* METHOD: GET
* ENDPOINT: /getespecialidades
* Filtrar por grupo
* retorna uma lista com as especialidades
* 
*/
app.get("/getespecialidades", function(requesto, resposta) {
  //Pedir um acces token
  request({
    url: 'https://identity.primaverabss.com/core/connect/token',
    method: 'POST',
    auth: {
      user: 'IEOP2223-IPVC', // TODO : put your application client id here
      pass: '2637f8d3-4be4-4e3a-bc4f-e79d04bf9f52' // TODO : put your application client secret here
    },
    form: { 
      'grant_type': 'client_credentials',
      'scope': 'application',
    }
  }, function(err, res) {
    if (res) {

      var json = JSON.parse(res.body);
      var access_token = json.access_token;
  
      var url = `http://my.jasminsoftware.com/api/291662/291662-0001/salescore/salesitems/odata?$filter=Description eq 'Consulta'`;
  
      request({
          url: url,
          method: "GET",
          headers: {
              "Authorization": `bearer ${access_token}`,
              'Content-Type': 'application/json'
          },
          form: {
              scope: 'application'
          }
      },
      function(err, res) {

          if(err) {
              resposta.status(200).json({
                  status: false,
                  message: "Tenho problemas!"
              });
              return;
          }

          var json = JSON.parse(res.body);

          if(json.items.length > 0) {
              var Arr = [];
              json.items.forEach(item => Arr.push({id: item.itemKey, descricao: item.complementaryDescription}));
              resposta.status(200).json({
                  status: true,
                  message: Arr
              });
          } else {
              resposta.status(200).json({
                  status: false,
                  message: "Não existem especialidades!"
              });
          }

      });
    }
    else {
      resposta.status(200).json({
          status: false,
          message: "Ocorreu um erro ao fazer o pedido de autenticação"
      });
      return;
    }
  });
});


//POST ENCOMENDA 
/**
* METHOD: POST
* ENDPOINT: /createencomenda
*  PARAMS: idUtente, idEspecialidade/artigo
* 
*  status: true
*  status: 
*          
* 
*/ 
app.post("/createencomenda", function(requesto, resposta) {
  console.log("################CRIAR ENCOMENTDA#################\n");
  console.log(requesto.body);
  if(typeof requesto.body.cutomerId === "undefined"){
      resposta.status(200).json({
          status: false,
          message: "É necessário fornecer o id do cliente"
      })

      return;
  }

  if(typeof requesto.body.itemId === "undefined"){
      resposta.status(200).json({
          status: false,
          message: "É necessário fornecer a especialidade"
      })
      
      return;
  }


  request({
      url: 'https://identity.primaverabss.com/core/connect/token',
      method: 'POST',
      auth: {
        user: 'IE', // TODO : put your application client id here
        pass: '77d952e3-ecbd-46f4-a815-b119913d5519' // TODO : put your application client secret here
      },
      form: { 
        'grant_type': 'client_credentials',
        'scope': 'application',
      }
    }, function(err, res) {
      if (res) {

        var json = JSON.parse(res.body);
        var access_token = json.access_token;
        var date = new Date();
        var datetime = /*date.getFullYear() + */ date.getDate() + "-" + (date.getMonth()+1) + "-" + "2019"
                      + "T" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    
        var url = `https://my.jasminsoftware.com/api/291662/291662-0001/sales/orders`;
    
        request({
            url: url,
            method: "POST",
            headers: {
                "Authorization": `bearer ${access_token}`,
                'Content-Type': 'application/json'
            },
            json: true,
            body: {
              
              BuyerCustomerParty : requesto.body.cutomerId,
              currency: "EUR",
              documentType: "ECL",
              quantity: 1,
              documentDate: datetime,
              "documentLines": [
                  {
                      salesItem: requesto.body.itemId,
                      quantity: 1,
                      unit :"UN",
                      itemTaxSchema :"IVA-TR",
                      "unitPrice": {
                      "amount": 50
                    }
                  }
              ]
            } 
        },
        function(err, res) {
            if(err) {
                resposta.status(200).json({
                    status: false,
                    message: "Ocorreu um erro ao criar consulta"
                    
                });
                return;
            }
          console.log(res.body);

            if(res.statusCode != 201) {
              console.log(res.statusCode);
              resposta.status(200).json({
                  status: false,
                  message: res
              });
              return;
          }

          resposta.json({
              status: true,
              message: res
          });
        });
      }
      else {
        resposta.status(200).json({
            status: false,
            message: "Ocorreu um erro ao fazer o pedido de autenticação"
        });
        return;
      }
    });  
});

app.post("/xmlkillme", async function(req, res) {
  if(typeof req.body.idMedico === "undefined") {
      resposta.status(200).json({
          status: false,
          message: "Tens de inserir um nif"
      });
      return;
  }

  let medico = req.body.idMedico;

  if(typeof req.body.data === "undefined") {
      resposta.status(200).json({
          status: false,
          message: "Tens de inserir um nif"
      });
      return;
  }

  let dataConsulta = req.body.data;

  if(typeof req.body.hora === "undefined") {
      resposta.status(200).json({
          status: false,
          message: "Tens de inserir um nif"
      });
      return;
  }

  let horaConsulta = req.body.hora;

  let url = "http://localhost:10024/IEOPProject/WebServices/EntityManagerSOA.asmx?wsdl";
  let headers = {
      "Content-Type": "text/xml;charset=UTF-8"
  }



  let xml = `
      <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
          <Body>
              <getEntitiesAsString xmlns="http://tempuri.org/">
                  <entitiesInfo>
                      <![CDATA[<BizAgiWSParam>
                              <EntityData>
                                      <EntityName>Horario</EntityName>
                                      <Filters> HoraConsulta = ${horaConsulta} and DataConsulta = '${dataConsulta}' </Filters>
                              </EntityData>
                      </BizAgiWSParam>]]>
                  </entitiesInfo>
              </getEntitiesAsString>
          </Body>
      </Envelope>`;

      let options = {
          url: url,
          method: "POST",
          headers: headers,
          body:xml
      }

      request(options, async function(err, response) {
          if(err) {
              res.status(200).json({
                  status: false,
                  message: "SHIT"
              })

              console.log(err);
              return;
          }

          let document = await parser.parseStringPromise(response.body);
          
      
          let retorno = document["soap:Envelope"]["soap:Body"][0].getEntitiesAsStringResponse[0].getEntitiesAsStringResult;

    
          let document2 = await parser.parseStringPromise(retorno);
          let entidades = document2.BizAgiWSResponse.Entities;

          //Se não houver resultados está livre
          if(entidades[0] === '') {
              res.status(200).json({
                  status: true,
                  message: true
              });
              return;
          }

          
          //Buscar o horario
          let horario = entidades[0].Horario;

          let horariosArray = [];

          horario.forEach(e => {
              horariosArray.push(e["$"].key);
          })
 

          //Construir uma string com o query dos horarios
          let query = "";
          horariosArray.forEach(e => query+=`Horario=${e} or `)

          query = query.slice(0,-3);

          //Fazer um novo pedido kill me
          //Memorando remover comentarios estranhos


          let xml = `
          <Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
              <Body>
                  <getEntitiesAsString xmlns="http://tempuri.org/">
                      <entitiesInfo>
                          <![CDATA[<BizAgiWSParam>
                              <EntityData>
                                  <EntityName>Consulta</EntityName>
                                  <!--<Filters> HoraConsulta = 10 and DataConsulta = '2020-01-21' </Filters>-->
                                  <Filters> (${query}) and Medicos= ${medico}</Filters>
                              </EntityData>
                          </BizAgiWSParam>]]>
                      </entitiesInfo>
                  </getEntitiesAsString>
              </Body>
          </Envelope> `

          let options = {
              url: url,
              method: "POST",
              headers: headers,
              body:xml
          }



          request(options, async function(err, resposta2) {

              if(err) {
                  res.status(200).json({
                      status: false,
                      message: "SHIT"
                  })
  
                  console.log(err);
                  return;
              }

              let document = await parser.parseStringPromise(resposta2.body);
          
      
              let retorno = document["soap:Envelope"]["soap:Body"][0].getEntitiesAsStringResponse[0].getEntitiesAsStringResult;
  
              console.log(retorno);
              let document2 = await parser.parseStringPromise(retorno);
              let entidades = document2.BizAgiWSResponse.Entities;
  
              //Se não houver resultados está livre
              if(entidades[0] === '') {
                  res.status(200).json({
                      status: true,
                      message: true
                  });
                  return;
              }

              console.log(entidades);



              res.status(200).json({
                  status: true,
                  message: false
              })


          })


      });

});

app.post("/sendemail", function(req,res){

  
  console.log(req.body);

  if(typeof req.body.nomeUtente === "undefined"){

      res.status(200).json({
          status: false,
          message: "Nome de utente não definido."
      });

      return;
  }

  if(typeof req.body.nomeMedico === "undefined"){

      res.status(200).json({
          status: false,
          message: "Nome de médico não definido."
      });

      return;
  }

  if(typeof req.body.nomeClinica === "undefined"){

      res.status(200).json({
          status: false,
          message: "Nome de clinica não definido."
      });

      return;
  }

  if(typeof req.body.especialidade === "undefined"){

      res.status(200).json({
          status: false,
          message: "Especialidade não definida."
      });

      return;
  }

  if(typeof req.body.horaConsulta === "undefined"){

      res.status(200).json({
          status: false,
          message: "Hora não definida."
      });

      return;
  }

  if(typeof req.body.dataConsulta === "undefined"){

      res.status(200).json({
          status: false,
          message: "Data não definida."
      });

      return;
  }

  if(typeof req.body.emailUtente === "undefined"){

      res.status(200).json({
          status: false,
          message: "Email de utente não definido."
      });

      return;
  }

  var nodemailer = require('nodemailer');

  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'ieopProject@gmail.com',
          pass: 'aA123456!'
      }
  });

  var dataConsultaRevised = req.body.dataConsulta.substring(0,10);

  var array = dataConsultaRevised.split("-");

  var orderedData = `${array[2]}-${array[1]}-${array[0]}`;

  var textMail = `<p>Caro/a ${req.body.nomeUtente},</p>
  <p>A sua consulta de ${req.body.especialidade} 
  com o/a médico/a ${req.body.nomeMedico} foi marcada para o dia ${orderedData}
  às ${req.body.horaConsulta}h, na clínica "${req.body.nomeClinica}."</p>`;

  var mailOptions = {
      from: 'ieopProject@gmail.com',
      to: req.body.emailUtente,
      subject: 'A sua consulta foi marcada.',
      html: textMail
  };

  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          console.log(error);
      }else{
          console.log("Email sent: " + info.res);
          res.status(200).json({
              status: true,
              message: "Email enviado com sucesso."
          });
      }
  })

})


app.listen(PORT, function() {
  console.log("iniciei");
})