import { redirect } from "next/navigation";

export default function DevlogRedirectPage() {
  redirect("/blog?category=Devlog");
}
