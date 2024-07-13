module.exports = {
    expo: {
      entryPoint: "./app/_layout.tsx",
      name: "PatientClient",
      slug: "PatientClient",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/images/icon.png",
      scheme: "myapp",
      userInterfaceStyle: "automatic",
      splash: {
        image: "./assets/images/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      },
      ios: {
        config: {
          usesNonExemptEncryption: false
        },
        supportsTablet: true,
        softwareKeyboardLayoutMode: "pan",
        infoPlist: {
          CFBundleAllowMixedLocalizations: true,
          NSAppTransportSecurity: {
            NSAllowsArbitraryLoads: true,
            NSAllowsLocalNetworking: true,
            NSExceptionDomains: {
              NSIncludesSubdomains: true,
              NSExceptionAllowsInsecureHTTPLoads: true
            }
          },
          UIBackgroundModes: [
            "audio"
          ]
        }
      },
      android: {
        softwareKeyboardLayoutMode: "pan",
        usesCleartextTraffic: true,
        adaptiveIcon: {
          foregroundImage: "./assets/images/adaptive-icon.png",
          backgroundColor: "#ffffff"
        },
        package: "com.aphasia.patientclient",
        compileSdkVersion: 33,
        minSdkVersion: 21,
        targetSdkVersion: 33
      },
      web: {
        bundler: "metro",
        output: "static",
        favicon: "./assets/images/favicon.png"
      },
      plugins: [
        "expo-router",
        "expo-secure-store"
      ],
      experiments: {
        typedRoutes: true
      },
      extra: {
        eas: {
            projectId: "7443b01e-46ab-4b87-94cc-196df1a7f315"
        }
      }
    }
  };