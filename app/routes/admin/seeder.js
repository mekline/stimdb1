import Ember from 'ember';

export default Ember.Route.extend({

  //use the below model () and setupController to bring multiple models on a route

  model() {
    return Ember.RSVP.hash({
      creators: this.store.findAll('creator'),
      stimsets: this.store.findAll('stimset'),
      stimuli: this.store.findAll('stimulus')
    });
  }, 

  setupController(controller, model) {
    controller.set('creators', model.creators);
    controller.set('stimsets', model.stimsets);
    controller.set('stimuli', model.stimuli);
  }

});
