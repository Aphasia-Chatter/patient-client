import * as SecureStore from 'expo-secure-store';

// expo-secure-store provides a way to encrypt and securely store key–value pairs locally on the device.
// Each Expo project has a separate storage system and has no access to the storage of other Expo projects.
// Size limit for a value is 2048 bytes. An attempt to store larger values may fail.
// Currently, we print a warning when the limit is reached, however, in a future SDK version an error might be thrown.
// The requireAuthentication option is not supported in Expo Go when biometric authentication is available due to a missing NSFaceIDUsageDescription key.
// This API is not compatible with devices running Android 5 or lower.

// Helper function to save value with key into the local storage on device
export async function saveValue(key: string, value: any) {
    try {
        const jsonValue = JSON.stringify(value)
        await SecureStore.setItemAsync(key, jsonValue);
    } catch (error) {
        throw error;
    }
}

// Helper function to get value with key into the local storage on device
export async function fetchValue(key: string) {
    try {
        const jsonValue = await SecureStore.getItemAsync(key);
        return jsonValue != null ? JSON.parse (jsonValue) : null;

    } catch(error) {
        throw error;
    }
}

// Helper function to get value with key into the local storage on device
export async function deleteValue(key: string) {
    try {
        return await SecureStore.deleteItemAsync(key);
    } catch(error) {
        throw error;
    }
}
