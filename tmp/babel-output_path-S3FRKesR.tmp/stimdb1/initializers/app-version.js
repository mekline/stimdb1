define('stimdb1/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'stimdb1/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _stimdb1ConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_stimdb1ConfigEnvironment['default'].APP.name, _stimdb1ConfigEnvironment['default'].APP.version)
  };
});