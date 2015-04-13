The goal of this project is to add suppot for URL based access control
to stongloop loopback by emulating the Unix type behavior of a users 
ability to read, write or execute a particular file or folder. 

For a particular URL, this project provides support for users to be
administrators, writers or readers of a particular URL and associated 
sub URLS.  If a user has administrative access to a particular URL, he/she
has the ability to read, write, or execute commands to that and succeeding
URLS.  The same is true for read, write and execute.

The implemetation defines the following:
- All models requiring URL based access support must include an "accessControl"
element in their definition allowing full access to the mode as follows:
    {
      "principalType": "ROLE",
      "principalId": "accessManager",
      "permission": "ALLOW"
    }
- A resolution resolver is defined to intercept access requests
- The resolution resolver  



