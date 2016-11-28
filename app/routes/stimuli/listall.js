import Ember from 'ember';

var inflector = Ember.Inflector.inflector;
inflector.irregular('stimulus','stimuli');

export default Ember.Route.extend({

model(){
  return Ember.RSVP.hash({
      stimuli: this.store.findAll('stimulus'),
      stimsets: this.store.findAll('stimset')
    });
},

setupController(controller, model) {
    controller.set('stimuli', model.stimuli);
    controller.set('stimsets', model.stimsets);
  },

});
