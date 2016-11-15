define('stimdb1/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'stimdb1/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _stimdb1ConfigEnvironment) {

  var name = _stimdb1ConfigEnvironment['default'].APP.name;
  var version = _stimdb1ConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});