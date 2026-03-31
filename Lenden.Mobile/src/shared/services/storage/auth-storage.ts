import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const saveAuth = async (token: string, user: any) => {
  const data: [string, string][] = [[TOKEN_KEY, token]];

  if (user) {
    data.push([USER_KEY, JSON.stringify(user)]);
  }

  await AsyncStorage.multiSet(data);
};

export const loadAuth = async () => {
  const values = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);

  const token = values[0][1];
  const user = values[1][1] ? JSON.parse(values[1][1] as string) : null;

  return { token, user };
};

export const clearAuth = async () => {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
};
