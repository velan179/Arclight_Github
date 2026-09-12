'use strict';
/**
 * Tool: customer.get
 * Retrieves customer account details from MongoDB.
 * The LLM NEVER touches the DB directly — this tool is the deterministic boundary.
 */

const Customer = require('../models/Customer');

/**
 * @param {Object} params
 * @param {string} params.customerId
 * @returns {Promise<Object>} Structured tool observation
 */
async function execute({ customerId }) {
  try {
    const customer = await Customer.findOne({ customerId });

    if (!customer) {
      return {
        tool: 'customer.get',
        status: 'FAILURE',
        data: null,
        summary: `Customer ${customerId} not found`,
        errorCode: 'NOT_FOUND'
      };
    }

    if (customer.accountStatus === 'SUSPENDED') {
      return {
        tool: 'customer.get',
        status: 'SUCCESS',
        data: {
          customerId: customer.customerId,
          name: customer.name,
          email: customer.email,
          tier: customer.tier,
          accountStatus: customer.accountStatus,
          totalOrders: customer.totalOrders
        },
        summary: `Customer ${customer.name} found — account SUSPENDED`,
        flags: ['ACCOUNT_SUSPENDED']
      };
    }

    return {
      tool: 'customer.get',
      status: 'SUCCESS',
      data: {
        customerId: customer.customerId,
        name: customer.name,
        email: customer.email,
        tier: customer.tier,
        accountStatus: customer.accountStatus,
        totalOrders: customer.totalOrders
      },
      summary: `Customer ${customer.name} retrieved — ${customer.tier} tier, account ${customer.accountStatus}`,
      flags: []
    };
  } catch (err) {
    return {
      tool: 'customer.get',
      status: 'FAILURE',
      data: null,
      summary: `Error retrieving customer: ${err.message}`,
      errorCode: 'TOOL_EXECUTION_FAILED'
    };
  }
}

module.exports = { name: 'customer.get', execute };
