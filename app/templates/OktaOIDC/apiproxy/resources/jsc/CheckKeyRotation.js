var kid = context.getVariable("jwt.DecodeIdToken.header.kid");

var jwks = context.getVariable("cached.okta.jwks");
var json = JSON.parse(jwks);

var keys = json.keys;
keys.forEach(function(k){
    if (k.kid === kid) {
        context.setVariable("refresh_jwks_cache", false);
        return;
    }
})