define('stimdb1/tests/helpers/resolver', ['exports', 'stimdb1/resolver', 'stimdb1/config/environment'], function (exports, _stimdb1Resolver, _stimdb1ConfigEnvironment) {

  var resolver = _stimdb1Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: _stimdb1ConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _stimdb1ConfigEnvironment['default'].podModulePrefix
  };

  exports['default'] = resolver;
});