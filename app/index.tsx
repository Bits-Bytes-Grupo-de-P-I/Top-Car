// import { Redirect } from "expo-router";
// import { APP_VERSION } from "../env";

// export default function Index() {
//   if (APP_VERSION === "admin") {
//     return <Redirect href="/admin" />;
//   } else {
//     return <Redirect href="/client" />;
//   }
// }

import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="./admin" />;
}