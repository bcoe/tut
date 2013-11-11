var equal = require('assert').equal,
  Create = require('../lib/create').Create,
  fs = require('fs'),
  exec = require('child_process').exec;

describe('Create', function () {

  beforeEach(function() {
    this.outputPath = './test';
  });

  afterEach(function(done) {
    try {
      exec('rm -rf ' + this.outputPath + '/my_first_tutorial', function(err, stdout, stderr) {
        done();
      });
    } catch (e) {
      console.log(e);
    }
  });

  describe('.createTutorialFolder', function() {

    it('should create output folder for tutorial', function(done) {
      var create = new Create({
        name: 'my_first_tutorial',
        outputPath: this.outputPath
      });
      
      create.execute(function() {
        equal(
          fs.existsSync('./test/my_first_tutorial'),
          true,
          'tutorial folder not created'
        );

        done();        
      });
    });

  });

  describe('.createManifest', function() {

    it('should copy tut.json in to tutorial directory', function(done) {
      var create = new Create({
        name: 'my_first_tutorial',
        outputPath: this.outputPath
      });
      
      create.execute(function() {
        equal(
          fs.existsSync(create._tutorialFolder() + '/tut.json'),
          true,
          'tutorial manifest did not exist'
        );
        done();
      });
    });

  });

  describe('.title', function() {
    it('should convert a name to a title', function() {
      var create = new Create({
        name: 'my_first_tutorial',
        outputPath: this.outputPath
      });

      equal(create.title(), 'My First Tutorial');
    });
  });

  describe('.initializeRepo', function() {
    it('should initialize a github repo in the folder created', function(done) {
      var create = new Create({
        name: 'my_first_tutorial',
        outputPath: this.outputPath
      });
      
      create.execute(function() {
        equal(fs.existsSync('./test/my_first_tutorial/.git'), true);
        done();
      });
    });
  });

});