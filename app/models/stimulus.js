import DS from 'ember-data';

export default DS.Model.extend({
  mediaFilename: DS.attr('string'),
  stimset: DS.belongsTo('stimset')
});
