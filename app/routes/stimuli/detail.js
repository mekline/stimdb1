import Ember from 'ember';
var inflector = Ember.Inflector.inflector;
inflector.irregular('stimulus','stimuli');

export default Ember.Route.extend({
	model(params) {
	return this.store.findRecord('stimulus', params.stimulus_id);  
  },

});
