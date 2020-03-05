#!/bin/sh
# wait-for-postgres.sh

set -e

cmd="${@}"

until PGPASSWORD=${DATABASE_PASSWORD} psql -h "${DATABASE_HOST}" -U "${DATABASE_USERNAME}" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command ${cmd}"
exec $cmd

