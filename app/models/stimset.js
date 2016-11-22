import DS from 'ember-data';

export default DS.Model.extend({
	
  setname: DS.attr('string'),
  citation: DS.attr('string'), //text version
  doi: DS.attr('string'), //doi link
  setSource: DS.attr('string'), //record whether this is a fake thing!

  creator: DS.belongsTo('creator'),
  stims: DS.hasMany('stimulus'),

  randomize(creator){//specify who made this stim set
  	const whichSet = Faker.hacker.adjective() + ' ' + Faker.hacker.adjective() + ' Stimuli';
  	this.set('setname', whichSet),
  	this.set('citation', creator.name + ' et al.(' + this._randomYear() + ') A paper about ' + whichSet)
  	this.set('doi', 'http://DOI.' + Faker.internet.ip()),
  	this.set('creator', creator),
  	this.set('setSource', 'faker generated');

  	return this; //not sure why needed yet

  },

  _randomYear() {
    return new Date(this._getRandomArbitrary(1900, 2015).toPrecision(4));
  },
  
});
