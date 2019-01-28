context.setVariable("okta_auth.response_type", "code");
context.setVariable("okta_auth.scope", "openid email profile");

var redirect_uri = "https://" +
    context.getVariable("organization.name") + "-" +
    context.getVariable("environment.name") + "." +
    "apigee.net/okta-oidc/callback";
context.setVariable("okta_auth.redirect_uri", redirect_uri);


function getRandom(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

var state = getRandom(12);
context.setVariable("okta_auth.state", state);

var nonce = getRandom(32);
context.setVariable("okta_auth.nonce", nonce);

var request = {
    client_id: context.getVariable("request.queryparam.client_id"),
    redirect_uri: context.getVariable("request.queryparam.redirect_uri"),
    response_type: context.getVariable("request.queryparam.response_type"),
    okta_auth_state: state,
    okta_auth_nonce: nonce,
    scope: context.getVariable("request.queryparam.scope"),
    state: context.getVariable("request.queryparam.state")
};
context.setVariable("okta_auth.request", JSON.stringify(request));

context.setVariable("okta_auth.idp", context.getVariable("request.queryparam.idp"));


