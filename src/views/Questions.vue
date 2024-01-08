<template>
  <h1>Questions</h1>
  <section id="questions">
    <div v-for="question in questions" :key="question.id" class="question">
      {{ question.quesNo }} . {{ question.description }}
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { quesRef, examsRef } from "../firebase/db.js";
import { doc, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "vue-router";

const questions = ref([]);
const router = useRouter();
const paperId = router.currentRoute.value.params.paperId;

onMounted(async () => {
  const q = query(quesRef, where("paper", "==", doc(examsRef, paperId)));
  const snapshot = await getDocs(q);
  snapshot.forEach((question) => {
    questions.value.push({ ...question.data(), id: question.id });
  });
});
</script>
