class FailureSimulator {
  constructor() {
    this.flags = {
      inventoryOutage: true,     // Default true for the primary demo scenario!
      actionExecutionError: false,
      verificationFailure: false,
      policyRejection: false,
    };
  }

  setFlag(flag, value) {
    if (flag in this.flags) {
      this.flags[flag] = Boolean(value);
    }
  }

  getFlags() {
    return { ...this.flags };
  }

  reset() {
    this.flags = {
      inventoryOutage: true,
      actionExecutionError: false,
      verificationFailure: false,
      policyRejection: false,
    };
  }
}

export const failureSimulator = new FailureSimulator();
export default failureSimulator;
