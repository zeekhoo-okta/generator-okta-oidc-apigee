var accessTokenPayload = context.getVariable('jwt.VerifyAccessToken.payload-json');

var ctx_default = context.getVariable('oauthv2accesstoken.GetCachedAccesToken.accesstoken.context_default');

context.setVariable("composite_token.context.idp1", context.getVariable('oauthv2accesstoken.GetCachedAccesToken.accesstoken.context_idp_1'));
context.setVariable("composite_token.context.idp2", context.getVariable('oauthv2accesstoken.GetCachedAccesToken.accesstoken.context_idp_2'));

var idp = context.getVariable("cached.composite_auth_state.idp");
if (idp) {
    context.setVariable("composite_token.context.default", ctx_default);

    var idpvar = '';
    switch(idp) {
        case '0oah1vlx17SoCvq7X0h7':
            idpvar = "composite_token.context.idp1";
            break;
        case '0oa9anwb8pR1Kzso00h7':
            idpvar = "composite_token.context.idp2";
            break;
    }
    if (idpvar !== '') {
        context.setVariable(idpvar, accessTokenPayload);
    }

} else {
    context.setVariable("composite_token.context.default", accessTokenPayload);
}

