import {redirect} from "next/navigation";

export default function Page() {
  redirect("/user/home");
  // adjust in the future to redirect to /login if not logged in, /user/home if logged in and not admin or not admin mode, and /admin if logged in and in admin mode
}