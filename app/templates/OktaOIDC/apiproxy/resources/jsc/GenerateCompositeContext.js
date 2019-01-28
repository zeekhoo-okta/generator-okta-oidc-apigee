 var accessTokenPayload = context.getVariable('jwt.VerifyAccessToken.payload-json');
var json = JSON.parse(accessTokenPayload);

var pix_ctx = context.getVariable('oauthv2accesstoken.GetCachedAccesToken.accesstoken.context_default');
if (pix_ctx) {
    pix_ctx = JSON.parse(pix_ctx);
}
else {
    pix_ctx = {
        subject: json.sub,
        personal: json
    } 
}

var idp = context.getVariable("cached.composite_auth_state.idp");
if (idp) {
    pix_ctx[idp] = json
}

context.setVariable("composite_token.context.default", JSON.stringify(pix_ctx));
