### Overview
StrongLoop LoopBack, a Node.js based framework, supports the ability
to define classes or types (known as a models) and easily expose them
via a RESTful API and persist them via LoopBack's ORM feature.  LoopBack also 
provides the ability to define access controls on models
via roles and ACLs.  LoopBack's access control feature works at the model level.
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

The URL-based access control feature defines the following concepts.

######Access Levels
Two levels of URL access are defined as follows:

1. View level - Enables a particular user to perform read operations on a model
instance identified by its URL.
2. Admin level - Enables a particular user to to perform read, write and execute operations
on a model instance based on its URL.

######Access Policy
Access policies are the rules that specify which users are allowed to
perform which operations on a particular model instance and related instances rooted
at a unique URL.

######Axioms
* For a particular model instance, a user is either unauthorized, an admin or a viewer.
* A model instance may have more than one admin or viewer.
* Access control is applied to a particular model instance and related instances identified by URL and related sub URLs if no other access control policy is in effect.

###### Scenario
Let's consider the following scenario:
* A model is created that consists of a Project identified as /Project/1 that is related to a Team identified by /Project/1/Team/1 and an Activity identified as /Project/1/Activity/1
* User Peter has admin access to /Project/1, user Paul has view access to /Project/1, and user Mary has view access to /Project/1 and admin access to /Project/1/Activity/1
 
The consequence of this scenario follows:

* Peter is allowed to invoke read, write and execute operations against all model instances rooted at /Project/1.  
* Paul is allowed to invoke read operations against all model instances rooted at /Project/1. 
* Mary is allowed to invoke read operations against all model instances rooted at /Project/1 and read, write and execute operations against all model instances rooted at /Project/1/Folder/1.

### Core Component
######AccessRule
AccessRule is a LoopBack model located in ./common/models/access-rule.js*. AccessRule instances hold the data needed for access control.  Its fields include:
* baseUrl - The URL being controlled
* accessType - Currently either admin or view as described above
* userId - The user authorized to access the baseURL with the privileges specified by roleType
 
AccessRule implements a LoopBack role resolver function that determines if a given user is authorized to access a given URL.  

### Implementation Examples
Access rules may be added manually via a very simple web page located at ./index.html or programatically. 

######Project
The Project model illustrates one programmatic way of adding a access rules. Project implements an afterRemote('create') function that creates an AccessRule to make an admin of the logged-in user for the project identified as /Project/1.

######index.html
index.html is a very simple web page for creating access rules.  The page includes views for listing currently created rules and creating new ones.

### Notes/Disclaimers
* There may be some execute operations that are read-only so preventing viewers from all execute operations may be too restrictive.

* An enterprise level solution for URL level access control
would be to use a specialize product such as OpenAM.

* I've only been working with LoopBack a short while. There may
be better ways of meeting my requirements.

* Please excuse any sloppiness in my description of any terms 
or concepts. 

* The implementation uses file-based persistence, which has limited query ability.  For example, in the the query to determine if a user has access control to a particuar URL, I would have used the SQL substring function, but since that query function is not available, I needed to iterate query results in the code.

