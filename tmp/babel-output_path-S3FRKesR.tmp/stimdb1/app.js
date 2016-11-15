define('stimdb1/app', ['exports', 'ember', 'stimdb1/resolver', 'ember-load-initializers', 'stimdb1/config/environment'], function (exports, _ember, _stimdb1Resolver, _emberLoadInitializers, _stimdb1ConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _stimdb1ConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _stimdb1ConfigEnvironment['default'].podModulePrefix,
    Resolver: _stimdb1Resolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _stimdb1ConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});