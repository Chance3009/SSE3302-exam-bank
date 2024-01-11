<template>
  <button class="card" @click="selectCourse(course.id)">
    {{ course.courseCode }}<br />
    {{ course.courseName }}
  </button>
</template>

<script setup>
import { useRouter } from "vue-router";

const props = defineProps(["course"]);

const router = useRouter();

const selectCourse = (courseCode) => {
  router.push({ name: "papers-list", params: { courseCode } });
};
</script>
