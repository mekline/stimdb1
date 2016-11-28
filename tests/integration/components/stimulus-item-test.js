import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('stimulus-item', 'Integration | Component | stimulus item', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{stimulus-item}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#stimulus-item}}
      template block text
    {{/stimulus-item}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
