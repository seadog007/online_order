var appname = 'snackfast';
var itemprefix = 'item_';
var common_title = 'Snackfast - Online Ordering';
var serviceUrl = ScriptApp.getService().getUrl();
var sheetID = '19FjtBRALRtV0XIcDjklmv8wroBjAUVuxzaa7jSgZRto';
var sheetApp = SpreadsheetApp.openById(sheetID); // 打開試算表
var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
var tomorrow_str = tomorrow.getFullYear() + '-' + (tomorrow.getMonth() + 1) + '-' + tomorrow.getDate();

function signSHA_256(message){
  return digest(Utilities.DigestAlgorithm.SHA_256, appname + message); // 加salt
}

function digest(algorithm, msg){
  algorithm = algorithm || Utilities.DigestAlgorithm.SHA_256; // 預設 sha256 雜湊
  msg = msg || "";  // 預設空字串
  var signature = Utilities.computeDigest(algorithm, msg, Utilities.Charset.US_ASCII)
  var signatureStr = '';
    for (var i = 0; i < signature.length; i++) {
      var byte = signature[i];
      if (byte < 0)
        byte += 256;
      var byteStr = byte.toString(16);
      if (byteStr.length == 1) byteStr = '0'+byteStr;
      signatureStr += byteStr;
    }
  return signatureStr;
}

function mailprocess(body, data){
  for (var i in data){
    body = body.replaceall('{{' + i + '}}', data[i]); //替換{{key}}為value
  }
  return body
}

function getprice(item_id){
  var sheet = sheetApp.getSheetByName('Items'); // 打開分頁
  for (var i = 2; i <= sheet.getLastRow(); i++){
    if (sheet.getRange(i, 1).getValue() == item_id){ // 如果物品ID = i
      return sheet.getRange(i, 4).getValue();
    }
  }
  return 0;
}

function findhash(hash){ // 回傳hash所在行數
  var sheet = sheetApp.getSheetByName('Unconfirmed'); // 打開分頁

  for (var i = 2; i <= sheet.getLastRow(); i++){
    if (sheet.getRange(i, 2).getValue() == hash){
      return i;
    }
  }
  return -1;
}

function sameday(d1, d2){
  return d1.toLocaleDateString() === d2.toLocaleDateString();
}

function genlist(items){
  var sheet = sheetApp.getSheetByName('Items'); // 打開分頁
  var output = '';

  for (var i = 2; i <= sheet.getLastRow(); i++){
    itemid = sheet.getRange(i, 1).getValue();
    if (items[itemid] > 0){ // 如果物品數量 > 0
      output += ' - ' + sheet.getRange(i, 2).getValue() + ' ' + sheet.getRange(i, 3).getValue() + ' *' +  items[itemid] + '\n'; // - 物品名稱 *物品數量
    }
  }

  output = output.substring(0, output.length - 1); // 移除最後一個換行
  return output;
}

function sendmail(email, name, data){
  var sheet = sheetApp.getSheetByName('Email format');
  for (var i = 2; i <= sheet.getLastRow(); i++){
    if (sheet.getRange(i, 1).getValue() == name){
      var subject = sheet.getRange(i, 2).getValue();
      var body = sheet.getRange(i, 3).getValue();
      break;
    }
  }

  body = mailprocess(body, data);
  var body_nohtml = body.replace(/<a\ .*?href="(.*?)".*?>.*?<\/a>/,'$1');
  body = body.replaceall('\n', '<br/>');
  GmailApp.sendEmail(email, subject, body_nohtml, {'htmlBody': body});
  Logger.log(body_nohtml);
}

function itemlist(){
  var sheet = sheetApp.getSheetByName('Items'); // 打開分頁

  var items = []; // 建立一個 items 空陣列
  for (var i = 2; i <= sheet.getLastRow(); i++){
    if (sheet.getRange(i, 5).getValue() == 'Y'){ // 如果 item 設定為啟用
      var item = {}; // 建立一個 item 物件
      item.id = sheet.getRange(i, 1).getValue(); // 設定 item 各項屬性
      item.en_name = sheet.getRange(i, 2).getValue();
      item.ch_name = sheet.getRange(i, 3).getValue();
      item.price = sheet.getRange(i, 4).getValue();
      items.push(item); // 將 item 推進 items
    }
  }

  return items;
}

String.prototype.replaceall = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
