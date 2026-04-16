import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.3df96f30a521488c85c3e83e97dff667',
  appName: 'habesha-spark',
  webDir: 'dist',
  server: {
    url: 'https://3df96f30-a521-488c-85c3-e83e97dff667.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  plugins: {
    AdMob: {
      appId: 'ca-app-pub-9190131594569715~1410272909',
    },
  },
};

export default config;
