const Action = require('../../models/Action');

/**
 * Checks for an existing action using idempotencyKey.
 * @param {string} idempotencyKey
 * @returns {Promise<Object|null>} The existing action if found, otherwise null
 */
const checkExistingAction = async (idempotencyKey) => {
  if (!idempotencyKey) return null;
  return await Action.findOne({ idempotencyKey });
};

module.exports = {
  checkExistingAction
};
