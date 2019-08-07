# Architecture

The system consists of Clients, Users, Backend, and Frontend:
* Backend manages data and provides services to Clients and to the Frontend.
* Frontend provides HTML based user interface for Users.
* Clients are Ark: Survival evolved game server(s) and game client(s).
* Users are entities (usually humans) using the Frontend (usually with a web-browser).

In addition to the above, there are also Players who for the most part are the same as the Users. The Players connect to the Clients (game servers) using game clients.


## Communication interfaces

### Communication interfaces: Clients

The Clients communicate with the Backend.

The Clients provide only basic HTTP support: they can do GET and POST requests, and HTTPS can not be used with self-signed certificates. The request and response headers can not be read or written in the Clients. Thus the Clients and the Backend communicate with HTTP in majority of the installations, and things like cookies are managed manually.

Each Client sends first a "login" request, and then synchronizes its data with the backend. All the communication is initiated by the Clients. When Clients wants to send something to the Backend, the Client just sends it with a specific request. But when the Backend wants to send something to the Client, the Backend waits for the Client to send a update request, and then the Backend responds to the update request with the data it wants to send to the Client.


### Communication interfaces: Users

The Users communicate with the Frontend.

The Users use HTTPS and standard web application practices.


### Communication interfaces: Frontend

The Frontend communicates with the Backend similarly to the Clients to avoid duplicating interface code. Methods that are only used by the Frontend, are not using the manual cookie method for authentication. The Frontend is allocated one Client id.
