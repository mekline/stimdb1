define('stimdb1/router', ['exports', 'ember', 'stimdb1/config/environment'], function (exports, _ember, _stimdb1ConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _stimdb1ConfigEnvironment['default'].locationType,
    rootURL: _stimdb1ConfigEnvironment['default'].rootURL
  });

  Router.map(function () {});

  exports['default'] = Router;
});