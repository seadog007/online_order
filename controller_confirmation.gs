function route_confirmation(e){
  var page = HtmlService.createTemplateFromFile('msg.html');
  page.msg = 'We recieved your order<br/>Please go to your email to confirm the order.<br/>Thanks you!';
  return page.evaluate();
}

function confirmation_html(){
  var page = HtmlService.createTemplateFromFile('msg.html');
  page.msg = 'We recieved your order<br/>Please go to your email to confirm the order.<br/>Thanks you!';
  return page.evaluate().getContent();
}
