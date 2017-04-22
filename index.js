var api_key = require('./sendgrid.env');
var helper = require('sendgrid').mail;
var from_email = new helper.Email('pearljam@pro');
var to_email = new helper.Email('mikeliao97@berkeley.edu');
var subject = 'Please confirm to let us know';
var content = new helper.Content('text/plain', 'Your friend bob invited you to pearljam, \
Follow this link to redirect and signup http://pearljam.pro/dfdfasd');
var mail = new helper.Mail(from_email, subject, to_email, content);

var sg = require('sendgrid')(api_key);
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