import {
  GoogleAuthProvider,
  getAuth,
  signInWithCredential,
} from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId:
    "934195552915-4k0e2nkupvaplh7fkqf50n7pb322iq92.apps.googleusercontent.com",
});

export async function onGoogleButtonPress() {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const signInResult = await GoogleSignin.signIn();

  var idToken = signInResult.data?.idToken;

  if (!idToken) {
    throw new Error("No ID token found");
  }

  const googleCredential = GoogleAuthProvider.credential(idToken);
  const userCredential = await signInWithCredential(
    getAuth(),
    googleCredential,
  );
  console.log("This is user credentials", userCredential);

  return userCredential;
}
