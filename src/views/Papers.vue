<template>
  <h1>Papers</h1>
  <section id="papers">
    <button
      v-for="paper in papers || []"
      :key="paper.id"
      class="card"
      @click="selectPaper(paper.id)"
    >
      {{ paper.year }} Test {{ paper.test }}
    </button>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { coursesRef, examsRef } from "../firebase/db.js";
import { doc, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "vue-router";

const papers = ref([]);
const router = useRouter();
const courseId = router.currentRoute.value.params.courseId;

onMounted(async () => {
  const q = query(examsRef, where("course", "==", doc(coursesRef, courseId)));
  const snapshot = await getDocs(q);
  snapshot.forEach((paper) => {
    console.log("Test 4 Selected Paper ID:", paper.id);
    papers.value.push({ ...paper.data(), id: paper.id });
  });
});

const selectPaper = (paperId) => {
  router.push({ name: "questions-list", params: { paperId } });
};
</script>
