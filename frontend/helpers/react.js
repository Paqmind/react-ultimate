import {keys, equals} from "ramda"

/**
 * Decorator to attach static methods to HOC
 * Example:
 *   @withStatic({
 *     willTransitionTo(transition) {
 *       transition.abort()
 *     }
 *   })
 * @param obj - object with methods that should be static in HOC
 * @returns {Function} - decorator to apply on HOC
 */
export function statics(obj) {
  return component => Object.assign(component, obj)
}

/**
* Does a shallow comparison for props and state.
*/
export function shallowCompare(nextState, nextProps) {
  //console.debug("shallowCompare()")
  return !isEqualShallow(this.props, nextProps) || !isEqualShallow(this.state, nextState)
}

/**
* Does a deep comparison for props and state.
*/
export function deepCompare(nextState, nextProps) {
  //console.debug("deepCompare()")
  return !equals(this.props, nextProps) || !equals(this.state, nextState)
}

function isEqualShallow(objA, objB) {
  if (objA === objB) {
    return true
  }

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false
  }

  var keysA = keys(objA)
  var keysB = keys(objB)

  if (keysA.length !== keysB.length) {
    return false
  }

  // Test for A's keys different from B.
  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB)
  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false
    }
  }

  return true
}
