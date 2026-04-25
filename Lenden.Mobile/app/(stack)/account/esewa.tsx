import React from 'react';
import { View, Button, Alert, Platform } from 'react-native';
import * as Linking from 'expo-linking';

export default function OpenEsewa() {

  const openEsewaApp = async () => {
    const appUrl = 'esewa://';
    const webUrl = 'https://esewa.com.np';
    const playStoreUrl =
      'https://play.google.com/store/apps/details?id=com.f1soft.esewa';

    try {
      const supported = await Linking.canOpenURL(appUrl);

      if (supported) {
        await Linking.openURL(appUrl);
        return;
      }

      // fallback → try web (may redirect to app if installed)
      await Linking.openURL(webUrl);

    } catch (err) {
      console.log(err);

      // last fallback → store
      Alert.alert(
        'eSewa not available',
        'Redirecting to install...',
      );

      await Linking.openURL(
        Platform.OS === 'android' ? playStoreUrl : webUrl
      );
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Button title="Open eSewa" onPress={openEsewaApp} />
    </View>
  );
}