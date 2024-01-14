<template>
  <div class="content-container">
    <h1>Login</h1>
    <input type="text" placeholder="Email" v-model="email" />
    <input type="password" placeholder="Password" v-model="password" />
    <p v-if="errMsg">{{ errMsg }}</p>
    <button @click="signIn">Sign In</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const errMsg = ref();

const router = useRouter();

const signIn = () => {
  signInWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((data) => {
      console.log("Successfully logged in!");
      router.push("/courses-list");
    })
    .catch((error) => {
      switch (error.code) {
        case "auth/invalid-email":
          errMsg.value = "Invalid email";
          break;
        case "auth/user-not-found":
          errMsg.value = "No account with that email was found";
          break;
        case "auth/wrong-password":
          errMsg.value = "Incorrect password";
          break;
        default:
          errMsg.value = "Email or password was incorrect";
          break;
      }
    });
};
</script>


<style scoped>
.content-container {
  margin: 0 auto;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.content-container input {
  width: 100%;
  margin-bottom: 10px;
}

.content-container button {
  width: 100%;
}
</style>