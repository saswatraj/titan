var _ = require('underscore');

var register = function(Handlebars) {
    var helpers = {
      // put all of your helpers inside this object
      everyNth: function(context, every, options) {
        var fn = options.fn, inverse = options.inverse;
        var ret = "";
        if(context && context.length > 0) {
          for(var i=0, j=context.length; i<j; i++) {
            var modZero = i % every === 0;
            ret = ret + fn(_.extend({}, context[i], {
              isModZero: modZero,
              isLastForNth: i % every == (every - 1),
              isLast: i === context.length - 1
            }));
          }
        } else {
          ret = inverse(this);
        }
        return ret;
      },
      ifCond: function (v1, operator, v2, options) {
        switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '!=':
                return (v1 != v2) ? options.fn(this) : options.inverse(this);
            case '!==':
                return (v1 !== v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
            }
        }
    };
  
    if (Handlebars && typeof Handlebars.registerHelper === "function") {
      // register helpers
      for (var prop in helpers) {
          Handlebars.registerHelper(prop, helpers[prop]);
      }
    } else {
        // just return helpers object if we can't register helpers here
        return helpers;
    }
  
  };
  
  module.exports.register = register;
  module.exports.helpers = register(null);   