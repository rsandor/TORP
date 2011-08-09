/**
 * Handles Key Events for the Game.
 * @author Ryan Sandor Richards.
 */
var Key = {
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40,
  Z: 90
};

var Keyboard = (function() {
  var map = {};
  
  // Setup Key Bindings
  $(window).keydown(function(e) { map[e.keyCode] = true;  });
  $(window).keyup(function(e) { delete map[e.keyCode];  });
  
  // Public Interface
  return {
    down: function(code) {
      return map[code];
    }
  };
})();