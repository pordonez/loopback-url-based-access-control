strongloop loopback provides good support for model based access control.  
That is, access is controled at the model or type level. What doesn't appear
to be supported as of the 2.14 release is the ability to control access
at the URL level.    

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



