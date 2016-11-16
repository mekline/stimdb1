import Ember from 'ember';

export default Ember.Controller.extend({

  emailAddress: '',
  message: '',
  responseMessage:'',


  isValidEmail: Ember.computed.match('emailAddress', /^.+@.+\..+$/),
  isValidMessage: Ember.computed.notEmpty('message'),
  isValid: Ember.computed.and('isValidEmail', 'isValidMessage'),
  isDisabled: Ember.computed.not('isValid'),

  actions: {

    saveMessage() {
      const email = this.get('emailAddress');
      const msg = this.get('message');
      console.log(msg);

      const newMessage = this.store.createRecord('message', { 
      	email: email, 
      	messagetxt: msg 
      });

      newMessage.save().then((response)=> {
     	  this.set('responseMessage', `Thank you! Your message has been sent and your email saved: ${this.get('emailAddress')}`);
        this.set('emailAddress', '');
      	this.set('message', '');
      });

    }
  }

});
