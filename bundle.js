var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/bycontract/dist/lib/Exception.js
var require_Exception = __commonJS({
  "node_modules/bycontract/dist/lib/Exception.js"(exports2) {
    "use strict";
    var __extends = exports2 && exports2.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports2, "__esModule", { value: true });
    var Exception = (
      /** @class */
      function(_super) {
        __extends(Exception2, _super);
        function Exception2(code, message) {
          var _this = _super.call(this, message) || this;
          _this.code = code;
          _this.name = "ByContractError", _this.message = message;
          Object.setPrototypeOf(_this, Exception2.prototype);
          return _this;
        }
        Exception2.prototype.toString = function() {
          return "ByContractError: " + this.message;
        };
        return Exception2;
      }(TypeError)
    );
    exports2.default = Exception;
  }
});

// node_modules/bycontract/dist/lib/is.js
var require_is = __commonJS({
  "node_modules/bycontract/dist/lib/is.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var is = {
      "arguments": function(value) {
        return toString.call(value) === "[object Arguments]";
      },
      "array": Array.isArray || function(value) {
        return toString.call(value) === "[object Array]";
      },
      "string": function(value) {
        return toString.call(value) === "[object String]";
      },
      "undefined": function(value) {
        return value === void 0;
      },
      "boolean": function(value) {
        return value === true || value === false || toString.call(value) === "[object Boolean]";
      },
      "function": function(value) {
        return toString.call(value) === "[object Function]" || typeof value === "function";
      },
      "nan": function(value) {
        return value !== value;
      },
      "null": function(value) {
        return value === null;
      },
      "number": function(value) {
        return !is["nan"](value) && toString.call(value) === "[object Number]";
      },
      "regexp": function(value) {
        return toString.call(value) === "[object RegExp]";
      },
      "object": function(value) {
        var t = typeof value;
        return t === "function" || t === "object" && !!value;
      }
    };
    exports2.default = is;
  }
});

// node_modules/bycontract/dist/lib/verify.js
var require_verify = __commonJS({
  "node_modules/bycontract/dist/lib/verify.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var Exception_1 = __importDefault(require_Exception());
    var is_1 = __importDefault(require_is());
    var scope = typeof window !== "undefined" ? window : global;
    function isOptional(propContract) {
      return is_1.default.string(propContract) && propContract.endsWith("=");
    }
    function stringify(val) {
      if (typeof val === "object" && "constructor" in val && val.constructor.name) {
        return "instance of " + val.constructor.name;
      }
      if (typeof val === "function") {
        return val.prototype.constructor.name;
      }
      return getType(val);
    }
    function getType(val) {
      var basicType = Object.keys(is_1.default).find(function(aType) {
        return is_1.default[aType](val);
      });
      return basicType || typeof val;
    }
    function isValid(val, contract, exceptions) {
      if (exceptions === void 0) {
        exceptions = [];
      }
      try {
        verify(val, contract);
        return true;
      } catch (ex) {
        if (!(ex instanceof Exception_1.default)) {
          throw ex;
        }
        exceptions.push(ex.message);
        return false;
      }
    }
    exports2.customTypes = {};
    function verify(val, contract, propPath) {
      if (propPath === void 0) {
        propPath = "";
      }
      var lib = new Validate(val, contract, propPath);
      lib.validate();
    }
    exports2.default = verify;
    function normalizeProp(prop, propPath) {
      return propPath ? propPath + "." + prop : prop;
    }
    var Validate = (
      /** @class */
      function() {
        function Validate2(val, contract, propPath) {
          if (propPath === void 0) {
            propPath = "";
          }
          this.val = val;
          this.contract = contract;
          this.propPath = propPath;
        }
        Validate2.prototype.validate = function() {
          if (this.assertAny()) {
            return;
          }
          if (this.assertObject()) {
            return;
          }
          if (this.assertInterface()) {
            return;
          }
          if (!is_1.default.string(this.contract)) {
            throw this.newException("EINVALIDCONTRACT", "invalid parameters. Contract must be a string or a constructor function");
          }
          if (this.assertOptional()) {
            return;
          }
          if (this.assertBasicType()) {
            return;
          }
          if (this.assertNullable()) {
            return;
          }
          if (this.assertUnion()) {
            return true;
          }
          if (this.assertStrictArrayJson()) {
            return true;
          }
          if (this.assertStrictArray()) {
            return;
          }
          if (this.assertStrictObject()) {
            return;
          }
          if (this.assertCustom()) {
            return;
          }
          if (!this.contract.match(/^[a-zA-Z0-9\._]+$/)) {
            throw this.newException("EINVALIDCONTRACT", "invalid contract " + JSON.stringify(this.contract));
          }
          if (this.assertGlobal()) {
            return;
          }
          throw this.newException("EINVALIDCONTRACT", "invalid contract " + JSON.stringify(this.contract));
        };
        Validate2.prototype.assertCustom = function() {
          if (!(this.contract in exports2.customTypes)) {
            return false;
          }
          try {
            verify(this.val, exports2.customTypes[this.contract]);
          } catch (err) {
            throw this.newException("EINVALIDTYPE", "type " + this.contract + ": " + err.message);
          }
          return true;
        };
        Validate2.prototype.assertGlobal = function() {
          if (!(this.contract in scope) || typeof scope[this.contract] !== "function") {
            return false;
          }
          if (this.val instanceof scope[this.contract]) {
            return true;
          }
          throw this.newException("EINTERFACEVIOLATION", "expected instance of " + scope[this.contract] + " but got " + stringify(this.val));
        };
        Validate2.prototype.assertAny = function() {
          if (is_1.default.string(this.contract) && this.contract === "*") {
            return true;
          }
          return false;
        };
        Validate2.prototype.assertObject = function() {
          var _this = this;
          if (!this.contract || typeof this.contract !== "object") {
            return false;
          }
          if (!this.val || typeof this.val !== "object") {
            throw this.newException("EINVALIDTYPE", "expected object literal but got " + getType(this.val));
          }
          Object.keys(this.contract).forEach(function(prop, inx) {
            var propContract = _this.contract[prop];
            if (!(prop in _this.val) && !isOptional(propContract)) {
              throw _this.newException("EMISSINGPROP", "missing required property #" + normalizeProp(prop, _this.propPath));
            }
            verify(_this.val[prop], propContract, normalizeProp(prop, _this.propPath));
          });
          return true;
        };
        Validate2.prototype.assertInterface = function() {
          if (!is_1.default.function(this.contract) && typeof this.contract !== "object") {
            return false;
          }
          if (!(this.val instanceof this.contract)) {
            throw this.newException("EINTERFACEVIOLATION", "expected instance of " + stringify(this.contract) + " but got " + stringify(this.val));
          }
          return true;
        };
        Validate2.prototype.assertOptional = function() {
          if (this.contract.match(/=$/)) {
            if (!this.val) {
              return true;
            }
            this.contract = this.contract.substr(0, this.contract.length - 1);
          }
          return false;
        };
        Validate2.prototype.assertBasicType = function() {
          var vtype = this.contract.toLowerCase(), test = is_1.default[vtype];
          if (typeof test === "undefined") {
            return false;
          }
          if (!test(this.val)) {
            throw this.newException("EINVALIDTYPE", "expected " + vtype + " but got " + getType(this.val));
          }
          return true;
        };
        Validate2.prototype.assertNullable = function() {
          if (!this.contract.startsWith("?")) {
            return false;
          }
          var vtype = this.contract.replace(/^\?/, "").toLowerCase(), test = is_1.default[vtype];
          if (is_1.default["null"](this.val)) {
            return true;
          }
          if (typeof test === "undefined") {
            throw this.newException("EINVALIDCONTRACT", "invalid contract " + JSON.stringify(vtype));
          }
          if (!test(this.val)) {
            throw this.newException("EINVALIDTYPE", "expected " + this.contract + " but got " + getType(this.val));
          }
          return true;
        };
        Validate2.prototype.assertUnion = function() {
          var _this = this;
          if (!this.contract.includes("|")) {
            return false;
          }
          var exceptions = [];
          if (!this.contract.split("|").some(function(contract) {
            return isValid(_this.val, contract, exceptions);
          })) {
            var tdesc = is_1.default.array(this.val) || is_1.default.object(this.val) ? "failed on each: " + exceptions.join(", ") : "got " + getType(this.val);
            throw this.newException("EINVALIDTYPE", "expected " + this.contract + " but " + tdesc);
          }
          return true;
        };
        Validate2.prototype.assertStrictArrayJson = function() {
          if (!this.contract.endsWith("[]")) {
            return false;
          }
          if (!is_1.default.array(this.val)) {
            this.contract = "array";
            return this.assertBasicType();
          }
          var contract = this.contract.replace(/\[\]$/, "");
          var elInx = 0;
          if (contract === "*") {
            this.contract = "array";
            return this.assertBasicType();
          }
          try {
            is_1.default.array(this.val) && this.val.forEach(function(v) {
              verify(v, contract);
              elInx++;
            });
          } catch (err) {
            throw this.newException("EINVALIDTYPE", "array element " + elInx + ": " + err.message);
          }
          return true;
        };
        Validate2.prototype.assertStrictArray = function() {
          if (!this.contract.startsWith("Array.<")) {
            return false;
          }
          if (!is_1.default.array(this.val)) {
            this.contract = "array";
            return this.assertBasicType();
          }
          var elInx = 0;
          var match = this.contract.match(/Array\.<(.+)>/i);
          if (!match) {
            throw this.newException("EINVALIDCONTRACT", "invalid contract " + stringify(this.contract));
          }
          if (match[1] === "*") {
            this.contract = "array";
            return this.assertBasicType();
          }
          try {
            is_1.default.array(this.val) && this.val.forEach(function(v) {
              verify(v, match[1]);
              elInx++;
            });
          } catch (err) {
            throw this.newException("EINVALIDTYPE", "array element " + elInx + ": " + err.message);
          }
          return true;
        };
        Validate2.prototype.assertStrictObject = function() {
          var _this = this;
          if (this.contract.indexOf("Object.<") !== 0) {
            return false;
          }
          if (!is_1.default.object(this.val)) {
            this.contract = "object";
            return this.assertBasicType();
          }
          var prop = null;
          var match = this.contract.match(/Object\.<(.+),\s*(.+)>/i);
          if (!match) {
            throw this.newException("EINVALIDCONTRACT", "invalid contract " + stringify(this.contract));
          }
          if (match[2] === "*") {
            this.contract = "object";
            return this.assertBasicType();
          }
          try {
            is_1.default.object(this.val) && Object.keys(this.val).forEach(function(key) {
              prop = key;
              verify(_this.val[key], match[2]);
            });
          } catch (err) {
            throw this.newException("EINVALIDTYPE", "object property " + prop + ": " + err.message);
          }
          return true;
        };
        Validate2.prototype.newException = function(code, msg) {
          var pref = this.propPath ? "property #" + this.propPath + " " : "";
          return new Exception_1.default(code, pref + msg);
        };
        return Validate2;
      }()
    );
  }
});

