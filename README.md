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