<template>
  <div class="content-container">
    <h1>Create an Account</h1>
    <input type="text" placeholder="Email" v-model="email" />
    <input type="password" placeholder="Password" v-model="password" />
    <button @click="register">Register</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");

const router = useRouter();
const register = () => {
  createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((data) => {
      console.log("Successfully registered!");
      router.push("/courses-list");
    })
    .catch((error) => {
      console.log(error.code);
      alert(error.message);
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