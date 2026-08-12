#!/bin/sh
set -e

node /app/server/main.js &
nginx -g 'daemon off;'
