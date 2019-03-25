Rota 
==

This is a simple rota application.  It's aimed at the particular case of allocating registrars etc to hospitals which 
have a particular number of slots to fill.

It's also a demonstration of using [API Platform](https://api-platform.com/), which makes it easy to generate:
* A Symfony API, complete with OpenAPI documentation/playground (Swagger, as was)
* A sample Admin API, using React.
* A client, using Vue.

We then deploy this to Heroku, integrated with this repository, so that we get a nice deployment mechanism.

Developing
==

To develop the client, you'll need a server which provides the API the client uses.  You can start one using:

`docker-compose up -d`

You then can see the API at 

http://localhost:8080/

Then you can run the client in development mode:

`cd client-nuxt
npm run dev`

Deploying
==

You'll need to deploy both the server and the client.

Deploying the server to Heroku
==

As per Platform API instructions, and enable automatic deploys.  Set the env to production:

`heroku config:set SYMFONY_ENV=prod -a rotavator-api`  

Also set the DATABASE_URL environment variable to be the same as the CLEARDB_DATABASE_URL.

Then set up a pipeline to the api subfolder from the git repository using the instructions at:

https://github.com/timanovsky/subdir-heroku-buildpack

`heroku buildpacks:clear -a rotavator-api`

`heroku buildpacks:set https://github.com/timanovsky/subdir-heroku-buildpack -a rotavator-api`

`heroku buildpacks:add heroku/php -a rotavator-api`

`heroku config:set PROJECT_PATH=api -a rotavator-api`

You may need to create the database:

`heroku run php bin/console doctrine:database:create`

`heroku run php bin/console doctrine:schema:update --force`

Deploying the client to Heroku
=== 

As per Platform API instructions, then set up a pipeline to the client-nuxt subfolder from the git repository using the instructions at 

https://github.com/timanovsky/subdir-heroku-buildpack

Then customise for Nuxt according to https://nuxtjs.org/faq/heroku-deployment/

`heroku config:set NPM_CONFIG_PRODUCTION=false -a rotavator-client`

`heroku config:set HOST=0.0.0.0 -a rotavator-client`

`heroku config:set NODE_ENV=production -a rotavator-client`

Troubleshooting
===

* If you have problems deploying, check that APP_ENV in .env is set to prod. 
* Getting invalid reference format on docker-compose up?  Make sure you're in the top level, not under /api