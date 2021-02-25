const data = Fliplet.Widget.getData();
const helperInstances = _.get(data, 'helperInstances', []);
const instanceId = _.get(data, 'instanceId', '');

/**
 * Returns a boolean indicating whether a nested helper instance matches a filter
 * @param {Helper} instance The helper instance
 * @param {Function} predicate The function invoked per iteration
 * @returns {Boolean} Whether the element matches
 */
function helperMatches(instance, predicate) {
  return instance.id !== instanceId
        && instance.isChildren
        && (predicate ? _.find([instance], predicate) : true);
}

/**
 * Prepares a predicate filter before it's sent to the various
 * find functions for helpers. This allows a given predicate shorthand
 * to be converted into the suitable filter.
 * @param {Function|String|Object} predicate A filter
 * @return {Function|Object} The prepared predicate
 */
function prepareFilter(predicate) {
  if (typeof predicate === 'string') {
    return { name: predicate };
  }

  return predicate;
}

/**
 * Finds all matching child helpers (through all levels)
 * @param {Function} predicate The function invoked per iteration
 * @returns {Array} The matched helpers
 */
export function findAll(predicate) {
  predicate = prepareFilter(predicate);

  return _.filter(helperInstances, function(instance) {
    return helperMatches(instance, predicate);
  });
}

/**
 * Finds a matching child helper (through all levels)
 * @param {Function} predicate The function invoked per iteration
 * @returns {Helper} The matched helper
 */
export function findOne(predicate) {
  predicate = prepareFilter(predicate);

  return _.find(helperInstances, function(instance) {
    return helperMatches(instance, predicate);
  });
}

/**
 * Finds matching direct children helpers
 * @param {Function} predicate The function invoked per iteration
 * @returns {Helper} The matched helper
 */
export function findChildren(predicate) {
  predicate = prepareFilter(predicate);

  return _.filter(helperInstances, function(instance) {
    return instance.id !== instanceId
      && instance.parentId
      && instance.parentId === instanceId
      && (predicate ? _.find([instance], predicate) : true);
  });
}
