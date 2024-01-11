<template>
  <h1>Courses</h1>
  <section id="courses">
    <button
      v-for="course in courses || []"
      :key="course.id"
      class="card"
      @click="selectCourse(course.id)"
    >
      {{ course.courseCode }}<br />
      {{ course.courseName }}
    </button>
  </section>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { coursesRef } from "../firebase/db.js";
import { getDocs } from "firebase/firestore";
import { useRouter } from "vue-router";

const courses = ref([]);
const router = useRouter();

onMounted(async () => {
  const snapshot = await getDocs(coursesRef);
  snapshot.forEach((course) => {
    courses.value.push({ ...course.data(), id: course.id });
  });
});

const selectCourse = async (courseCode) => {
  console.log("Selected Course ID:", courseCode);
  const isValidcourseCode = courses.value.some(
    (course) => course.id === courseCode
  );

  if (isValidcourseCode) {
    router.push({ name: "papers-list", params: { courseCode } });
  } else {
    console.error("Invalid course ID");
  }
};
</script>
