#!/bin/sh

dropdb structuresaver
createdb structuresaver || exit 1

npm start &
NPMPID=${!}

sleep 5s

../bin/post.js test_requests/clientCreate.json

sleep 1s

kill -INT ${NPMPID}
