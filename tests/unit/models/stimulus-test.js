import { moduleForModel, test } from 'ember-qunit';

moduleForModel('stimulus', 'Unit | Model | stimulus', {
  // Specify the other units that are required for this test.
  needs: ['model:stimset']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
