import DS from 'ember-data';
import Ember from 'ember';
import Faker from 'faker';

export default DS.Model.extend({
  name: DS.attr('string'),
  emailaddress: DS.attr('string'),
  website: DS.attr('string'),
  creatorSource: DS.attr('string'), //record whether this is a fake thing!

  stimsets: DS.hasMany('stimset', {inverse: 'creator', async:true}),

  isValidName: Ember.computed.notEmpty('name'),
  isValidEmail: Ember.computed.match('emailaddress', /^.+@.+\..+$/),
  isValidWebsite: Ember.computed.match('website',/^.+/), //To add: website validataion + glyphicon
  isValidContact: Ember.computed.and('isValidEmail','isValidName', 'isValidWebsite'),

  randomize(){ //if this gets called on a creator instance, all values replaced with fake data!
  	this.set('name', Faker.name.firstName() + ' ' + Faker.name.lastName());
    this.set('emailaddress', Faker.internet.exampleEmail());
  	this.set('website', Faker.internet.url());
  	this.set('creatorSource', 'faker generated');

  	return this; //not sure why needed yet

  }
});
