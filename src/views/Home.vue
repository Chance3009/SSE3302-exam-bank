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


