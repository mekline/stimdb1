import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('about');
  this.route('contact');

  this.route('admin', function() {
    this.route('messages');
    this.route('seeder');
  });

  this.route('creators', function() {
    this.route('new');
    this.route('listall');
    this.route('edit', { path: '/:creator_id/edit' });
  });

  this.route('stimsets', function() {
    this.route('new');
    this.route('listall');
    this.route('search');
  });

});

export default Router;
