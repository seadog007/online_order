function route_create_order(e){
  var sheet = sheetApp.getSheetByName('Unconfirmed'); // 打開分頁

  if (!(e.parameter.pickup_date && e.parameter.name && e.parameter.email)){return 'Missing Field';}
  Logger.log(e.parameter.pickup_date);
  Logger.log(tomorrow_str);
  if (e.parameter.pickup_date != tomorrow_str){return 'Pickup_date is not tmr';}

  var data = {}; // 建立一個空物件
  var createat = new Date(); // 訂單成立時間
  var total = 0;
  data['createat'] = createat;
  data['items'] = {};
  for (var i in e.parameter){
    if (i.toString().indexOf(itemprefix) == 0){ // 是一項物品
      if (e.parameter[i] > 0){ // 物品數量 > 0
        if (e.parameter[i] > 20){return 'goaway';}
        data['items'][i.replaceall(itemprefix, '')] = e.parameter[i];
        total += e.parameter[i] * getprice(i.replaceall(itemprefix, '')); // Total += 物品數量 + 取得價格(物品ID)
      }
    }else{
      data[i] = e.parameter[i];
    }
  }
  if (total <= 0){return 'Buy something please';}
  data['total'] = total;


  var hash = signSHA_256(JSON.stringify(data));
  data['hash'] = hash;
  sheet.appendRow([createat,
                   hash,
                   JSON.stringify(data),
                   'N',
                   Session.getActiveUser().getEmail()
                  ]);

  body_data = {
    'total': data.total,
    'link': serviceUrl + '?action=confirm&key=' + data.hash,
    'list': genlist(data.items)
  };
  sendmail(data.email, 'Confirmation', body_data);
  return 'done';
}

function processForm(formObject) {
  e = {};
  e.parameter = formObject;
  return doPost(e);
}

