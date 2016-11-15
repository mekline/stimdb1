define('stimdb1/tests/helpers/start-app', ['exports', 'ember', 'stimdb1/app', 'stimdb1/config/environment'], function (exports, _ember, _stimdb1App, _stimdb1ConfigEnvironment) {
  exports['default'] = startApp;

  function startApp(attrs) {
    var application = undefined;

    var attributes = _ember['default'].merge({}, _stimdb1ConfigEnvironment['default'].APP);
    attributes = _ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    _ember['default'].run(function () {
      application = _stimdb1App['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }
});