
import assign from 'object-assign';
import { each, isFunction } from 'underscore';
import { EventEmitter } from 'events';

const CHANGE_EVENT = 'change';

export function createStore(spec) {
  const emitter = new EventEmitter();
  emitter.setMaxListeners(0);

  const store = assign({
    emitChange() {
      emitter.emit(CHANGE_EVENT);
    },

    addChangeListener(callback) {
      emitter.on(CHANGE_EVENT, callback);
    },

    removeChangeListener(callback) {
      emitter.removeListener(CHANGE_EVENT, callback);
    }
  }, spec);

  // Auto-bind store methods for convenience
  each(store, (val, key) => {
    if (isFunction(val)) {
      store[key] = store[key].bind(store);
    }
  });

  return store;
}