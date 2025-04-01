import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';
const config: CapacitorConfig = {
  appId: 'Majestic.ovation.customer',
  appName: 'Ovation',
  webDir: 'www',
  "android": {
    "webContentsDebuggingEnabled": true
  },
  plugins: {
    Keyboard: {
      resize: KeyboardResize.Body,
      // style: KeyboardStyle.Dark,
      resizeOnFullScreen: true,

    }
  }
};

export default config;
