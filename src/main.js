import { createApp } from "vue";
import router from "./router";
import "./styles.css";
import App from "./App.vue";
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAS2ftKtcirMipVPQ_RkcKTi16FJ26ZD40",
  authDomain: "exambank-a79d9.firebaseapp.com",
  projectId: "exambank-a79d9",
  storageBucket: "exambank-a79d9.appspot.com",
  messagingSenderId: "255397653173",
  appId: "1:255397653173:web:dd2dbe42ee5c2e1b3a2cfc",
  measurementId: "G-3ERWJVY05Q",
};

initializeApp(firebaseConfig);

if (location.hostname === "localhost") {
  connectAuthEmulator(getAuth(), "http://127.0.0.1:5173");
}

const app = createApp(App).use(router).mount("#app");
