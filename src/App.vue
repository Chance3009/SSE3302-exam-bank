<script setup>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();

const isLoggedIn = ref(true);

onAuthStateChanged(getAuth(), function (user) {
  if (user) {
    isLoggedIn.value = true;
  } else {
    isLoggedIn.value = false;
  }
});

const handleSignOut = () => {
  signOut(getAuth());
  router.push("/");
};
</script>

<template>
  <div>
    <nav class="navbar">
      <router-link class="nav-link" to="/">
        <img src="./assets/SEExam.png" alt="Logo" style="height: 30px; vertical-align: middle; margin-right: 5px;" />
        <span>SE EXAM BANK</span> </router-link> |
      <span v-if="isLoggedIn">
        <router-link class="nav-btn" to="/courses-list">Courses</router-link> |
        <router-link class="nav-btn" to="/upload-paper">Upload Paper</router-link> |
        <button class="nav-btn" @click="handleSignOut">Logout</button>
      </span>
      <span v-else>
        <router-link class="nav-btn" to="/register">Register</router-link> |
        <router-link class="nav-btn" to="/sign-in">Login</router-link>
      </span>
    </nav>
    <router-view />
  </div>
</template>

<style>
.navbar {
  display: flex;
  justify-content: space-around;
  background-color: #f5f5f5;
}

.nav-btn,
.nav-link {
  padding: 10px 20px;
  margin: 5px;
  border: none;
  border-radius: 10px;
  background-color: white;
  text-decoration: none;
  color: black;
  cursor: pointer;
  transition: background-color 0.3s;
}

.nav-btn:hover {
  background-color: #e0e0e0;

}

.nav-link {
  background-color: transparent;
  border: none;
}
</style>