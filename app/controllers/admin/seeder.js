// app/controllers/admin/seeder.js 
import Ember from 'ember';
import Faker from 'faker';

export default Ember.Controller.extend({

  // If you haven't mapped these properties in Route in setupController hook, you can alias them here, for example:
  // libraries: Ember.computed.alias('model.libraries')
  creators: [],
  stimsets: [],
  stimuli: [],

  actions: {

    generateCreators(num) {
      const counter = parseInt(num);

      for (let i = 0; i < counter; i++) {
        const isTheLast = i === counter-1;
        this._saveRandomCreator(isTheLast);
      }
    },

    deleteCreators() {
      this._destroyAll(this.get('creators')); //TODO: filter to just the fake ones?

      // Data down via seeder-block to fader-label that we ready to show the label
      this.set('creDelDone', true);
    },

    generateStimSetsandStims(num) {
      const counter = parseInt(num);

      for (let i = 0; i < counter; i++) {
        const isTheLast = i === counter-1;
        const myCreator = this._selectRandomCreator();
        this._saveRandomStimSet(myCreator, isTheLast);
      }
    },

    deleteStimSetsandStims() {
      this._destroyAll(this.get('stimuli'));
      this._destroyAll(this.get('stimsets'));

      // Data down via seeder-block to fader-label that we ready to show the label
      this.set('stimDelDone', true);
    }
  },

  // Private methods

  _saveRandomCreator(isLast) {
    const randomCreator = this.store.createRecord('creator').randomize();

    randomCreator.save().then(() => {
      if (isLast) {

        // Data down via seeder-block to fader-label that we ready to show the label
        this.set('creDone', true);
      }
    });
  },

  _selectRandomCreator() {
    const creators = this.get('creators');
    const creatorCounter = creators.get('length');

    // Create a new array from ids
    const creatorIds = creators.map(cre => cre.get('id'));

    // Randomly pick one id from the libraryIds array and return the library
    const randomNumber = Faker.random.number(creatorCounter-1);
    const randomCreator = creators.findBy('id', creatorIds[randomNumber]);

    return randomCreator;

  },

  _saveRandomStimSet(creator, isLast) {
    const newStimSet = this.store.createRecord('stimset').randomize(creator);
    this._generateSomeStimuli(newStimSet);
    newStimSet.save().then(() => {
        if (isLast) {

          // Data down via seeder-block to fader-label that we ready to show the label
          this.set('authDone', true);
        }
      }
    );
    return newStimSet;
  },

  _generateSomeStimuli(stimset) {
    const stimCounter = Faker.random.number(10);

    for (let j = 0; j < stimCounter; j++) {
      this.store.createRecord('stimulus')
        .randomize(stimset)
        .save();
    }
  },

  _destroyAll(records) {
    records.forEach(
      item => item.destroyRecord()
    );
  }

});