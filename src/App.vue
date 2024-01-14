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
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <router-link class="navbar-brand" to="/">ECLIPSE RED</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item" :class="{ active: $route.path === '/' }">
            <router-link to="/" class="nav-link">Home</router-link>
          </li>
          <li v-if="isLoggedIn" class="nav-item">
            <router-link to="/courses-list" class="nav-link"
              >Courses</router-link
            >
          </li>
          <li v-if="isLoggedIn" class="nav-item">
            <router-link to="/upload-paper" class="nav-link"
              >Upload Paper</router-link
            >
          </li>
        </ul>

        <form class="form-inline my-2 my-lg-0">
          <input
            class="form-control mr-sm-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">
            Search
          </button>
        </form>

        <span v-if="isLoggedIn" class="ml-md-auto">
          <button @click="handleSignOut" class="btn btn-outline-light ml-2">
            Logout
          </button>
        </span>
        <span v-else class="ml-md-auto">
          <router-link to="/register" class="btn btn-outline-light ml-2"
            >Register</router-link
          >
          <router-link to="/sign-in" class="btn btn-outline-light ml-2"
            >Login</router-link
          >
        </span>
      </div>
    </nav>

    <router-view />
  </div>
</template>
