function route_confirm(e){
  var sheet = sheetApp.getSheetByName('Unconfirmed'); // 打開分頁
  var page = HtmlService.createTemplateFromFile('msg.html');
    var row = findhash(e.parameter.key);
    if (row <= 0){ // 檢查Key存不存在
      page.msg = 'die here, wrong key';
    }else {
      var data = sheet.getRange(row, 3).getValue(); // 取出資料
      data = JSON.parse(data);

      if (sheet.getRange(row, 4).getValue() == 'Y'){ // 已經確認過
        page.msg = 'die here, already confirmed';
      }else if (!sameday(new Date(data.createat), new Date())){ // 確認連結過期
        page.msg = 'die here, key expire';
      }else{ // 確認成功
        sheet.getRange(row, 4).setValue('Y')

        var sheet = sheetApp.getSheetByName('Order');
        var order_id = sheet.getLastRow();
        sheet.appendRow([order_id,
                   new Date(data.createat),
                   genlist(data.items),
                   data.total,
                   data.spr
                  ]);

        body_data = {
          'order_number': order_id,
          'total': data.total,
          'list': genlist(data.items)
        };
        sendmail(data.email, 'Confirmed', body_data)
        page.msg = 'Order Confirmed!<br/>We will send the order number to your email.';
      }
    }
    return page.evaluate().addMetaTag('viewport', 'width=device-width, initial-scale=1, shrink-to-fit=no').setTitle(common_title);
}

