import DS from 'ember-data';
import Faker from 'faker';

export default DS.Model.extend({
	
  stimsetname: DS.attr('string'),
  citation: DS.attr('string'), //text version
  doi: DS.attr('string'), //doi link
  setSource: DS.attr('string'), //record whether this is a fake thing!

  creator: DS.belongsTo('creator'),
  stimuli: DS.hasMany('stimulus'),

  randomize(creator){//specify who made this stim set
  	const whichSet = Faker.hacker.adjective() + ' ' + Faker.hacker.adjective() + ' Stimuli';
    this.set('creator', creator);
    //make sure the stimset gets saved back to creator, doesn't happen automatically
    var myCreator = this.get('creator');
    if (myCreator && myCreator.then){
      myCreator.then(function(myCreator){myCreator.save();});
    } else if (myCreator){
      myCreator.save();
    }

    this.set('stimsetname', whichSet);
  	this.set('citation', myCreator.get('name') + ' et al.(' + Faker.random.number(1975,2015) + ') A paper about ' + whichSet);
  	this.set('doi', 'http://DOI.' + Faker.internet.ip());
  	
  	this.set('setSource', 'faker generated');



  	return this; //not sure why needed yet

  },
  
});
