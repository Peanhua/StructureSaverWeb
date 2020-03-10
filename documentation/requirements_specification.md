# Requirements Specification

Title of the software: StructureSaverWeb

## Purpose

The StructureSaver mod allows players to save buildings (made of structure pieces) as plans, and then use those plans to create copies of the original buildings. This repository contains a backend for the mod to manage sharing the plans across multiple ARK:Survival Evolved game servers. Also present in this repository is a web-based frontend to manage the plans, some additional features not present in the mod, and related settings.


## Users

There are two types of users: administrators who can control everything the backend contains, and normal users who can only control their own plans. ~~A user belongs to 1..N groups.~~


## Product Functions

This is a work in progress, the following are plans and subject to change:

* Users can login using their Steam credentials.
* Users can list plans.
* Users can view plans.
* Users can delete plans.
* ~~Users can rename plans.~~
* ~~Users can (temporarily) hide plans so they don't show up in the game.~~
* Users can export plans to files.
* ~~Users can import plans from files.~~
* ~~Users can import plans from another instance of StructureSaverWeb backend.~~
* Administrators can login using their Steam credentials and/or separate account.
* ~~Administrators can add groups.~~
* ~~Administrators can delete groups.~~
* ~~Administrators can rename groups.~~
* ~~Administrators can adjust the users of the groups.~~
* Administrators can do all the same actions as normal users as any user.
* ~~Administrators can see a list of users and some statistics about their activity:~~
  * ~~Number of plans~~
  * ~~Size of the plans~~
  * ~~Restoring (cloning) counts and history.~~
* ~~Administrators can copy plans from one user to another.~~
* ~~Administrators can undo plan deletions (if the plan has not yet been permanently deleted).~~
* ~~Administrators can permanently delete unused plans.~~
* ~~Administrators can setup automatic permanent deletion of plans with a configurable time to live -setting.~~
* ~~Administrators can enable/disable normal users plan importing.~~
* ~~Administrators can set a limit on the number of plans each user can have stored:~~
  * ~~Global limit~~
  * ~~Optional per group limits (overrides global limit)~~
  * ~~Optional per user limits (overrides global and group limits)~~
* ~~Administrators can set a limit on the size (in number of structure pieces) of plans:~~
  * ~~Global limit~~
  * ~~Optional per group limits (overrides global limit)~~
  * ~~Optional per user limits (overrides global and group limits)~~
* ~~Administrators can set a limit on the number of restorations users can perform within specific timespan.~~
  * ~~Global limit~~
  * ~~Optional per group limits (overrides global limit)~~
  * ~~Optional per user limits (overrides global and group limits)~~
* ~~Administrators can limit users who can access the backend:~~
  * ~~By whitelisting Steam id's~~
  * ~~By blacklisting Steam id's~~
* Administrators can limit Ark:Survival Evolved servers who can access the backend:
  * ~~By IP addresses~~
  * By secret key mechanism
* Three docker images are provided:
  * Frontend only
  * Backend only
  * Both frontend and backend as a docker-compose configuration.
* The backend uses a database to store plans, configuration, etc.
* ~~The backend writes to a log file that can be utilized with [Fail2Ban](http://fail2ban.sourceforge.net/).~~
