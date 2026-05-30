import type { CapacitorConfig } from '@capacitor/cli';

// Set to true for local development, false for production builds
const isDevelopment = false;

const config: CapacitorConfig = {
  appId: 'com.example.myapp',
  appName: 'MyApp',
  webDir: 'www',
  bundledWebRuntime: false,
  server: isDevelopment
    ? {
        // Development: point to local dev server
        url: 'http://localhost:3000',
        cleartext: true,
      }
    : {
        // Production: point to your live website
        url: 'https://www.example.com',
        // Allow navigation within your app domain
        allowNavigation: ['*.example.com'],
      },
  ios: {
    contentInset: 'automatic',
    scheme: 'MyApp',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffffff',
      showSpinner: false,
      androidSpinnerStyle: 'small',
      iosSpinnerStyle: 'small',
    },
    StatusBar: {
      style: 'default',
      backgroundColor: '#ffffff',
    },
    PushNotifications: {
      // Show notifications when app is in foreground
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