// node_modules/bycontract/dist/lib/byContract.js
var require_byContract = __commonJS({
  "node_modules/bycontract/dist/lib/byContract.js"(exports2) {
    "use strict";
    var __assign = exports2 && exports2.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
      }
      result["default"] = mod;
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var Exception_1 = __importDefault(require_Exception());
    var verify_1 = __importStar(require_verify());
    var is_1 = __importDefault(require_is());
    function err(msg, callContext, argInx) {
      var loc = typeof argInx !== "undefined" ? "Argument #" + argInx + ": " : "", prefix = callContext ? callContext + ": " : "";
      return "" + prefix + loc + msg;
    }
    function config(options) {
      byContract.options = __assign(__assign({}, byContract.options), options);
    }
    function typedef(typeName, tagDic) {
      validate4([typeName, tagDic], ["string", "*"], "byContract.typedef");
      if (typeName in is_1.default) {
        throw new Exception_1.default("EINVALIDPARAM", "Custom type must not override a primitive");
      }
      verify_1.customTypes[typeName] = tagDic;
    }
    function validateCombo(values, combo, callContext) {
      try {
        if (!is_1.default.array(values)) {
          throw new Exception_1.default("EINVALIDPARAM", err("Invalid validateCombo() parameters. The first parameter (values) shall be an array", callContext));
        }
        if (!is_1.default.array(combo)) {
          throw new Exception_1.default("EINVALIDPARAM", err("Invalid validateCombo() parameters. The second parameter (combo) shall be an array", callContext));
        }
        var exceptions = combo.map(function(contracts) {
          return getValidateError(values, contracts, callContext);
        });
        if (exceptions.every(function(ex) {
          return ex !== false;
        })) {
          throw exceptions.find(function(ex) {
            return ex !== false;
          });
        }
      } catch (err2) {
        if (err2 instanceof Exception_1.default && Error.captureStackTrace) {
          Error.captureStackTrace(err2, validateCombo);
        }
        throw err2;
      }
      return values;
    }
    function getValidateError(values, contracts, callContext) {
      try {
        validate4(values, contracts, callContext);
        return false;
      } catch (err2) {
        return err2;
      }
    }
    function validate4(values, contracts, callContext) {
      if (!byContract.options.enable) {
        return values;
      }
      try {
        if (typeof contracts === "undefined") {
          throw new Exception_1.default("EINVALIDPARAM", err("Invalid validate() parameters. The second parameter (contracts) is missing", callContext));
        }
        if (is_1.default.array(contracts) && !(is_1.default.array(values) || is_1.default.arguments(values))) {
          throw new Exception_1.default("EINVALIDPARAM", err("Invalid validate() parameters. The second parameter (contracts) is array, the first one (values) expected to be array too", callContext));
        }
        if (callContext && !is_1.default.string(callContext)) {
          throw new Exception_1.default("EINVALIDPARAM", err("Invalid validate() parameters. The third parameter (callContext) shall be string or omitted", callContext));
        }
        if (is_1.default.array(contracts)) {
          if (is_1.default.arguments(values)) {
            values = Array.from(values);
          }
          if (!is_1.default.array(values)) {
            throw new Exception_1.default("EINVALIDPARAM", err("Invalid parameters. When the second parameter (contracts) is an array, the first parameter (values) must an array too", callContext));
          }
          contracts.forEach(function(c, inx) {
            if (!(inx in values) && !c.match(/=$/)) {
              throw new Exception_1.default("EMISSINGARG", err("Missing required argument", callContext));
            }
            validateValue(values[inx], c, callContext, inx);
          });
          return values;
        }
        validateValue(values, contracts, callContext);
      } catch (err2) {
        if (err2 instanceof Exception_1.default && Error.captureStackTrace) {
          Error.captureStackTrace(err2, validate4);
        }
        throw err2;
      }
      return values;
    }
    function validateValue(value, contract, callContext, inx) {
      try {
        verify_1.default(value, contract);
      } catch (ex) {
        if (!(ex instanceof Exception_1.default)) {
          throw ex;
        }
        throw new Exception_1.default(ex.code, err(ex.message, callContext, inx));
      }
    }
    var byContract = {
      options: {
        enable: true
      },
      Exception: Exception_1.default,
      validate: validate4,
      typedef,
      config,
      validateCombo,
      is: is_1.default
    };
    exports2.default = byContract;
  }
});

// node_modules/bycontract/dist/lib/jsDoc.js
var require_jsDoc = __commonJS({
  "node_modules/bycontract/dist/lib/jsDoc.js"(exports2) {
    "use strict";
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var Exception_1 = __importDefault(require_Exception());
    function parse(line) {
      var iLeft = line.indexOf("{"), iRight = line.indexOf("}");
      if (iLeft === -1 || iRight === -1) {
        throw new Exception_1.default("EINVALIDJSDOC", "invalid JSDOC. Expected syntax: { exp } param got " + line);
      }
      var contract = line.substr(iLeft + 1, iRight - iLeft - 1), name = line.substr(iRight + 1).trim();
      return { contract, name };
    }
    exports2.parse = parse;
    function validateJsDocString(jsdoc) {
      var params = [], returns = null;
      jsdoc.split("\n").map(function(line) {
        return line.trim().replace(/\r/, "");
      }).filter(function(line) {
        return line.length;
      }).forEach(function(line) {
        switch (true) {
          case line.startsWith("@param"):
            params.push(parse(line));
            break;
          case line.startsWith("@returns"):
            returns = parse(line);
            break;
          default:
            throw new Exception_1.default("EINVALIDJSDOC", "only @param and @returns tags allowed");
        }
      });
      return { params, returns };
    }
    exports2.validateJsDocString = validateJsDocString;
  }
});

// node_modules/bycontract/dist/lib/scope.js
var require_scope = __commonJS({
  "node_modules/bycontract/dist/lib/scope.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var scope = typeof window !== "undefined" ? window : global;
    exports2.default = scope;
  }
});

