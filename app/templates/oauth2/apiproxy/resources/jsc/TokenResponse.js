var context_default = context.getVariable("accesstoken.context_default");
var pix_token = {
    "default": JSON.parse(context_default)
}
var context_idp_1 = context.getVariable("accesstoken.context_idp_1");
if (context_idp_1) {
    pix_token["idp1"] = JSON.parse(context_idp_1);
}
var context_idp_2 = context.getVariable("accesstoken.context_idp_2");
if (context_idp_2) {
    pix_token["idp2"] = JSON.parse(context_idp_2);
}

context.setVariable("token.composite", JSON.stringify(pix_token));
