# Setting up the system

The Backend needs to be running, the Frontend is optional.

## IMPORTANT

This is beta version, backup your files first!

Issues if a player has plans on more than one server:
* Migration of player memories is not yet done, the player will only see the plans from one of the servers.
* Plan id generation was not unique earlier, so plans created on different servers may be using same plan ids. There can only be one plan per id, so the other plans will be DISCARDED.

The plan id generation is now better as of v2.7 of the mod: The current UTC timestamp with 1 second resolution is used in the plan id, making it impossible for player to generate two plans with same id.

The first time synchronization between the game servers (Clients) and the Backend may take a long time depending on how many plans you have. With default settings it is approximately 10 seconds for each plan.


## Database

The Backend requires a database for storage, supported database engines are: PostgreSQL (tested), MySQL/MariaDB, and SQLite. The database connection currently needs to be adjusted in the `backend/utils/db.js` file directly. The default setup uses PostgreSQL with unix socket, meaning the current user is authenticated without password. For information about how to use different database engines, see https://sequelize.org/master/manual/dialects.html


## Network setup

Due to the lack of security with plain HTTP access between the Backend and the Clients, it is highly recommended to keep the Backend behind a firewall and not allow access to it from the internet. The Clients and the Frontend should therefore be placed in a DMZ from where they have access to the Backend.

It is not necessary to provide access to the Frontend from the internet, the Users do not need to use the Frontend for "normal" operations.

<img src="network_layout.svg" alt="Overview of the network layout" width="800" />

However, most users are probably not able to keep the Backend behind a firewall and have the Clients communicate internally, but instead run the Backend in the internet. In this scenario, it is highly recommended that the access to the Backends port is restricted to only to the Clients and the Frontend.


## Configuration

Configuration is done through environment variables.

The environment variables can also be set using a file: Create a file named ".env" into the backend root directory, and adjust the Backend configuration in this file. The format is:
```
VARIABLE1=Value1
VARIABLE2=Value2
...
```

<table>
  <tr><th>Variable</th> <th>Type</th>   <th>Default value</th><th>Description</th></tr>
  <tr><td>PORT</td>     <td>Integer</td><td>3001</td>         <td>The IP port the Backend listens to.</td></tr>
  <tr><td>PROTOCOL</td> <td>String</td> <td>"http"</td>       <td>Either "http" or "https". Note that HTTPS require valid certificate, self-signed will not work.</td></tr>
  <tr><td>CERT</td>     <td>String</td> <td>"cert.pem"</td>   <td>The filename of the certificate used for HTTPS.</td></tr>
  <tr><td>CERT_KEY</td> <td>String</td> <td>"key.pem"</td>    <td>The filename of the certificate key used for HTTPS.</td></tr>
  <tr><td>JWTSECRET</td><td>String</td> <td>"abc"</td>        <td>The secret used for creating JWTs, change to something random.</td></tr>
  <tr><td>AUTOCREATE_STEAM_USERS</td><td>Boolean</td><td>false</td><td>If set to true, everyone with a valid Steam account can login. A new user account is created automatically for new users.</td></tr>
  <tr><td>DATABASE_HOST</td><td>String</td><td>"/tmp"</td><td>The hostname of the database server. The default "/tmp" means to use unix socket connection.</td></tr>
  <tr><td>DATABASE_PORT</td><td>Integer</td><td></td><td>The TCP port of the database server.</td></tr>
  <tr><td>DATABASE_USERNAME</td><td>String</td><td></td><td>The username for the database connection.</td></tr>
  <tr><td>DATABASE_PASSWORD</td><td>String</td><td></td><td>The password for the database connection.</td></tr>
</table>

Example ".env" file:
```
PORT=9500
PROTOCOL=https
CERT=/etc/mycert.pem
CERT_KEY=/etc/mycertkey.pem
```

If the defaults are fine, you don't need to define the environment variables or the ".env" file.


## Installing dependencies

Both the Backend and the Frontend use npm, thus instaling the dependencies is done by issuing:
```
$ npm install
```
In the respective directory (backend and frontend).


## Initializing the database

See the "backend/bin/initialize_db.sh" script for example how to initialize the database.
The bin -directory in the backend contains also couple other useful tools for managing the database.


## Starting the Backend

Use the following npm command to start the Backend normally:
```
$ npm start
```

## Starting the Frontend

Configure the proper host and port for the backend in the package.json by setting the proxy, then start the frontend with npm:
```
$ npm start
```


## Client (Ark game server) configuration

Point all Clients (Ark game servers) to the Backend by setting the following GameUserSettings.ini -options:
```
[StructureSaver]
Backend="http://localhost:3001"
BackendClientId="id"
BackendClientPassword="password"
```
