
define(function(require) {
	return function(base, inherits) {
		base.prototype = Object.create(inherits.prototype);
		base.prototype.constructor = base;
	};
});