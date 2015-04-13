Strongloop Loopback provides support for model based access control.  
That is, access is controled at the model or type level. 
Model specifications in JSON specify the access control rules. 

What doesn't appear to be supported without customization as of the 
2.14 release is the ability to control access
at the URL level.  That is, for a particualar URL, the sytem should be able
to specify which user's have administrative, write and read access to that
URL and sub URLs. 

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



