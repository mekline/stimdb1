import DS from 'ember-data';

export default DS.Model.extend({
  setname: DS.attr('string'),
  creator: DS.belongsTo('creator'),
  citation: DS.attr('string'), //text version
  doi: DS.attr('string'), //doi link
  stims: DS.hasMany('stimulus')
});
