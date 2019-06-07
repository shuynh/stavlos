/*
 * OKType by OKFocus v1.0.0
 * http://okfoc.us 
 *
 * Copyright 2012, OKFocus
 * Licensed under the MIT license.
 *
 */

(function ($) {
    var 
      timer,
      self,
      // An object for storing an element's style history
      restore = {},
      // Array of CSS values for font-weight
      weights = '100 200 300 400 500 600 700 800 900'.split(' '),
      // Array of CSS values for text-decoration
      decorations = 'overline line-through underline'.split(' '),
      // Array of typefaces
      typefaces = ['arial',
                 'helvetica',
                 'arial black',
                 'comic sans ms',
                 'courier new',
                 'georgia',
                 'impact',
                 'monospace',
                 'times new roman',
                 'trebuchet ms',
                 'verdana',
                 'symbol',
                 'webdings',
                 'fantasy',
                 'cursive'];
    
    $.oktype = function (el, options) {
        var base = this;
        base.$el = $(el);
        base.el = el;

        base.init = function () {
            base.options = $.extend({}, $.oktype.options, options);
            base.start();
        };

        base.start = function () {

            // Should the animation execute on hover?
            if (base.options.hover) {
                // If the function .on() is available to us (jQuery > 1.7), use it. Otherwise fallback to .bind().
                if(typeof $().on === "function"){
                    base.$el.on({
                        // On hover
                        mouseenter: function(){
                            base.hoverIn($(this));
                        },
                        // On leave
                        mouseleave: function(){
                            base.hoverOut($(this));
                        }
                    });
                } else {
                    base.$el.bind({
                        // On hover
                        mouseenter: function(){
                            base.hoverIn($(this));
                        },
                        // On hover
                        mouseleave: function(){
                            base.hoverOut($(this));
                        }
                    });
                }
                // Animte in perpetuity
            } else {
                base.hoverIn(base.$el);
            }
        };

        // Sets an interval to iterate through typefaces. Also will save the values of the current CSS 
        // in an object to return our element to its old state and add a class.
        //
        // Takes one argument, the element we are hovering on.
        base.hoverIn = function(el){
            // Cache jQuery object
            self = $(el);

            // Our object for saving the element's history
            restore = {
                fontFamily : self.css('font-family'),
                fontWeight : self.css('font-weight'),
                fontSize : self.css('font-size'),
                color : self.css('color'),
                textTransform : self.css('text-transform'),
                textDecoration : self.css('text-decoration'),
                letterSpacing : self.css('letter-spacing')
            }
            
            // Adds a convienence class
            if (base.options.hover) self.addClass('oktype-hovering');
            
            // The timeout
            timer = window.setInterval(function(){

                // changes the CSS with fallbacks to the current CSS
                self.css({
                    'font-family': base.randomType(),
                    'font-weight': base.options.weight ? base.weight() : self.css('font-weight'),
                    'font-size': (base.options.maxSize && base.options.minSize) ? base.randomSize() : self.css('font-size'),
                    'color': base.options.randomColor ? base.randomColor() : self.css('color'),
                    'text-transform': base.options.toggleCase ? base.toggleCase() : self.css('text-transform'),
                    'text-decoration': base.options.randomDecoration ? base.randomDecoration() : self.css('text-decoration'),
                    'letter-spacing': (base.options.minSpace && base.options.maxSpace) ? base.randomSpacing() : self.css('letter-spacing')
                });
                // the rate of the timeout
            }, base.options.interval);
            
        };


        // Removes our timeout and CSS class. Will return the element to its prior state unless explicitly stated by the user.
        base.hoverOut = function(){

            // Destroy the timeout
            clearTimeout(timer);

            // Remove the class
            if (base.options.hover) self.removeClass('oktype-hovering');

            // Sould we restore CSS?
            if (base.options.restore){
                // Restore the element's prior CSS
                self.css({
                    'font-family': restore.fontFamily,
                    'font-weight': restore.fontWeight,
                    'font-size': restore.fontSize,
                    'color': restore.color,
                    'text-transform': restore.textTransform,
                    'text-decoration': restore.textDecoration,
                    'letter-spacing': restore.letterSpacing
                });

            }
        };

        // Parse the weight option and return the correct function
        base.weight = function(){
            if (base.options.weight === 'toggle'){
                return base.randomBold();
            } else if (base.options.weight === 'random'){
                return base.randomWeight();      
            } else {
                console.log("OKType Error: You must set the option for weight to be either 'toggle' or 'random'.");
            }
        }

        // Returns the CSS value for the 'font-weight' property, randomly toggling between 'bold' and 'normal'.
        base.randomBold = function(){
            return (Math.round(Math.random() * 1) % 2 == 0) ? "bold" : "normal";
        };
        
        // Returns a CSS weight from the weights array
        base.randomWeight = function(){
            return weights[Math.floor(weights.length * Math.random())];
        };

        // Returns the CSS value for 'text-transform' property, randomly toggling between 'uppercase' and 'lowercase'
        base.toggleCase = function(){
            return (Math.round(Math.random() * 1) % 2 == 0) ? "uppercase" : "lowercase";
        };

        // Returns a CSS text-decoration from the decorations array
        base.randomDecoration = function(){
            return decorations[Math.floor(decorations.length * Math.random())];
        };

        // Returns a random number based on the max and min options for letter-spacing
        base.randomSpacing = function(){
            return Math.round(base.options.minSpace + (Math.random() * (base.options.maxSpace - base.options.minSpace))) + "px";
        };

        // Returns a random number based on the max and min options for font-size
        base.randomSize = function(){
            return Math.round(base.options.minSize + (Math.random() * (base.options.maxSize - base.options.minSize))) + "px";
        };
        
        // Returns a random hex color http://bit.ly/GYNA2N
        base.randomColor = function(){
            return '#' + Math.floor(Math.random() * 16777215).toString(16);
        };

        // Returns a random font from the typefaces array
        base.randomType = function(){
            return typefaces[Math.floor(typefaces.length * Math.random())];
        };

        // initialize everything
        base.init();
    };

    $.oktype.options = {
        weight: null, // Can be "toggle" or "random". Will alternate the font-weight.
        minSize: null, // The minimum desired size for the type (an int)
        maxSize: null, // The maximum desired size for the type (an int)
        randomColor: null, // Randomizes type color (a boolean)
        randomDecoration: null, // Random from array of text-decoration rules (a boolean)
        interval: 100, // The speed of our animation (an int)
        toggleCase: null, // Randomizes capitalization and lowercase of type (a boolean)
        maxSpace: null, // The minimum desired letter-spacing for type (an int)
        minSpace: null, // The maximum desired letter-spacing for type (an int)
        restore: true, // Restore the element to its prior state on hoverOut (a boolean)
        hover: true // Execute animation on hover? (a boolean)
    };

    $.fn.oktype = function (options) {
        return this.each(function () {
            (new $.oktype(this, options));
        });
    };
})(jQuery);
