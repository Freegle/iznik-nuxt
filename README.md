Rota 
==

This is a simple rota application.  It's aimed at the particular case of allocating registrars etc to hospitals which 
have a particular number of slots to fill.

It's also a demonstration of using [API Platform](https://api-platform.com/), which makes it easy to generate:
* A Symfony API, complete with OpenAPI documentation/playground (Swagger, as was)
* A sample Admin API, using React.
* A client, using Vue.

We then deploy this to Heroku, integrated with this repository, so that we get a nice deployment mechanism.

Deploying API to Heroku
===

As per Platform API instructions, then set up a pipeline from the git repositoring using 

https://github.com/timanovsky/subdir-heroku-buildpack

Don't forget to set the DATABASE_URL environment variable.

You may need to create the database:

`heroku run php bin/console doctrine:database:create`

`heroku run php bin/console doctrine:schema:update --force`
 
To update code:

`git push heroku master`