// node_modules/bycontract/dist/bycontract.dev.js
var require_bycontract_dev = __commonJS({
  "node_modules/bycontract/dist/bycontract.dev.js"(exports2) {
    "use strict";
    var __assign = exports2 && exports2.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    var byContract_1 = __importDefault(require_byContract());
    var jsDoc_1 = require_jsDoc();
    var scope_1 = __importDefault(require_scope());
    exports2.validate = byContract_1.default.validate;
    exports2.Exception = byContract_1.default.Exception;
    exports2.typedef = byContract_1.default.typedef;
    exports2.config = byContract_1.default.config;
    exports2.validateCombo = byContract_1.default.validateCombo;
    exports2.is = byContract_1.default.is;
    function validateContract(strings) {
      var rest = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
      }
      if (!byContract_1.default.options.enable) {
        return "ignore";
      }
      strings.map(function(line) {
        return line.trim().replace(/[\r\n]/, "");
      }).filter(function(line) {
        return line.length;
      }).forEach(function(str, inx) {
        var contract = jsDoc_1.parse(str).contract;
        if (!contract || !(inx in rest)) {
          throw new exports2.Exception("EINVALIDJSODC", "invalid JSDOC. Expected syntax::\n  @param {string|number} ${ foo }\n  @param {number} ${ bar }\n         ");
        }
        try {
          exports2.validate(rest[inx], contract);
        } catch (err) {
          throw new exports2.Exception(err.code, "Argument #" + inx + ": " + err.message);
        }
      });
      return "ignore";
    }
    exports2.validateContract = validateContract;
    function validateJsdoc(contracts) {
      return function(target, propKey, descriptor) {
        var callback = descriptor.value, _a = jsDoc_1.validateJsDocString(contracts), params = _a.params, returns = _a.returns;
        if (!byContract_1.default.options.enable) {
          return descriptor;
        }
        return Object.assign({}, descriptor, {
          value: function() {
            var args = Array.from(arguments);
            params.forEach(function(param, inx) {
              try {
                exports2.validate(args[inx], param.contract);
              } catch (err) {
                throw new exports2.Exception(err.code, "Method: " + propKey + ", parameter " + param.name + ": " + err.message);
              }
            });
            var retVal = callback.apply(this, args);
            try {
              returns && exports2.validate(retVal, returns.contract);
            } catch (err) {
              throw new exports2.Exception(err.code, "Method: " + propKey + ", return value: " + err.message);
            }
            return retVal;
          }
        });
      };
    }
    exports2.validateJsdoc = validateJsdoc;
    scope_1.default.byContract = __assign(__assign({}, byContract_1.default), { validateJsdoc, validateContract });
  }
});

// node_modules/ansi-regex/index.js
var require_ansi_regex = __commonJS({
  "node_modules/ansi-regex/index.js"(exports2, module2) {
    "use strict";
    module2.exports = (options) => {
      options = Object.assign({
        onlyFirst: false
      }, options);
      const pattern = [
        "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
        "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"
      ].join("|");
      return new RegExp(pattern, options.onlyFirst ? void 0 : "g");
    };
  }
});

// node_modules/strip-ansi/index.js
var require_strip_ansi = __commonJS({
  "node_modules/strip-ansi/index.js"(exports2, module2) {
    "use strict";
    var ansiRegex = require_ansi_regex();
    var stripAnsi = (string) => typeof string === "string" ? string.replace(ansiRegex(), "") : string;
    module2.exports = stripAnsi;
    module2.exports.default = stripAnsi;
  }
});

// node_modules/prompt-sync/index.js
var require_prompt_sync = __commonJS({
  "node_modules/prompt-sync/index.js"(exports2, module2) {
    "use strict";
    var fs = require("fs");
    var stripAnsi = require_strip_ansi();
    var term = 13;
    function create(config) {
      config = config || {};
      var sigint = config.sigint;
      var eot = config.eot;
      var autocomplete = config.autocomplete = config.autocomplete || function() {
        return [];
      };
      var history = config.history;
      prompt2.history = history || { save: function() {
      } };
      prompt2.hide = function(ask) {
        return prompt2(ask, { echo: "" });
      };
      return prompt2;
      function prompt2(ask, value, opts) {
        var insert = 0, savedinsert = 0, res, i, savedstr;
        opts = opts || {};
        if (Object(ask) === ask) {
          opts = ask;
          ask = opts.ask;
        } else if (Object(value) === value) {
          opts = value;
          value = opts.value;
        }
        ask = ask || "";
        var echo = opts.echo;
        var masked = "echo" in opts;
        autocomplete = opts.autocomplete || autocomplete;
        var fd = process.platform === "win32" ? process.stdin.fd : fs.openSync("/dev/tty", "rs");
        var wasRaw = process.stdin.isRaw;
        if (!wasRaw) {
          process.stdin.setRawMode && process.stdin.setRawMode(true);
        }
        var buf = Buffer.alloc(3);
        var str = "", character, read;
        savedstr = "";
        if (ask) {
          process.stdout.write(ask);
        }
        var cycle = 0;
        var prevComplete;
        while (true) {
          read = fs.readSync(fd, buf, 0, 3);
          if (read > 1) {
            switch (buf.toString()) {
              case "\x1B[A":
                if (masked) break;
                if (!history) break;
                if (history.atStart()) break;
                if (history.atEnd()) {
                  savedstr = str;
                  savedinsert = insert;
                }
                str = history.prev();
                insert = str.length;
                process.stdout.write("\x1B[2K\x1B[0G" + ask + str);
                break;
              case "\x1B[B":
                if (masked) break;
                if (!history) break;
                if (history.pastEnd()) break;
                if (history.atPenultimate()) {
                  str = savedstr;
                  insert = savedinsert;
                  history.next();
                } else {
                  str = history.next();
                  insert = str.length;
                }
                process.stdout.write("\x1B[2K\x1B[0G" + ask + str + "\x1B[" + (insert + ask.length + 1) + "G");
                break;
              case "\x1B[D":
                if (masked) break;
                var before = insert;
                insert = --insert < 0 ? 0 : insert;
                if (before - insert)
                  process.stdout.write("\x1B[1D");
                break;
              case "\x1B[C":
                if (masked) break;
                insert = ++insert > str.length ? str.length : insert;
                process.stdout.write("\x1B[" + (insert + ask.length + 1) + "G");
                break;
              default:
                if (buf.toString()) {
                  str = str + buf.toString();
                  str = str.replace(/\0/g, "");
                  insert = str.length;
                  promptPrint(masked, ask, echo, str, insert);
                  process.stdout.write("\x1B[" + (insert + ask.length + 1) + "G");
                  buf = Buffer.alloc(3);
                }
            }
            continue;
          }
          character = buf[read - 1];
          if (character == 3) {
            process.stdout.write("^C\n");
            fs.closeSync(fd);
            if (sigint) process.exit(130);
            process.stdin.setRawMode && process.stdin.setRawMode(wasRaw);
            return null;
          }
          if (character == 4) {
            if (str.length == 0 && eot) {
              process.stdout.write("exit\n");
              process.exit(0);
            }
          }
          if (character == term) {
            fs.closeSync(fd);
            if (!history) break;
            if (!masked && str.length) history.push(str);
            history.reset();
            break;
          }
          if (character == 9) {
            res = autocomplete(str);
            if (str == res[0]) {
              res = autocomplete("");
            } else {
              prevComplete = res.length;
            }
            if (res.length == 0) {
              process.stdout.write("	");
              continue;
            }
            var item = res[cycle++] || res[cycle = 0, cycle++];
            if (item) {
              process.stdout.write("\r\x1B[K" + ask + item);
              str = item;
              insert = item.length;
            }
          }
          if (character == 127 || process.platform == "win32" && character == 8) {
            if (!insert) continue;
            str = str.slice(0, insert - 1) + str.slice(insert);
            insert--;
            process.stdout.write("\x1B[2D");
          } else {
            if (character < 32 || character > 126)
              continue;
            str = str.slice(0, insert) + String.fromCharCode(character) + str.slice(insert);
            insert++;
          }
          ;
          promptPrint(masked, ask, echo, str, insert);
        }
        process.stdout.write("\n");
        process.stdin.setRawMode && process.stdin.setRawMode(wasRaw);
        return str || value || "";
      }
      ;
      function promptPrint(masked, ask, echo, str, insert) {
        if (masked) {
          process.stdout.write("\x1B[2K\x1B[0G" + ask + Array(str.length + 1).join(echo));
        } else {
          process.stdout.write("\x1B[s");
          if (insert == str.length) {
            process.stdout.write("\x1B[2K\x1B[0G" + ask + str);
          } else {
            if (ask) {
              process.stdout.write("\x1B[2K\x1B[0G" + ask + str);
            } else {
              process.stdout.write("\x1B[2K\x1B[0G" + str + "\x1B[" + (str.length - insert) + "D");
            }
          }
          var askLength = stripAnsi(ask).length;
          process.stdout.write(`\x1B[${askLength + 1 + (echo == "" ? 0 : insert)}G`);
        }
      }
    }
    module2.exports = create;
  }
});

