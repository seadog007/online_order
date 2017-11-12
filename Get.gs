function doGet(e){
  switch (e.parameter.action){
    case 'confirm':
      return route_confirm(e);
      break;
    case 'api':
      return route_api(e);
      break;
    case 'confirmation':
      return route_confirmation(e);
      break;
    default:
      return route_default(e);
  }
}
