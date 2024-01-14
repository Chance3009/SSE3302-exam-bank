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
      <div class="nav-left">
        <router-link class="nav-logo" to="/">
          <img src="./assets/SEExam.png" alt="Logo" class="logo" />
          SE EXAM BANK
        </router-link>
        <span v-if="isLoggedIn">
          <router-link class="nav-item" to="/courses-list">Courses</router-link></span>
        <span v-if="isLoggedIn">
          <router-link class="nav-item" to="/upload-paper">Upload Paper</router-link>
        </span>
      </div>
      <div class="nav-right" v-if="isLoggedIn">
        <button class="nav-item" @click="handleSignOut">Logout</button>
      </div>
      <div class="nav-right" v-else>
        <router-link class="nav-item" to="/register">Register</router-link>
        <router-link class="nav-item" to="/sign-in">Login</router-link>
      </div>
    </nav>

    <router-view />
  </div>
</template>



<style>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 10px 20px;
}

.nav-logo,
.nav-item {
  display: flex;
  align-items: center;
  color: #333;
  text-decoration: none;
  margin-right: 15px;
}

.logo {
  height: 30px;
  margin-right: 10px;
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
}

.nav-item {
  padding: 5px 15px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.3s;
}

.nav-item:hover {
  color: #af3eec;
}


@media (max-width: 600px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-left,
  .nav-right {
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-logo,
  .nav-item {
    margin-right: 0;
  }
}
</style>


