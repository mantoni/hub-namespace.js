/*
 * hub-namespace.js
 *
 * Copyright (c) 2012-2013 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var test      = require('utest');
var assert    = require('assert');
var sinon     = require('sinon');

var hub       = require('hubjs');
var namespace = require('../lib/namespace');


function testHandler(method) {
  return function () {
    var stub      = sinon.stub(this.hub, method);
    var ns        = namespace(this.hub, 'test');
    var callback  = function () {};

    ns[method]('abc', callback);

    sinon.assert.calledOnce(stub);
    sinon.assert.calledWith(stub, 'test.abc', callback);
  };
}


test('namespace', {

  before: function () {
    this.hub = hub();
  },

  'returns an instance of Namespace': function () {
    var ns = namespace(this.hub, 'test');

    assert(ns instanceof namespace.Namespace);
  },

  'has a nice toString implementation': function () {
    var ns = namespace(this.hub, 'test.me.*');

    assert.equal(ns.toString(), '[object Namespace(test.me.*)]');
  },

  'forwards emit': function () {
    var stub     = sinon.stub(this.hub, 'emit');
    var ns       = namespace(this.hub, 'test');
    var callback = function () {};

    ns.emit('abc', 123, 'xyz', callback);

    sinon.assert.calledOnce(stub);
    sinon.assert.calledOn(stub, this.hub);
    sinon.assert.calledWith(stub, 'test.abc', 123, 'xyz', callback);
  },

  'forwards emit object': function () {
    var stub     = sinon.stub(this.hub, 'emit');
    var ns       = namespace(this.hub, 'test');
    var callback = function () {};

    ns.emit({ event : 'abc', allResults : true }, 123, 'xyz', callback);

    sinon.assert.calledOnce(stub);
    sinon.assert.calledOn(stub, this.hub);
    sinon.assert.calledWith(stub, { event : 'test.abc', allResults : true },
        123, 'xyz', callback);
  },

  'forwards addListener'    : testHandler('addListener'),
  'forwards addFilter'      : testHandler('addFilter'),
  'forwards once'           : testHandler('once'),
  'forwards filterOnce'     : testHandler('filterOnce'),
  'forwards removeListener' : testHandler('removeListener'),
  'forwards removeFilter'   : testHandler('removeFilter'),

  'provides on as an alias for addListener': function () {
    var ns = namespace(this.hub, 'test');

    assert.strictEqual(ns.on, ns.addListener);
  },

  'forwards listeners': function () {
    var stub = sinon.stub(this.hub, 'listeners');
    var ns   = namespace(this.hub, 'test');

    ns.listeners('abc');

    sinon.assert.calledOnce(stub);
    sinon.assert.calledWith(stub, 'test.abc');
  },

  'forwards filters': function () {
    var stub = sinon.stub(this.hub, 'filters');
    var ns   = namespace(this.hub, 'test');

    ns.filters('abc');

    sinon.assert.calledOnce(stub);
    sinon.assert.calledWith(stub, 'test.abc');
  },

  'forwards listenersMatching': function () {
    var stub = sinon.stub(this.hub, 'listenersMatching');
    var ns   = namespace(this.hub, 'test');

    ns.listenersMatching('abc');

    sinon.assert.calledOnce(stub);
    sinon.assert.calledWith(stub, 'test.abc');
  },

  'forwards filtersMatching': function () {
    var stub = sinon.stub(this.hub, 'filtersMatching');
    var ns   = namespace(this.hub, 'test');

    ns.filtersMatching('abc');

    sinon.assert.calledOnce(stub);
    sinon.assert.calledWith(stub, 'test.abc');
  },

  'forwards removeAllListeners without event': function () {
    var stub = sinon.stub(this.hub, 'removeMatchingListeners');
    var ns   = namespace(this.hub, 'test');

    ns.removeAllListeners();

    sinon.assert.calledOnce(stub);
    sinon.assert.calledWith(stub, 'test.**');
  },

  'forwards removeAllListeners with event': function () {
    var stub = sinon.stub(this.hub, 'removeAllListeners');
    var ns   = namespace(this.hub, 'test');

    ns.removeAllListeners('abc');

    sinon.assert.calledOnce(stub);
    sinon.assert.calledWith(stub, 'test.abc');
  },

  'forwards removeAllFilters without event': function () {
    var stub = sinon.stub(this.hub, 'removeMatchingFilters');
    var ns   = namespace(this.hub, 'test');

    ns.removeAllFilters();

    sinon.assert.calledOnce(stub);
    sinon.assert.calledWith(stub, 'test.**');
  },

  'forwards removeAllFilters with event': function () {
    var stub = sinon.stub(this.hub, 'removeAllFilters');
    var ns   = namespace(this.hub, 'test');

    ns.removeAllFilters('abc');

    sinon.assert.calledOnce(stub);
    sinon.assert.calledWith(stub, 'test.abc');
  },

  'forwards removeMatchingListeners': function () {
    var stub = sinon.stub(this.hub, 'removeMatchingListeners');
    var ns   = namespace(this.hub, 'test');

    ns.removeMatchingListeners('abc');

    sinon.assert.calledOnce(stub);
    sinon.assert.calledWith(stub, 'test.abc');
  },

  'forwards removeMatchingFilters': function () {
    var stub = sinon.stub(this.hub, 'removeMatchingFilters');
    var ns   = namespace(this.hub, 'test');

    ns.removeMatchingFilters('abc');

    sinon.assert.calledOnce(stub);
    sinon.assert.calledWith(stub, 'test.abc');
  },

  'exposes hub': function () {
    var ns = namespace(this.hub, 'test');

    assert.strictEqual(ns.hub, this.hub);
  },

  'exposes namespace': function () {
    var ns = namespace(this.hub, 'test');

    assert.strictEqual(ns.namespace, 'test');
  },

  'does not create new functions for each namespace': function () {
    var nsA = namespace(this.hub, 'a');
    var nsB = namespace(this.hub, 'b');

    assert.strictEqual(nsA.emit, nsB.emit);
    assert.strictEqual(nsA.once, nsB.once);
    assert.strictEqual(nsA.on, nsB.on);
    assert.strictEqual(nsA.removeAllListeners, nsB.removeAllListeners);
  }

});
