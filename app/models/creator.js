import DS from 'ember-data';

export default DS.Model.extend({
  stimsets: DS.hasMany('stimset'),
  name: DS.attr('string'),
  emailaddress: DS.attr('string'),
  website: DS.attr('string')
});
