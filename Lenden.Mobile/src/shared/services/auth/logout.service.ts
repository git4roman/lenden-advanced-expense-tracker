import { logout } from "../../store/slices/auth-slice";
import { persistor, store } from "../../store/store";
import { onLogout } from "./google-auth.service";

export async function LogoutService() {
  await onLogout();
  store.dispatch(logout());
  await persistor.purge();
}
