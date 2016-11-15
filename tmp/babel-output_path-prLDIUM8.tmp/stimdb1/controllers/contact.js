define('stimdb1/controllers/contact', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({

    emailAddress: '',
    message: '',

    isValidEmail: _ember['default'].computed.match('emailAddress', /^.+@.+\..+$/),
    isValidMessage: _ember['default'].computed.notEmpty('message'),
    isValid: _ember['default'].computed.and('isValidEmail', 'isValidMessage'),
    isDisabled: _ember['default'].computed.not('isValid'),

    actions: {

      saveMessage: function saveMessage() {
        var _this = this;

        var email = this.get('emailAddress');
        var msg = this.get('message');
        console.log(msg);

        var newMessage = this.store.createRecord('message', {
          email: email,
          messagetxt: msg
        });

        newMessage.save().then(function (response) {
          _this.set('responseMessage', 'Thank you! Your message has been sent and your email saved: ' + _this.get('emailAddress'));
          _this.set('emailAddress', '');
          _this.set('message', '');
        });
      }
    }

  });
});