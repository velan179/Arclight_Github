const Inventory = require('../../models/Inventory');

/**
 * Deterministically simulates a failure by setting inventory to 0.
 * Used for the PS5 autonomous recovery demonstration.
 * @param {string} productId 
 */
const simulateReplacementInventoryDrop = async (productId) => {
  const inventory = await Inventory.findOne({ productId });
  if (inventory) {
    inventory.stockLevel = 0;
    inventory.isSimulatedFailure = true;
    await inventory.save();
  }
};

/**
 * Resets the inventory to a specific stock level (for test cleanup).
 * @param {string} productId 
 * @param {number} stockLevel 
 */
const resetInventory = async (productId, stockLevel = 1) => {
  const inventory = await Inventory.findOne({ productId });
  if (inventory) {
    inventory.stockLevel = stockLevel;
    inventory.isSimulatedFailure = false;
    await inventory.save();
  }
};

module.exports = {
  simulateReplacementInventoryDrop,
  resetInventory
};
