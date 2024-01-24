/**
 * @license
 * Copyright 2022-2023 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */
const TheCrypto = {
  getRandomData: (length) => {
    return new Uint8Array(length);
  }
};
function cryptoSetup(Crypto) {
  Crypto.get = () => TheCrypto;
}
export {
  cryptoSetup
};
//# sourceMappingURL=crypto.js.map
