import { setAuth } from "./api";
import { clearLocalData, ensureLocalOwner } from "./offline/db";
import { unsubscribePush } from "./push.ts";

/** Guarda la sesión tras login/registro */
export async function startSession(token: string, userId: string) {
  localStorage.setItem("token", token);
  setAuth(token);
  await ensureLocalOwner(String(userId));
}

/** Cierra sesión: deja de recibir push en este equipo y borra los datos locales */
export async function logout() {
  try {
    await unsubscribePush(); // necesita el token, por eso va antes de borrarlo
  } catch {
    /* sin red: el servidor limpiará la suscripción cuando falle el envío */
  }
  await clearLocalData();
  localStorage.removeItem("token");
  setAuth(null);
  window.location.href = "/";
}
