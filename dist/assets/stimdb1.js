"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('stimdb1/adapters/application', ['exports', 'emberfire/adapters/firebase'], function (exports, _emberfireAdaptersFirebase) {
  exports['default'] = _emberfireAdaptersFirebase['default'].extend({});
});
define('stimdb1/app', ['exports', 'ember', 'stimdb1/resolver', 'ember-load-initializers', 'stimdb1/config/environment'], function (exports, _ember, _stimdb1Resolver, _emberLoadInitializers, _stimdb1ConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _stimdb1ConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _stimdb1ConfigEnvironment['default'].podModulePrefix,
    Resolver: _stimdb1Resolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _stimdb1ConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('stimdb1/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'stimdb1/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _stimdb1ConfigEnvironment) {

  var name = _stimdb1ConfigEnvironment['default'].APP.name;
  var version = _stimdb1ConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});
define('stimdb1/components/creator-item-form', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({

    buttonLabel: 'Save',

    actions: {

      buttonClicked: function buttonClicked(param) {
        this.sendAction('action', param);
      }

    }

  });
});
define('stimdb1/components/creator-item', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define('stimdb1/components/fader-label', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    tagName: 'span',

    classNames: ['label label-success label-fade'],
    classNameBindings: ['isShowing:label-show'],

    isShowing: false,

    isShowingChanged: _ember['default'].observer('isShowing', function () {
      var _this = this;

      _ember['default'].run.later(function () {
        return _this.set('isShowing', false);
      }, 3000);
    })
  });
});
// app/components/fader-label.js
define('stimdb1/components/number-box', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Component.extend({

		classNames: ['panel', 'panel-warning']

	});
});
define('stimdb1/components/seeder-block', ['exports', 'ember'], function (exports, _ember) {

  var MAX_VALUE = 50;

  exports['default'] = _ember['default'].Component.extend({

    counter: null,

    isCounterValid: _ember['default'].computed.lte('counter', MAX_VALUE),
    placeholder: 'Max ' + MAX_VALUE,

    createReady: false,
    deleteReady: false,

    actions: {

      generateAction: function generateAction() {
        if (this.get('isCounterValid')) {

          // Action up to Seeder Controller with the requested amount
          this.sendAction('generateAction', this.get('counter'));
        }
      },

      deleteAction: function deleteAction() {
        this.sendAction('deleteAction');
      }

    }
  });
});
// app/components/seeder-block.js
define('stimdb1/components/smart-link-to', ['exports', 'ember-cli-smart-link-to/components/smart-link-to'], function (exports, _emberCliSmartLinkToComponentsSmartLinkTo) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCliSmartLinkToComponentsSmartLinkTo['default'];
    }
  });
});
define('stimdb1/controllers/admin/seeder', ['exports', 'ember', 'faker'], function (exports, _ember, _faker) {
  exports['default'] = _ember['default'].Controller.extend({

    // If you haven't mapped these properties in Route in setupController hook, you can alias them here, for example:
    // libraries: Ember.computed.alias('model.libraries')
    creators: [],
    stimsets: [],
    stimuli: [],

    actions: {

      generateCreators: function generateCreators(num) {
        var counter = parseInt(num);

        for (var i = 0; i < counter; i++) {
          var isTheLast = i === counter - 1;
          this._saveRandomCreator(isTheLast);
        }
      },

      deleteCreators: function deleteCreators() {
        this._destroyAll(this.get('creators')); //TODO: filter to just the fake ones?

        // Data down via seeder-block to fader-label that we ready to show the label
        this.set('creDelDone', true);
      },

      generateStimSetsandStim: function generateStimSetsandStim(num) {
        var counter = parseInt(num);

        for (var i = 0; i < counter; i++) {
          var isTheLast = i === counter - 1;
          var myCreator = this._selectRandomCreator();
          this._saveRandomStimSet(myCreator, isTheLast);
        }
      },

      deleteStimsSetsandStims: function deleteStimsSetsandStims() {
        this._destroyAll(this.get('stimuli'));
        this._destroyAll(this.get('stimsets'));

        // Data down via seeder-block to fader-label that we ready to show the label
        this.set('stimDelDone', true);
      }
    },

    // Private methods

    _saveRandomCreator: function _saveRandomCreator(isLast) {
      var _this = this;

      var randomCreator = this.store.createRecord('creator').randomize();

      randomCreator.save().then(function () {
        if (isLast) {

          // Data down via seeder-block to fader-label that we ready to show the label
          _this.set('creDone', true);
        }
      });
    },

    _selectRandomCreator: function _selectRandomCreator() {
      var creators = this.get('creators');
      var creatorCounter = creators.get('length');

      // Create a new array from ids
      var creatorIds = creators.map(function (cre) {
        return cre.get('id');
      });

      // Randomly pick one id from the libraryIds array and return the library
      var randomNumber = _faker['default'].random.number(creatorCounter - 1);
      var randomCreator = creators.findBy('id', creatorIds[randomNumber]);

      return randomCreator;
    },

    _saveRandomStimSet: function _saveRandomStimSet(creator, isLast) {
      var _this2 = this;

      var newStimSet = this.store.createRecord('stimset').randomize(creator);
      this._generateSomeStimuli(newStimSet);
      newStimSet.save().then(function () {
        if (isLast) {

          // Data down via seeder-block to fader-label that we ready to show the label
          _this2.set('authDone', true);
        }
      });
      return newStimSet;
    },

    _generateSomeStimuli: function _generateSomeStimuli(stimset) {
      var stimCounter = _faker['default'].random.number(10);

      for (var j = 0; j < stimCounter; j++) {
        this.store.createRecord('stimulus').randomize(stimset).save();
      }
    },

    _destroyAll: function _destroyAll(records) {
      records.forEach(function (item) {
        return item.destroyRecord();
      });
    }

  });
});
// app/controllers/admin/seeder.js
define('stimdb1/controllers/contact', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({

    emailAddress: '',
    message: '',
    responseMessage: '',

    isValidEmail: _ember['default'].computed.match('emailAddress', /^.+@.+\..+$/),
    isValidMessage: _ember['default'].computed.notEmpty('message'),
    isValid: _ember['default'].computed.and('isValidEmail', 'isValidMessage'),
    isDisabled: _ember['default'].computed.not('isValid'),

    actions: {

      saveMessage: function saveMessage() {
        var _this = this;

        var email = this.get('emailAddress');
        var msg = this.get('message');
        console.log(msg);

        var newMessage = this.store.createRecord('message', {
          email: email,
          messagetxt: msg
        });

        newMessage.save().then(function (response) {
          _this.set('responseMessage', 'Thank you! Your message has been sent and your email saved: ' + _this.get('emailAddress'));
          _this.set('emailAddress', '');
          _this.set('message', '');
        });
      }
    }

  });
});
define('stimdb1/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('stimdb1/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('stimdb1/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'stimdb1/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _stimdb1ConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_stimdb1ConfigEnvironment['default'].APP.name, _stimdb1ConfigEnvironment['default'].APP.version)
  };
});
define('stimdb1/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('stimdb1/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('stimdb1/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.Controller.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('stimdb1/initializers/ember-faker', ['exports'], function (exports) {
  exports.initialize = initialize;

  function initialize() /* container, application */{
    // application.inject('route', 'foo', 'service:foo');
  }

  ;

  exports['default'] = {
    name: 'ember-faker',
    initialize: initialize
  };
});
define('stimdb1/initializers/emberfire', ['exports', 'emberfire/initializers/emberfire'], function (exports, _emberfireInitializersEmberfire) {
  exports['default'] = _emberfireInitializersEmberfire['default'];
});
define('stimdb1/initializers/export-application-global', ['exports', 'ember', 'stimdb1/config/environment'], function (exports, _ember, _stimdb1ConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_stimdb1ConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _stimdb1ConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_stimdb1ConfigEnvironment['default'].modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('stimdb1/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('stimdb1/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: _ember['default'].K
  };
});
define('stimdb1/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define("stimdb1/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('stimdb1/models/creator', ['exports', 'ember-data', 'ember', 'faker'], function (exports, _emberData, _ember, _faker) {
  exports['default'] = _emberData['default'].Model.extend({
    name: _emberData['default'].attr('string'),
    emailaddress: _emberData['default'].attr('string'),
    website: _emberData['default'].attr('string'),
    creatorSource: _emberData['default'].attr('string'), //record whether this is a fake thing!

    stimsets: _emberData['default'].hasMany('stimset', { inverse: 'creator', async: true }),

    isValidName: _ember['default'].computed.notEmpty('name'),
    isValidEmail: _ember['default'].computed.match('emailaddress', /^.+@.+\..+$/),
    isValidWebsite: _ember['default'].computed.match('website', /^.+/), //To add: website validataion + glyphicon
    isValidContact: _ember['default'].computed.and('isValidEmail', 'isValidName', 'isValidWebsite'),

    randomize: function randomize() {
      //if this gets called on a creator instance, all values replaced with fake data!
      this.set('name', _faker['default'].name.firstName() + ' ' + _faker['default'].name.lastName());
      this.set('emailaddress', _faker['default'].internet.exampleEmail());
      this.set('website', _faker['default'].internet.url());
      this.set('creatorSource', 'faker generated');

      return this; //not sure why needed yet
    }
  });
});
define('stimdb1/models/message', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    email: _emberData['default'].attr('string'),
    messagetxt: _emberData['default'].attr('string')
  });
});
define('stimdb1/models/stimset', ['exports', 'ember-data', 'faker'], function (exports, _emberData, _faker) {
  exports['default'] = _emberData['default'].Model.extend({

    setname: _emberData['default'].attr('string'),
    citation: _emberData['default'].attr('string'), //text version
    doi: _emberData['default'].attr('string'), //doi link
    setSource: _emberData['default'].attr('string'), //record whether this is a fake thing!

    creator: _emberData['default'].belongsTo('creator'),
    //stims: DS.hasMany('stimulus'),

    randomize: function randomize(creator) {
      //specify who made this stim set
      var whichSet = _faker['default'].hacker.adjective() + ' ' + _faker['default'].hacker.adjective() + ' Stimuli';
      this.set('setname', whichSet);
      this.set('citation', creator.name + ' et al.(' + _faker['default'].random.number(1975, 2015) + ') A paper about ' + whichSet);
      this.set('doi', 'http://DOI.' + _faker['default'].internet.ip());
      this.set('creator', creator);
      this.set('setSource', 'faker generated');

      return this; //not sure why needed yet
    }

  });
});
define('stimdb1/models/stimulus', ['exports', 'ember-data', 'faker'], function (exports, _emberData, _faker) {
  exports['default'] = _emberData['default'].Model.extend({
    stimname: _emberData['default'].attr('string'),
    mediaFilename: _emberData['default'].attr('string'),
    stimSource: _emberData['default'].attr('string'), //record whether this is a fake thing!

    stimset: _emberData['default'].belongsTo('stimset'),

    randomize: function randomize(stimset) {
      //Pass in which stimset this is being added to...
      var whichStim = _faker['default'].hacker.adjective() + _faker['default'].hacker.noun();
      this.set('stimname', whichStim);
      this.set('mediaFilename', whichStim + '.' + _faker['default'].system.commonFileExt());
      this.set('stimset', stimset);
      this.set('stimSource', 'faker generated');

      return this; //not sure why needed yet
    }

  });
});
define('stimdb1/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('stimdb1/router', ['exports', 'ember', 'stimdb1/config/environment'], function (exports, _ember, _stimdb1ConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _stimdb1ConfigEnvironment['default'].locationType,
    rootURL: _stimdb1ConfigEnvironment['default'].rootURL
  });

  Router.map(function () {
    this.route('about');
    this.route('contact');

    this.route('admin', function () {
      this.route('messages');
      this.route('seeder');
    });

    this.route('creators', function () {
      this.route('new');
      this.route('listall');
      this.route('edit', { path: '/:creator_id/edit' });
    });

    this.route('stimsets', function () {
      this.route('new');
      this.route('listall');
      this.route('search');
    });
  });

  exports['default'] = Router;
});
define('stimdb1/routes/about', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('stimdb1/routes/admin/messages', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    model: function model() {
      return this.store.findAll('message');
    }

  });
});
// app/routes/admin/invitations.js
define('stimdb1/routes/admin/seeder', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    //use the below model () and setupController to bring multiple models on a route

    model: function model() {
      return _ember['default'].RSVP.hash({
        creators: this.store.findAll('creator'),
        stimsets: this.store.findAll('stimset'),
        stimuli: this.store.findAll('stimulus')
      });
    },

    setupController: function setupController(controller, model) {
      controller.set('creators', model.creators);
      controller.set('stimsets', model.stimsets);
      controller.set('stimuli', model.stimuli);
    }

  });
});
define('stimdb1/routes/contact', ['exports', 'ember'], function (exports, _ember) {
	exports['default'] = _ember['default'].Route.extend({});
});
define('stimdb1/routes/creators/edit', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    model: function model(params) {
      return this.store.findRecord('creator', params.creator_id);
    },

    setupController: function setupController(controller, model) {
      this._super(controller, model);

      controller.set('title', 'Edit an existing creator');
      controller.set('buttonLabel', 'Edit creator');
    },

    renderTemplate: function renderTemplate() {
      this.render('creators/form');
    },

    actions: {

      saveCreator: function saveCreator(newCreator) {
        var _this = this;

        newCreator.save().then(function () {
          return _this.transitionTo('creators');
        });
      },

      willTransition: function willTransition(transition) {

        var model = this.controller.get('model');

        if (model.get('hasDirtyAttributes')) {
          var confirmation = confirm("Your changes haven't saved yet. Would you like to leave this form?");

          if (confirmation) {
            model.rollbackAttributes();
          } else {
            transition.abort();
          }
        }
      }
    }
  });
});
//app/routes/creators/edit.js
define('stimdb1/routes/creators/listall', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    model: function model() {
      return this.store.findAll('creator');
    },

    actions: {

      deleteCreator: function deleteCreator(creator) {
        var confirmation = confirm('Are you sure?');

        if (confirmation) {
          creator.destroyRecord();
        }
      }
    }

  });
});
// app/routes/creators/listall.js
define('stimdb1/routes/creators/new', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    model: function model() {
      return this.store.createRecord('creator');
    },

    setupController: function setupController(controller, model) {
      this._super(controller, model);

      controller.set('title', 'Add a new stimulus set Creator');
      controller.set('buttonLabel', 'New creator');
    },

    renderTemplate: function renderTemplate() {
      this.render('creators/form');
    },

    actions: {

      saveCreator: function saveCreator(newCreator) {
        var _this = this;

        newCreator.save().then(function () {
          return _this.transitionTo('creators.listall');
        });
      },

      willTransition: function willTransition() {
        // rollbackAttributes() removes the record from the store
        // if the model 'isNew'
        this.controller.get('model').rollbackAttributes();
      }
    }
  });
});
// app/routes/libraries/new.js
define('stimdb1/routes/stimsets/new', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('stimdb1/routes/stimsets/search', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('stimdb1/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define('stimdb1/services/firebase-app', ['exports', 'emberfire/services/firebase-app'], function (exports, _emberfireServicesFirebaseApp) {
  exports['default'] = _emberfireServicesFirebaseApp['default'];
});
define('stimdb1/services/firebase', ['exports', 'emberfire/services/firebase'], function (exports, _emberfireServicesFirebase) {
  exports['default'] = _emberfireServicesFirebase['default'];
});
define("stimdb1/templates/about", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 37,
            "column": 9
          }
        },
        "moduleName": "stimdb1/templates/about.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("About");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("This is going to be a searchable database of psychological stimuli. You contribute to it by making a public repository on OSF and including a component which contains individual [stim file, info file] pairs plus a master info file with information about the set. If you put them in the right format (and mark them with a special tag?) then this website should find/load them. ");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("h5");
        var el2 = dom.createTextNode("Community norms! ");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("Everything is public/cc licensed, and every stimulus has a citation; if you use this database, you cite this database + the stimuli.");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("h5");
        var el2 = dom.createTextNode("Point/benefit of db");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("A taxonomy of stimuli, organized both by content and by research purpose (e.g.: Pictures of faces; stimuli appropriate for toddlers; stimuli created for social experiments). The ability to search & generate metadata for these stimuli (the spreadsheets you get out of either end); ongoing creation/curation of stimulus types.");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("h5");
        var el2 = dom.createTextNode("Desiderata ");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("Things that should be very easy for users of stimuli to do:");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n    ");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("ul");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("Find and browse stimulus sets in the database");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("Search for stimuli across or within sets, including both easily discovering common fields and unstructured searching. This needs to be more than a searchbox, but not sure how much more.");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("Download stimuli with their information - eventually including something more user-friendly than a pile of json files!");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("Things that should be pretty easy for contributors of stimuli to do:");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n	");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("ul");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("Decide what kind/type their stimset is and find out what tagging is required by the schema");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("Provide the tagging info in spreadsheet form, and get back the corresponding json files (Something like how the simple mturk online interface will download you a csv with the necessary columns for the variables you used");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("Send you to OSF to upload those files");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("Other neat things");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n    ");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("ul");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("If you have new info on a stim set (e.g. new norming!), you should be able to associate it with that set (Model: \"These info files in Reseacher2's component refer to stim set/items on Researcher1's component).");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("As with stim sets themselves, norming data like this should be linked/cited to their creator");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("Eventually: Derivative stimuli/modifications to someone else's stim (Maybe we just let people document this naturalistically...");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() {
        return [];
      },
      statements: [],
      locals: [],
      templates: []
    };
  })());
});
define("stimdb1/templates/admin/messages", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.2",
          "loc": {
            "source": null,
            "start": {
              "line": 14,
              "column": 2
            },
            "end": {
              "line": 20,
              "column": 2
            }
          },
          "moduleName": "stimdb1/templates/admin/messages.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createElement("p");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
          morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]), 0, 0);
          morphs[2] = dom.createMorphAt(dom.childAt(element0, [5, 0]), 0, 0);
          return morphs;
        },
        statements: [["content", "message.id", ["loc", [null, [16, 10], [16, 24]]], 0, 0, 0, 0], ["content", "message.email", ["loc", [null, [17, 10], [17, 27]]], 0, 0, 0, 0], ["content", "message.messagetxt", ["loc", [null, [18, 13], [18, 35]]], 0, 0, 0, 0]],
        locals: ["message"],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 23,
            "column": 0
          }
        },
        "moduleName": "stimdb1/templates/admin/messages.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment(" app/templates/admin/messages.hbs ");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("Messages sent to stimdb1");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("table");
        dom.setAttribute(el1, "class", "table table-bordered table-striped table-responsive");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("thead");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("ID");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("E-mail");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Message");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tbody");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [4, 3]), 1, 1);
        return morphs;
      },
      statements: [["block", "each", [["get", "model", ["loc", [null, [14, 10], [14, 15]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [14, 2], [20, 11]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("stimdb1/templates/admin/seeder", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 26,
            "column": 0
          }
        },
        "moduleName": "stimdb1/templates/admin/seeder.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment(" app/templates/admin/seeder.hbs ");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("Database Seeder");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("This is a place to summarize the dataset so far. Right now it doesn't distinguish\n counts of 'real' and fakedata entries that just exist to test database relations.");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "row");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "col-md-4");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "col-md-4");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "col-md-4");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [6]);
        var morphs = new Array(5);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
        morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]), 0, 0);
        morphs[2] = dom.createMorphAt(dom.childAt(element0, [5]), 0, 0);
        morphs[3] = dom.createMorphAt(fragment, 8, 8, contextualElement);
        morphs[4] = dom.createMorphAt(fragment, 10, 10, contextualElement);
        return morphs;
      },
      statements: [["inline", "number-box", [], ["title", "Creators", "number", ["subexpr", "@mut", [["get", "creators.length", ["loc", [null, [8, 61], [8, 76]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [8, 24], [8, 78]]], 0, 0], ["inline", "number-box", [], ["title", "Stimulus Sets", "number", ["subexpr", "@mut", [["get", "stimsets.length", ["loc", [null, [9, 66], [9, 81]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [9, 24], [9, 83]]], 0, 0], ["inline", "number-box", [], ["title", "Stimuli", "number", ["subexpr", "@mut", [["get", "stimuli.length", ["loc", [null, [10, 60], [10, 74]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [10, 24], [10, 76]]], 0, 0], ["inline", "seeder-block", [], ["sectionTitle", "Creators", "generateAction", "generateCreators", "deleteAction", "deleteCreators", "createReady", ["subexpr", "@mut", [["get", "creDone", ["loc", [null, [17, 16], [17, 23]]], 0, 0, 0, 0]], [], [], 0, 0], "deleteReady", ["subexpr", "@mut", [["get", "creDelDone", ["loc", [null, [18, 16], [18, 26]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [13, 0], [18, 28]]], 0, 0], ["inline", "seeder-block", [], ["sectionTitle", "Stimsets", "generateAction", "generateStimSetsandStim", "deleteAction", "deleteStimSetsandStim", "createReady", ["subexpr", "@mut", [["get", "stimDone", ["loc", [null, [24, 16], [24, 24]]], 0, 0, 0, 0]], [], [], 0, 0], "deleteReady", ["subexpr", "@mut", [["get", "stimDelDone", ["loc", [null, [25, 16], [25, 27]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [20, 0], [25, 29]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("stimdb1/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 6
          }
        },
        "moduleName": "stimdb1/templates/application.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(element0, 1, 1);
        morphs[1] = dom.createMorphAt(element0, 3, 3);
        return morphs;
      },
      statements: [["inline", "partial", ["navbar"], [], ["loc", [null, [2, 2], [2, 22]]], 0, 0], ["content", "outlet", ["loc", [null, [3, 2], [3, 12]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("stimdb1/templates/components/creator-item-form", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.2",
          "loc": {
            "source": null,
            "start": {
              "line": 6,
              "column": 10
            },
            "end": {
              "line": 6,
              "column": 100
            }
          },
          "moduleName": "stimdb1/templates/components/creator-item-form.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("span");
          dom.setAttribute(el1, "class", "glyphicon glyphicon-ok form-control-feedback");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.2",
          "loc": {
            "source": null,
            "start": {
              "line": 13,
              "column": 10
            },
            "end": {
              "line": 13,
              "column": 101
            }
          },
          "moduleName": "stimdb1/templates/components/creator-item-form.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("span");
          dom.setAttribute(el1, "class", "glyphicon glyphicon-ok form-control-feedback");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 28,
            "column": 0
          }
        },
        "moduleName": "stimdb1/templates/components/creator-item-form.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "form-horizontal");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3, "class", "col-sm-2 control-label");
        var el4 = dom.createTextNode("Name*");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-sm-10");
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3, "class", "col-sm-2 control-label");
        var el4 = dom.createTextNode("Email*");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-sm-10");
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "form-group");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3, "class", "col-sm-2 control-label");
        var el4 = dom.createTextNode("Website");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-sm-10");
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "form-group");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-sm-offset-2 col-sm-10");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4, "type", "submit");
        dom.setAttribute(el4, "class", "btn btn-default");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element1, [3]);
        var element3 = dom.childAt(element0, [3]);
        var element4 = dom.childAt(element3, [3]);
        var element5 = dom.childAt(element0, [7, 1, 1]);
        var morphs = new Array(10);
        morphs[0] = dom.createAttrMorph(element1, 'class');
        morphs[1] = dom.createMorphAt(element2, 1, 1);
        morphs[2] = dom.createMorphAt(element2, 3, 3);
        morphs[3] = dom.createAttrMorph(element3, 'class');
        morphs[4] = dom.createMorphAt(element4, 1, 1);
        morphs[5] = dom.createMorphAt(element4, 3, 3);
        morphs[6] = dom.createMorphAt(dom.childAt(element0, [5, 3]), 1, 1);
        morphs[7] = dom.createAttrMorph(element5, 'disabled');
        morphs[8] = dom.createElementMorph(element5);
        morphs[9] = dom.createMorphAt(element5, 0, 0);
        return morphs;
      },
      statements: [["attribute", "class", ["concat", ["form-group has-feedback ", ["subexpr", "if", [["get", "item.isValidName", ["loc", [null, [2, 45], [2, 61]]], 0, 0, 0, 0], "has-success"], [], ["loc", [null, [2, 40], [2, 77]]], 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["inline", "input", [], ["type", "text", "value", ["subexpr", "@mut", [["get", "item.name", ["loc", [null, [5, 36], [5, 45]]], 0, 0, 0, 0]], [], [], 0, 0], "class", "form-control", "placeholder", "The person's name"], ["loc", [null, [5, 10], [5, 100]]], 0, 0], ["block", "if", [["get", "item.isValidName", ["loc", [null, [6, 16], [6, 32]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [6, 10], [6, 107]]]], ["attribute", "class", ["concat", ["form-group has-feedback ", ["subexpr", "if", [["get", "item.isValidEmail", ["loc", [null, [9, 45], [9, 62]]], 0, 0, 0, 0], "has-success"], [], ["loc", [null, [9, 40], [9, 78]]], 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["inline", "input", [], ["type", "text", "value", ["subexpr", "@mut", [["get", "item.emailaddress", ["loc", [null, [12, 36], [12, 53]]], 0, 0, 0, 0]], [], [], 0, 0], "class", "form-control", "placeholder", "The person's email address"], ["loc", [null, [12, 10], [12, 117]]], 0, 0], ["block", "if", [["get", "item.isValidEmail", ["loc", [null, [13, 16], [13, 33]]], 0, 0, 0, 0]], [], 1, null, ["loc", [null, [13, 10], [13, 108]]]], ["inline", "input", [], ["type", "text", "value", ["subexpr", "@mut", [["get", "item.website", ["loc", [null, [19, 36], [19, 48]]], 0, 0, 0, 0]], [], [], 0, 0], "class", "form-control", "placeholder", "The person's website"], ["loc", [null, [19, 10], [19, 106]]], 0, 0], ["attribute", "disabled", ["subexpr", "unless", [["get", "item.isValidContact", ["loc", [null, [24, 108], [24, 127]]], 0, 0, 0, 0], true], [], ["loc", [null, [null, null], [24, 134]]], 0, 0], 0, 0, 0, 0], ["element", "action", ["buttonClicked", ["get", "item", ["loc", [null, [24, 83], [24, 87]]], 0, 0, 0, 0]], [], ["loc", [null, [24, 58], [24, 89]]], 0, 0], ["content", "buttonLabel", ["loc", [null, [24, 135], [24, 150]]], 0, 0, 0, 0]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("stimdb1/templates/components/creator-item", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 19,
            "column": 0
          }
        },
        "moduleName": "stimdb1/templates/components/creator-item.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "panel panel-default creator-item");
        var el2 = dom.createTextNode("\n\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "panel-heading");
        var el3 = dom.createTextNode("\n	  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3, "class", "panel-title");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "panel-body");
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("Email Address: ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("Website: ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("Source: ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "panel-footer text-right");
        var el3 = dom.createTextNode("\n		");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n	");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [3]);
        var element2 = dom.childAt(element1, [3, 1]);
        var morphs = new Array(6);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1, 1]), 0, 0);
        morphs[1] = dom.createMorphAt(dom.childAt(element1, [1]), 1, 1);
        morphs[2] = dom.createAttrMorph(element2, 'href');
        morphs[3] = dom.createMorphAt(element2, 0, 0);
        morphs[4] = dom.createMorphAt(dom.childAt(element1, [5]), 1, 1);
        morphs[5] = dom.createMorphAt(dom.childAt(element0, [5]), 1, 1);
        return morphs;
      },
      statements: [["content", "item.name", ["loc", [null, [4, 27], [4, 40]]], 0, 0, 0, 0], ["content", "item.emailaddress", ["loc", [null, [8, 20], [8, 41]]], 0, 0, 0, 0], ["attribute", "href", ["get", "item.website", ["loc", [null, [9, 24], [9, 36]]], 0, 0, 0, 0], 0, 0, 0, 0], ["content", "item.website", ["loc", [null, [9, 39], [9, 55]]], 0, 0, 0, 0], ["content", "item.creatorSource", ["loc", [null, [10, 13], [10, 35]]], 0, 0, 0, 0], ["content", "yield", ["loc", [null, [14, 2], [14, 11]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("stimdb1/templates/components/fader-label", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "stimdb1/templates/components/fader-label.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["content", "yield", ["loc", [null, [1, 0], [1, 9]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("stimdb1/templates/components/number-box", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 6,
            "column": 0
          }
        },
        "moduleName": "stimdb1/templates/components/number-box.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment(" app/templates/components/number-box.hbs ");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "panel-heading");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h3");
        dom.setAttribute(el2, "class", "text-center");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h1");
        dom.setAttribute(el2, "class", "text-center");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [2]);
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
        morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]), 0, 0);
        return morphs;
      },
      statements: [["content", "title", ["loc", [null, [3, 26], [3, 35]]], 0, 0, 0, 0], ["inline", "if", [["get", "number", ["loc", [null, [4, 31], [4, 37]]], 0, 0, 0, 0], ["get", "number", ["loc", [null, [4, 38], [4, 44]]], 0, 0, 0, 0], "..."], [], ["loc", [null, [4, 26], [4, 52]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("stimdb1/templates/components/seeder-block", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.2",
          "loc": {
            "source": null,
            "start": {
              "line": 14,
              "column": 4
            },
            "end": {
              "line": 14,
              "column": 50
            }
          },
          "moduleName": "stimdb1/templates/components/seeder-block.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Created!");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.2",
          "loc": {
            "source": null,
            "start": {
              "line": 17,
              "column": 4
            },
            "end": {
              "line": 17,
              "column": 50
            }
          },
          "moduleName": "stimdb1/templates/components/seeder-block.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Deleted!");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 20,
            "column": 6
          }
        },
        "moduleName": "stimdb1/templates/components/seeder-block.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment(" app/templates/components/seeder-block.hbs ");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "well well-sm extra-padding-bottom");
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h3");
        var el3 = dom.createTextNode("Generate fake ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "form-inline");
        var el3 = dom.createTextNode("\n  \n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("label");
        dom.setAttribute(el4, "class", "control-label");
        var el5 = dom.createTextNode("Number of new records:");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    \n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("button");
        dom.setAttribute(el3, "class", "btn btn-primary");
        var el4 = dom.createTextNode("Generate ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    \n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("button");
        dom.setAttribute(el3, "class", "btn btn-danger");
        var el4 = dom.createTextNode("Delete All ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  \n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [2]);
        var element1 = dom.childAt(element0, [3]);
        var element2 = dom.childAt(element1, [1]);
        var element3 = dom.childAt(element1, [3]);
        var element4 = dom.childAt(element1, [7]);
        var morphs = new Array(10);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 1, 1);
        morphs[1] = dom.createAttrMorph(element2, 'class');
        morphs[2] = dom.createMorphAt(element2, 3, 3);
        morphs[3] = dom.createAttrMorph(element3, 'disabled');
        morphs[4] = dom.createElementMorph(element3);
        morphs[5] = dom.createMorphAt(element3, 1, 1);
        morphs[6] = dom.createMorphAt(element1, 5, 5);
        morphs[7] = dom.createElementMorph(element4);
        morphs[8] = dom.createMorphAt(element4, 1, 1);
        morphs[9] = dom.createMorphAt(element1, 9, 9);
        return morphs;
      },
      statements: [["content", "sectionTitle", ["loc", [null, [4, 20], [4, 36]]], 0, 0, 0, 0], ["attribute", "class", ["concat", ["form-group has-feedback ", ["subexpr", "unless", [["get", "isCounterValid", ["loc", [null, [8, 49], [8, 63]]], 0, 0, 0, 0], "has-error"], [], ["loc", [null, [8, 40], [8, 77]]], 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["inline", "input", [], ["value", ["subexpr", "@mut", [["get", "counter", ["loc", [null, [10, 20], [10, 27]]], 0, 0, 0, 0]], [], [], 0, 0], "class", "form-control", "placeholder", ["subexpr", "@mut", [["get", "placeholder", ["loc", [null, [10, 61], [10, 72]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [10, 6], [10, 74]]], 0, 0], ["attribute", "disabled", ["subexpr", "if", [["get", "isCounterValid", ["loc", [null, [13, 78], [13, 92]]], 0, 0, 0, 0], false, true], [], ["loc", [null, [null, null], [13, 105]]], 0, 0], 0, 0, 0, 0], ["element", "action", ["generateAction"], [], ["loc", [null, [13, 36], [13, 63]]], 0, 0], ["content", "sectionTitle", ["loc", [null, [13, 115], [13, 131]]], 0, 0, 0, 0], ["block", "fader-label", [], ["isShowing", ["subexpr", "@mut", [["get", "createReady", ["loc", [null, [14, 29], [14, 40]]], 0, 0, 0, 0]], [], [], 0, 0]], 0, null, ["loc", [null, [14, 4], [14, 66]]]], ["element", "action", ["deleteAction"], [], ["loc", [null, [16, 35], [16, 60]]], 0, 0], ["content", "sectionTitle", ["loc", [null, [16, 72], [16, 88]]], 0, 0, 0, 0], ["block", "fader-label", [], ["isShowing", ["subexpr", "@mut", [["get", "deleteReady", ["loc", [null, [17, 29], [17, 40]]], 0, 0, 0, 0]], [], [], 0, 0]], 1, null, ["loc", [null, [17, 4], [17, 66]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("stimdb1/templates/contact", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.2",
          "loc": {
            "source": null,
            "start": {
              "line": 32,
              "column": 2
            },
            "end": {
              "line": 34,
              "column": 3
            }
          },
          "moduleName": "stimdb1/templates/contact.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("     ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "alert alert-success");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 0, 0);
          return morphs;
        },
        statements: [["content", "responseMessage", ["loc", [null, [33, 38], [33, 57]]], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 38,
            "column": 0
          }
        },
        "moduleName": "stimdb1/templates/contact.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("Thank you for checking out the NAMEOFDATABASE! This is a mockup of the stimulus database; it's designed to have a relatively small number of stimulus sets and creators in order to test out feature implementation. Currently it's the only instantiation of the database.");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("The plan for the project is to focus initially on event stimuli, and then branch out to other classes. We're not yet ready to upload new sets, but we are very interested in hearing from you if you are interested in contributing stimuli! If you are interested or have any other questions about the project, please send a message below. Your email will be added to a list to be contacted about updates!");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h3");
        var el3 = dom.createTextNode("Contact form");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("br");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("br");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "form-horizontal form-group form-group-lg row");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-1 col-md-5 col-md-offset-2");
        var el4 = dom.createTextNode("\n\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("br");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      \n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        var el5 = dom.createTextNode("If your stimuli are currently available online, feel free to send us a link to the materials!");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("br");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4, "class", "btn btn-primary btn-lg btn-block");
        var el5 = dom.createTextNode("Send message");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-xs-10 col-xs-offset-1 col-sm-offset-0 col-sm-4 col-md-3");
        var el4 = dom.createTextNode("\n\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("  \n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("br");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("br");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [4]);
        var element1 = dom.childAt(element0, [6, 1]);
        var element2 = dom.childAt(element1, [11]);
        var morphs = new Array(5);
        morphs[0] = dom.createMorphAt(element1, 1, 1);
        morphs[1] = dom.createMorphAt(element1, 3, 3);
        morphs[2] = dom.createAttrMorph(element2, 'disabled');
        morphs[3] = dom.createElementMorph(element2);
        morphs[4] = dom.createMorphAt(element0, 8, 8);
        return morphs;
      },
      statements: [["inline", "input", [], ["type", "email", "value", ["subexpr", "@mut", [["get", "emailAddress", ["loc", [null, [14, 33], [14, 45]]], 0, 0, 0, 0]], [], [], 0, 0], "class", "form-control", "placeholder", "Please type your e-mail address.", "autofocus", "autofocus"], ["loc", [null, [14, 6], [14, 137]]], 0, 0], ["inline", "textarea", [], ["value", ["subexpr", "@mut", [["get", "message", ["loc", [null, [16, 23], [16, 30]]], 0, 0, 0, 0]], [], [], 0, 0], "class", "form-control", "placeholder", "Please type your message.", "autofocus", "autofocus", "rows", "5"], ["loc", [null, [16, 6], [16, 124]]], 0, 0], ["attribute", "disabled", ["get", "isDisabled", ["loc", [null, [24, 25], [24, 35]]], 0, 0, 0, 0], 0, 0, 0, 0], ["element", "action", ["saveMessage"], [], ["loc", [null, [24, 79], [24, 103]]], 0, 0], ["block", "if", [["get", "responseMessage", ["loc", [null, [32, 8], [32, 23]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [32, 2], [34, 10]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("stimdb1/templates/creators", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.2",
          "loc": {
            "source": null,
            "start": {
              "line": 9,
              "column": 4
            },
            "end": {
              "line": 9,
              "column": 71
            }
          },
          "moduleName": "stimdb1/templates/creators.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("a");
          dom.setAttribute(el1, "href", "");
          var el2 = dom.createTextNode("List all");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.2",
          "loc": {
            "source": null,
            "start": {
              "line": 10,
              "column": 4
            },
            "end": {
              "line": 10,
              "column": 66
            }
          },
          "moduleName": "stimdb1/templates/creators.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("a");
          dom.setAttribute(el1, "href", "");
          var el2 = dom.createTextNode("Add new");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 14,
            "column": 10
          }
        },
        "moduleName": "stimdb1/templates/creators.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment(" app/templates/creators.hbs ");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("People");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode(" For now this will just be a list of stimulus-set creators we are putting in the mockup. ");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "well");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("ul");
        dom.setAttribute(el2, "class", "nav nav-pills");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [6, 1]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(element0, 1, 1);
        morphs[1] = dom.createMorphAt(element0, 3, 3);
        morphs[2] = dom.createMorphAt(fragment, 8, 8, contextualElement);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "link-to", ["creators.listall"], ["tagName", "li"], 0, null, ["loc", [null, [9, 4], [9, 83]]]], ["block", "link-to", ["creators.new"], ["tagName", "li"], 1, null, ["loc", [null, [10, 4], [10, 78]]]], ["content", "outlet", ["loc", [null, [14, 0], [14, 10]]], 0, 0, 0, 0]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("stimdb1/templates/creators/form", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.2",
          "loc": {
            "source": null,
            "start": {
              "line": 11,
              "column": 4
            },
            "end": {
              "line": 13,
              "column": 4
            }
          },
          "moduleName": "stimdb1/templates/creators/form.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("br");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 16,
            "column": 6
          }
        },
        "moduleName": "stimdb1/templates/creators/form.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment(" /app/templates/creators/form.hbs ");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("h2");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "row");
        var el2 = dom.createTextNode("\n  \n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "col-md-6");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  \n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "col-md-4");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [4]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [2]), 0, 0);
        morphs[1] = dom.createMorphAt(dom.childAt(element0, [1]), 1, 1);
        morphs[2] = dom.createMorphAt(dom.childAt(element0, [3]), 1, 1);
        return morphs;
      },
      statements: [["content", "title", ["loc", [null, [2, 4], [2, 13]]], 0, 0, 0, 0], ["inline", "creator-item-form", [], ["item", ["subexpr", "@mut", [["get", "model", ["loc", [null, [7, 29], [7, 34]]], 0, 0, 0, 0]], [], [], 0, 0], "buttonLabel", ["subexpr", "@mut", [["get", "buttonLabel", ["loc", [null, [7, 47], [7, 58]]], 0, 0, 0, 0]], [], [], 0, 0], "action", "saveCreator"], ["loc", [null, [7, 4], [7, 81]]], 0, 0], ["block", "creator-item", [], ["item", ["subexpr", "@mut", [["get", "model", ["loc", [null, [11, 25], [11, 30]]], 0, 0, 0, 0]], [], [], 0, 0]], 0, null, ["loc", [null, [11, 4], [13, 21]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("stimdb1/templates/creators/listall", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        var child0 = (function () {
          return {
            meta: {
              "revision": "Ember@2.8.2",
              "loc": {
                "source": null,
                "start": {
                  "line": 10,
                  "column": 8
                },
                "end": {
                  "line": 10,
                  "column": 82
                }
              },
              "moduleName": "stimdb1/templates/creators/listall.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("Edit");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes() {
              return [];
            },
            statements: [],
            locals: [],
            templates: []
          };
        })();
        return {
          meta: {
            "revision": "Ember@2.8.2",
            "loc": {
              "source": null,
              "start": {
                "line": 8,
                "column": 6
              },
              "end": {
                "line": 14,
                "column": 6
              }
            },
            "moduleName": "stimdb1/templates/creators/listall.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("\n        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("button");
            dom.setAttribute(el1, "class", "btn btn-danger btn-xs");
            var el2 = dom.createTextNode("Delete");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [3]);
            var morphs = new Array(2);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            morphs[1] = dom.createElementMorph(element0);
            return morphs;
          },
          statements: [["block", "link-to", ["creators.edit", ["get", "creator.id", ["loc", [null, [10, 35], [10, 45]]], 0, 0, 0, 0]], ["class", "btn btn-success btn-xs"], 0, null, ["loc", [null, [10, 8], [10, 94]]]], ["element", "action", ["deleteCreator", ["get", "creator", ["loc", [null, [12, 71], [12, 78]]], 0, 0, 0, 0]], [], ["loc", [null, [12, 46], [12, 80]]], 0, 0]],
          locals: [],
          templates: [child0]
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.8.2",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 2
            },
            "end": {
              "line": 18,
              "column": 0
            }
          },
          "moduleName": "stimdb1/templates/creators/listall.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "col-md-4");
          var el2 = dom.createTextNode("\n\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 1, 1);
          return morphs;
        },
        statements: [["block", "creator-item", [], ["item", ["subexpr", "@mut", [["get", "creator", ["loc", [null, [8, 27], [8, 34]]], 0, 0, 0, 0]], [], [], 0, 0]], 0, null, ["loc", [null, [8, 6], [14, 23]]]]],
        locals: ["creator"],
        templates: [child0]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 21,
            "column": 0
          }
        },
        "moduleName": "stimdb1/templates/creators/listall.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment(" app/templates/creators/listall.hbs ");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "row");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [2]), 1, 1);
        return morphs;
      },
      statements: [["block", "each", [["get", "model", ["loc", [null, [5, 10], [5, 15]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [5, 2], [18, 9]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("stimdb1/templates/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 12,
            "column": 5
          }
        },
        "moduleName": "stimdb1/templates/index.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("Front page");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\nStimdb needs a real name. Miraculously there is a navbar now. \n\nTo implement:\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("ul");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("Login/admin access of some kind (??User authentification????)");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("Sample sets");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode("(Everything)");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode(" paragraph formatting in css");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createTextNode(" Refactor the contact form into the contact model!");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() {
        return [];
      },
      statements: [],
      locals: [],
      templates: []
    };
  })());
});
define("stimdb1/templates/navbar", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.2",
          "loc": {
            "source": null,
            "start": {
              "line": 10,
              "column": 6
            },
            "end": {
              "line": 10,
              "column": 64
            }
          },
          "moduleName": "stimdb1/templates/navbar.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Stimulus Database");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.2",
          "loc": {
            "source": null,
            "start": {
              "line": 15,
              "column": 8
            },
            "end": {
              "line": 15,
              "column": 60
            }
          },
          "moduleName": "stimdb1/templates/navbar.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("a");
          dom.setAttribute(el1, "href", "");
          var el2 = dom.createTextNode("Home");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child2 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.2",
          "loc": {
            "source": null,
            "start": {
              "line": 16,
              "column": 8
            },
            "end": {
              "line": 16,
              "column": 61
            }
          },
          "moduleName": "stimdb1/templates/navbar.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("a");
          dom.setAttribute(el1, "href", "");
          var el2 = dom.createTextNode("About");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child3 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.2",
          "loc": {
            "source": null,
            "start": {
              "line": 17,
              "column": 8
            },
            "end": {
              "line": 17,
              "column": 72
            }
          },
          "moduleName": "stimdb1/templates/navbar.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("a");
          dom.setAttribute(el1, "href", "");
          var el2 = dom.createTextNode("Stimulus Sets");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child4 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.2",
          "loc": {
            "source": null,
            "start": {
              "line": 18,
              "column": 8
            },
            "end": {
              "line": 18,
              "column": 73
            }
          },
          "moduleName": "stimdb1/templates/navbar.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("a");
          dom.setAttribute(el1, "href", "");
          var el2 = dom.createTextNode("People");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child5 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.2",
          "loc": {
            "source": null,
            "start": {
              "line": 19,
              "column": 8
            },
            "end": {
              "line": 19,
              "column": 65
            }
          },
          "moduleName": "stimdb1/templates/navbar.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("a");
          dom.setAttribute(el1, "href", "");
          var el2 = dom.createTextNode("Contact");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child6 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.2",
          "loc": {
            "source": null,
            "start": {
              "line": 28,
              "column": 10
            },
            "end": {
              "line": 28,
              "column": 75
            }
          },
          "moduleName": "stimdb1/templates/navbar.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("a");
          dom.setAttribute(el1, "href", "");
          var el2 = dom.createTextNode("Messages");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child7 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.2",
          "loc": {
            "source": null,
            "start": {
              "line": 29,
              "column": 10
            },
            "end": {
              "line": 29,
              "column": 80
            }
          },
          "moduleName": "stimdb1/templates/navbar.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("a");
          dom.setAttribute(el1, "href", "");
          var el2 = dom.createTextNode("Database seeder");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 36,
            "column": 6
          }
        },
        "moduleName": "stimdb1/templates/navbar.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("nav");
        dom.setAttribute(el1, "class", "navbar navbar-inverse");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "container-fluid");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "navbar-header");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4, "type", "button");
        dom.setAttribute(el4, "class", "navbar-toggle collapsed");
        dom.setAttribute(el4, "data-toggle", "collapse");
        dom.setAttribute(el4, "data-target", "#main-navbar");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5, "class", "sr-only");
        var el6 = dom.createTextNode("Toggle navigation");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5, "class", "icon-bar");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5, "class", "icon-bar");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5, "class", "icon-bar");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "collapse navbar-collapse");
        dom.setAttribute(el3, "id", "main-navbar");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4, "class", "nav navbar-nav");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4, "class", "nav navbar-nav navbar-right");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        dom.setAttribute(el5, "class", "dropdown");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6, "class", "dropdown-toggle");
        dom.setAttribute(el6, "data-toggle", "dropdown");
        dom.setAttribute(el6, "role", "button");
        dom.setAttribute(el6, "aria-haspopup", "true");
        dom.setAttribute(el6, "aria-expanded", "false");
        var el7 = dom.createTextNode("\n            Admin");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "caret");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("ul");
        dom.setAttribute(el6, "class", "dropdown-menu");
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createComment(" /.navbar-collapse ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createComment(" /.container-fluid ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 1]);
        var element1 = dom.childAt(element0, [3]);
        var element2 = dom.childAt(element1, [1]);
        var element3 = dom.childAt(element1, [3, 1, 3]);
        var morphs = new Array(8);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 3, 3);
        morphs[1] = dom.createMorphAt(element2, 1, 1);
        morphs[2] = dom.createMorphAt(element2, 3, 3);
        morphs[3] = dom.createMorphAt(element2, 5, 5);
        morphs[4] = dom.createMorphAt(element2, 7, 7);
        morphs[5] = dom.createMorphAt(element2, 9, 9);
        morphs[6] = dom.createMorphAt(element3, 1, 1);
        morphs[7] = dom.createMorphAt(element3, 3, 3);
        return morphs;
      },
      statements: [["block", "link-to", ["index"], ["class", "navbar-brand"], 0, null, ["loc", [null, [10, 6], [10, 76]]]], ["block", "link-to", ["index"], ["tagName", "li"], 1, null, ["loc", [null, [15, 8], [15, 72]]]], ["block", "link-to", ["about"], ["tagName", "li"], 2, null, ["loc", [null, [16, 8], [16, 73]]]], ["block", "link-to", ["stimsets"], ["tagName", "li"], 3, null, ["loc", [null, [17, 8], [17, 84]]]], ["block", "link-to", ["creators.listall"], ["tagName", "li"], 4, null, ["loc", [null, [18, 8], [18, 85]]]], ["block", "link-to", ["contact"], ["tagName", "li"], 5, null, ["loc", [null, [19, 8], [19, 77]]]], ["block", "link-to", ["admin.messages"], ["tagName", "li"], 6, null, ["loc", [null, [28, 10], [28, 87]]]], ["block", "link-to", ["admin.seeder"], ["tagName", "li"], 7, null, ["loc", [null, [29, 10], [29, 92]]]]],
      locals: [],
      templates: [child0, child1, child2, child3, child4, child5, child6, child7]
    };
  })());
});
define("stimdb1/templates/stimsets", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.2",
          "loc": {
            "source": null,
            "start": {
              "line": 10,
              "column": 4
            },
            "end": {
              "line": 10,
              "column": 71
            }
          },
          "moduleName": "stimdb1/templates/stimsets.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("a");
          dom.setAttribute(el1, "href", "");
          var el2 = dom.createTextNode("List all");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.2",
          "loc": {
            "source": null,
            "start": {
              "line": 11,
              "column": 4
            },
            "end": {
              "line": 11,
              "column": 68
            }
          },
          "moduleName": "stimdb1/templates/stimsets.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("a");
          dom.setAttribute(el1, "href", "");
          var el2 = dom.createTextNode("Search");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child2 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.2",
          "loc": {
            "source": null,
            "start": {
              "line": 12,
              "column": 4
            },
            "end": {
              "line": 12,
              "column": 66
            }
          },
          "moduleName": "stimdb1/templates/stimsets.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("a");
          dom.setAttribute(el1, "href", "");
          var el2 = dom.createTextNode("Add new");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 16,
            "column": 10
          }
        },
        "moduleName": "stimdb1/templates/stimsets.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment(" app/templates/stimsets.hbs ");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("Stimulus Sets");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode(" Panels showing each stimulus set with basic details. These should show a 'snapshot'\n/ sample item to give people a flavor of what's there.");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "well");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("ul");
        dom.setAttribute(el2, "class", "nav nav-pills");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [6, 1]);
        var morphs = new Array(4);
        morphs[0] = dom.createMorphAt(element0, 1, 1);
        morphs[1] = dom.createMorphAt(element0, 3, 3);
        morphs[2] = dom.createMorphAt(element0, 5, 5);
        morphs[3] = dom.createMorphAt(fragment, 8, 8, contextualElement);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "link-to", ["stimsets.listall"], ["tagName", "li"], 0, null, ["loc", [null, [10, 4], [10, 83]]]], ["block", "link-to", ["stimsets.search"], ["tagName", "li"], 1, null, ["loc", [null, [11, 4], [11, 80]]]], ["block", "link-to", ["stimsets.new"], ["tagName", "li"], 2, null, ["loc", [null, [12, 4], [12, 78]]]], ["content", "outlet", ["loc", [null, [16, 0], [16, 10]]], 0, 0, 0, 0]],
      locals: [],
      templates: [child0, child1, child2]
    };
  })());
});
define("stimdb1/templates/stimsets/listall", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 24
          }
        },
        "moduleName": "stimdb1/templates/stimsets/listall.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("No stim sets yet!");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() {
        return [];
      },
      statements: [],
      locals: [],
      templates: []
    };
  })());
});
define("stimdb1/templates/stimsets/new", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 54
          }
        },
        "moduleName": "stimdb1/templates/stimsets/new.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("No mechanism for adding new stimsets right now ");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() {
        return [];
      },
      statements: [],
      locals: [],
      templates: []
    };
  })());
});
define("stimdb1/templates/stimsets/search", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.2",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "stimdb1/templates/stimsets/search.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode(" Magic search will go here! ");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() {
        return [];
      },
      statements: [],
      locals: [],
      templates: []
    };
  })());
});
define('stimdb1/torii-providers/firebase', ['exports', 'emberfire/torii-providers/firebase'], function (exports, _emberfireToriiProvidersFirebase) {
  exports['default'] = _emberfireToriiProvidersFirebase['default'];
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('stimdb1/config/environment', ['ember'], function(Ember) {
  var prefix = 'stimdb1';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("stimdb1/app")["default"].create({"name":"stimdb1","version":"0.0.0+fd09169b"});
}

/* jshint ignore:end */
//# sourceMappingURL=stimdb1.map
