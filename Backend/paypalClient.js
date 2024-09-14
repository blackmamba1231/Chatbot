// paypalClient.js
const paypal = require('@paypal/checkout-server-sdk');

function environment() {
    return new paypal.core.SandboxEnvironment('AZP1-f4vt4XuxioFxKbf9nqrAc7ul0RZoiE2EvjHH-OQ-Z4N8BTxfiNRAobWyMGNq1ik-fAAXw55U_bv', 'EFG3KY4otFHji1fCP034kDsHyGmi2sb6AxLycG0cc3a7_nYGd_-iuP_GNMTyrratL8f8TKRoTY_ZqeSD');
}

function client() {
    return new paypal.core.PayPalHttpClient(environment());
}

module.exports = { client };
