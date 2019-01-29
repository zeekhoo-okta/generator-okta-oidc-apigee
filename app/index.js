'use strict';

var Generator = require('yeoman-generator');
var join = require('path').join;
var chalk = require('chalk');
var shell = require('shelljs');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  async askFor() {
    // welcome message
    if (!this.options['skip-welcome-message']) {
      this.log(require('yosay')());
      this.log(chalk.magenta(
        'Sample Generator of OAuth Authorization Code Grant Type Proxies.'
      ));
    }

    var prompts = [{
        type: 'input',
        name: 'a_uname',
        message: 'Your Apigee admin username',
        required: true,
        store   : true,
        default: 'example@example.com'
      }, 
      {
        type: 'password',
        name: 'a_password',
        message: 'Your Apigee admin password',
        required: true,
        store: false
      }, 
      {
        type: 'input',
        name: 'a_orgname',
        message: 'Apigee Organization Name',
        required: true,
        store   : true,
      }, 
      {
        type: 'input',
        name: 'a_envname',
        message: 'Apigee Environment Name',
        required: true,
        store   : true,
      },
      {
        type: 'input',
        name: 'mgmtapiurl',
        message: 'Apigee Management API URL Endpoint',
        required: true,
        store   : true,
        default: 'https://api.enterprise.apigee.com'
      },        
      {
        type: 'input',
        name: 'okta_org',
        message: 'Your Okta "Org"',
        required: true,
        store   : true,
        default: 'dev-######.oktapreview.com'
      }, 
      {
        type: 'input',
        name: 'okta_client_id',
        message: 'The CLIENT_ID of the app you created in Okta',
        required: true,
        store   : true
      }, 
      {
        type: 'input',
        name: 'okta_client_secret',
        message: 'The CLIENT_SECRET of the app you created in Okta',
        required: true,
        store   : true
      },
      {
        type: 'input',
        name: 'auth_server_id',
        message: 'Id of the AuthorizationServer you configured to use in Okta (your Developer account comes with a pre-configured "default" AS)',
        required: true,
        store   : true,
        default: 'default'
      }

    ];

    this.answers = await this.prompt(prompts);

  }

  apiProxySetup() {
    shell.rm('-rf', '../deploy-okta-oidc-apigee');

    this.fs.copy(
      this.templatePath('OktaOIDC/apiproxy'),
      this.destinationPath('../deploy-okta-oidc-apigee/OktaOIDC/apiproxy')
    );

    this.fs.copy(
      this.templatePath('oauth2/apiproxy'),
      this.destinationPath('../deploy-okta-oidc-apigee/oauth2/apiproxy')
    );

    this.fs.copy(
      this.templatePath('webserver-app/apiproxy'),
      this.destinationPath('../deploy-okta-oidc-apigee/webserver-app/apiproxy')
    );    

    this.fs.copy(
      this.templatePath('api/apiproxy'),
      this.destinationPath('../deploy-okta-oidc-apigee/api/apiproxy')
    );    

    this.fs.copy(
      this.templatePath('provisioning'),
      this.destinationPath('../deploy-okta-oidc-apigee/provisioning')
    );

  }

  install() {
    shell.cd('../deploy-okta-oidc-apigee');

    var callback_url = 'https://'+this.answers.a_orgname+'-'+this.answers.a_envname+'.apigee.net/web/callback';

    // provision webserver-app
    shell.sed('-i','CALLBACKURL', callback_url, 'provisioning/webserver-app.xml');
    shell.sed('-i','ENVNAME', this.answers.a_envname, 'provisioning/webserver-product.json');

    shell.cd('provisioning');
    shell.exec('./provision-webserver.sh '+this.answers.a_uname+' \''+this.answers.a_password+'\' '+this.answers.a_orgname+' '+this.answers.a_envname+' '+this.answers.mgmtapiurl);

    //capture clientID and secret from last step and put in webserver-app bundle
    var webserverappkey = shell.exec("curl -H 'Accept: application/json' -u '"+this.answers.a_uname+":"+this.answers.a_password+"' "+this.answers.mgmtapiurl+"/v1/o/"+this.answers.a_orgname+"/developers/webdev@example.com/apps/okta-oidc-apigee-webserver-app 2>/dev/null | grep consumerKey | awk -F '\"' '{ print $4 }'").stdout;
    var webserverappsecret = shell.exec("curl -H 'Accept: application/json' -u '"+this.answers.a_uname+":"+this.answers.a_password+"' "+this.answers.mgmtapiurl+"/v1/o/"+this.answers.a_orgname+"/developers/webdev@example.com/apps/okta-oidc-apigee-webserver-app 2>/dev/null | grep consumerSecret | awk -F '\"' '{ print $4 }'").stdout;
    // remove trailing whitespace
    webserverappkey = webserverappkey.replace(/\n$/, "");
    webserverappsecret = webserverappsecret.replace(/\n$/, "");

    // deploy OktaOIDC proxy
    shell.cd('../OktaOIDC');
    shell.sed('-i','OKTAORGNAME', this.answers.okta_org, 'apiproxy/policies/SetConfigVariables.xml');
    shell.sed('-i','OKTAAUTHSERVERID', this.answers.auth_server_id, 'apiproxy/policies/SetConfigVariables.xml');
    shell.sed('-i','OKTACLIENTID', this.answers.okta_client_id, 'apiproxy/policies/SetConfigVariables.xml');
    shell.sed('-i','OKTACLIENTSECRET', this.answers.okta_client_secret, 'apiproxy/policies/SetConfigVariables.xml');
    shell.exec('apigeetool deployproxy -u '+this.answers.a_uname+' -p \''+this.answers.a_password+'\' -o '+this.answers.a_orgname+' -e '+this.answers.a_envname+ ' -n OktaOIDC -d .');

    // deploy oauth2 proxy
    shell.cd('../oauth2');
    shell.sed('-i','OKTAORGNAME', this.answers.okta_org, 'apiproxy/policies/SetConfigVariables.xml');
    shell.sed('-i','OKTAAUTHSERVERID', this.answers.auth_server_id, 'apiproxy/policies/SetConfigVariables.xml');
    shell.sed('-i','OKTACLIENTID', this.answers.okta_client_id, 'apiproxy/policies/SetConfigVariables.xml');
    shell.exec('apigeetool deployproxy -u '+this.answers.a_uname+' -p \''+this.answers.a_password+'\' -o '+this.answers.a_orgname+' -e '+this.answers.a_envname+ ' -n oauth2 -d .');

    // configure webserver-app HTML INDEX
    shell.cd('../webserver-app');
    shell.sed('-i','OKTAORGNAME', this.answers.okta_org, 'apiproxy/policies/HTMLIndex.xml');
    shell.sed('-i','WEBSERVERAPPKEY', webserverappkey, 'apiproxy/policies/HTMLIndex.xml');
    shell.sed('-i','ENVNAME', this.answers.a_envname, 'apiproxy/policies/HTMLIndex.xml');
    shell.sed('-i','ORGNAME', this.answers.a_orgname, 'apiproxy/policies/HTMLIndex.xml');
    // deploy webserver-app proxy
    shell.sed('-i','WEBSERVERAPPKEY', webserverappkey, 'apiproxy/policies/SetConfigurationVariables.xml');
    shell.sed('-i','WEBSERVERAPPSECRET', webserverappsecret, 'apiproxy/policies/SetConfigurationVariables.xml');    
    shell.exec('apigeetool deployproxy -u '+this.answers.a_uname+' -p \''+this.answers.a_password+'\' -o '+this.answers.a_orgname+' -e '+this.answers.a_envname+ ' -n webserver-app -d .');

    // deploy "api" proxy
    shell.cd('../api');
    shell.exec('apigeetool deployproxy -u '+this.answers.a_uname+' -p \''+this.answers.a_password+'\' -o '+this.answers.a_orgname+' -e '+this.answers.a_envname+ ' -n api -d .');
  }

};