// Basicas.js
var import_bycontract = __toESM(require_bycontract_dev(), 1);
var import_prompt_sync = __toESM(require_prompt_sync(), 1);
var prompt = (0, import_prompt_sync.default)({ sigint: true });
var Ferramenta = class {
  #nome;
  constructor(nome) {
    (0, import_bycontract.validate)(nome, "String");
    this.#nome = nome;
  }
  get nome() {
    return this.#nome;
  }
  usar() {
    return true;
  }
};
var Mochila = class {
  #ferramentas;
  #limite;
  constructor(limite = 4) {
    this.#ferramentas = [];
    this.#limite = limite;
  }
  guarda(ferramenta) {
    (0, import_bycontract.validate)(ferramenta, Ferramenta);
    if (this.#ferramentas.length >= this.#limite) {
      console.log("Mochila cheia! N\xE3o \xE9 poss\xEDvel guardar mais ferramentas.");
      return false;
    }
    this.#ferramentas.push(ferramenta);
    return true;
  }
  pega(nomeFerramenta) {
    (0, import_bycontract.validate)(arguments, ["String"]);
    let ferramenta = this.#ferramentas.find((f) => f.nome === nomeFerramenta);
    return ferramenta;
  }
  tem(nomeFerramenta) {
    (0, import_bycontract.validate)(arguments, ["String"]);
    return this.#ferramentas.some((f) => f.nome === nomeFerramenta);
  }
  remove(nomeFerramenta) {
    (0, import_bycontract.validate)(arguments, ["String"]);
    const index = this.#ferramentas.findIndex((f) => f.nome === nomeFerramenta);
    if (index >= 0) {
      this.#ferramentas.splice(index, 1);
      return true;
    }
    return false;
  }
  inventario() {
    if (this.#ferramentas.length === 0) {
      return "Nenhuma ferramenta";
    }
    return this.#ferramentas.map((obj) => obj.nome).join(", ");
  }
};
var Objeto = class {
  #nome;
  #descricaoAntesAcao;
  #descricaoDepoisAcao;
  #acaoOk;
  constructor(nome, descricaoAntesAcao, descricaoDepoisAcao) {
    (0, import_bycontract.validate)(arguments, ["String", "String", "String"]);
    this.#nome = nome;
    this.#descricaoAntesAcao = descricaoAntesAcao;
    this.#descricaoDepoisAcao = descricaoDepoisAcao;
    this.#acaoOk = false;
  }
  get nome() {
    return this.#nome;
  }
  get acaoOk() {
    return this.#acaoOk;
  }
  set acaoOk(acaoOk) {
    (0, import_bycontract.validate)(acaoOk, "Boolean");
    this.#acaoOk = acaoOk;
  }
  get descricao() {
    if (!this.acaoOk) {
      return this.#descricaoAntesAcao;
    } else {
      return this.#descricaoDepoisAcao;
    }
  }
  usa(ferramenta, objeto) {
    return false;
  }
};
var Sala = class {
  #nome;
  #objetos;
  #ferramentas;
  #portas;
  #engine;
  constructor(nome, engine) {
    (0, import_bycontract.validate)(arguments, ["String", Engine]);
    this.#nome = nome;
    this.#objetos = /* @__PURE__ */ new Map();
    this.#ferramentas = /* @__PURE__ */ new Map();
    this.#portas = /* @__PURE__ */ new Map();
    this.#engine = engine;
  }
  get nome() {
    return this.#nome;
  }
  get objetos() {
    return this.#objetos;
  }
  get ferramentas() {
    return this.#ferramentas;
  }
  get portas() {
    return this.#portas;
  }
  get engine() {
    return this.#engine;
  }
  objetosDisponiveis() {
    let arrObjs = [...this.#objetos.values()];
    return arrObjs.map((obj) => obj.nome + ": " + obj.descricao);
  }
  ferramentasDisponiveis() {
    let arrFer = [...this.#ferramentas.values()];
    return arrFer.map((f) => f.nome);
  }
  portasDisponiveis() {
    let arrPortas = [...this.#portas.values()];
    return arrPortas.map((sala) => sala.nome);
  }
  pega(nomeFerramenta) {
    (0, import_bycontract.validate)(nomeFerramenta, "String");
    let ferramenta = this.#ferramentas.get(nomeFerramenta);
    if (ferramenta != null) {
      this.#engine.mochila.guarda(ferramenta);
      this.#ferramentas.delete(nomeFerramenta);
      return ferramenta;
    } else {
      return null;
    }
  }
  sai(porta) {
    (0, import_bycontract.validate)(porta, "String");
    return this.#portas.get(porta);
  }
  textoDescricao() {
    let descricao = "Voc\xEA est\xE1 no(a) " + this.nome + "\n";
    if (this.objetos.size == 0) {
      descricao += "N\xE3o h\xE1 objetos vis\xEDveis na sala\n";
    } else {
      descricao += "Objetos: " + this.objetosDisponiveis().join(", ") + "\n";
    }
    if (this.ferramentas.size == 0) {
      descricao += "N\xE3o h\xE1 ferramentas na sala\n";
    } else {
      descricao += "Ferramentas: " + this.ferramentasDisponiveis().join(", ") + "\n";
    }
    descricao += "Sa\xEDdas: " + this.portasDisponiveis().join(", ") + "\n";
    return descricao;
  }
  usa(ferramenta, objeto) {
    return false;
  }
};
var Engine = class {
  #mochila;
  #salaCorrente;
  #fim;
  constructor() {
    this.#mochila = new Mochila();
    this.#salaCorrente = null;
    this.#fim = false;
    this.criaCenario();
  }
  get mochila() {
    return this.#mochila;
  }
  get salaCorrente() {
    return this.#salaCorrente;
  }
  set salaCorrente(sala) {
    (0, import_bycontract.validate)(sala, Sala);
    this.#salaCorrente = sala;
  }
  get fim() {
    return this.#fim;
  }
  set fim(valor) {
    (0, import_bycontract.validate)(valor, "Boolean");
    this.#fim = valor;
  }
  indicaFimDeJogo() {
    this.#fim = true;
  }
  // Para criar um jogo deriva-se uma classe a partir de
  // Engine e se sobrescreve o método "criaCenario"
  criaCenario() {
  }
  // Para poder acionar o método "joga" deve-se garantir que
  // o método "criaCenario" foi acionado antes
  joga() {
    let novaSala = null;
    let acao = "";
    let tokens = null;
    while (!this.#fim) {
      console.log("-------------------------");
      console.log(this.salaCorrente.textoDescricao());
      acao = prompt("O que voc\xEA deseja fazer? ");
      tokens = acao.split(" ");
      switch (tokens[0]) {
        case "fim":
          this.#fim = true;
          break;
        case "pega":
          if (this.salaCorrente.pega(tokens[1])) {
            console.log("Ok! " + tokens[1] + " guardado!");
          } else {
            console.log("Objeto " + tokens[1] + " n\xE3o encontrado.");
          }
          break;
        case "inventario":
          console.log("Ferramentas dispon\xEDveis: " + this.#mochila.inventario());
          break;
        case "usa":
          if (tokens.length >= 3) {
            if (this.salaCorrente.usa(tokens[1], tokens[2])) {
              console.log("Feito!");
              if (this.#fim == true) {
                console.log("Parab\xE9ns, voc\xEA venceu!");
              }
            } else {
              console.log(
                "N\xE3o \xE9 poss\xEDvel usar " + tokens[1] + " sobre " + tokens[2] + " nesta sala"
              );
            }
          } else if (tokens.length === 2) {
            if (this.salaCorrente.usa("", tokens[1])) {
              console.log("Feito!");
            } else {
              console.log("N\xE3o \xE9 poss\xEDvel interagir com " + tokens[1]);
            }
          }
          break;
        case "sai":
          novaSala = this.salaCorrente.sai(tokens[1]);
          if (novaSala == null) {
            console.log("Sala desconhecida...");
          } else {
            this.#salaCorrente = novaSala;
          }
          break;
        default:
          console.log("Comando desconhecido: " + tokens[0]);
          console.log("Comandos dispon\xEDveis: pega, usa, sai, inventario, fim");
          break;
      }
    }
    console.log("Jogo encerrado!");
  }
};

// Salas.js
var import_bycontract3 = __toESM(require_bycontract_dev(), 1);

// Ferramentas.js
var Pa = class extends Ferramenta {
  constructor() {
    super("pa");
  }
};
var ControleRemoto = class extends Ferramenta {
  #pilhas;
  #usos;
  constructor() {
    super("controle_remoto");
    this.#pilhas = false;
    this.#usos = 0;
  }
  // Adiciona pilhas e define 3 usos
  colocarPilhas() {
    this.#pilhas = true;
    this.#usos = 3;
  }
  // Usa o controle - reduz usos disponíveis
  usar() {
    if (!this.#pilhas || this.#usos <= 0) {
      return false;
    }
    this.#usos--;
    return true;
  }
  // Getter para verificar se tem pilhas
  get temPilhas() {
    return this.#pilhas;
  }
  // Getter para verificar usos restantes
  get usosRestantes() {
    return this.#usos;
  }
};
var ChaveCasa = class extends Ferramenta {
  constructor() {
    super("chave_casa");
  }
};
var PeDeCabra = class extends Ferramenta {
  #usado;
  constructor() {
    super("pe_de_cabra");
    this.#usado = false;
  }
  // Pode ser usado apenas uma vez
  usar() {
    if (this.#usado) {
      return false;
    }
    this.#usado = true;
    return true;
  }
};
var Relogio = class extends Ferramenta {
  #engine;
  constructor(engine) {
    super("relogio");
    this.#engine = engine;
  }
  // Método para ver as horas atuais
  verHoras() {
    return this.#engine.horaAtual;
  }
};
var ChavePisoSecreto = class extends Ferramenta {
  constructor() {
    super("chave_piso_secreto");
  }
};

// Objetos.js
var import_bycontract2 = __toESM(require_bycontract_dev(), 1);
var PedacoTerra = class extends Objeto {
  constructor() {
    super(
      "pedaco_terra",
      "Um peda\xE7o de terra que parece ter sido mexido recentemente",
      "Buraco cavado na terra. Voc\xEA encontrou uma chave do piso secreto!"
    );
  }
  // Só pode ser usado com pá
  usar(ferramenta) {
    (0, import_bycontract2.validate)(ferramenta, Ferramenta);
    if (ferramenta instanceof Pa) {
      this.acaoOk = true;
      return true;
    }
    return false;
  }
};
var CarroGaragem = class extends Objeto {
  constructor() {
    super(
      "carro",
      "Um carro antigo com vidros emba\xE7ados",
      "Carro com vidro quebrado. Estava vazio."
    );
  }
  // Vidro pode ser quebrado com pá
  usar(ferramenta) {
    (0, import_bycontract2.validate)(ferramenta, Ferramenta);
    if (ferramenta instanceof Pa) {
      this.acaoOk = true;
      return true;
    }
    return false;
  }
};
var PortaSalaEstar = class extends Objeto {
  constructor() {
    super(
      "porta_sala_estar",
      "Porta trancada da sala de estar",
      "Porta da sala de estar est\xE1 aberta"
    );
  }
  // Precisa da chave da casa para abrir
  usar(ferramenta) {
    (0, import_bycontract2.validate)(ferramenta, Ferramenta);
    if (ferramenta instanceof ChaveCasa) {
      this.acaoOk = true;
      return true;
    }
    return false;
  }
};
var GavetaCozinha = class extends Objeto {
  constructor() {
    super(
      "gaveta_cozinha",
      "Gaveta da cozinha fechada",
      "Gaveta aberta. Voc\xEA encontrou pilhas e um controle remoto!"
    );
  }
  // Abre sem ferramenta
  usar() {
    this.acaoOk = true;
    return true;
  }
};
var ArmarioVidro = class extends Objeto {
  constructor() {
    super(
      "armario_vidro",
      "Arm\xE1rio de vidro trancado",
      "Arm\xE1rio de vidro aberto. H\xE1 uma chave da casa dentro!"
    );
  }
  // Abre sem ferramenta
  usar() {
    this.acaoOk = true;
    return true;
  }
};
var LivrosBiblioteca = class extends Objeto {
  constructor() {
    super(
      "livros",
      "Livros empoeirados na estante",
      "Nos livros h\xE1 anota\xE7\xF5es: 'A chave est\xE1 enterrada no jardim'"
    );
  }
  // Lê sem ferramenta - revela localização da chave
  usar() {
    this.acaoOk = true;
    return true;
  }
};
var ArmarioSalaJantar = class extends Objeto {
  constructor() {
    super(
      "armario_sala_jantar",
      "Arm\xE1rio da sala de jantar",
      "Arm\xE1rio vazio, nada de \xFAtil aqui"
    );
  }
  // Precisa da chave da casa
  usar(ferramenta) {
    (0, import_bycontract2.validate)(ferramenta, Ferramenta);
    if (ferramenta instanceof ChaveCasa) {
      this.acaoOk = true;
      return true;
    }
    return false;
  }
};
var ArmarioQuarto = class extends Objeto {
  constructor() {
    super(
      "armario_quarto",
      "Arm\xE1rio do quarto trancado",
      "Arm\xE1rio aberto. H\xE1 um rel\xF3gio antigo dentro!"
    );
  }
  // Precisa da chave da casa
  usar(ferramenta) {
    (0, import_bycontract2.validate)(ferramenta, Ferramenta);
    if (ferramenta instanceof ChaveCasa) {
      this.acaoOk = true;
      return true;
    }
    return false;
  }
};
var Cachorro = class extends Objeto {
  constructor() {
    super(
      "cachorro",
      "Um cachorro feroz bloqueando a passagem",
      "O cachorro correu quando o port\xE3o se abriu"
    );
  }
  // Interação direta causa derrota
  usar() {
    return "DERROTA_CACHORRO";
  }
};
var Espelho = class extends Objeto {
  #engine;
  constructor(engine) {
    super(
      "espelho",
      "Um espelho empoeirado na parede",
      "Voc\xEA se olha no espelho"
    );
    this.#engine = engine;
  }
  // Mostra estado de cansaço baseado no nível
  usar() {
    const c = this.#engine.nivelCansaco;
    if (c < 20) {
      console.log("Otto parece alerta e focado.");
    } else if (c < 50) {
      console.log("Otto est\xE1 um pouco cansado mas ainda determinado.");
    } else if (c < 80) {
      console.log(
        "Otto est\xE1 visivelmente cansado, com olheiras marcantes e express\xE3o pesada."
      );
    } else {
      console.log(
        "Otto est\xE1 exausto, quase no limite, mal se reconhecendo no espelho. "
      );
    }
    return true;
  }
};
var PortaSotao = class extends Objeto {
  constructor() {
    super(
      "porta_sotao",
      "Porta trancada do s\xF3t\xE3o",
      "Porta do s\xF3t\xE3o aberta. Voc\xEA encontrou evid\xEAncias de Jerry!"
    );
  }
  // Precisa da chave do piso secreto - condição de vitória
  usar(ferramenta) {
    (0, import_bycontract2.validate)(ferramenta, Ferramenta);
    if (ferramenta instanceof ChavePisoSecreto) {
      this.acaoOk = true;
      return "VITORIA";
    }
    return false;
  }
};
var PortaBiblioteca = class extends Objeto {
  constructor() {
    super(
      "porta_biblioteca",
      "Porta emperrada da biblioteca",
      "Porta da biblioteca for\xE7ada e aberta"
    );
  }
  // Precisa de pé de cabra para forçar
  usar(ferramenta) {
    (0, import_bycontract2.validate)(ferramenta, Ferramenta);
    if (ferramenta instanceof PeDeCabra && ferramenta.usar()) {
      this.acaoOk = true;
      return true;
    }
    return false;
  }
};
var PortaoFundos = class extends Objeto {
  constructor() {
    super(
      "portao_fundos",
      "Port\xE3o dos fundos fechado",
      "Port\xE3o dos fundos aberto"
    );
  }
  // Precisa do controle remoto funcionando
  usar(ferramenta) {
    (0, import_bycontract2.validate)(ferramenta, Ferramenta);
    if (ferramenta instanceof ControleRemoto && ferramenta.usar()) {
      this.acaoOk = true;
      return true;
    }
    return false;
  }
};
var PortaoGaragem = class extends Objeto {
  constructor() {
    super(
      "portao_garagem",
      "Port\xE3o da garagem fechado",
      "Port\xE3o da garagem aberto"
    );
  }
  // Precisa do controle remoto funcionando
  usar(ferramenta) {
    (0, import_bycontract2.validate)(ferramenta, Ferramenta);
    if (ferramenta instanceof ControleRemoto && ferramenta.usar()) {
      this.acaoOk = true;
      return true;
    }
    return false;
  }
};

// Salas.js
var Jardim = class extends Sala {
  constructor(engine) {
    (0, import_bycontract3.validate)(engine, Engine);
    super("Jardim", engine);
    this.objetos.set("portao_garagem", new PortaoGaragem());
  }
  // Gerencia uso de ferramentas nos objetos do jardim
  usa(nomeFerramenta, nomeObjeto) {
    (0, import_bycontract3.validate)(arguments, ["String", "String"]);
    if (nomeObjeto === "pedaco_terra") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("pedaco_terra");
      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        if (!objeto.acaoOk) return false;
        this.ferramentas.set("chave_piso_secreto", new ChavePisoSecreto());
        console.log(
          "Otto cavava com cuidado, quase em sil\xEAncio, exatamente no lugar indicado nos livros que encontrara na biblioteca. Segundo aqueles registros, Jerry havia escondido ali algo importante, longe dos olhos de qualquer curioso. A p\xE1 bateu em algo met\xE1lico pouco abaixo da superf\xEDcie. Ele afastou a terra com as m\xE3os e revelou uma pequena caixa de metal, ainda intacta, sem sinais de corros\xE3o. A fechadura estava em uso recente, mas cedeu facilmente ao seu toque. Dentro, envolta em um pano grosso e \xFAmido, repousava uma chave grande, de dentes largos e desenho antigo, claramente usada com frequ\xEAncia. Otto reconheceu imediatamente. Era a chave do piso secreto. A chave que abria o acesso ao compartimento oculto da casa \u2014 o verdadeiro motivo daquela investiga\xE7\xE3o. O rel\xF3gio n\xE3o parava. O tempo era curto. O objetivo estava pr\xF3ximo."
        );
        return true;
      }
    } else if (nomeObjeto === "portao_garagem") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("portao_garagem");
      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        console.log(
          "O port\xE3o da garagem rangeu ao deslizar lentamente, abrindo-se com o clique do controle remoto. O sil\xEAncio do lugar parecia ainda mais pesado agora."
        );
        return true;
      }
    }
    return false;
  }
};
var Garagem = class extends Sala {
  constructor(engine) {
    (0, import_bycontract3.validate)(engine, Engine);
    super("Garagem", engine);
    this.objetos.set("carro", new CarroGaragem());
    this.ferramentas.set("pa", new Pa());
  }
  usa(nomeFerramenta, nomeObjeto) {
    (0, import_bycontract3.validate)(arguments, ["String", "String"]);
    if (nomeObjeto === "portao_garagem") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("portao_garagem");
      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        console.log("Port\xE3o da garagem aberto!");
        return true;
      }
    } else if (nomeObjeto === "carro") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("carro");
      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        console.log(
          "Com um golpe firme, Otto quebrou o vidro do carro com a p\xE1. O estalo do vidro se espalhou pelo sil\xEAncio pesado do jardim. Ele olhou para dentro, esperando encontrar algo \u2014 alguma pista, um objeto esquecido, uma prova escondida. Mas o interior estava vazio, tomado por lixo velho e tralhas acumuladas ao longo do tempo. O carro n\xE3o parecia ter sido usado h\xE1 muito tempo; o banco estava rasgado, os pain\xE9is empoeirados e o cheiro de mofo impregnava o ar. N\xE3o havia nada ali que pudesse ajud\xE1-lo, s\xF3 o eco do abandono e do descaso."
        );
        return true;
      }
    }
    return false;
  }
};
var HallInferior = class extends Sala {
  constructor(engine) {
    (0, import_bycontract3.validate)(engine, Engine);
    super("Hall_Inferior", engine);
    this.objetos.set("espelho", new Espelho(engine));
    this.objetos.set("porta_sala_estar", new PortaSalaEstar());
  }
  usa(nomeFerramenta, nomeObjeto) {
    (0, import_bycontract3.validate)(arguments, ["String", "String"]);
    if (nomeObjeto === "espelho" && !nomeFerramenta) {
      let objeto = this.objetos.get("espelho");
      if (objeto) {
        objeto.usar();
        return true;
      }
    }
    if (nomeObjeto === "porta_sala_estar") {
      const ferramenta = this.engine.mochila.pega(nomeFerramenta);
      const objeto = this.objetos.get("porta_sala_estar");
      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        console.log(
          "Otto girou a chave com cuidado e destrancou a porta da sala de estar. O rangido da madeira velha se espalhou pelo sil\xEAncio da casa, mostrando a imensid\xE3o do local"
        );
        return true;
      }
    }
    return false;
  }
};
var Cozinha = class extends Sala {
  constructor(engine) {
    (0, import_bycontract3.validate)(engine, Engine);
    super("Cozinha", engine);
    this.objetos.set("gaveta_cozinha", new GavetaCozinha());
  }
  usa(nomeFerramenta, nomeObjeto) {
    (0, import_bycontract3.validate)(arguments, ["String", "String"]);
    if (nomeObjeto === "gaveta_cozinha") {
      let objeto = this.objetos.get("gaveta_cozinha");
      if (objeto && objeto.usar()) {
        let controle = new ControleRemoto();
        controle.colocarPilhas();
        this.ferramentas.set("controle_remoto", controle);
        console.log(
          "Otto abriu a gaveta da cozinha e encontrou o controle remoto, com as pilhas j\xE1 colocadas. Era a pe\xE7a que faltava para controlar o port\xE3o da garagem."
        );
        return true;
      }
    }
    return false;
  }
};
var Banheiro = class extends Sala {
  constructor(engine) {
    (0, import_bycontract3.validate)(engine, Engine);
    super("Banheiro", engine);
    this.objetos.set("armario_vidro", new ArmarioVidro());
  }
  usa(nomeFerramenta, nomeObjeto) {
    (0, import_bycontract3.validate)(arguments, ["String", "String"]);
    const objeto = this.objetos.get(nomeObjeto);
    if (!nomeFerramenta && objeto && objeto.usar()) {
      this.ferramentas.set("chave_casa", new ChaveCasa());
      console.log(
        "Otto abriu o arm\xE1rio do banheiro e encontrou uma chave simples. A fechadura parecia comum, como as usadas nas portas da casa, poderia ser \xFAtil."
      );
      return true;
    }
    return false;
  }
};
var SalaEstar = class extends Sala {
  constructor(engine) {
    (0, import_bycontract3.validate)(engine, Engine);
    super("Sala_de_Estar", engine);
  }
  usa(nomeFerramenta, nomeObjeto) {
    (0, import_bycontract3.validate)(arguments, ["String", "String"]);
    if (nomeObjeto === "porta_sala_estar") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("porta_sala_estar");
      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        console.log(
          "Otto girou a chave com cuidado e destrancou a porta da sala de estar. O rangido da madeira velha se espalhou pelo sil\xEAncio da casa, mostrando a imensid\xE3o do local"
        );
        return true;
      }
    }
    return false;
  }
};
var SalaJantar = class extends Sala {
  constructor(engine) {
    (0, import_bycontract3.validate)(engine, Engine);
    super("Sala_de_Jantar", engine);
    this.objetos.set("armario_sala_jantar", new ArmarioSalaJantar());
    this.objetos.set("portao_fundos", new PortaoFundos());
  }
  usa(nomeFerramenta, nomeObjeto) {
    (0, import_bycontract3.validate)(arguments, ["String", "String"]);
    if (nomeObjeto === "armario_sala_jantar") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("armario_sala_jantar");
      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        console.log(
          "Otto abriu o arm\xE1rio da sala de jantar com cuidado. L\xE1 dentro, s\xF3 encontrou pratos, copos e alguns talheres \u2014 nada que pudesse ajudar na investiga\xE7\xE3o."
        );
        return true;
      }
    } else if (nomeObjeto === "portao_fundos") {
      const ferramenta = this.engine.mochila.pega(nomeFerramenta);
      const objeto = this.objetos.get("portao_fundos");
      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        console.log(
          "Otto apontou o controle remoto para o port\xE3o do p\xE1tio dos fundos. Com um clique suave, o port\xE3o se abriu lentamente, rangendo contra o sil\xEAncio do lugar."
        );
        const salaFundos = this.engine.todasAsSalas.find(
          (s) => s.nome === "Fundos"
        );
        if (salaFundos && salaFundos.objetos.has("cachorro")) {
          salaFundos.objetos.delete("cachorro");
          console.log(
            "O cachorro, que dormia tranquilamente ao lado, despertou com o som do port\xE3o rangendo. Levantou-se r\xE1pido e saiu correndo pelo p\xE1tio, desaparecendo na escurid\xE3o da floresta."
          );
        }
        return true;
      }
    }
    return false;
  }
};
var Fundos = class extends Sala {
  constructor(engine) {
    (0, import_bycontract3.validate)(engine, Engine);
    super("Fundos", engine);
    this.objetos.set("cachorro", new Cachorro());
    this.ferramentas.set("pe_de_cabra", new PeDeCabra());
  }
  usa(nomeFerramenta, nomeObjeto) {
    (0, import_bycontract3.validate)(arguments, ["String", "String"]);
    if (nomeObjeto === "cachorro") {
      let objeto = this.objetos.get("cachorro");
      if (objeto) {
        let resultado = objeto.usar();
        if (resultado === "DERROTA_CACHORRO") {
          console.log(
            "O cachorro dormia quieto ao lado, mas quando Otto tentou se aproximar, o animal despertou abruptamente e atacou sem aviso. Otto foi ferido gravemente antes de conseguir recuar."
          );
          this.engine.indicaDerrota("cachorro");
          return true;
        }
      }
    }
    return false;
  }
};
var HallSuperior = class extends Sala {
  constructor(engine) {
    (0, import_bycontract3.validate)(engine, Engine);
    super("Hall_Superior", engine);
    this.objetos.set("espelho", new Espelho(engine));
    this.objetos.set("porta_biblioteca", new PortaBiblioteca());
  }
  usa(nomeFerramenta, nomeObjeto) {
    (0, import_bycontract3.validate)(arguments, ["String", "String"]);
    if (nomeObjeto === "espelho" && !nomeFerramenta) {
      let objeto = this.objetos.get("espelho");
      if (objeto) {
        objeto.usar();
        return true;
      }
    }
    if (nomeObjeto === "porta_biblioteca") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("porta_biblioteca");
      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        console.log(
          "Otto usou o p\xE9 de cabra para arrombar a porta da biblioteca. A madeira cedeu com um estrondo seco, abrindo caminho para o que estava l\xE1 dentro."
        );
        return true;
      }
    }
    return false;
  }
};
var Quarto = class extends Sala {
  constructor(engine) {
    (0, import_bycontract3.validate)(engine, Engine);
    super("Quarto", engine);
    this.objetos.set("armario_quarto", new ArmarioQuarto());
  }
  usa(nomeFerramenta, nomeObjeto) {
    (0, import_bycontract3.validate)(arguments, ["String", "String"]);
    if (nomeObjeto === "armario_quarto") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("armario_quarto");
      if (ferramenta && objeto && objeto.usar(ferramenta)) {
        this.ferramentas.set("relogio", new Relogio(this.engine));
        console.log(
          "Otto abriu o arm\xE1rio do quarto e encontrou um velho rel\xF3gio de ponteiros. A pe\xE7a tinha a caixa de metal desgastada pelo tempo, o vidro arranhado e mostrava marcas de uso constante. No verso, uma inscri\xE7\xE3o quase apagada indicava o nome de Jerry."
        );
        return true;
      }
    }
    return false;
  }
};
var Biblioteca = class extends Sala {
  constructor(engine) {
    (0, import_bycontract3.validate)(engine, Engine);
    super("Biblioteca", engine);
    this.objetos.set("livros", new LivrosBiblioteca());
  }
  usa(nomeFerramenta, nomeObjeto) {
    (0, import_bycontract3.validate)(arguments, ["String", "String"]);
    if (nomeObjeto === "livros") {
      let objeto = this.objetos.get("livros");
      if (objeto && objeto.usar()) {
        console.log(
          "Otto passou um tempo lendo os livros antigos, folheando p\xE1ginas amareladas e poeirentas. Entre as anota\xE7\xF5es manuscritas, encontrou pistas sutis que indicavam que a chave do s\xF3t\xE3o estava escondida no p\xE1tio da frente."
        );
        const salaJardim = this.engine.todasAsSalas.find(
          (s) => s.nome === "Jardim"
        );
        if (salaJardim && !salaJardim.objetos.has("pedaco_terra")) {
          salaJardim.objetos.set("pedaco_terra", new PedacoTerra());
          console.log("Voc\xEA percebe algo diferente no jardim agora...");
        }
        return true;
      }
    }
    return false;
  }
};
var Sotao = class extends Sala {
  constructor(engine) {
    (0, import_bycontract3.validate)(engine, Engine);
    super("Sotao", engine);
    this.objetos.set("porta_sotao", new PortaSotao());
  }
  usa(nomeFerramenta, nomeObjeto) {
    (0, import_bycontract3.validate)(arguments, ["String", "String"]);
    if (nomeObjeto === "porta_sotao") {
      let ferramenta = this.engine.mochila.pega(nomeFerramenta);
      let objeto = this.objetos.get("porta_sotao");
      if (ferramenta && objeto) {
        let resultado = objeto.usar(ferramenta);
        if (resultado === "VITORIA") {
          console.log(
            "Otto encontrou provas irrefut\xE1veis ligando Jerry aos crimes. Cada detalhe parecia encaixar perfeitamente, confirmando suas suspeitas e revelando a verdadeira face do criminoso."
          );
          console.log(
            "Documentos, fotos e planos criminosos estavam espalhados pelo s\xF3t\xE3o, como pe\xE7as de um quebra-cabe\xE7a sombrio que s\xF3 agora come\xE7ava a ser montado."
          );
          console.log("Finalmente voc\xEA conseguiu as provas que precisava. ");
          this.engine.indicaVitoria();
          return true;
        }
      }
    }
    return false;
  }
};

