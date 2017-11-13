function route_default(e){
  var page = HtmlService.createTemplateFromFile('index.html');
  page.serviceUrl = serviceUrl;
  page.itemlist = JSON.stringify(itemlist());
  page.itemprefix = itemprefix;
  page.itemrows = itemrows(); // 產生項目清單
  return page.evaluate().addMetaTag('viewport', 'width=device-width, initial-scale=1, shrink-to-fit=no').setTitle(common_title);
}

function itemrows(){
  var items = itemlist();

  rowshtml = '';
  for (var i = 0; i < items.length; i++){
    if ((i + 1) < items.length){
      var page = HtmlService.createTemplateFromFile('index_2itemrow.html');

      item_1 = items[i];
      page.item_1_id = item_1.id;
      page.item_1_name = item_1.en_name + '<br/>' + item_1.ch_name + ' NT$ ' + item_1.price;

      item_2 = items[i+1];
      page.item_2_id = item_2.id;
      page.item_2_name = item_2.en_name + '<br/>' + item_2.ch_name + ' NT$ ' + item_2.price;

      i++;
    }else{
      var page = HtmlService.createTemplateFromFile('index_1itemrow.html');

      item_1 = items[i];
      page.item_1_id = item_1.id;
      page.item_1_name = item_1.en_name + '<br/>' + item_1.ch_name + ' NT$ ' + item_1.price;

    }
    page.itemprefix = itemprefix;
    rowshtml += page.evaluate().getContent();
  }
  return rowshtml;
}
