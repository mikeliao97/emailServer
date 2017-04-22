var express = require('express');
var bodyParser = require('body-parser')

//setup postgres database
var pg = require('pg');
var client = new pg.Client('postgres://postgres:root@pearljam.pro:5432/test');
client.connect()    

var app = express();


app.use(bodyParser.json());


//Send expects a json object
//2) From Username
//3) To Usernam3
//4) From Username unique Link Unique Link 

/*
Example request body
{
	"from": "jennifer",
	"to": "andy",
	"code": "432424fdsaf",
	"toEmail": "mikeliao97@gmail.com"
}

*/


var api_key = require('./sendgrid.env');
app.post('/send', function(req, res) {

  var fromUser = req.body.from;
  var toUser = req.body.to;
  var toUserEmail = req.body.toEmail;
  var code = req.body.code; 

  var helper = require('sendgrid').mail;
  var from_email = new helper.Email('pearljam@pro');
  var to_email = new helper.Email(toUserEmail);
  var subject = `Hey ${toUser}, Your friend ${fromUser} invited you to play PearlJam. Signup for a bonus 500 Pearls`;
  var content = new helper.Content('text/plain', `Hey ${toUser}, Your friend ${fromUser} invited you to pearljam. \
  Use code ${code} to claim your reward`);
  var mail = new helper.Mail(from_email, subject, to_email, content);

  var sg = require('sendgrid')(api_key);
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON(),
  });

  sg.API(request, function(error, response) {
    if (error) {
      console.log('err', error);
    } else  {
      //confirmation was sent, make a
      var queryStr = `insert into invites values ('${fromUser}', '${toUserEmail}', '${code}', false)`
      client.query(queryStr, function(err, result) {
        if (err) {
          console.log('err', err);
          res.status(500).send({error: err});
        } else {
          console.log('result', result);
          res.status(200).send(`finished sending info ${fromUser} ${toUserEmail} ${code}`);
        }
      });
    }
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  });  
})

app.get('/userInvites/:userEmail', function(req, res) {
    console.log('request params', req.params);  
    const userEmail = req.params.userEmail;
    var queryStr = `select * from invites where fromemail='${userEmail}'`
    client.query(queryStr, function(err, result) {
      if (err) {
        console.log('err', err);
      } else {
        console.log('result', result);
        res.status(200).send(result.rows);
      }
    })
})


app.listen(process.env.PORT || 3000, function() {
  console.log(`email server listening on ${process.env.PORT || 3000}`);  
})