<template>
  <div>
    <h1>Exam Papers of {{ courseCode }}</h1>
    <button @click="openGeneratePaperModal" class="btn btn-primary">
      Generate Paper
    </button>
    <section id="papers">
      <PaperCard v-for="paper in papers" :key="paper.id" :paper="paper" />
    </section>

    <div
      v-show="showGeneratePaperModal"
      id="quesNoModal"
      class="modal fade"
      tabindex="-1"
      role="dialog"
      aria-labelledby="generatePaperModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="generatePaperModalLabel">
              Generate Paper
            </h5>
            <button
              type="button"
              class="close"
              @click="closeGeneratePaperModal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>How many questions do you want to generate?</p>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                name="questionCount"
                id="questionCount1"
                value="3"
                v-model="selectedQuestionCount"
              />
              <label class="form-check-label" for="questionCount1">3</label>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                name="questionCount"
                id="questionCount2"
                value="5"
                v-model="selectedQuestionCount"
              />
              <label class="form-check-label" for="questionCount2">5</label>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                name="questionCount"
                id="questionCount3"
                value="7"
                v-model="selectedQuestionCount"
              />
              <label class="form-check-label" for="questionCount3">7</label>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeGeneratePaperModal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="generatePaper"
            >
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { coursesRef, examsRef, quesRef } from "../firebase/db.js";
import { doc, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "vue-router";
import PaperCard from "../components/PaperCard.vue";
import $ from "jquery";

const papers = ref([]);
const router = useRouter();
const courseCode = router.currentRoute.value.params.courseCode;
const showGeneratePaperModal = ref(false);
const selectedQuestionCount = ref(3);

const fetchPapers = async () => {
  const q = query(examsRef, where("course", "==", doc(coursesRef, courseCode)));
  const snapshot = await getDocs(q);
  snapshot.forEach((paper) => {
    papers.value.push({ ...paper.data(), id: paper.id });
  });
};

onMounted(fetchPapers);

const openGeneratePaperModal = () => {
  showGeneratePaperModal.value = true;
  $("#quesNoModal").modal("show");
  $(".fade").css("display", "block"); 
};

const closeGeneratePaperModal = () => {
  showGeneratePaperModal.value = false;
  $("#quesNoModal").modal("hide");
  $(".fade").css("display", "none"); 
};

const generatePaper = async () => {
  $(".fade").css("display", "none");
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

    const selectedQuestions = getRandomQuestions(
      questions,
      selectedQuestionCount.value
    );
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
