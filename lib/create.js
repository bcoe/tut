var _ = require('underscore'),
  _s = require('underscore.string'),
  fs = require('fs'),
  ejs = require('ejs'),
  exec = require('child_process').exec,
  async = require('async');

(function() {

  function Create(opts) {
    _.extend(this, {
      outputPath: './',
      templatePath: './templates',

      // Variables populated in manifest.
      name: null, // the name of the tutorial.
      difficulty: 1, // difficulty of tutorial from 0 - 10.
      description: 'A brief description of what will be covered in the tutorial',
      version: '0.0.0', // version # of tutorial.
      // path to tutorial on Github.
      github_user: 'your-github-user-name',
      github_path: null,
      topics: ["JavaScript"], // string keywords, of topics covered.
      questions: [
        {
          question: "how long should it take someone to read your tutorial?",
          options: ["15 minutes", "1 hour", "30 minutes", "2 hours"],
          answer: "15 minutes" // this is ba
        },
        {
          question: "an advanced tutorial should have a difficulty of 1",
          answer: false,
        },
        {
          question: "this command line tool can be used to create tutorials",
          answer: "tut"
        }
      ]

    }, opts);

    _.mixin(_s.exports());
  }

  Create.prototype.execute = function(done) {
    this._createTutorialFolder();
    this._createManifest();
    this._createREADME();
    this._createGITIgnore();
    this._createRepo(function() {
      done();
    });
  };

  Create.prototype._createTutorialFolder = function() {
    if (!this.name) throw 'tutorial must have a name';
    console.log('creatinging folder', this._tutorialFolder());
    fs.mkdirSync(this._tutorialFolder());
  };

  Create.prototype._tutorialFolder = function() {
    return this.outputPath + '/' + this.name;
  };

  Create.prototype._createManifest = function() {
    console.log('creating tutorial manifest', this._tutorialFolder() + '/tut.json');

    var scope = {
      name: JSON.stringify(this.name),
      title: JSON.stringify( this.title() ),
      description: JSON.stringify( this.description ),
      version: JSON.stringify( this.version ),
      github_path: JSON.stringify( this.github_user + '/' + this.name ),
      difficulty: this.difficulty,
      topics: JSON.stringify(this.topics, null, 2),
      questions: JSON.stringify(this.questions, null, 2)
    };

    this._expandTemplate(
      this.templatePath + '/tut.json.ejs',
      this._tutorialFolder() + '/tut.json',
      scope
    );
  };


  Create.prototype._createREADME = function() {
    console.log('creating tutorial', this._tutorialFolder() + '/README.md');

    var scope = {
      title: this.title(),
    };

    this._expandTemplate(
      this.templatePath + '/README.md.ejs',
      this._tutorialFolder() + '/README.md',
      scope
    );
  };

  Create.prototype._createGITIgnore = function() {
    console.log('creating .gitignore', this._tutorialFolder() + '/README.md');

    this._expandTemplate(
      this.templatePath + '/.gitignore.ejs',
      this._tutorialFolder() + '/.gitignore',
      {}
    );
  };

  Create.prototype._expandTemplate = function(inputFile, outputFile, scope) {
    var output = ejs.render(fs.readFileSync(inputFile).toString(), scope);

    fs.writeFileSync(
      outputFile,
      output
    );
  };

  Create.prototype.title = function() {
    return _( this.name.replace(/_/g, ' ') ).titleize();
  };

  Create.prototype._createRepo = function(cb) {
    var _this = this;

    async.waterfall([
      
      // initialize the tutorial as a github repo.
      function (done) {
        exec('git init ' + _this._tutorialFolder(), function(err, stdout, stderr) {
          if (err) throw err;
          console.log('initialized git repo.');
          done();
        });
      },

      // add the auto generated files.
      function (done) {
        exec(_this.gitPrefix() + ' add .', function(err, stdout, stderr) {
          if (err) throw err;
          console.log('adding tutorial files.');
          done();
        });
      },

      // commit the files.
      function (done) {
        exec(_this.gitPrefix() + ' commit -a -m "initial commit for ' + _this.name + ' tutorial"', function(err, stdout, stderr) {
          if (err) throw err;
          console.log('performing initial commit.');
          done();
        });
      }

    ], function(err) {
      if (err) throw err;
      cb();
    });
  };

  Create.prototype.gitPrefix = function() {
    return 'git --work-tree=' + this._tutorialFolder() + ' --git-dir=' + this._tutorialFolder() + '/.git';
  };

  exports.Create = Create;
})();