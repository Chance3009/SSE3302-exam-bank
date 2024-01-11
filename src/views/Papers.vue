<template>
  <h1>Exam Papers of {{ courseCode }}</h1>
  <button @click="generatePaper(courseCode)">Generate Paper</button>
  <section id="papers">
    <PaperCard v-for="paper in papers" :key="paper.id" :paper="paper" />
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { coursesRef, examsRef, quesRef } from "../firebase/db.js";
import { doc, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "vue-router";
import PaperCard from "../components/PaperCard.vue";

const papers = ref([]);
const router = useRouter();
const courseCode = router.currentRoute.value.params.courseCode;

const fetchPapers = async () => {
  const q = query(examsRef, where("course", "==", doc(coursesRef, courseCode)));
  const snapshot = await getDocs(q);
  snapshot.forEach((paper) => {
    papers.value.push({ ...paper.data(), id: paper.id });
  });
};

onMounted(fetchPapers);

const generatePaper = async (courseCode) => {
  try {
    const q = query(
      quesRef,
      where("__name__", ">=", `${courseCode}`),
      where("__name__", "<", `${courseCode}\uf8ff`)
    );
    const snapshot = await getDocs(q);
    const questions = [];
    snapshot.forEach((question) => {
      questions.push({ id: question.id, ...question.data() });
    });
    const getRandomQuestions = (questions, count) => {
      const shuffled = questions.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    const selectedQuestions = getRandomQuestions(questions, 2);
    const jsonSelectedQuestions = JSON.stringify(selectedQuestions);

    console.log(
      "Paper generated successfully with questions:",
      selectedQuestions
    );
    router.push({
      name: "generated-paper",
      params: { courseCode, jsonSelectedQuestions },
    });
  } catch (error) {
    console.error("Error generating paper:", error);
  }
};
</script>
