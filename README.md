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
instance identified by its URL and any related instances identified as a sub URL.
2. Admin level - Enables a particular user to to perform read, write and execute operations
on a model instance based on its URL and any related instances identified as a sub URL.

######Access Policy
Access policies are the rules that specify which users are allowed to
perform which operations on a particular model instance and related instances rooted
at a unique URL.


#### Scenario
Let's consider the following scenario:
* A model is created that consists of a Project identified as /Project/1 that is related to a Activity identified as /Project/1/activity/1
* User Peter has admin access to /Project/1, user Paul has view access to /Project/1, and user Mary has view access to /Project/1 and admin access to /Project/1/activity/1
 
As a result...

* Peter is allowed to invoke read, write and execute operations against all model instances rooted at /Project/1.  
* Paul is allowed to invoke read operations against all model instances rooted at /Project/1. 
* Mary is allowed to invoke read operations against all model instances rooted at /Project/1 and read, write and execute operations against all model instances rooted at /Project/1/Activity/1.

### Core Components

######AccessRule
AccessRule is a LoopBack model located in ./common/models/access-rule.js[on]. AccessRule instances hold the data needed for access control.  Its fields include:
* baseUrl - The URL being controlled
* accessType - Currently either admin or view as described above
* userId - The user authorized to access the baseURL with the privileges specified by roleType
 
AccessRule implements a LoopBack role resolver function that determines if a given user is authorized to access a given URL.  

######Project
The Project model illustrates a programmatic way of adding a access rules. Project implements an afterRemote('create') function that creates an AccessRule to make an admin of the logged-in user for the project being created. The afterRemote('create') function also add the currently logged-in user as a team member of the project.

Note that to control a model (e.g., Project), the model must include the following ACL permission. "accessManager" is the name of the role resolver registered function.
```
    {
      "principalType": "ROLE",
      "principalId": "accessManager",
      "permission": "ALLOW"
    }

```

### Running the repository content
Looback's explorer and a custom index.html page are used to run the repository content and view results. To run the content, do the following:

1. Clone the repository.
2. Install the depenant packages using, for example, npm install.
2. Run "DEBUG=aclmod*" slc run" to start the server.
3. Navigate to http://localhost:3000/ to view the access rules currently defined.
4. Use the LoopBack explorer to create and login new users and create projects and activities.

The file-based database included in the repository is called db.json and is located at the root of the repository.  The database includes the following data:
* Two users with emails: auser@test.com and buser@test.com; their passwords are auser and buser respectively.  Use the LoopBack explorer login function to authenticate the users and test.

### Notes/Disclaimers
* There may be some execute operations that are read-only so preventing viewers from all execute operations may be too restrictive.

* An enterprise level solution for URL level access control
would be to use a specialize product such as OpenAM.

* I've only been working with LoopBack a short while. There may
be better ways of meeting my requirements.

* Access to the access control rules is wide open.  The AccessControl model should be locked-down, for example, using static model ACLs.

* The implementation uses file-based persistence, which has limited query ability.  For example, in the the query to determine if a user has access control to a particuar URL, I would have used the SQL substring function, but since that query function is not available, I needed to iterate query results in the code.