// Jogo.js
var JogoOtto = class extends Engine {
  #horaAtual;
  // Controla o tempo do jogo (10h-19h)
  #nivelCansaco;
  // Sistema de cansaço (0-100)
  #jogoTerminado;
  // Flag para encerrar o jogo
  #motivoTermino;
  // Razão do fim do jogo
  constructor() {
    super();
    this.#horaAtual = 10;
    this.#nivelCansaco = 0;
    this.#jogoTerminado = false;
    this.#motivoTermino = "";
  }
  get horaAtual() {
    return this.#horaAtual;
  }
  get nivelCansaco() {
    return this.#nivelCansaco;
  }
  // Método para avançar o tempo quando o jogador faz ações
  avancaTempo(minutos = 15) {
    this.#horaAtual += minutos / 60;
    this.#nivelCansaco += 4;
    if (this.#horaAtual >= 19 && !this.#jogoTerminado) {
      console.log("\n=== GAME OVER ===");
      console.log(
        "S\xE3o 19 horas. A porta range lentamente e Jerry finalmente aparece. O ar fica pesado, o sil\xEAncio \xE9 quebrado por passos firmes. Voc\xEA foi pego."
      );
      console.log("Voc\xEA n\xE3o conseguiu escapar a tempo...");
      this.#motivoTermino = "tempo";
      this.indicaFimDeJogo();
      return;
    }
    if (this.#nivelCansaco >= 100 && !this.#jogoTerminado) {
      console.log("\n=== GAME OVER ===");
      console.log("Voc\xEA desmaiou de exaust\xE3o!");
      console.log("Otto n\xE3o aguentou mais e perdeu a consci\xEAncia...");
      this.#motivoTermino = "cansaco";
      this.indicaFimDeJogo();
      return;
    }
  }
  // Método para indicar derrota por motivo específico
  indicaDerrota(motivo) {
    this.#jogoTerminado = true;
    this.#motivoTermino = motivo;
    this.indicaFimDeJogo();
  }
  // Método para indicar vitória
  indicaVitoria() {
    this.#jogoTerminado = true;
    this.#motivoTermino = "vitoria";
    console.log("\n=== PARAB\xC9NS! VIT\xD3RIA! ===");
    console.log("Otto conseguiu as evid\xEAncias necess\xE1rias!");
    console.log("Agora Jerry pode finalmente ser preso!");
    this.indicaFimDeJogo();
  }
  // Método para descansar e reduzir cansaço
  descansar() {
    if (this.#nivelCansaco > 0) {
      this.#nivelCansaco = Math.max(0, this.#nivelCansaco - 30);
      this.avancaTempo(30);
      console.log("Voc\xEA descansou um pouco. Cansa\xE7o reduzido.");
    } else {
      console.log("Voc\xEA n\xE3o est\xE1 cansado.");
    }
  }
  criaCenario() {
    console.log("=== INVESTIGA\xC7\xC3O NA CASA DE JERRY ===");
    console.log(
      "Otto, o investigador veterano, chegou \xE0 casa suspeita \xE0s 10 da manh\xE3. A constru\xE7\xE3o antiga parecia esquecida pelo tempo, com a pintura descascada e janelas empoeiradas que mal deixavam passar a luz. O jardim \xE0 frente estava tomado pelo mato alto, e a cerca de madeira rangia sob o leve vento. A porta da frente, meio entreaberta, dava um convite silencioso e amea\xE7ador ao interior escuro. O ar carregado de abandono e segredos pairava ao redor do local, deixando claro que aquela casa guardava mais do que apenas poeira e sil\xEAncio."
    );
    console.log(
      "Objetivo: Encontrar evid\xEAncias contra Jerry antes que ele apare\xE7a \xE0s 19h!"
    );
    console.log("Cuidado com o tempo e seu n\xEDvel de cansa\xE7o!\n");
    let jardim = new Jardim(this);
    let hallInferior = new HallInferior(this);
    let cozinha = new Cozinha(this);
    let banheiro = new Banheiro(this);
    let garagem = new Garagem(this);
    let salaEstar = new SalaEstar(this);
    let salaJantar = new SalaJantar(this);
    let fundos = new Fundos(this);
    let hallSuperior = new HallSuperior(this);
    let quarto = new Quarto(this);
    let biblioteca = new Biblioteca(this);
    let sotao = new Sotao(this);
    jardim.portas.set(hallInferior.nome, hallInferior);
    jardim.portas.set(garagem.nome, garagem);
    hallInferior.portas.set(jardim.nome, jardim);
    hallInferior.portas.set(cozinha.nome, cozinha);
    hallInferior.portas.set(salaEstar.nome, salaEstar);
    cozinha.portas.set(hallInferior.nome, hallInferior);
    cozinha.portas.set(banheiro.nome, banheiro);
    banheiro.portas.set(cozinha.nome, cozinha);
    garagem.portas.set(jardim.nome, jardim);
    salaEstar.portas.set(hallInferior.nome, hallInferior);
    salaEstar.portas.set(salaJantar.nome, salaJantar);
    salaEstar.portas.set(hallSuperior.nome, hallSuperior);
    salaJantar.portas.set(salaEstar.nome, salaEstar);
    salaJantar.portas.set(fundos.nome, fundos);
    fundos.portas.set(salaJantar.nome, salaJantar);
    hallSuperior.portas.set(salaEstar.nome, salaEstar);
    hallSuperior.portas.set(quarto.nome, quarto);
    hallSuperior.portas.set(biblioteca.nome, biblioteca);
    hallSuperior.portas.set(sotao.nome, sotao);
    quarto.portas.set(hallSuperior.nome, hallSuperior);
    biblioteca.portas.set(hallSuperior.nome, hallSuperior);
    sotao.portas.set(hallSuperior.nome, hallSuperior);
    this.salaCorrente = jardim;
    this.todasAsSalas = [
      jardim,
      hallInferior,
      cozinha,
      banheiro,
      garagem,
      salaEstar,
      salaJantar,
      fundos,
      hallSuperior,
      quarto,
      biblioteca,
      sotao
    ];
  }
  // Sobrescreve o método joga para incluir comandos específicos do jogo
  joga() {
    let novaSala = null;
    let acao = "";
    let tokens = null;
    while (!this.fim) {
      console.log("-------------------------");
      console.log(this.salaCorrente.textoDescricao());
      acao = prompt("O que voc\xEA deseja fazer? ");
      tokens = acao.split(" ");
      switch (tokens[0].toLowerCase()) {
        case "fim":
          this.fim = true;
          break;
        case "inventario":
          console.log("Ferramentas dispon\xEDveis: " + this.mochila.inventario());
          break;
        case "usa":
          if (tokens.length >= 3) {
            if (this.salaCorrente.usa(tokens[1], tokens[2])) {
              console.log("Feito!");
              this.avancaTempo();
              if (this.fim === true) {
                console.log("Parab\xE9ns, voc\xEA venceu!");
              }
            } else {
              console.log(
                "N\xE3o \xE9 poss\xEDvel usar " + tokens[1] + " sobre " + tokens[2] + " nesta sala"
              );
            }
          } else if (tokens.length === 2) {
            const nome = tokens[1];
            if (nome === "relogio") {
              const ferramenta = this.mochila.pega("relogio");
              if (ferramenta && ferramenta.verHoras) {
                let hora = Math.floor(ferramenta.verHoras());
                let minutos = Math.floor((ferramenta.verHoras() - hora) * 60);
                console.log(
                  `S\xE3o ${hora}:${minutos.toString().padStart(2, "0")}h`
                );
                if (this.horaAtual >= 18) {
                  console.log("ATEN\xC7\xC3O: Jerry pode chegar a qualquer momento!");
                } else if (this.horaAtual >= 17) {
                  console.log("Cuidado: Est\xE1 ficando tarde...");
                }
                this.avancaTempo(1);
              }
            }
            if (this.salaCorrente.usa("", tokens[1])) {
              console.log("Feito!");
              this.avancaTempo();
            } else {
              console.log("N\xE3o \xE9 poss\xEDvel interagir com " + tokens[1]);
            }
          }
          break;
        case "sai":
          const bloqueios = {
            Sala_de_Estar: {
              objeto: "porta_sala_estar",
              mensagem: "A porta da sala de estar est\xE1 trancada. Talvez uma chave ajude."
            },
            Biblioteca: {
              objeto: "porta_biblioteca",
              mensagem: "A porta da biblioteca est\xE1 emperrada. Precisa ser for\xE7ada."
            },
            Sotao: {
              objeto: "porta_sotao",
              mensagem: "A porta do s\xF3t\xE3o est\xE1 trancada. Voc\xEA precisa da chave certa."
            },
            Garagem: {
              objeto: "portao_garagem",
              mensagem: "portao trancado"
            }
          };
          novaSala = this.salaCorrente.sai(tokens[1]);
          const bloqueio = bloqueios[novaSala?.nome];
          if (bloqueio) {
            const obj = this.salaCorrente.objetos.get(bloqueio.objeto);
            if (obj && !obj.acaoOk) {
              console.log(bloqueio.mensagem);
              break;
            }
          }
          if (novaSala == null) {
            console.log("Sala desconhecida...");
          } else {
            this.salaCorrente = novaSala;
            this.avancaTempo(5);
          }
          break;
        case "pega":
          if (this.salaCorrente.pega(tokens[1])) {
            console.log("Ok! " + tokens[1] + " guardado!");
            this.avancaTempo(10);
          } else {
            console.log("Objeto " + tokens[1] + " n\xE3o encontrado.");
          }
          break;
        case "remove":
          const itemRemovido = this.mochila.pega(tokens[1]);
          if (itemRemovido && this.mochila.remove(tokens[1])) {
            this.salaCorrente.ferramentas.set(itemRemovido.nome, itemRemovido);
            console.log(tokens[1] + " descartado no ch\xE3o da sala.");
            this.avancaTempo(5);
          } else {
            console.log("Voc\xEA n\xE3o tem " + tokens[1] + " na mochila.");
          }
          break;
        case "descansar":
          this.descansar();
          break;
        case "olhar":
          if (tokens[1] === "espelho") {
            this.olharEspelho();
          } else if (tokens[1] === "relogio") {
            this.olharRelogio();
          } else {
            console.log(
              "Comando n\xE3o reconhecido. Tente 'olhar espelho' ou 'olhar relogio'"
            );
          }
          break;
        default:
          console.log("Comando desconhecido: " + tokens[0]);
          console.log(
            "Comandos dispon\xEDveis: pega, usa, sai, remove, inventario, descansar, olhar, fim"
          );
          break;
      }
    }
    console.log("\n=== JOGO ENCERRADO ===");
    if (this.#motivoTermino === "vitoria") {
      console.log("Otto completou sua miss\xE3o com sucesso!");
    } else if (this.#motivoTermino === "tempo") {
      console.log("Jerry chegou antes que Otto pudesse escapar...");
    } else if (this.#motivoTermino === "cansaco") {
      console.log("Otto n\xE3o aguentou o cansa\xE7o...");
    } else if (this.#motivoTermino === "cachorro") {
      console.log("O cachorro impediu Otto de continuar...");
    } else {
      console.log("Otto decidiu encerrar a investiga\xE7\xE3o.");
    }
    prompt("\nPressione ENTER para sair...");
  }
};

// index.js
var jogo = new JogoOtto();
jogo.joga();
