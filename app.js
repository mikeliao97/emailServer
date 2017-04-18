var express = require('express');
var bodyParser = require('body-parser')
var app = express();


app.use(bodyParser.json());


//Send expects a json object
//2) From Username
//3) To Usernam3
//4) From Username unique Link Unique Link 
app.post('/send', function(req, res) {

  console.log('req.body', req.body);
  var fromUser = req.body.from;
  var toUser = req.body.to;
  var toUserEmail = req.body.toEmail;
  var code = req.body.code; 

  console.log(`${fromUser} ${toUser} ${code} ${toUserEmail}`);
  
  var helper = require('sendgrid').mail;
  var from_email = new helper.Email('pearljam@pro');
  var to_email = new helper.Email(toUserEmail);
  var subject = `Hey ${toUser}, Your friend ${fromUser} invited you to play PearlJam. Signup for a bonus 500 Pearls`;
  var content = new helper.Content('text/plain', `Hey ${toUser}, Your friend ${fromUser} invited you to pearljam. \
  Use code ${code} to claim your reward`);
  var mail = new helper.Mail(from_email, subject, to_email, content);

  var sg = require('sendgrid')('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');
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON(),
  });

  sg.API(request, function(error, response) {
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  });  
 
  
  res.status(200).send('finished sending');
})


app.listen(process.env.PORT || 3000, function() {
  console.log(`email server listening on ${process.env.PORT || 3000}`);  
})