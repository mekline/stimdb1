define('stimdb1/models/message', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    email: _emberData['default'].attr('string'),
    messagetxt: _emberData['default'].attr('string')
  });
});