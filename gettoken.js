var request = require('request');
 
request({
  url: 'https://identity.primaverabss.com/connect/token',
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
    console.log("Access Token:", json.access_token);
    
  }
  else {
    console.log("Could not obtain acess token.");
  }
});

