import { logout } from "../../../shared/store/slices/auth-slice";
import { persistor, store } from "../../../shared/store/store";
import { onLogout } from "./google-auth.service";

export async function LogoutService() {
  await onLogout();
  store.dispatch(logout());
  await persistor.purge();
}
