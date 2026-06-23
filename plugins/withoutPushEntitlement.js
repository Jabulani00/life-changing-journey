const { withEntitlementsPlist } = require('@expo/config-plugins');

/**
 * Removes aps-environment so App Store builds succeed when the provisioning
 * profile has not yet been regenerated for Push Notifications.
 * Re-run `eas credentials` with Apple login to enable push on a future build.
 */
module.exports = function withoutPushEntitlement(config) {
  return withEntitlementsPlist(config, (config) => {
    delete config.modResults['aps-environment'];
    return config;
  });
};
