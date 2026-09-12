import Inventory from '../../models/Inventory.js';
import { getConnectionState } from '../../config/db.js';

let chaosSimulationInventoryOutage = true; // Default true for the demo scenario

const MOCK_INVENTORY = {
  'PROD-LAPTOP-X1': {
    productId: 'PROD-LAPTOP-X1',
    sku: 'AERO-PRO-15-OLED',
    stockQuantity: 0,
    reservedQuantity: 0,
    warehouseLocation: 'WH-CENTRAL-1',
    isAvailable: false,
  },
};

export const inventoryService = {
  setChaosOutage(enable) {
    chaosSimulationInventoryOutage = Boolean(enable);
  },

  getChaosOutage() {
    return chaosSimulationInventoryOutage;
  },

  async checkAvailability(productId) {
    if (chaosSimulationInventoryOutage) {
      return {
        productId,
        available: false,
        stockQuantity: 0,
        warehouseLocation: 'WH-CENTRAL-1',
        reason: 'Zero inventory available in all fulfillment centers for product ' + productId,
        summary: `Replacement inventory check: 0 units available for ${productId}. Out of stock.`,
      };
    }

    const { isConnected } = getConnectionState();
    if (isConnected) {
      const inv = await Inventory.findOne({ productId });
      if (inv) {
        return {
          productId,
          available: inv.stockQuantity > 0,
          stockQuantity: inv.stockQuantity,
          warehouseLocation: inv.warehouseLocation,
          summary: `Inventory check: ${inv.stockQuantity} units available.`,
        };
      }
    }

    const mock = MOCK_INVENTORY[productId];
    const qty = mock ? mock.stockQuantity : 0;
    return {
      productId,
      available: qty > 0,
      stockQuantity: qty,
      warehouseLocation: mock?.warehouseLocation || 'WH-CENTRAL-1',
      summary: `Inventory check: ${qty} units available.`,
    };
  },

  async reserveItem(productId, quantity = 1) {
    const availability = await this.checkAvailability(productId);
    if (!availability.available || availability.stockQuantity < quantity) {
      return {
        success: false,
        error: 'INSUFFICIENT_STOCK',
        message: `Cannot reserve ${quantity} units. Current stock is 0.`,
      };
    }
    return {
      success: true,
      reservationId: `RES-${Date.now()}`,
      productId,
      quantity,
    };
  },
};

export default inventoryService;
