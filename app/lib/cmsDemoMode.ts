import { isFirebaseConfigured } from "./firebase";

/** Local CMS/admin demo only when Firebase is off and not a production build. */
export function canUseLocalCmsDemo(): boolean {
  if (isFirebaseConfigured()) return false;
  return process.env.NODE_ENV === "development";
}
