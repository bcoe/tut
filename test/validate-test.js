var equal = require('assert').equal,
  Validate = require('../lib/validate').Validate,
  chai = require('chai');

describe('Validate', function () {

  it('should raise an exception if name is missing', function() {
    var validate = new Validate();

    chai.expect(function() {
      validate.validate({
        title: 'My First Tutorial',
        description: 'a brief description',
        version: '0.0.0',
        github_path: 'bcoe/first-tutorial',
        difficulty: 0,
        questions: [{question: "I'm a question?",answer: 'two',options: ['one', 'two']}]
      });
    }).to.throw( 'name field missing' );
  });

  it('should raise an exception if title is missing', function() {
    var validate = new Validate();

    chai.expect(function() {
      validate.validate({
        name: 'my_first_tutorial',
        description: 'a brief description',
        version: '0.0.0',
        github_path: 'bcoe/first-tutorial',
        difficulty: 1,
        questions: [{question: "I'm a question?",answer: 'two',options: ['one', 'two']}]
      });
    }).to.throw( 'title field missing' );
  });

  it('should raise an exception if description is missing', function() {
    var validate = new Validate();

    chai.expect(function() {
      validate.validate({
        title: 'My First Tutorial',
        name: 'my_first_tutorial',
        version: '0.0.0',
        github_path: 'bcoe/first-tutorial',
        difficulty: 1,
        questions: [{question: "I'm a question?",answer: 'two',options: ['one', 'two']}]
      });
    }).to.throw( 'description field missing' );
  });

  it('should raise an exception if version is invalid', function() {
    var validate = new Validate();

    chai.expect(function() {
      validate.validate({
        name: 'my_first_tutorial',
        title: 'My First Tutorial',
        description: 'a brief description',
        version: 'banana',
        github_path: 'bcoe/first-tutorial',
        difficulty: 1,
        questions: [{question: "I'm a question?",answer: 'two',options: ['one', 'two']}]
      });
    }).to.throw( 'invalid version number, should be of form 0.0.0' );
  });

  it('should raise an exception if version is missing', function() {
    var validate = new Validate();

    chai.expect(function() {
      validate.validate({
        name: 'my_first_tutorial',
        title: 'My First Tutorial',
        description: 'a brief description',
        github_path: 'bcoe/first-tutorial',
        difficulty: 1,
        questions: [{question: "I'm a question?",answer: 'two',options: ['one', 'two']}]
      });
    }).to.throw( 'version field missing' );
  });

  it('should raise an exception if github path is invalid', function() {
    var validate = new Validate();

    chai.expect(function() {
      validate.validate({
        name: 'my_first_tutorial',
        title: 'My First Tutorial',
        description: 'a brief description',
        version: '0.0.0',
        github_path: 'bcoe/first-tutorial/invalid',
        difficulty: 1,
        questions: [{question: "I'm a question?",answer: 'two',options: ['one', 'two']}]
      });
    }).to.throw( 'invalid github path should be username/repo' );
  });

  it('should raise an exception if difficulty is > 10 or < 0', function() {
    var validate = new Validate();

    chai.expect(function() {
      validate.validate({
        name: 'my_first_tutorial',
        title: 'My First Tutorial',
        description: 'a brief description',
        version: '0.0.0',
        github_path: 'bcoe/first-tutorial',
        difficulty: 0,
        questions: [{question: "I'm a question?",answer: 'two',options: ['one', 'two']}]
      });
    }).to.throw( 'difficulty must be between 1 for easy and 10 for hard' );

    chai.expect(function() {
      validate.validate({
        name: 'my_first_tutorial',
        title: 'My First Tutorial',
        description: 'a brief description',
        version: '0.0.0',
        github_path: 'bcoe/first-tutorial',
        difficulty: 11,
        questions: [{question: "I'm a question?",answer: 'two',options: ['one', 'two']}]
      });
    }).to.throw( 'difficulty must be between 1 for easy and 10 for hard' );

  });

  it('should raise an exception if topics array is invalid', function() {
    var validate = new Validate();

    chai.expect(function() {
      validate.validate({
        name: 'my_first_tutorial',
        title: 'My First Tutorial',
        description: 'a brief description',
        version: '0.0.0',
        github_path: 'bcoe/first-tutorial',
        difficulty: 1,
        topics: ['JavaScript', null],
        questions: [{question: "I'm a question?",answer: 'two',options: ['one', 'two']}]
      });
    }).to.throw( 'topics must be an array of string topics that describe tutorial' );
  });

  describe('validGithubPath', function() {
    it('should return true if path is of form username/repo', function() {
      var validate = new Validate();
      equal(validate.validGithubPath('bcoe/my-first-tutorial'), true);
    });

    it('should return false if path is any other form', function() {
      var validate = new Validate();
      equal(validate.validGithubPath('bcoe/my-first-tutorial/banana'), false);
    });
  });

  describe('validVersion', function() {

    it('should return false if version is not major, minor, build, revision', function() {
      var validate = new Validate();
      equal(validate.validVersion('0.0'), false);
      equal(validate.validVersion('0.0.0'), true);
      equal(validate.validVersion('0.0.0.0'), true);
      equal(validate.validVersion('0.0.0.0.0'), false);
    });

    it('should return false if major or minor are not integers', function() {
      var validate = new Validate();
      equal(validate.validVersion('0a.0'), false);
      equal(validate.validVersion('0.0b.0'), false);
      equal(validate.validVersion('0.0.0a'), true);
      equal(validate.validVersion('0.0.0.0a'), true);
    });

  });

  describe('validTopics', function() {
    it('should return false if topics is not an array', function() {
      var validate = new Validate();
      equal(validate.validTopics('not-an-array'), false);
    });

    it('should return false if topics contains a value other than a string', function() {
      var validate = new Validate();
      equal(validate.validTopics(['JavaScript', 7]), false);      
    });

    it('should return true if topics is array of strings', function() {
      var validate = new Validate();
      equal(validate.validTopics(['JavaScript', 'variables']), true);      
    });
  });

  describe('validQuestions', function() {

    it("raises an exception if question key is missing in any question", function() {
      var validate = new Validate(),
        questions = [
          {question: "I'm a question", answer: "I'm an answer"},
          {answer: "I'm an answer"}
        ];

      chai.expect(function() {
        validate.validQuestions(questions);
      }).to.throw( 'question field is missing' );
    });

    it("raises an exception if answer key is missing in any question", function() {
      var validate = new Validate(),
        questions = [
          {question: "I'm a question?", answer: "I'm an answer"},
          {question: "I'm a question?"}
        ];

      chai.expect(function() {
        validate.validQuestions(questions);
      }).to.throw( 'answer field is missing' );
    });

    it("raises an exception if a true/false question has options", function() {
      var validate = new Validate(),
        questions = [{
          question: "I'm a question?",
          answer: false,
          options: ['one', 'two']
        }];

      chai.expect(function() {
        validate.validQuestions(questions);
      }).to.throw( 'a true/false question should not have options' );
    });

    it("raises an exception if string answer is missing from options field", function() {
      var validate = new Validate(),
        questions = [{
          question: "I'm a question?",
          answer: 'banana',
          options: ['one', 'two']
        }];

      chai.expect(function() {
        validate.validQuestions(questions);
      }).to.throw( 'options field did not contain answer' );
    });

    it("does not raise an exception for a valid question", function() {
      var validate = new Validate(),
        questions = [{question: "I'm a question?",answer: 'two',options: ['one', 'two']}];

      validate.validQuestions(questions);
    });

  });

});