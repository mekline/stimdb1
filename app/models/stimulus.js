import DS from 'ember-data';

export default DS.Model.extend({
  stimname: DS.attr('string'),
  mediaFilename: DS.attr('string'),
  stimSource: DS.attr('string'), //record whether this is a fake thing!
  
  stimset: DS.belongsTo('stimset'),
  

  randomize(stimset){ //Pass in which stimset this is being added to...
  	const whichStim = Faker.hacker.adjective() + Faker.adjective.noun();
  	this.set('stimname', whichStim)
    this.set('mediaFilename', whichStim + '.' + Faker.stystem.commonFileExt())
  	this.set('stimset', stimset)
  	this.set('stimSource', 'faker generated');

  	return this; //not sure why needed yet

  }

});
