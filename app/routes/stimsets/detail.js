import Ember from 'ember';
var inflector = Ember.Inflector.inflector;
inflector.irregular('stimulus','stimuli');

export default Ember.Route.extend({

  model(params){

	return Ember.RSVP.hash({
      stimset: this.store.findRecord('stimset', params.stimset_id)
    });   
  },

  setupController(controller, model) {
    controller.set('stimset', model.stimset);
  }

});
