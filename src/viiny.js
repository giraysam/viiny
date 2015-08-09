/*jslint nomen: true, plusplus: true */
/*globals viiny, alert, console, KeyboardEvent */


/* Viiny Core Module */
(function (_window) {
	'use strict';

	var viiny, ViinyEvent, events;

	viiny = function (_elm) {

		if (!(this instanceof viiny)) {
			return new viiny.instance(_elm);
		}
	};

	// create viiny instance
	viiny.instance = function (_elm) {
		var _selector, i;

		if (typeof _elm === 'string') {
			_selector = document.querySelectorAll(_elm);

		} else {

			return _elm;
		}

		if (_selector.length > 0) {

			for (i = 0; i < _selector.length; i++) {
				this[i] = _selector[i];
			}

			this.length = _selector.length;
		}

		return this;
	};

	// each function
	viiny.each = function (_elm, _fn) {
		var i;

		for (i = 0; i < _elm.length; i++) {
			_fn.call(this, i, _elm[i]);
		}
	};

	viiny.extend = function (obj) {
		var i;

		for (i in obj) {
			if (obj.hasOwnProperty(i)) {
				this[i] = obj[i];
			}
		}
	};

	// === Viiny Event ===
	ViinyEvent = (function () {
		var _listeners, _events, _has, _addEvent, _removeEvent,
			_addListener, _removeListener, _getListeners,
			_makeEvent;

		_listeners = {};

		_events = {
			mouse: ['click', 'mousedown', 'mouseup', 'mousemove',
					'mouseover', 'mouseout'],
			key: ['keydown', 'keyup', 'keypress']
		};

		_addEvent = function (_obj, _type, _callback) {

			if (_obj.addEventListener) {
				_obj.addEventListener(_type, _callback);

			} else if (_obj.attachEvent) {
				_obj.attachEvent("on" + _type, _callback);

			} else {
				return;
			}

			_addListener(_obj, _type, _callback);
		};

		_removeEvent = function (_obj, _type) {
			var _callback;

			_callback = _listeners[_obj.id][_type];

			if (_obj.removeEventListener) {

				_obj.removeEventListener(_type, _callback);

			} else if (_obj.attachEvent) {
				_obj.detachEvent(_type, _callback);

			} else {
				return;
			}

			_removeListener(_obj, _type);
		};

		_addListener = function (_obj, _event, _callback) {

			if (!_listeners[_obj.id]) {
				_listeners[_obj.id] = {};
			}

			if (!_listeners[_obj.id][_event]) {
				_listeners[_obj.id][_event] = {};
			}

			_listeners[_obj.id][_event] = _callback;
		};

		_removeListener = function (_obj, _event) {

			if (!_listeners[_obj.id]) {
				return;
			}

			if (!_event) {
				return;
			}

			if (_listeners[_obj.id][_event]) {
				_listeners[_obj.id][_event] = {};
			}
		};

		_getListeners = function () {

			return _listeners;
		};

		_makeEvent = function (_type) {
			var evt;

			if (_has(_events.key, _type)) {

				if (typeof KeyboardEvent === 'function') {
					evt = new KeyboardEvent(_type);

				} else {

					evt = document.createEvent('KeyboardEvent');
					evt[(evt.initKeyEvent) ? 'initKeyEvent' : 'initKeyboardEvent'](_type, true, true, null);
				}
			} else {

				if (typeof document.createEvent === 'undefined' && typeof document.createEventObject !== 'undefined') {
					evt = document.createEventObject();

				} else if (typeof document.createEvent !== 'undefined') {
					evt = document.createEvent('MouseEvents');

					evt.initMouseEvent(_type, true, true, window);
				}
			}

			return evt;
		};

		_has = function (x, y) {
			var i;

			for (i = 0; i < x.length; i++) {
				if (x[i] === y) {
					return true;
				}
			}

			return false;
		};

		return {
			add: function (_obj, _event, _callback) {
				_addEvent(_obj, _event, _callback);
			},
			remove: function (_obj, _event) {
				_removeEvent(_obj, _event);
			},
			emit: function (_event) {
				return _makeEvent(_event);
			},
			list: function () {
				console.log(_getListeners());
			}
		};

	}());
	// === Viiny Event ===

	viiny.fn = viiny.prototype = {

		on: function (_type, _callback) {

			viiny.each(this, function (i, item) {

				ViinyEvent.add(item, _type, _callback);
			});
		},

		off: function (_type, _fn) {

			viiny.each(this, function (i, item) {

				ViinyEvent.remove(item, _type);
			});
		},

		emit: function (_type) {
			var _evt;
			_evt = ViinyEvent.emit(_type);

			viiny.each(this, function (i, item) {

				if (typeof item.dispatchEvent !== 'undefined') {
					item.dispatchEvent(_evt);

				} else if (typeof item.fireEvent !== 'undefined') {
					item.fireEvent('on' + _type, item);
				}
			});
		},

		each: function (_fn) {
			viiny.each(this, _fn);
			return this;
		},

		hide: function (_fn) {

			viiny.each(this, function (i, item) {
				item.style.display = 'none';

				if (_fn) {
					_fn.call(this, item);
				}
			});

			return this;
		},

		show: function (_fn) {

			viiny.each(this, function (i, item) {
				item.style.display = 'inline';

				if (_fn) {
					_fn.call(this, item);
				}
			});

			return this;
		}
	};

	viiny.instance.prototype = viiny.fn;

	_window.viiny = viiny;

}(window));
