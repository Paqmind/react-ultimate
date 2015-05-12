// IMPORTS =========================================================================================
import {keys, eqDeep} from "ramda";

// EXPORTS =========================================================================================
/**
* Does a shallow comparison for props and state.
*/
export function shallowCompare(nextState, nextProps) {
  //console.debug("shallowCompare()");
  return !isEqualShallow(this.props, nextProps) || !isEqualShallow(this.state, nextState);
}

/**
* Does a deep comparison for props and state.
*/
export function deepCompare(nextState, nextProps) {
  //console.debug("deepCompare()");
  return !eqDeep(this.props, nextProps) || !eqDeep(this.state, nextState);
}

// HELPERS =========================================================================================
function isEqualShallow(objA, objB) {
  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = keys(objA);
  var keysB = keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}