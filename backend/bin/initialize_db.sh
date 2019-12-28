#!/bin/sh

if [ ! -f ./.env ]; then
    echo "${0}: Missing required file \".env\"."
    exit 1
fi
source ./.env

if [ -z "${DATABASE_NAME}" ]; then
    echo "${0}: Missing mandatory environment variable DATABASE_NAME."
    exit 1
fi

dropdb ${DATABASE_NAME}
createdb ${DATABASE_NAME} || exit 1

./bin/createUser.js root Administrator aaa true
./bin/createClient.js kissa koira
