/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {n, zoneSymbol} from './utils';

// override Function.prototype.toString to make zone.js patched function
// look like native function
(Zone as any).l('toString', (global: any, Zone: ZoneType) => {
  // patch Func.prototype.toString to let them look like native
  const originalFunctionToString = (Zone as any)['__zone_symbol__originalToString'] =
      Function.prototype.toString;

  const ORIGINAL_DELEGATE_SYMBOL = zoneSymbol('OriginalDelegate');
  const PROMISE_SYMBOL = zoneSymbol('Promise');
  const ERROR_SYMBOL = zoneSymbol('Error');
  Function.prototype.toString = function() {
    if (typeof this === n) {
      const originalDelegate = this[ORIGINAL_DELEGATE_SYMBOL];
      if (originalDelegate) {
        if (typeof originalDelegate === n) {
          return originalFunctionToString.apply(this[ORIGINAL_DELEGATE_SYMBOL], arguments);
        } else {
          return Object.prototype.toString.call(originalDelegate);
        }
      }
      if (this === Promise) {
        const nativePromise = global[PROMISE_SYMBOL];
        if (nativePromise) {
          return originalFunctionToString.apply(nativePromise, arguments);
        }
      }
      if (this === Error) {
        const nativeError = global[ERROR_SYMBOL];
        if (nativeError) {
          return originalFunctionToString.apply(nativeError, arguments);
        }
      }
    }
    return originalFunctionToString.apply(this, arguments);
  };


  // patch Object.prototype.toString to let them look like native
  const originalObjectToString = Object.prototype.toString;
  const PROMISE_OBJECT_TO_STRING = '[object Promise]';
  Object.prototype.toString = function() {
    if (this instanceof Promise) {
      return PROMISE_OBJECT_TO_STRING;
    }
    return originalObjectToString.apply(this, arguments);
  };
});
