//app/routes/creators/edit.js 

import Ember from 'ember';

export default Ember.Route.extend({

  model(params) {
    return this.store.findRecord('creator', params.creator_id);
  },

  setupController: function (controller, model) {
    this._super(controller, model);

    controller.set('title', 'Edit an existing creator');
    controller.set('buttonLabel', 'Edit creator');
  },

  renderTemplate() {
    this.render('creators/form');
  },

  actions: {

    saveCreator(newCreator) {
      newCreator.save().then(() => this.transitionTo('creators'));
    },

    willTransition(transition) {

      let model = this.controller.get('model');

      if (model.get('hasDirtyAttributes')) {
        let confirmation = confirm("Your changes haven't saved yet. Would you like to leave this form?");

        if (confirmation) {
          model.rollbackAttributes();
        } else {
          transition.abort();
        }
      }
    }
  }
});