<template>
  <h1>ONLINE EXAM BANK SYSTEM</h1>
  <div class="search-bar">
    <input type="text" v-model="searchQuery" placeholder="Search for papers..." @input="performSearch">
    <button @click="performSearch">Search</button>
  </div>
  <div class="search-results">
    <div v-for="item in filteredItems" :key="item.id" class="search-item">
      {{ item.title }}
    </div>
  </div>
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


