import { createApp } from "vue";
import router from "./router";
import "./styles.css";
import App from "./App.vue";
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { firebaseConfig } from "./firebase/firebaseConfig";

initializeApp(firebaseConfig);

if (location.hostname === "localhost") {
  connectAuthEmulator(getAuth(), "http://127.0.0.1:5173");
}

const app = createApp(App).use(router).mount("#app");
