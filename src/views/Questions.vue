<template>
  <div class="content-container">
    <h1>
      {{ courseCode }} {{ year }} Test
      {{ test }}
    </h1>

    <form id="question-form">
      <div>
        <input type="text" placeholder="Question No." s v-model="newQuesNo" required />
        <input type="text" placeholder="Question Description" v-model="newDescription" required />
      </div>
      <button @click.prevent="addNewQuestion">Create</button>
    </form>

    <DownloadPaperButton :questions="questions" :courseCode="courseCode" :isGenerated="false" />

    <h2>Questions List</h2>
    <table>
      <thead>
        <tr>
          <th>No.</th>
          <th>Question</th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="question in questions" :key="question.id">
          <td>{{ question.quesNo }}</td>
          <td>{{ question.description }}</td>
          <td>
            <button @click="editQuestion(question)" class="icon-button">
              <span class="material-symbols-outlined">edit</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <EditQuestion :show="isModalOpen" :question="editingQuestion" @close="isModalOpen = false" @edit="handleEdit" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { quesRef, examsRef } from "../firebase/db.js";
import { doc, query, where, getDocs, setDoc } from "firebase/firestore";
import { useRouter } from "vue-router";
import DownloadPaperButton from "../components/DownloadPaperButton.vue";
import EditQuestion from "../components/EditQuestion.vue";

const questions = ref([]);
const router = useRouter();
const paperId = router.currentRoute.value.params.paperId;

const courseCode = paperId.split("-")[0];
const year = paperId.split("-")[1];
const test = paperId.split("-")[2];

const newQuesNo = ref("");
const newDescription = ref("");

const editingQuestion = ref(null);
const isModalOpen = ref(false);
const handleEdit = ref(false);

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
    if (newQuesNo.value.trim() == "" || newDescription.value.trim() == "") {
      console.error("Question No. and Description are required.");
      return;
    }
    console.log(newQuesNo.value);
    console.log(newDescription.value);
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

const editQuestion = (question) => {
  editingQuestion.value = question;
  newQuesNo.value = question.quesNo;
  newDescription.value = question.description;
};
</script>
