#!/bin/bash
#usage: provision-webserver.sh $username $password $org $env $url
username=$1
password=$2
org=$3
env=$4
url=$5

echo Install webserver-product

curl -u $username:$password $url/v1/o/$org/apiproducts \
  -H "Content-Type: application/json" -X POST -T webserver-product.json

echo Create developer webdev@example.com

curl -u $username:$password $url/v1/o/$org/developers \
  -H "Content-Type: application/xml" -X POST -T webserver-developer.xml

echo Create webserver-app

curl -u $username:$password \
  $url/v1/o/$org/developers/webdev@example.com/apps \
  -H "Content-Type: application/xml" -X POST -T webserver-app.xml


# Get consumer key and attach API product
# Do this in a quick and clean way that doesn't require python or anything

echo Get app info

ckey=`curl -u $username:$password -H "Accept: application/json" \
     $url/v1/o/$org/developers/webdev@example.com/apps/okta-oidc-apigee-webserver-app 2>/dev/null \
     | grep consumerKey | awk -F '\"' '{ print $4 }'`

echo Attach product to App

curl -u $username:$password \
  $url/v1/o/$org/developers/webdev@example.com/apps/okta-oidc-apigee-webserver-app/keys/${ckey} \
  -H "Content-Type: application/xml" -X POST -T webserver-product.xml
