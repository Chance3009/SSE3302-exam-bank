<template>
    <h1>Home</h1>
    <section id="courses">
      <button v-for="course in courses" :key="course.id" class="card">
        {{ course.courseCode }}<br />
        {{ course.courseName }}
      </button>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted, createApp } from "vue";
  import { coursesRef, examsRef } from "../firebase/db.js";
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
  