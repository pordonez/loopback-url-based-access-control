I wanted to ability in strongloop loopback to enforce access policies
at the URL level.  That is, for a particuar URL and for URLs under that 
URL, I wanted the ability to enforce who can administer, write, or read
content in and under that URL.

The goal of this project is to add suppot for URL based access control
to stongloop loopback by emulating the Unix type behavior of a user's 
ability to read, write or execute particular file or folder requests. 

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
- For a particular access control request, the resolution resolver
determines which user is authorized to access that URL and what 
privilages the user has. 



