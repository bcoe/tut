var _ = require('underscore');

(function() {
  function Validate(opts)  {
    _.extend(this, {
      requiredFields: [
        'name',
        'title',
        'description',
        'version',
        'github_path',
        'difficulty',
        'questions'
      ]
    }, opts);
  };

  Validate.prototype.validate = function(manifest) {

    this.requiredFields.forEach(function(field) {
      if ( !manifest.hasOwnProperty(field) ) throw field + ' field missing';
    });

    if (!this.validVersion(manifest.version)) throw 'invalid version number, should be of form 0.0.0';
    if (!this.validGithubPath(manifest.github_path)) throw 'invalid github path should be username/repo';
    if (manifest.difficulty < 1 || manifest.difficulty > 10) throw 'difficulty must be between 1 for easy and 10 for hard';
    if (manifest.topics && !this.validTopics(manifest.topics)) throw 'topics must be an array of string topics that describe tutorial';;
    this.validQuestions(manifest.questions);
  };

  Validate.prototype.validVersion = function(versionString) {
    versionString += ''; // coerce version into string.

    var parts = versionString.split('.');

    // Must be of form major, minor, build, (revision).
    if (parts.length < 3 || parts.length > 4) {
      return false;
    }

    // Major and minor must be integer.
    if ( isNaN(parts[0]) || isNaN(parts[1]) ) {
      return false;
    }

    return true;
  };

  Validate.prototype.validGithubPath = function(githubPath) {
    return githubPath.split('/').length == 2;
  };

  Validate.prototype.validTopics = function(topics) {
    if ( !(topics instanceof Array) ) return false;

    for (var i = 0, topic; (topic = topics[i]) != null; i++) {
      if (typeof topic !== 'string') return false;
    }

    return true;
  };

  Validate.prototype.validQuestions = function(questions) {
    questions.forEach(function(question) {
      if ( !question.hasOwnProperty('question') ) throw 'question field is missing';
      if ( !question.hasOwnProperty('answer') ) throw 'answer field is missing';
      
      if (typeof question.answer === 'boolean') {
        if ( question.hasOwnProperty('options') ) throw 'a true/false question should not have options';
      }

      if (typeof question.answer === 'string' && question.hasOwnProperty('options') ) {
        if (!_(question.options).contains(question.answer)) throw 'options field did not contain answer';
      }

    });
  };

  exports.Validate = Validate;
})();