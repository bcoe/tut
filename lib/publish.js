var _ = require('underscore'),
  request = require('request'),
  fs = require('fs'),
  Validate = require('./validate').Validate;

(function() {
  function Publish(opts) {
    _.extend(this, {
      registry: 'http://rock-em-sock-em.2013.nodeknockout.com',
      validator: new Validate()
    }, opts);
  }

  Publish.prototype.execute = function() {
    if ( !fs.existsSync('tut.json') ) throw 'Could not find manifest tut.json';
    
    var manifest = JSON.parse( fs.readFileSync('tut.json').toString() );

    try {
      console.log('validating tut.json')
      this.validator.validate(manifest);
    } catch (e) {
      throw 'invalid manifest: ' + e;
    }

    this.uploadManifest(manifest);
  };

  Publish.prototype.uploadManifest = function(manifest) {
    request({
      uri: this.registry + '/tutorials',
      method: 'POST',
      json: manifest
    }, function(err, response, body) {
      console.log(body);
    });
  };

  exports.Publish = Publish;
})();