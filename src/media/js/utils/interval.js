
define(function(require) {
	// interval for timing events
	return function(span) {
		var elapsed = 0;

		// return true if the next interval is reached
		this.next = function(time) {
			elapsed += time;

			if(elapsed > span) {
				elapsed -= span;

				return true;
			}

			return false;
		};

		// reset the timer
		this.reset = function() {
			elapsed = 0;
		};
	};
});