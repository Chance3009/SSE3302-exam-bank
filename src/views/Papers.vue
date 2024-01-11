<template>
  <h1>Exam Papers of {{ courseCode }}</h1>
  <button @click="generatePaper(courseCode)">Generate Paper</button>
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
import { coursesRef, examsRef, quesRef } from "../firebase/db.js";
import { doc, query, where, getDocs, setDoc } from "firebase/firestore";
import { useRouter } from "vue-router";

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

const selectPaper = (paperId) => {
  router.push({ name: "questions-list", params: { paperId } });
};

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

    console.log(
      "Paper generated successfully with questions:",
      selectedQuestions
    );

    router.push({
      name: "generated-paper",
      params: { courseCode, selectedQuestions },
    });
  } catch (error) {
    console.error("Error generating paper:", error);
  }
};
</script>
