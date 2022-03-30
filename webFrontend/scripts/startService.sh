#!/bin/bash
# Meteor requires to use node version v14.18.3
export ROOT_URL=https://photo.cubestudio.co
export MONGO_URL=mongodb://127.0.0.1/photowf
export PORT=3666
cd /var/www/photowp
node main.js
