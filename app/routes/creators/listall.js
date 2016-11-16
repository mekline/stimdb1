// app/routes/creators/listall.js
import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.store.findAll('creator');
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