// app/routes/libraries/new.js
import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.store.createRecord('creator');
  },

  setupController: function (controller, model) {
    this._super(controller, model);

    controller.set('title', 'Add a new stimulus set Creator');
    controller.set('buttonLabel', 'New creator');
  },

  renderTemplate() {
    this.render('creators/form');
  },

  actions: {

    saveCreator(newCreator) {
      newCreator.save().then(() => this.transitionTo('creators'));
    },

    willTransition() {
      // rollbackAttributes() removes the record from the store
      // if the model 'isNew'
      this.controller.get('model').rollbackAttributes();
    }
  }
});