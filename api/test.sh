#! /bin/bash
set -euo pipefail
echo '-w "\n"' >> ~/.curlrc

APP_HOST=127.0.0.1
APP_PORT=1337

MONGO_HOST=127.0.0.1
MONGO_PORT=27017
MONGO_DATABASE=intertempi

# create a few users
curl -s -X POST -H "Content-Type:application/json" http://$APP_HOST:$APP_PORT/users -d '{"username": "fabio", "password": "demo1234"}'
curl -s -X POST -H "Content-Type:application/json" http://$APP_HOST:$APP_PORT/users -d '{"username": "nikita", "password": "demo1234"}'

# login
curl -X POST -H "Content-Type:application/json" http://$APP_HOST:$APP_PORT/login -d '{"username": "fabio", "password": "demo1234"}'
curl -X POST -H "Content-Type:application/json" http://$APP_HOST:$APP_PORT/login -d '{"username": "nikita", "password": "demo1234"}'

# authorized resource access
token=$(curl -s -X POST -H "Content-Type:application/json" http://$APP_HOST:$APP_PORT/login -d '{"username": "fabio", "password": "demo1234"}' | jq -r '.token')
curl -H "Authorization: Bearer $token" http://$APP_HOST:$APP_PORT/users

# logout
curl -X POST -H "Content-Type:application/json" http://$APP_HOST:$APP_PORT/logout -d '{"token": "'$token'"}'

# unauthorized resource access
curl http://$APP_HOST:$APP_PORT/users
curl -H "Authorization: Bearer $token" http://$APP_HOST:$APP_PORT/users
