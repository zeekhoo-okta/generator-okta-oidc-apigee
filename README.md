This is a heavily modified version of Apigee's [oauth andvanced sample](https://github.com/apigee/api-platform-samples/tree/master/sample-proxies/oauth-advanced) by "replacing" the sample Node.js login-app contained in the sample with Okta. Apigee is still the OAuth2 Authorization Server, but at a high level, it has also become an "OpenID Connect Client," which authenticates to Okta, the "IdP."" By delegating Authentication to Okta, you gain all the benefits of an enterprise-solution grade, secure and fully featured Identity Mangement System. Just some of the things you can do with Okta include:
* Add Social Auth capabilities to your application
* Seamlessly connect to an 3rd party SAML and OpenID Connect IdPs
* Provide MFA
* Logging of all events
...All without writing a single line of code.

Below is a diagram describing the modified flow:
![alt text](images/Apigee-AS-Okta-IdP.png)


## <a name="prerequisites">Prerequisites
### Tools
To run this sample, you'll need:
* node.js and npm [installed](https://nodejs.org/)

* Yeoman [installed](http://yeoman.io/)

### Apigee Account
* The username and password that you use to login to `enterprise.apigee.com`.

* The name of the organization in which you have an account. Login to
  `enterprise.apigee.com` and check account settings.

### Okta Account
* Sign up for a free Developer Account [developer.okta.com](https://developer.okta.com/signup)

* Once you have access to the Developer Console, from there create an OpenID Connect client:
    - Applications > Add Application > Web
    - Provide a name for your app
    - Leave Base URI as-is
    - IMPORTANT: Enter the "Login redirect URI" with the value `https://{myorg}-{myenv}.apigee.net/okta-oidc/callback`. For example, If myorg == `"okta_oidc"`, and I am deploying to the `"test"` environment, then the redirect URI is `https://okta_oidc-test.apigee.net/okta-oidc/callback`
    - Click through to complete the App setup
    - Once complete, you can find the `client_id` and `client_secret` in the "General" tab. You will need these values when you run the Yeoman tool

* Please note that the sample does not run properly in Windows 10.  Please run in macOS or Linux for full compatibility.

## <a name="deploy">Deploying
1. Create a directory and 'cd' into it
e.g.
```
> mkdir example-project
> cd example-project
```

2. Clone this repository into the directory you just created
```
> git clone git@github.com:zeekhoo-okta/generator-okta-oidc-apigee.git
```

3. 'cd' into the "generator" directory:
```
> cd generator-okta-oidc-apigee
```

4. Install dependencies
```
> npm install
```

5. In order to run the Yeoman tool, you'll need to symlink this local module to a global one using this command:
```
> npm link
```
This will install your project dependencies and symlink a global module to your local file. After npm is done, you will be able to call `yo generator-name`

2. Call Yeoman:
    `yo okta-oidc-apigee`

3. Follow the prompts:

```
Sample Generator of OAuth Authorization Code Grant Type Proxies.
? Your Apigee admin username:
? Your Apigee admin password:
? Apigee Organization Name:
? Apigee Environment Name
? Management API URL Endpoint: https://api.enterprise.apigee.com
? Your Okta "Org": dev-######.oktapreview.com
? The CLIENT_ID of the app you created in Okta:
? The CLIENT_SECRET of the app you created in Okta:
? Id of the AuthorizationServer you configured to use in Okta (your Developer account comes with a pre-configured "default" AS):
```

## <a name="testit">Test the sample

1. Open a browser and go to this URL:

    `http://myorg-myenv.apigee.net/web`

    For example:

    `http://okta_oidc-test.apigee.net/web`

2. Initiate the flow.  Just click the "Apigee+Okta Example Auth" button. This action sends a request to the authorization server (Apigee Edge), which redirects the browser to Okta for login.
