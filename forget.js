var http = require("https");

var options = {
  "method": "POST",
  "hostname": "emailapi.netcorecloud.net",
  "port": null,
  "path": "/v5/mail/send",
  "headers": {
    "api_key": "f07afebd4480a49aa9f7a7a40606a3a8",
    "content-type": "application/json"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
   console.log(body.toString());
  });
});

req.write(JSON.stringify({
  from: {email: 'pepz1nmail@pepisandbox.com', name: 'pepz1nmail'},
  subject: 'Your Barcelona flight e-ticket : BCN2118050657714',
  content: [{type: 'html', value: 'Hello Lionel, Your flight for Barcelona is confirmed.'}],
  personalizations: [{to: [{email: 'bebezanetti@gmail.com', name: 'Lionel Messi'}]}]
}));
req.end();