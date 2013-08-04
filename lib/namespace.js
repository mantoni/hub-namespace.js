/*
 * hub-namespace.js
 *
 * Copyright (c) 2012-2013 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';


var Namespace = function (hub, namespace) {
  this.hub       = hub;
  this.namespace = namespace;
};

var proto = Namespace.prototype = {

  toString: function () {
    return '[object Namespace(' + this.namespace + ')]';
  },

  emit: function (event) {
    var args = Array.prototype.slice.call(arguments, 1);
    if (typeof event === 'object') {
      args.unshift({
        event      : this.namespace + '.' + event.event,
        allResults : event.allResults
      });
    } else {
      args.unshift(this.namespace + '.' + event);
    }
    this.hub.emit.apply(this.hub, args);
  },

  removeAllListeners: function (event) {
    if (arguments.length) {
      this.hub.removeAllListeners(this.namespace + '.' + event);
    } else {
      this.hub.removeMatchingListeners(this.namespace + '.**', false);
    }
  },

  removeAllFilters: function (event) {
    if (arguments.length) {
      this.hub.removeAllFilters(this.namespace + '.' + event);
    } else {
      this.hub.removeMatchingFilters(this.namespace + '.**', false);
    }
  }

};

function delegateOneArg(method) {
  proto[method] = function (event) {
    return this.hub[method](this.namespace + '.' + event);
  };
}

function delegateTwoArgs(method) {
  proto[method] = function (event, callback) {
    this.hub[method](this.namespace + '.' + event, callback);
  };
}

delegateOneArg('listeners');
delegateOneArg('filters');
delegateOneArg('listenersMatching');
delegateOneArg('filtersMatching');
delegateOneArg('removeMatchingListeners');
delegateOneArg('removeMatchingFilters');

delegateTwoArgs('addListener');
delegateTwoArgs('addFilter');
delegateTwoArgs('once');
delegateTwoArgs('filterOnce');
delegateTwoArgs('removeListener');
delegateTwoArgs('removeFilter');

proto.on = proto.addListener;

function create(hub, namespace) {
  return new Namespace(hub, namespace);
}
create.Namespace = Namespace;

module.exports = create;
