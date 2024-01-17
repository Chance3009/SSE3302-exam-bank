<template>
  <div class="content-container">
    <div>
      <h1>Add new paper</h1>
      <form id="paper-form">
        <div>
          <label for="newPaperCourse">Course</label>
          <input type="text" placeholder="Course code" v-model="course" required />
          <label for="newPaperYear">Year</label>
          <input type="text" placeholder="Year published" v-model="year" required />
          <label for="newPaperTest">Test</label>
          <input type="int" placeholder="Test number (e.g. Test 1, please enter 1)" v-model="test" required />
        </div>
        <button @click.prevent="addNewPaper">Create</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { examsRef, db } from "../firebase/db.js";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "vue-router";

const course = ref("");
const year = ref("");
const test = ref("");

const router = useRouter();

const addNewPaper = async () => {
  try {
    const paperId = `${course.value}-${year.value}-${test.value}`;
    const paperDocRef = doc(examsRef, paperId);

    await setDoc(paperDocRef, {
      course: doc(db, "courses", course.value),
      year: year.value,
      test: test.value,
    });

    // Clear form fields
    course.value = "";
    year.value = "";
    test.value = "";

    // Use router.push to navigate to the questions-list route with the paperId as a parameter
    router.push({ name: "questions-list", params: { paperId } });
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};
</script>
