define('stimdb1/tests/models/message.jshint', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | models/message.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/message.js should pass jshint.');
  });
});