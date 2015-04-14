### Overview
StrongLoop LoopBack, a Node.js based framework, supports the ability
to define classes or types (known as a models) and easily expose them
via a RESTful API and persist them via LoopBack's ORM feature.  LoopBack also 
provides the ability to define access controls on models
via roles and ACLs.  LoopBack access control feature works at the model level.
That is, for a particular model, LoopBack supports the ability
to specify the users or roles having access to the model
and his or her access privileges.   

While model level access control is useful, my requirement
is to be able to to specify access control at the URL or path level.  That is,
for a particular (RESTful) URL, I wanted to be able to specify the users
having access to that URL and sub URLs and his or her privileges.  I tried to find
a solution using existing LoopBack mechanisms such as roles, role mappings and ACLs,
but I was unable to, so I rolled my own.
This repository serves as a sample implementation for URL-based
access control using LoopBack.  

### Concept
[As described in the LoopBack controlling data access documentation](http://docs.strongloop.com/display/public/LB/Controlling+data+access),
LoopBack categorizes operations against models according to 
access type as follows: read, write, execute. 

The implementation defines the following concepts.

######Access Levels
Two levels of URL access are defined as follows:

1. Read level - Enables a particular user to perform read and execute operations on a model
instance identified by its URL.
2. Admin level - Enables a particular user to to perform read, write and execute operations
on a model instance based on its URL.

######Access Policy
Access policies are the rules that specify which users are allowed to
perform which operations on a particular model instance and related instances rooted
at a unique URL.

######Axioms
* For a particular model instance, a user is either unauthorized, an admin or a reader.
* A model instance may have more than one admin or reader.
* Access control is applied to a particular model instance and related instances identified by URL and related sub URLs if no other access control policy is in effect.

###### Scenario
Let's consider the following scenario:
* A model is created that consists of a Project identified as /Project/1 that is related to a Team identified by /Project/1/Team/1 and an Activity identified as /Project/1/Activity/1
* User Peter has admin access to /Project/1, user Paul has reader access to /Project/1, and user Mary has reader access to /Project/1 and admin access to /Project/1/Activity/1
 
The consequence of this scenario follows:

* Peter is allowed to invoke read, write and execute operations against all model instances rooted at /Project/1.  
* Paul is allowed to invoke read and execute operations against all model instances rooted at /Project/1. 
* Mary is allowed to invoke read and execute operations against all model instances rooted at /Project/1 and read, write and execute operations against all model instances rooted at /Project/1/Folder/1.

### Core Component
Access Rule

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

