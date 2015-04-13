### Overview
StrongLoop LoopBack, a Node.js based framework, supports the ability
to define types (known as a models a la MVC) and easily expose them
via a RESTful API and persist them via LoopBack's ORM feature.  

LoopBack also provides the ability to define access controls on models
via Roles and ACLs.  The access control feature works at the model level.
That is, for a particular model or type, LoopBack supports the ability
to specify which users or roles have access and the type of access
to that particular model or type.   

While model level access control is useful, my requirement
is to be able to to specify access control at the URL or path level.  That is,
for a particular (RESTful) URL, I wanted to be able to specify which users
have access to that URL and sub URLs and what type of access.

This repository serves as a sample implementation for URL-based
access control using LoopBack.  

### Concept Elaborated
[As described in the LoopBack controlling data access documentation](http://docs.strongloop.com/display/public/LB/Controlling+data+access),
LoopBack categorizes operations against models according to 
access type as follows: read, write, execute. The objective is for URL or path level access control.  To meet
this objective, the following concepts are conceived.

######Access Levels
Two levels of access are conceived as follows:
1. Read level - Enables a particular user to perform read and execute operations on a model
instance identified by its URL.
2. Admin level - Enables a particular user to to perform read, write and execute operations
on a model instance based on its URL.

######Access Policy
An access policy are the rules that specify which users are allowed to
perform which operations on a particular model instance and related instances rooted
at a unique URL.

######Supplementary Requirements
* A model instance should be able to have more than one admin
* Access control should be applied to a particular URL and sub URLs
if no other access control policy is in effect.

### Core Component
Access Manager

### Implementation Examples 
Project

Team

### Notes/Disclaimers
* A better solution would be to make the EXECUTE access type
more granular so that EXECUTE read operations could be
distinguished from EXECUTE write operations.

* An enterprise level solution for URL level access control
would be to use a specialize product such as OpenAM.

* I've only been working with LoopBack a short while. There may
be better ways of meeting my requirements.

* Please excuse any sloppiness in my description of any terms 
or concepts. 

