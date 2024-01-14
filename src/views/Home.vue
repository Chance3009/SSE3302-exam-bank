<template>
  <h1>Home</h1>
  <div class="search-bar">
    <input type="text" v-model="searchQuery" placeholder="Search for papers..." @input="performSearch">
    <button @click="performSearch">Search</button>
  </div>
  <div class="search-results">
    <div v-for="item in filteredItems" :key="item.id" class="search-item">
      {{ item.title }}
    </div>
  </div>



  <h2>Just a home, access more function by register/login</h2>
  <h3>Till 11/1, I have completed a few function as belows:</h3>
  <ul>
    <li>Configure Firebase Authentication</li>
    <li>Display list of courses</li>
    <li>Upload new paper (Without the function of adding question)</li>
    <li>
      Display list of papers for a specific course after clicking on the
      respective course button
    </li>
    <li>
      Display list of questions for a specific paper after clicking on the
      respective paper button
    </li>
    <li>Generate new paper (for view)</li>
    <li>Download the generated paper as txt file</li>
  </ul>
  <p>
    Just to clarify, for now I just throw everything into views and write
    everything as individual file, but certain files should be classfied as
    components instead, so who are available please help to organize the project
    file structure, make it less cluttered lah. Need to refactor.
  </p>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="#">Navbar</a>
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
        <li class="nav-item active">
          <a class="nav-link" href="#"
            >Home <span class="sr-only">(current)</span></a
          >
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Link</a>
        </li>
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Dropdown
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#">Something else here</a>
          </div>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled" href="#">Disabled</a>
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
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { coursesRef } from "../firebase/db.js";
import { getDocs } from "firebase/firestore";

const courses = ref([]);

onMounted(async () => {
  let coursesCollection = await getDocs(coursesRef);
  coursesCollection.forEach((course) => {
    console.log(course.data());
    courses.value.push({ ...course.data(), id: course.id });
  });
});
</script>


