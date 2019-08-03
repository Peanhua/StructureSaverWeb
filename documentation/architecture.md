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

The Clients provide only basic HTTP support: they can do GET and POST requests, and HTTPS is not available. The request and response headers can not be read or written in the Clients. Thus the Clients and the Backend communicate with HTTP and things like cookies are managed manually.

Each Client sends first a "login" request, and then synchronizes its data with the backend.


### Communication interfaces: Users

The Users communicate with the Frontend.

The Users use HTTPS and standard web application practices.


### Communication interfaces: Frontend

Even though the Frontend has capabilities to communicate "properly" using HTTPS and other things, the Frontend communicates with the Backend similarly to the Clients to avoid duplicating interface code. The Frontend is allocated one Client id.


## Preferred setup

Due to the lack of security with plain HTTP access between the Backend and the Clients, it is highly recommended to keep the Backend behind a firewall and not allow access to it from the internet. The Clients and the Frontend should therefore be placed in a DMZ from where they have access to the Backend.

It is not necessary to provide access to the Frontend from the internet, the Users do not need to use the Frontend for "normal" operations. The Frontend does not need to be running.

<img src="network_layout.svg" alt="Overview of the network layout" width="800" />
