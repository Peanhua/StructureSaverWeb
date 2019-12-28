#!/bin/sh

dropdb structuresaver
createdb structuresaver || exit 1

./bin/createUser.js root Administrator aaa true
./bin/createClient.js kissa koira
