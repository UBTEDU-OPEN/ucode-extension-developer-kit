import type { UCodeWorkerScope, UBT } from '@ubtech/ucode-extension-common-sdk/types';

declare global {
  interface Window {
    UCode: UCodeWorkerScope.ExternalExtensionGlobalVariable;
  }
}


