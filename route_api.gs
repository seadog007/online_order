function route_api(e) {
  switch (e.parameter.entry){
    case 'items':
      return api_items(e);
      break;
    default:
      return ContentService.createTextOutput(JSON.stringify({}));
  }
}

