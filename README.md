### Overview
StrongLoop LoopBack, a Node.js based framework, supports the ability
to define types (known as a models a la MVC) and easily expose them
via a RESTful API and persist them via LoopBack's ORM feature.  

LoopBack also provides the ability to define access controls on models
via Roles and ACLs.  The access control feature works at the model level.
That is, for a particular model or type, LoopBack supports the ability
to specify which users or roles have access and the type of access
to that particular model or type.   

While access control at the granularity of a model is nice, I
wanted to be able to specify access control at the URL level.  That is,
for a particular (RESTful) URL, I wanted to be able to specify which users
have access to that URL and sub URLs and what type of access.

This repository serves as a sample implementation for URL-based
access control.  

*Note that a better solution for URL level access control
might be to use a specialize product such as OpenAM.*


### Core Component
Access Manager

### Implementation Examples 
Project

Team




