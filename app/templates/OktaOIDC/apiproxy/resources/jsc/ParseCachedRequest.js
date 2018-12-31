var request = context.getVariable("cached.request");
var json = JSON.parse(request);
 
context.setVariable("cached.okta_auth_nonce", json.okta_auth_nonce);
context.setVariable("cached.redirect_uri", json.redirect_uri);
context.setVariable("cached.client_id", json.client_id);
context.setVariable("cached.scope", json.scope);
context.setVariable("cached.response_type", json.response_type);
context.setVariable("cached.state", json.state);
context.setVariable("cached.auth_code", json.auth_code);