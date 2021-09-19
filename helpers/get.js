/**
 * Gets a prop value safely with default value fallback
 *
 * @export
 * @param {object} object
 * @param {string} key
 * @param {any} [defaultVal]
 * @return {any}
 */
function get(object, key, defaultVal) {
  return object[key] || defaultVal;
}

module.exports = get;
