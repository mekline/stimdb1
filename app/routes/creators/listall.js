// app/routes/creators/listall.js
import Ember from 'ember';
var inflector = Ember.Inflector.inflector;
inflector.irregular('stimulus','stimuli');

export default Ember.Route.extend({

  model(){

    return Ember.RSVP.hash({
      creators: this.store.findAll('creator'),
      stimsets: this.store.findAll('stimset')
    });
  },

  setupController(controller, model) {
    controller.set('creators', model.creators);
    controller.set('stimsets', model.stimsets);
  },

    actions: {

    deleteCreator(creator) {
      let confirmation = confirm('Are you sure?');

      if (confirmation) {
        creator.destroyRecord();
      }
    }
  }

});