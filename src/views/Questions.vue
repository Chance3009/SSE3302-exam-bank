<template>
  <h1>
    {{ courseCode }} {{ year }} Test
    {{ test }}
  </h1>
  <section id="questions">
    <div v-for="question in questions" :key="question.id" class="question">
      {{ question.quesNo }} . {{ question.description }}
    </div>

    <form id="question-form">
      <div>
        <input
          type="text"
          placeholder="Question No."
          v-model="newQuesNo"
          required
        />
        <input
          type="text"
          placeholder="Question Description"
          v-model="newDescription"
          required
        />
      </div>
      <button @click.prevent="addNewQuestion">Create</button>
    </form>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { quesRef, examsRef } from "../firebase/db.js";
import { doc, query, where, getDocs, setDoc } from "firebase/firestore";
import { useRouter } from "vue-router";

const questions = ref([]);
const router = useRouter();
const paperId = router.currentRoute.value.params.paperId;

const courseCode = paperId.split("-")[0];
const year = paperId.split("-")[1];
const test = paperId.split("-")[2];

const newQuesNo = ref("");
const newDescription = ref("");

const fetchQuestions = async () => {
  try {
    const q = query(quesRef, where("paper", "==", doc(examsRef, paperId)));
    const snapshot = await getDocs(q);
    const updatedQuestions = [];
    snapshot.forEach((question) => {
      updatedQuestions.push({ ...question.data(), id: question.id });
    });
    questions.value = updatedQuestions;
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
};

onMounted(fetchQuestions);

const addNewQuestion = async () => {
  try {
    const quesDocRef = doc(quesRef, paperId + "-" + newQuesNo.value);

    await setDoc(quesDocRef, {
      quesNo: newQuesNo.value,
      paper: doc(examsRef, paperId),
      description: newDescription.value,
    });

    newQuesNo.value = "";
    newDescription.value = "";

    await fetchQuestions();
  } catch (error) {
    console.error("Error adding document:", error);
  }
};
</script>
