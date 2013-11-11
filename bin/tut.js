#!/usr/bin/env node

var Create = require('../lib').Create,
  Publish = require('../lib').Publish,
  optimist = require('optimist'),
  request = require('request');

var argv = optimist
  .options('c', {
    alias: 'create',
    describe: 'create a new tutorial.'
  })
  .options('u', {
    alias: 'registry_url',
    describe: 'set the URL of the package registry.'
  })
  .options('p', {
    alias: 'publish',
    describe: 'publish the tutorial.'
  })
  .options('g', {
    alias: 'github_user',
    describe: 'your github username'
  })
  .usage("tut -c my_tutorial_name")
  .argv;

if (argv.help) {
  console.log(optimist.help());
} else if (argv.create) {
  var create = new Create({
    name: argv.create,
    github_user: argv.github_user,
    templatePath: __dirname + '/../templates'
  });

  // Generate a new tutorial.
  try {
    create.execute(function() {
      console.log('created tutorial', argv.create);
    });
  } catch (e) {
    console.log(e);
  }

} else if (argv.publish) {
  console.log('publishing tutorial');

  var publish = new Publish();

  try {
    publish.execute();
  } catch (e) {
    console.log(e);
  }
}