<template>
    <div>
      <h1>Add new paper</h1>
      <form id="paper-form">
        <div>
          <label for="newPaperCourse">Course</label>
          <input
            type="text"
            placeholder="Add course code here"
            v-model="course"
            required
          />
          <label for="newPaperYear">Year</label>
          <input
            type="text"
            placeholder="Year published"
            v-model="year"
            required
          />
          <label for="newPaperTest">Test</label>
          <input type="int" placeholder="Test?" v-model="test" required />
        </div>
        <button @click.prevent="addNewPaper">Create</button>
      </form>
    </div>
  </template>
  
  <script>
  import { examsRef, db } from "../firebase/db.js";
  import { doc, setDoc } from "firebase/firestore";
  
  export default {
    name: "App",
    data() {
      return {
        course: "",
        year: "",
        test: "",
      };
    },
    methods: {
      async addNewPaper() {
        try {
          const paperDocRef = doc(examsRef, this.course + "-" + this.year + "-" + this.test);
  
          await setDoc(paperDocRef, {
            course: doc(db, "courses", this.course),
            year: this.year,
            test: this.test,
          });
  
          this.course = "";
          this.year = "";
          this.test = "";
        } catch (error) {
          console.error("Error adding document: ", error);
        }
      },
    },
  };
  </script>
  