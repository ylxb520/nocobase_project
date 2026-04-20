/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

/* globals define,module */

/*
Using a Universal Module Loader that should be browser, require, and AMD friendly
http://ricostacruz.com/cheatsheets/umdjs.html
*/

import { getDayRangeByParams } from '@nocobase/utils/client';

export function getOperators() {
  'use strict';
  /* globals console:false */

  if (!Array.isArray) {
    Array.isArray = function (arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  }

  /**
   * Return an array that contains no duplicates (original not modified)
   * @param  {array} array   Original reference array
   * @return {array}         New array with no duplicates
   */
  function arrayUnique(array) {
    var a = [];
    for (var i = 0, l = array.length; i < l; i++) {
      if (a.indexOf(array[i]) === -1) {
        a.push(array[i]);
      }
    }
    return a;
  }
  function areArraysEqual(arr1, arr2) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }

  var jsonLogic = {};
  var operations = {
    $is: function (a, b) {
      return a === b;
    },
    $match: function (a, b) {
      if (Array.isArray(a) && Array.isArray(b) && a.some((element) => Array.isArray(element))) {
        return a.some(
          (subArray) => subArray?.length === b.length && subArray?.every((element, index) => element === b[index]),
        );
      }
      return JSON.stringify(a) === JSON.stringify(b);
    },
    $eq: function (a, b) {
      if (Array.isArray(a) && Array.isArray(b)) return areArraysEqual(a, b);
      if (Array.isArray(a)) {
        return a.includes(b);
      }
      return a == b;
    },
    $ne: function (a, b) {
      return a != b;
    },
    '!==': function (a, b) {
      return a !== b;
    },
    $gt: function (a, b) {
      if (Array.isArray(a)) return a.some((k) => k > b);
      return a > b;
    },
    $gte: function (a, b) {
      return a >= b;
    },
    $lt: function (a, b, c) {
      if (Array.isArray(a)) return a.some((k) => k < b);
      return c === undefined ? a < b : a < b && b < c;
    },
    $lte: function (a, b, c) {
      return c === undefined ? a <= b : a <= b && b <= c;
    },
    $exists: function (a) {
      return jsonLogic.truthy(a);
    },
    $notEmpty: function (a) {
      return !operations.$empty(a);
    },
    $empty: function (a) {
      if (Array.isArray(a)) return a.length === 0;
      if (typeof a === 'string') return a.length === 0;
      return a === null || a === undefined;
    },
    $notExists: function (a) {
      return !jsonLogic.truthy(a);
    },
    '%': function (a, b) {
      return a % b;
    },
    log: function (a) {
      return a;
    },
    $in: function (a, b) {
      if (!b || typeof b.indexOf === 'undefined') return false;
      if (Array.isArray(a) && Array.isArray(b)) {
        return b.some((elementB) => a.includes(elementB));
      }
      return b.indexOf(a) !== -1;
    },
    $nin: function (a, b) {
      return !operations.$in(a, b);
    },
    $notIn: function (a, b) {
      return !operations.$in(a, b);
    },
    $or: function (a, b) {
      return a || b;
    },
    $and: function (a, b) {
      return a && b;
    },
    $not: function (a) {
      return !jsonLogic.truthy(a);
    },
    '!': function (a) {
      return !jsonLogic.truthy(a);
    },
    '!!': function (a) {
      return jsonLogic.truthy(a);
    },
    $date: {
      $dateBegin: function (a, b, c) {
        const range = getDayRangeByParams(b, c);
        return a >= range[0] && a <= range[1];
      },
      $dateNotBegin: function (a, b, c) {
        const range = getDayRangeByParams(b, c);
        return a < range[0] || a > range[1];
      },
    },
    var: function (a, b) {
      // undefined means ignore check
      if (a === undefined) {
        return jsonLogic.truthy(b);
      }
      return jsonLogic.truthy(a);
    },
    missing: function () {
      var fields = Array.isArray(arguments[0]) ? arguments[0] : Array.prototype.slice.call(arguments);
      var data = arguments[fields.length];
      var missing = [];
      for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        var value = jsonLogic.apply({ var: field }, data);
        if (value === null || value === undefined || value === '') {
          missing.push(field);
        }
      }
      return missing;
    },
    missing_some: function (need_count, options) {
      var are_missing = jsonLogic.apply({ missing: options }, this);
      if (options.length - are_missing.length >= need_count) {
        return [];
      } else {
        return are_missing;
      }
    },
  };

  jsonLogic.is_logic = function (logic) {
    return (
      typeof logic === 'object' &&
      logic !== null &&
      !Array.isArray(logic) &&
      Object.keys(logic).length === 1 &&
      !logic.type
    );
  };

  jsonLogic.truthy = function (value) {
    if (Array.isArray(value) && value.length === 0) {
      return false;
    }
    return !!value;
  };

  jsonLogic.getOperator = function (logic) {
    return Object.keys(logic)[0];
  };

  jsonLogic.getValues = function (logic) {
    return logic[jsonLogic.getOperator(logic)];
  };

  jsonLogic.apply = function (logic, data) {
    if (Array.isArray(logic)) {
      return logic.map(function (l) {
        return jsonLogic.apply(l, data);
      });
    }
    if (!jsonLogic.is_logic(logic)) {
      return logic;
    }

    var op = jsonLogic.getOperator(logic);
    var values = logic[op];
    var i;
    var current;
    var scopedLogic;
    var scopedData;
    var initial;

    if (!Array.isArray(values)) {
      values = [values];
    }

    if (op === 'if' || op == '?:') {
      for (i = 0; i < values.length - 1; i += 2) {
        if (jsonLogic.truthy(jsonLogic.apply(values[i], data))) {
          return jsonLogic.apply(values[i + 1], data);
        }
      }
      if (values.length === i + 1) {
        return jsonLogic.apply(values[i], data);
      }
      return null;
    } else if (op === '$and') {
      for (i = 0; i < values.length; i += 1) {
        current = jsonLogic.apply(values[i], data);
        if (!jsonLogic.truthy(current)) {
          return current;
        }
      }
      return current;
    } else if (op === 'or') {
      for (i = 0; i < values.length; i += 1) {
        current = jsonLogic.apply(values[i], data);
        if (jsonLogic.truthy(current)) {
          return current;
        }
      }
      return current;
    } else if (op === 'filter') {
      scopedData = jsonLogic.apply(values[0], data);
      scopedLogic = values[1];
      if (!Array.isArray(scopedData)) {
        return [];
      }
      return scopedData.filter(function (datum) {
        return jsonLogic.truthy(jsonLogic.apply(scopedLogic, datum));
      });
    } else if (op === 'map') {
      scopedData = jsonLogic.apply(values[0], data);
      scopedLogic = values[1];
      if (!Array.isArray(scopedData)) {
        return [];
      }
      return scopedData.map(function (datum) {
        return jsonLogic.apply(scopedLogic, datum);
      });
    } else if (op === 'reduce') {
      scopedData = jsonLogic.apply(values[0], data);
      scopedLogic = values[1];
      initial = typeof values[2] !== 'undefined' ? values[2] : null;
      if (!Array.isArray(scopedData)) {
        return initial;
      }
      return scopedData.reduce(function (accumulator, current) {
        return jsonLogic.apply(scopedLogic, { current: current, accumulator: accumulator });
      }, initial);
    } else if (op === 'all') {
      scopedData = jsonLogic.apply(values[0], data);
      scopedLogic = values[1];
      if (!Array.isArray(scopedData) || !scopedData.length) {
        return false;
      }
      for (i = 0; i < scopedData.length; i += 1) {
        if (!jsonLogic.truthy(jsonLogic.apply(scopedLogic, scopedData[i]))) {
          return false;
        }
      }
      return true;
    } else if (op === 'none') {
      scopedData = jsonLogic.apply(values[0], data);
      scopedLogic = values[1];
      if (!Array.isArray(scopedData) || !scopedData.length) {
        return true;
      }
      for (i = 0; i < scopedData.length; i += 1) {
        if (jsonLogic.truthy(jsonLogic.apply(scopedLogic, scopedData[i]))) {
          return false;
        }
      }
      return true;
    } else if (op === 'some') {
      scopedData = jsonLogic.apply(values[0], data);
      scopedLogic = values[1];
      if (!Array.isArray(scopedData) || !scopedData.length) {
        return false;
      }
      for (i = 0; i < scopedData.length; i += 1) {
        if (jsonLogic.truthy(jsonLogic.apply(scopedLogic, scopedData[i]))) {
          return true;
        }
      }
      return false;
    }

    if (operations[op]) {
      if (typeof operations[op] === 'function') {
        return operations[op].apply(
          data,
          values.map(function (val) {
            return jsonLogic.apply(val, data);
          }),
        );
      }
      // nested operations like $date.$dateBegin
      var nestedOp = values[0];
      var nestedKey = Object.keys(nestedOp)[0];
      if (operations[op][nestedKey]) {
        var nestedValues = nestedOp[nestedKey];
        if (!Array.isArray(nestedValues)) {
          nestedValues = [nestedValues];
        }
        return operations[op][nestedKey].apply(
          data,
          nestedValues.map(function (val) {
            return jsonLogic.apply(val, data);
          }),
        );
      }
    }

    return null;
  };

  jsonLogic.uses_data = function (logic) {
    var collection = [];
    if (jsonLogic.is_logic(logic)) {
      var op = jsonLogic.getOperator(logic);
      var values = logic[op];
      if (!Array.isArray(values)) {
        values = [values];
      }
      if (op === 'var') {
        collection.push(values[0]);
      } else {
        values.forEach(function (val) {
          collection.push.apply(collection, jsonLogic.uses_data(val));
        });
      }
    }
    return arrayUnique(collection);
  };

  jsonLogic.addOperation = function (name, code) {
    operations[name] = code;
  };

  jsonLogic.rmOperation = function (name) {
    delete operations[name];
  };

  jsonLogic.rule_like = function (rule, pattern) {
    if (pattern === rule) {
      return true;
    }
    if (pattern === '@') {
      return true;
    }
    if (pattern === 'number') {
      return typeof rule === 'number';
    }
    if (pattern === 'string') {
      return typeof rule === 'string';
    }
    if (pattern === 'array') {
      return Array.isArray(rule) && !jsonLogic.is_logic(rule);
    }
    if (jsonLogic.is_logic(pattern)) {
      if (jsonLogic.is_logic(rule)) {
        var pattern_op = jsonLogic.getOperator(pattern);
        var rule_op = jsonLogic.getOperator(rule);
        if (pattern_op === '@' || pattern_op === rule_op) {
          return jsonLogic.rule_like(jsonLogic.getValues(rule), jsonLogic.getValues(pattern));
        }
      }
      return false;
    }
    if (Array.isArray(pattern)) {
      if (Array.isArray(rule)) {
        if (pattern.length !== rule.length) {
          return false;
        }
        for (var i = 0; i < pattern.length; i += 1) {
          if (!jsonLogic.rule_like(rule[i], pattern[i])) {
            return false;
          }
        }
        return true;
      } else {
        return false;
      }
    }
    return false;
  };

  return jsonLogic;
}
