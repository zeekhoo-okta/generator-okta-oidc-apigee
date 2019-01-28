var request = context.getVariable("cached.auth_state");
var json = JSON.parse(request);
 
context.setVariable("cached.composite_auth_state.access_token", json.access_token);
context.setVariable("cached.composite_auth_state.idp", json.idp);
