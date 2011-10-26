/*!
 * jquery-machine Plugin for jQuery
 *
 * Version 0.0.1
 *
 * Copyright 2011, Luca Ongaro
 * Licensed under the MIT license.
 *
 */ 
 
(function( $ ){
  $.fn.machine = function(machine) {
    var $this = this,
        events = [],
        states = [],
        defaultState = "start",
        callMethodIfExisting = function(obj, method) {
          if(!!obj && typeof obj[method] == "function") {
            return obj[method].apply($this, Array.prototype.slice.call( arguments, 2))
          }
        };

    // populate states and event array, get default state
    for(var state in machine) if (machine.hasOwnProperty(state)) {
      states.push(state);
      if(!!machine[state].default) {
        defaultState = state;
      }
      machine[state].exits = machine[state].exits || {};
      for(var evt in machine[state].exits) if (machine[state].exits.hasOwnProperty(evt)) {
        events.push(evt);
      }
    }
    events = $.unique(events);

    // Store state machine object
    $(this).data("machine", machine);

    // Enter default state
    callMethodIfExisting($(this).data("machine")[defaultState], "onEnter");
    $(this).data("state", defaultState);

    // Event handler
    $this.bind(events.join(" "), function(evt) {
      var machine = $(this).data("machine"),
          currentState = $(this).data("state"),
          nextState = machine[currentState]["exits"][evt.type];
      if (!!nextState) {
        callMethodIfExisting(machine[currentState], "onExit", evt);
        callMethodIfExisting(machine[nextState], "onEnter", evt);
        $(this).data("state", nextState);
      }
    });

    return $this;
  };

})(jQuery);