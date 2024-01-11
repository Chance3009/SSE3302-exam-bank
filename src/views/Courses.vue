<template>
  <h1>Courses</h1>
  <section id="courses">
    <CourseCard v-for="course in courses" :key="course.id" :course="course" />
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { coursesRef } from "../firebase/db.js";
import { getDocs } from "firebase/firestore";
import CourseCard from "../components/CourseCard.vue";

const courses = ref([]);

onMounted(async () => {
  const snapshot = await getDocs(coursesRef);
  snapshot.forEach((course) => {
    courses.value.push({ ...course.data(), id: course.id });
  });
});
</script>
