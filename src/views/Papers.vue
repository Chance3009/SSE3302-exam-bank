<template>
  <div id="app">
    <div>
      <h1>Exam Papers of {{ courseCode }}</h1>
      <button @click="openGeneratePaperModal" class="btn btn-primary">
        Generate Paper
      </button>
      <section id="papers">
        <PaperCard v-for="paper in papers" :key="paper.id" :paper="paper" />
      </section>

      <div v-show="showGeneratePaperModal" id="quesNoModal" class="modal fade" tabindex="-1" role="dialog"
        aria-labelledby="generatePaperModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="generatePaperModalLabel">
                Generate Paper
              </h5>
              <button type="button" class="close" @click="closeGeneratePaperModal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>How many questions do you want to generate?</p>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="questionCount" id="questionCount1" value="3"
                  v-model="selectedQuestionCount" />
                <label class="form-check-label" for="questionCount1">3</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="questionCount" id="questionCount2" value="5"
                  v-model="selectedQuestionCount" />
                <label class="form-check-label" for="questionCount2">5</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="questionCount" id="questionCount3" value="7"
                  v-model="selectedQuestionCount" />
                <label class="form-check-label" for="questionCount3">7</label>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeGeneratePaperModal">
                Close
              </button>
              <button type="button" class="btn btn-primary" @click="generatePaper">
                Generate
              </button>
            </div>
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

<style scoped>
*,
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::after,
::before {
  box-sizing: border-box;
}

html {
  font-family: sans-serif;
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
}

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

article,
aside,
figcaption,
figure,
footer,
header,
hgroup,
main,
nav,
section {
  display: block;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

#app {
  min-height: 100%;
  overflow-y: auto;
}

[tabindex="-1"]:focus:not(:focus-visible) {
  outline: 0 !important;
}

hr {
  box-sizing: content-box;
  height: 0;
  overflow: visible;
}

.btn .badge {
  position: relative;
  top: -1px;
}

.close {
  float: right;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  color: #000;
  text-shadow: 0 1px 0 #fff;
  opacity: 0.5;
}

.close:hover {
  color: #000;
  text-decoration: none;
}

.close:not(:disabled):not(.disabled):focus,
.close:not(:disabled):not(.disabled):hover {
  opacity: 0.75;
}

button.close {
  padding: 0;
  background-color: transparent;
  border: 0;
}

a.close.disabled {
  pointer-events: none;
}

.modal-open {
  overflow: hidden;
}

.modal-open .modal {
  overflow-x: hidden;
  overflow-y: auto;
}

.modal {
  margin: 20px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1050;
  display: none;
  width: 100%;
  height: 100%;
  overflow: hidden;
  outline: 0;
}

.modal-dialog {
  position: relative;
  width: auto;
  margin: 0.5rem;
  pointer-events: none;
}

.modal.fade .modal-dialog {
  transition: -webkit-transform 0.3s ease-out;
  transition: transform 0.3s ease-out;
  transition: transform 0.3s ease-out, -webkit-transform 0.3s ease-out;
  -webkit-transform: translate(0, -50px);
  transform: translate(0, -50px);
}

@media (prefers-reduced-motion: reduce) {
  .modal.fade .modal-dialog {
    transition: none;
  }
}

.modal.show .modal-dialog {
  -webkit-transform: none;
  transform: none;
}

.modal.modal-static .modal-dialog {
  -webkit-transform: scale(1.02);
  transform: scale(1.02);
}

.modal-dialog-scrollable {
  display: -ms-flexbox;
  display: flex;
  max-height: calc(100% - 1rem);
}

.modal-dialog-scrollable .modal-content {
  max-height: calc(100vh - 1rem);
  overflow: hidden;
}

.modal-dialog-scrollable .modal-footer,
.modal-dialog-scrollable .modal-header {
  -ms-flex-negative: 0;
  flex-shrink: 0;
}

.modal-dialog-scrollable .modal-body {
  overflow-y: auto;
}

.modal-dialog-centered {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  min-height: calc(100% - 1rem);
}

.modal-dialog-centered::before {
  display: block;
  height: calc(100vh - 1rem);
  height: -webkit-min-content;
  height: -moz-min-content;
  height: min-content;
  content: "";
}

.modal-dialog-centered.modal-dialog-scrollable {
  -ms-flex-direction: column;
  flex-direction: column;
  -ms-flex-pack: center;
  justify-content: center;
  height: 100%;
}

.modal-dialog-centered.modal-dialog-scrollable .modal-content {
  max-height: none;
}

.modal-dialog-centered.modal-dialog-scrollable::before {
  content: none;
}

.modal-content {
  position: relative;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
  outline: 0;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: #000;
}

.modal-backdrop.fade {
  opacity: 0;
}

.modal-backdrop.show {
  opacity: 0.5;
}

.modal-header {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: start;
  align-items: flex-start;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 1rem 1rem;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: calc(0.3rem - 1px);
  border-top-right-radius: calc(0.3rem - 1px);
}

.modal-header .close {
  padding: 1rem 1rem;
  margin: -1rem -1rem -1rem auto;
}

.modal-title {
  margin-bottom: 0;
  line-height: 1.5;
}

.modal-body {
  position: relative;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  padding: 1rem;
}

.modal-footer {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: end;
  justify-content: flex-end;
  padding: 0.75rem;
  border-top: 1px solid #dee2e6;
  border-bottom-right-radius: calc(0.3rem - 1px);
  border-bottom-left-radius: calc(0.3rem - 1px);
}

.modal-footer>* {
  margin: 0.25rem;
}

.modal-scrollbar-measure {
  position: absolute;
  top: -9999px;
  width: 50px;
  height: 50px;
  overflow: scroll;
}

@media (min-width: 576px) {
  .modal-dialog {
    max-width: 500px;
    margin: 1.75rem auto;
  }

  .modal-dialog-scrollable {
    max-height: calc(100% - 3.5rem);
  }

  .modal-dialog-scrollable .modal-content {
    max-height: calc(100vh - 3.5rem);
  }

  .modal-dialog-centered {
    min-height: calc(100% - 3.5rem);
  }

  .modal-dialog-centered::before {
    height: calc(100vh - 3.5rem);
    height: -webkit-min-content;
    height: -moz-min-content;
    height: min-content;
  }

  .modal-sm {
    max-width: 300px;
  }
}

@media (min-width: 992px) {

  .modal-lg,
  .modal-xl {
    max-width: 800px;
  }
}

@media (min-width: 1200px) {
  .modal-xl {
    max-width: 1140px;
  }
}

.tooltip {
  position: absolute;
  z-index: 1070;
  display: block;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
    "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-style: normal;
  font-weight: 400;
  line-height: 1.5;
  text-align: left;
  text-align: start;
  text-decoration: none;
  text-shadow: none;
  text-transform: none;
  letter-spacing: normal;
  word-break: normal;
  word-spacing: normal;
  white-space: normal;
  line-break: auto;
  font-size: 0.875rem;
  word-wrap: break-word;
  opacity: 0;
}

.tooltip.show {
  opacity: 0.9;
}

.tooltip .arrow {
  position: absolute;
  display: block;
  width: 0.8rem;
  height: 0.4rem;
}

.tooltip .arrow::before {
  position: absolute;
  content: "";
  border-color: transparent;
  border-style: solid;
}

.bs-tooltip-auto[x-placement^="top"],
.bs-tooltip-top {
  padding: 0.4rem 0;
}

.bs-tooltip-auto[x-placement^="top"] .arrow,
.bs-tooltip-top .arrow {
  bottom: 0;
}

.bs-tooltip-auto[x-placement^="top"] .arrow::before,
.bs-tooltip-top .arrow::before {
  top: 0;
  border-width: 0.4rem 0.4rem 0;
  border-top-color: #000;
}

.bs-tooltip-auto[x-placement^="right"],
.bs-tooltip-right {
  padding: 0 0.4rem;
}

.bs-tooltip-auto[x-placement^="right"] .arrow,
.bs-tooltip-right .arrow {
  left: 0;
  width: 0.4rem;
  height: 0.8rem;
}

.bs-tooltip-auto[x-placement^="right"] .arrow::before,
.bs-tooltip-right .arrow::before {
  right: 0;
  border-width: 0.4rem 0.4rem 0.4rem 0;
  border-right-color: #000;
}

.bs-tooltip-auto[x-placement^="bottom"],
.bs-tooltip-bottom {
  padding: 0.4rem 0;
}

.bs-tooltip-auto[x-placement^="bottom"] .arrow,
.bs-tooltip-bottom .arrow {
  top: 0;
}

.bs-tooltip-auto[x-placement^="bottom"] .arrow::before,
.bs-tooltip-bottom .arrow::before {
  bottom: 0;
  border-width: 0 0.4rem 0.4rem;
  border-bottom-color: #000;
}

.bs-tooltip-auto[x-placement^="left"],
.bs-tooltip-left {
  padding: 0 0.4rem;
}

.bs-tooltip-auto[x-placement^="left"] .arrow,
.bs-tooltip-left .arrow {
  right: 0;
  width: 0.4rem;
  height: 0.8rem;
}

.bs-tooltip-auto[x-placement^="left"] .arrow::before,
.bs-tooltip-left .arrow::before {
  left: 0;
  border-width: 0.4rem 0 0.4rem 0.4rem;
  border-left-color: #000;
}

.tooltip-inner {
  max-width: 200px;
  padding: 0.25rem 0.5rem;
  color: #fff;
  text-align: center;
  background-color: #000;
  border-radius: 0.25rem;
}

.carousel {
  position: relative;
}

.carousel.pointer-event {
  -ms-touch-action: pan-y;
  touch-action: pan-y;
}

.carousel-inner {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.carousel-inner::after {
  display: block;
  clear: both;
  content: "";
}

.carousel-item {
  position: relative;
  display: none;
  float: left;
  width: 100%;
  margin-right: -100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transition: -webkit-transform 0.6s ease-in-out;
  transition: transform 0.6s ease-in-out;
  transition: transform 0.6s ease-in-out, -webkit-transform 0.6s ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
  .carousel-item {
    transition: none;
  }
}

.carousel-item-next,
.carousel-item-prev,
.carousel-item.active {
  display: block;
}

.active.carousel-item-right,
.carousel-item-next:not(.carousel-item-left) {
  -webkit-transform: translateX(100%);
  transform: translateX(100%);
}

.active.carousel-item-left,
.carousel-item-prev:not(.carousel-item-right) {
  -webkit-transform: translateX(-100%);
  transform: translateX(-100%);
}

.carousel-fade .carousel-item {
  opacity: 0;
  transition-property: opacity;
  -webkit-transform: none;
  transform: none;
}

.carousel-fade .carousel-item-next.carousel-item-left,
.carousel-fade .carousel-item-prev.carousel-item-right,
.carousel-fade .carousel-item.active {
  z-index: 1;
  opacity: 1;
}

.carousel-fade .active.carousel-item-left,
.carousel-fade .active.carousel-item-right {
  z-index: 0;
  opacity: 0;
  transition: opacity 0s 0.6s;
}

@media (prefers-reduced-motion: reduce) {

  .carousel-fade .active.carousel-item-left,
  .carousel-fade .active.carousel-item-right {
    transition: none;
  }
}

.carousel-control-next,
.carousel-control-prev {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 1;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: center;
  justify-content: center;
  width: 15%;
  color: #fff;
  text-align: center;
  opacity: 0.5;
  transition: opacity 0.15s ease;
}

@media (prefers-reduced-motion: reduce) {

  .carousel-control-next,
  .carousel-control-prev {
    transition: none;
  }
}

.carousel-control-next:focus,
.carousel-control-next:hover,
.carousel-control-prev:focus,
.carousel-control-prev:hover {
  color: #fff;
  text-decoration: none;
  outline: 0;
  opacity: 0.9;
}

.carousel-control-prev {
  left: 0;
}

.carousel-control-next {
  right: 0;
}

.carousel-control-next-icon,
.carousel-control-prev-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: no-repeat 50%/100% 100%;
}

.carousel-control-prev-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath d='M5.25 0l-4 4 4 4 1.5-1.5L4.25 4l2.5-2.5L5.25 0z'/%3e%3c/svg%3e");
}

.carousel-control-next-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath d='M2.75 0l-1.5 1.5L3.75 4l-2.5 2.5L2.75 8l4-4-4-4z'/%3e%3c/svg%3e");
}

.carousel-indicators {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 15;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: center;
  justify-content: center;
  padding-left: 0;
  margin-right: 15%;
  margin-left: 15%;
  list-style: none;
}

.carousel-indicators li {
  box-sizing: content-box;
  -ms-flex: 0 1 auto;
  flex: 0 1 auto;
  width: 30px;
  height: 3px;
  margin-right: 3px;
  margin-left: 3px;
  text-indent: -999px;
  cursor: pointer;
  background-color: #fff;
  background-clip: padding-box;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  opacity: 0.5;
  transition: opacity 0.6s ease;
}

@media (prefers-reduced-motion: reduce) {
  .carousel-indicators li {
    transition: none;
  }
}

.carousel-indicators .active {
  opacity: 1;
}

.carousel-caption {
  position: absolute;
  right: 15%;
  bottom: 20px;
  left: 15%;
  z-index: 10;
  padding-top: 20px;
  padding-bottom: 20px;
  color: #fff;
  text-align: center;
}

@-webkit-keyframes spinner-border {
  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes spinner-border {
  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.spinner-border {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  vertical-align: text-bottom;
  border: 0.25em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  -webkit-animation: spinner-border 0.75s linear infinite;
  animation: spinner-border 0.75s linear infinite;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.2em;
}

@-webkit-keyframes spinner-grow {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }

  50% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

@keyframes spinner-grow {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }

  50% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

.spinner-grow {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  vertical-align: text-bottom;
  background-color: currentColor;
  border-radius: 50%;
  opacity: 0;
  -webkit-animation: spinner-grow 0.75s linear infinite;
  animation: spinner-grow 0.75s linear infinite;
}

.spinner-grow-sm {
  width: 1rem;
  height: 1rem;
}

.align-baseline {
  vertical-align: baseline !important;
}

.align-top {
  vertical-align: top !important;
}

.align-middle {
  vertical-align: middle !important;
}

.align-bottom {
  vertical-align: bottom !important;
}

.align-text-bottom {
  vertical-align: text-bottom !important;
}

.align-text-top {
  vertical-align: text-top !important;
}

.bg-primary {
  background-color: #007bff !important;
}

a.bg-primary:focus,
a.bg-primary:hover,
button.bg-primary:focus,
button.bg-primary:hover {
  background-color: #0062cc !important;
}

.bg-secondary {
  background-color: #6c757d !important;
}

a.bg-secondary:focus,
a.bg-secondary:hover,
button.bg-secondary:focus,
button.bg-secondary:hover {
  background-color: #545b62 !important;
}

.bg-success {
  background-color: #28a745 !important;
}

a.bg-success:focus,
a.bg-success:hover,
button.bg-success:focus,
button.bg-success:hover {
  background-color: #1e7e34 !important;
}

.bg-info {
  background-color: #17a2b8 !important;
}

a.bg-info:focus,
a.bg-info:hover,
button.bg-info:focus,
button.bg-info:hover {
  background-color: #117a8b !important;
}

.bg-warning {
  background-color: #ffc107 !important;
}

a.bg-warning:focus,
a.bg-warning:hover,
button.bg-warning:focus,
button.bg-warning:hover {
  background-color: #d39e00 !important;
}

.bg-danger {
  background-color: #dc3545 !important;
}

a.bg-danger:focus,
a.bg-danger:hover,
button.bg-danger:focus,
button.bg-danger:hover {
  background-color: #bd2130 !important;
}

.bg-light {
  background-color: #f8f9fa !important;
}

a.bg-light:focus,
a.bg-light:hover,
button.bg-light:focus,
button.bg-light:hover {
  background-color: #dae0e5 !important;
}

.bg-dark {
  background-color: #343a40 !important;
}

a.bg-dark:focus,
a.bg-dark:hover,
button.bg-dark:focus,
button.bg-dark:hover {
  background-color: #1d2124 !important;
}

.bg-white {
  background-color: #fff !important;
}

.bg-transparent {
  background-color: transparent !important;
}

@media (min-width: 1200px) {
  .d-xl-none {
    display: none !important;
  }

  .d-xl-inline {
    display: inline !important;
  }

  .d-xl-inline-block {
    display: inline-block !important;
  }

  .d-xl-block {
    display: block !important;
  }

  .d-xl-table {
    display: table !important;
  }

  .d-xl-table-row {
    display: table-row !important;
  }

  .d-xl-table-cell {
    display: table-cell !important;
  }

  .d-xl-flex {
    display: -ms-flexbox !important;
    display: flex !important;
  }

  .d-xl-inline-flex {
    display: -ms-inline-flexbox !important;
    display: inline-flex !important;
  }
}

@media print {
  .d-print-none {
    display: none !important;
  }

  .d-print-inline {
    display: inline !important;
  }

  .d-print-inline-block {
    display: inline-block !important;
  }

  .d-print-block {
    display: block !important;
  }

  .d-print-table {
    display: table !important;
  }

  .d-print-table-row {
    display: table-row !important;
  }

  .d-print-table-cell {
    display: table-cell !important;
  }

  .d-print-flex {
    display: -ms-flexbox !important;
    display: flex !important;
  }

  .d-print-inline-flex {
    display: -ms-inline-flexbox !important;
    display: inline-flex !important;
  }
}

.embed-responsive {
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  overflow: hidden;
}

.embed-responsive::before {
  display: block;
  content: "";
}

.embed-responsive .embed-responsive-item,
.embed-responsive embed,
.embed-responsive iframe,
.embed-responsive object,
.embed-responsive video {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.embed-responsive-21by9::before {
  padding-top: 42.857143%;
}

.embed-responsive-16by9::before {
  padding-top: 56.25%;
}

.embed-responsive-4by3::before {
  padding-top: 75%;
}

.embed-responsive-1by1::before {
  padding-top: 100%;
}

.flex-row {
  -ms-flex-direction: row !important;
  flex-direction: row !important;
}

.flex-column {
  -ms-flex-direction: column !important;
  flex-direction: column !important;
}

.flex-row-reverse {
  -ms-flex-direction: row-reverse !important;
  flex-direction: row-reverse !important;
}

.flex-column-reverse {
  -ms-flex-direction: column-reverse !important;
  flex-direction: column-reverse !important;
}

.flex-wrap {
  -ms-flex-wrap: wrap !important;
  flex-wrap: wrap !important;
}

.flex-nowrap {
  -ms-flex-wrap: nowrap !important;
  flex-wrap: nowrap !important;
}

.flex-wrap-reverse {
  -ms-flex-wrap: wrap-reverse !important;
  flex-wrap: wrap-reverse !important;
}

.flex-fill {
  -ms-flex: 1 1 auto !important;
  flex: 1 1 auto !important;
}

.flex-grow-0 {
  -ms-flex-positive: 0 !important;
  flex-grow: 0 !important;
}

.flex-grow-1 {
  -ms-flex-positive: 1 !important;
  flex-grow: 1 !important;
}

.flex-shrink-0 {
  -ms-flex-negative: 0 !important;
  flex-shrink: 0 !important;
}

.flex-shrink-1 {
  -ms-flex-negative: 1 !important;
  flex-shrink: 1 !important;
}

.justify-content-start {
  -ms-flex-pack: start !important;
  justify-content: flex-start !important;
}

.justify-content-end {
  -ms-flex-pack: end !important;
  justify-content: flex-end !important;
}

.justify-content-center {
  -ms-flex-pack: center !important;
  justify-content: center !important;
}

.justify-content-between {
  -ms-flex-pack: justify !important;
  justify-content: space-between !important;
}

.justify-content-around {
  -ms-flex-pack: distribute !important;
  justify-content: space-around !important;
}

.align-items-start {
  -ms-flex-align: start !important;
  align-items: flex-start !important;
}

.align-items-end {
  -ms-flex-align: end !important;
  align-items: flex-end !important;
}

.align-items-center {
  -ms-flex-align: center !important;
  align-items: center !important;
}

.align-items-baseline {
  -ms-flex-align: baseline !important;
  align-items: baseline !important;
}

.align-items-stretch {
  -ms-flex-align: stretch !important;
  align-items: stretch !important;
}

.align-content-start {
  -ms-flex-line-pack: start !important;
  align-content: flex-start !important;
}

.align-content-end {
  -ms-flex-line-pack: end !important;
  align-content: flex-end !important;
}

.align-content-center {
  -ms-flex-line-pack: center !important;
  align-content: center !important;
}

.align-content-between {
  -ms-flex-line-pack: justify !important;
  align-content: space-between !important;
}

.align-content-around {
  -ms-flex-line-pack: distribute !important;
  align-content: space-around !important;
}

.align-content-stretch {
  -ms-flex-line-pack: stretch !important;
  align-content: stretch !important;
}

.align-self-auto {
  -ms-flex-item-align: auto !important;
  align-self: auto !important;
}

.align-self-start {
  -ms-flex-item-align: start !important;
  align-self: flex-start !important;
}

.align-self-end {
  -ms-flex-item-align: end !important;
  align-self: flex-end !important;
}

.align-self-center {
  -ms-flex-item-align: center !important;
  align-self: center !important;
}

.align-self-baseline {
  -ms-flex-item-align: baseline !important;
  align-self: baseline !important;
}

.align-self-stretch {
  -ms-flex-item-align: stretch !important;
  align-self: stretch !important;
}

@media (min-width: 576px) {
  .flex-sm-row {
    -ms-flex-direction: row !important;
    flex-direction: row !important;
  }

  .flex-sm-column {
    -ms-flex-direction: column !important;
    flex-direction: column !important;
  }

  .flex-sm-row-reverse {
    -ms-flex-direction: row-reverse !important;
    flex-direction: row-reverse !important;
  }

  .flex-sm-column-reverse {
    -ms-flex-direction: column-reverse !important;
    flex-direction: column-reverse !important;
  }

  .flex-sm-wrap {
    -ms-flex-wrap: wrap !important;
    flex-wrap: wrap !important;
  }

  .flex-sm-nowrap {
    -ms-flex-wrap: nowrap !important;
    flex-wrap: nowrap !important;
  }

  .flex-sm-wrap-reverse {
    -ms-flex-wrap: wrap-reverse !important;
    flex-wrap: wrap-reverse !important;
  }

  .flex-sm-fill {
    -ms-flex: 1 1 auto !important;
    flex: 1 1 auto !important;
  }

  .flex-sm-grow-0 {
    -ms-flex-positive: 0 !important;
    flex-grow: 0 !important;
  }

  .flex-sm-grow-1 {
    -ms-flex-positive: 1 !important;
    flex-grow: 1 !important;
  }

  .flex-sm-shrink-0 {
    -ms-flex-negative: 0 !important;
    flex-shrink: 0 !important;
  }

  .flex-sm-shrink-1 {
    -ms-flex-negative: 1 !important;
    flex-shrink: 1 !important;
  }

  .justify-content-sm-start {
    -ms-flex-pack: start !important;
    justify-content: flex-start !important;
  }

  .justify-content-sm-end {
    -ms-flex-pack: end !important;
    justify-content: flex-end !important;
  }

  .justify-content-sm-center {
    -ms-flex-pack: center !important;
    justify-content: center !important;
  }

  .justify-content-sm-between {
    -ms-flex-pack: justify !important;
    justify-content: space-between !important;
  }

  .justify-content-sm-around {
    -ms-flex-pack: distribute !important;
    justify-content: space-around !important;
  }

  .align-items-sm-start {
    -ms-flex-align: start !important;
    align-items: flex-start !important;
  }

  .align-items-sm-end {
    -ms-flex-align: end !important;
    align-items: flex-end !important;
  }

  .align-items-sm-center {
    -ms-flex-align: center !important;
    align-items: center !important;
  }

  .align-items-sm-baseline {
    -ms-flex-align: baseline !important;
    align-items: baseline !important;
  }

  .align-items-sm-stretch {
    -ms-flex-align: stretch !important;
    align-items: stretch !important;
  }

  .align-content-sm-start {
    -ms-flex-line-pack: start !important;
    align-content: flex-start !important;
  }

  .align-content-sm-end {
    -ms-flex-line-pack: end !important;
    align-content: flex-end !important;
  }

  .align-content-sm-center {
    -ms-flex-line-pack: center !important;
    align-content: center !important;
  }

  .align-content-sm-between {
    -ms-flex-line-pack: justify !important;
    align-content: space-between !important;
  }

  .align-content-sm-around {
    -ms-flex-line-pack: distribute !important;
    align-content: space-around !important;
  }

  .align-content-sm-stretch {
    -ms-flex-line-pack: stretch !important;
    align-content: stretch !important;
  }

  .align-self-sm-auto {
    -ms-flex-item-align: auto !important;
    align-self: auto !important;
  }

  .align-self-sm-start {
    -ms-flex-item-align: start !important;
    align-self: flex-start !important;
  }

  .align-self-sm-end {
    -ms-flex-item-align: end !important;
    align-self: flex-end !important;
  }

  .align-self-sm-center {
    -ms-flex-item-align: center !important;
    align-self: center !important;
  }

  .align-self-sm-baseline {
    -ms-flex-item-align: baseline !important;
    align-self: baseline !important;
  }

  .align-self-sm-stretch {
    -ms-flex-item-align: stretch !important;
    align-self: stretch !important;
  }
}

@media (min-width: 768px) {
  .flex-md-row {
    -ms-flex-direction: row !important;
    flex-direction: row !important;
  }

  .flex-md-column {
    -ms-flex-direction: column !important;
    flex-direction: column !important;
  }

  .flex-md-row-reverse {
    -ms-flex-direction: row-reverse !important;
    flex-direction: row-reverse !important;
  }

  .flex-md-column-reverse {
    -ms-flex-direction: column-reverse !important;
    flex-direction: column-reverse !important;
  }

  .flex-md-wrap {
    -ms-flex-wrap: wrap !important;
    flex-wrap: wrap !important;
  }

  .flex-md-nowrap {
    -ms-flex-wrap: nowrap !important;
    flex-wrap: nowrap !important;
  }

  .flex-md-wrap-reverse {
    -ms-flex-wrap: wrap-reverse !important;
    flex-wrap: wrap-reverse !important;
  }

  .flex-md-fill {
    -ms-flex: 1 1 auto !important;
    flex: 1 1 auto !important;
  }

  .flex-md-grow-0 {
    -ms-flex-positive: 0 !important;
    flex-grow: 0 !important;
  }

  .flex-md-grow-1 {
    -ms-flex-positive: 1 !important;
    flex-grow: 1 !important;
  }

  .flex-md-shrink-0 {
    -ms-flex-negative: 0 !important;
    flex-shrink: 0 !important;
  }

  .flex-md-shrink-1 {
    -ms-flex-negative: 1 !important;
    flex-shrink: 1 !important;
  }

  .justify-content-md-start {
    -ms-flex-pack: start !important;
    justify-content: flex-start !important;
  }

  .justify-content-md-end {
    -ms-flex-pack: end !important;
    justify-content: flex-end !important;
  }

  .justify-content-md-center {
    -ms-flex-pack: center !important;
    justify-content: center !important;
  }

  .justify-content-md-between {
    -ms-flex-pack: justify !important;
    justify-content: space-between !important;
  }

  .justify-content-md-around {
    -ms-flex-pack: distribute !important;
    justify-content: space-around !important;
  }

  .align-items-md-start {
    -ms-flex-align: start !important;
    align-items: flex-start !important;
  }

  .align-items-md-end {
    -ms-flex-align: end !important;
    align-items: flex-end !important;
  }

  .align-items-md-center {
    -ms-flex-align: center !important;
    align-items: center !important;
  }

  .align-items-md-baseline {
    -ms-flex-align: baseline !important;
    align-items: baseline !important;
  }

  .align-items-md-stretch {
    -ms-flex-align: stretch !important;
    align-items: stretch !important;
  }

  .align-content-md-start {
    -ms-flex-line-pack: start !important;
    align-content: flex-start !important;
  }

  .align-content-md-end {
    -ms-flex-line-pack: end !important;
    align-content: flex-end !important;
  }

  .align-content-md-center {
    -ms-flex-line-pack: center !important;
    align-content: center !important;
  }

  .align-content-md-between {
    -ms-flex-line-pack: justify !important;
    align-content: space-between !important;
  }

  .align-content-md-around {
    -ms-flex-line-pack: distribute !important;
    align-content: space-around !important;
  }

  .align-content-md-stretch {
    -ms-flex-line-pack: stretch !important;
    align-content: stretch !important;
  }

  .align-self-md-auto {
    -ms-flex-item-align: auto !important;
    align-self: auto !important;
  }

  .align-self-md-start {
    -ms-flex-item-align: start !important;
    align-self: flex-start !important;
  }

  .align-self-md-end {
    -ms-flex-item-align: end !important;
    align-self: flex-end !important;
  }

  .align-self-md-center {
    -ms-flex-item-align: center !important;
    align-self: center !important;
  }

  .align-self-md-baseline {
    -ms-flex-item-align: baseline !important;
    align-self: baseline !important;
  }

  .align-self-md-stretch {
    -ms-flex-item-align: stretch !important;
    align-self: stretch !important;
  }
}

@media (min-width: 992px) {
  .flex-lg-row {
    -ms-flex-direction: row !important;
    flex-direction: row !important;
  }

  .flex-lg-column {
    -ms-flex-direction: column !important;
    flex-direction: column !important;
  }

  .flex-lg-row-reverse {
    -ms-flex-direction: row-reverse !important;
    flex-direction: row-reverse !important;
  }

  .flex-lg-column-reverse {
    -ms-flex-direction: column-reverse !important;
    flex-direction: column-reverse !important;
  }

  .flex-lg-wrap {
    -ms-flex-wrap: wrap !important;
    flex-wrap: wrap !important;
  }

  .flex-lg-nowrap {
    -ms-flex-wrap: nowrap !important;
    flex-wrap: nowrap !important;
  }

  .flex-lg-wrap-reverse {
    -ms-flex-wrap: wrap-reverse !important;
    flex-wrap: wrap-reverse !important;
  }

  .flex-lg-fill {
    -ms-flex: 1 1 auto !important;
    flex: 1 1 auto !important;
  }

  .flex-lg-grow-0 {
    -ms-flex-positive: 0 !important;
    flex-grow: 0 !important;
  }

  .flex-lg-grow-1 {
    -ms-flex-positive: 1 !important;
    flex-grow: 1 !important;
  }

  .flex-lg-shrink-0 {
    -ms-flex-negative: 0 !important;
    flex-shrink: 0 !important;
  }

  .flex-lg-shrink-1 {
    -ms-flex-negative: 1 !important;
    flex-shrink: 1 !important;
  }

  .justify-content-lg-start {
    -ms-flex-pack: start !important;
    justify-content: flex-start !important;
  }

  .justify-content-lg-end {
    -ms-flex-pack: end !important;
    justify-content: flex-end !important;
  }

  .justify-content-lg-center {
    -ms-flex-pack: center !important;
    justify-content: center !important;
  }

  .justify-content-lg-between {
    -ms-flex-pack: justify !important;
    justify-content: space-between !important;
  }

  .justify-content-lg-around {
    -ms-flex-pack: distribute !important;
    justify-content: space-around !important;
  }

  .align-items-lg-start {
    -ms-flex-align: start !important;
    align-items: flex-start !important;
  }

  .align-items-lg-end {
    -ms-flex-align: end !important;
    align-items: flex-end !important;
  }

  .align-items-lg-center {
    -ms-flex-align: center !important;
    align-items: center !important;
  }

  .align-items-lg-baseline {
    -ms-flex-align: baseline !important;
    align-items: baseline !important;
  }

  .align-items-lg-stretch {
    -ms-flex-align: stretch !important;
    align-items: stretch !important;
  }

  .align-content-lg-start {
    -ms-flex-line-pack: start !important;
    align-content: flex-start !important;
  }

  .align-content-lg-end {
    -ms-flex-line-pack: end !important;
    align-content: flex-end !important;
  }

  .align-content-lg-center {
    -ms-flex-line-pack: center !important;
    align-content: center !important;
  }

  .align-content-lg-between {
    -ms-flex-line-pack: justify !important;
    align-content: space-between !important;
  }

  .align-content-lg-around {
    -ms-flex-line-pack: distribute !important;
    align-content: space-around !important;
  }

  .align-content-lg-stretch {
    -ms-flex-line-pack: stretch !important;
    align-content: stretch !important;
  }

  .align-self-lg-auto {
    -ms-flex-item-align: auto !important;
    align-self: auto !important;
  }

  .align-self-lg-start {
    -ms-flex-item-align: start !important;
    align-self: flex-start !important;
  }

  .align-self-lg-end {
    -ms-flex-item-align: end !important;
    align-self: flex-end !important;
  }

  .align-self-lg-center {
    -ms-flex-item-align: center !important;
    align-self: center !important;
  }

  .align-self-lg-baseline {
    -ms-flex-item-align: baseline !important;
    align-self: baseline !important;
  }

  .align-self-lg-stretch {
    -ms-flex-item-align: stretch !important;
    align-self: stretch !important;
  }
}

@media (min-width: 1200px) {
  .flex-xl-row {
    -ms-flex-direction: row !important;
    flex-direction: row !important;
  }

  .flex-xl-column {
    -ms-flex-direction: column !important;
    flex-direction: column !important;
  }

  .flex-xl-row-reverse {
    -ms-flex-direction: row-reverse !important;
    flex-direction: row-reverse !important;
  }

  .flex-xl-column-reverse {
    -ms-flex-direction: column-reverse !important;
    flex-direction: column-reverse !important;
  }

  .flex-xl-wrap {
    -ms-flex-wrap: wrap !important;
    flex-wrap: wrap !important;
  }

  .flex-xl-nowrap {
    -ms-flex-wrap: nowrap !important;
    flex-wrap: nowrap !important;
  }

  .flex-xl-wrap-reverse {
    -ms-flex-wrap: wrap-reverse !important;
    flex-wrap: wrap-reverse !important;
  }

  .flex-xl-fill {
    -ms-flex: 1 1 auto !important;
    flex: 1 1 auto !important;
  }

  .flex-xl-grow-0 {
    -ms-flex-positive: 0 !important;
    flex-grow: 0 !important;
  }

  .flex-xl-grow-1 {
    -ms-flex-positive: 1 !important;
    flex-grow: 1 !important;
  }

  .flex-xl-shrink-0 {
    -ms-flex-negative: 0 !important;
    flex-shrink: 0 !important;
  }

  .flex-xl-shrink-1 {
    -ms-flex-negative: 1 !important;
    flex-shrink: 1 !important;
  }

  .justify-content-xl-start {
    -ms-flex-pack: start !important;
    justify-content: flex-start !important;
  }

  .justify-content-xl-end {
    -ms-flex-pack: end !important;
    justify-content: flex-end !important;
  }

  .justify-content-xl-center {
    -ms-flex-pack: center !important;
    justify-content: center !important;
  }

  .justify-content-xl-between {
    -ms-flex-pack: justify !important;
    justify-content: space-between !important;
  }

  .justify-content-xl-around {
    -ms-flex-pack: distribute !important;
    justify-content: space-around !important;
  }

  .align-items-xl-start {
    -ms-flex-align: start !important;
    align-items: flex-start !important;
  }

  .align-items-xl-end {
    -ms-flex-align: end !important;
    align-items: flex-end !important;
  }

  .align-items-xl-center {
    -ms-flex-align: center !important;
    align-items: center !important;
  }

  .align-items-xl-baseline {
    -ms-flex-align: baseline !important;
    align-items: baseline !important;
  }

  .align-items-xl-stretch {
    -ms-flex-align: stretch !important;
    align-items: stretch !important;
  }

  .align-content-xl-start {
    -ms-flex-line-pack: start !important;
    align-content: flex-start !important;
  }

  .align-content-xl-end {
    -ms-flex-line-pack: end !important;
    align-content: flex-end !important;
  }

  .align-content-xl-center {
    -ms-flex-line-pack: center !important;
    align-content: center !important;
  }

  .align-content-xl-between {
    -ms-flex-line-pack: justify !important;
    align-content: space-between !important;
  }

  .align-content-xl-around {
    -ms-flex-line-pack: distribute !important;
    align-content: space-around !important;
  }

  .align-content-xl-stretch {
    -ms-flex-line-pack: stretch !important;
    align-content: stretch !important;
  }

  .align-self-xl-auto {
    -ms-flex-item-align: auto !important;
    align-self: auto !important;
  }

  .align-self-xl-start {
    -ms-flex-item-align: start !important;
    align-self: flex-start !important;
  }

  .align-self-xl-end {
    -ms-flex-item-align: end !important;
    align-self: flex-end !important;
  }

  .align-self-xl-center {
    -ms-flex-item-align: center !important;
    align-self: center !important;
  }

  .align-self-xl-baseline {
    -ms-flex-item-align: baseline !important;
    align-self: baseline !important;
  }

  .align-self-xl-stretch {
    -ms-flex-item-align: stretch !important;
    align-self: stretch !important;
  }
}

.float-left {
  float: left !important;
}

.float-right {
  float: right !important;
}

.float-none {
  float: none !important;
}

@media (min-width: 576px) {
  .float-sm-left {
    float: left !important;
  }

  .float-sm-right {
    float: right !important;
  }

  .float-sm-none {
    float: none !important;
  }
}

@media (min-width: 768px) {
  .float-md-left {
    float: left !important;
  }

  .float-md-right {
    float: right !important;
  }

  .float-md-none {
    float: none !important;
  }
}

@media (min-width: 992px) {
  .float-lg-left {
    float: left !important;
  }

  .float-lg-right {
    float: right !important;
  }

  .float-lg-none {
    float: none !important;
  }
}

@media (min-width: 1200px) {
  .float-xl-left {
    float: left !important;
  }

  .float-xl-right {
    float: right !important;
  }

  .float-xl-none {
    float: none !important;
  }
}

.user-select-all {
  -webkit-user-select: all !important;
  -moz-user-select: all !important;
  -ms-user-select: all !important;
  user-select: all !important;
}

.user-select-auto {
  -webkit-user-select: auto !important;
  -moz-user-select: auto !important;
  -ms-user-select: auto !important;
  user-select: auto !important;
}

.user-select-none {
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;
}

.overflow-auto {
  overflow: auto !important;
}

.overflow-hidden {
  overflow: hidden !important;
}

.position-static {
  position: static !important;
}

.position-relative {
  position: relative !important;
}

.position-absolute {
  position: absolute !important;
}

.position-fixed {
  position: fixed !important;
}

.position-sticky {
  position: -webkit-sticky !important;
  position: sticky !important;
}

.fixed-top {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1030;
}

.fixed-bottom {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1030;
}

@supports ((position: -webkit-sticky) or (position: sticky)) {
  .sticky-top {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 1020;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sr-only-focusable:active,
.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

.shadow-sm {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
}

.shadow {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.shadow-lg {
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175) !important;
}

.shadow-none {
  box-shadow: none !important;
}

.w-25 {
  width: 25% !important;
}

.w-50 {
  width: 50% !important;
}

.w-75 {
  width: 75% !important;
}

.w-100 {
  width: 100% !important;
}

.w-auto {
  width: auto !important;
}

.h-25 {
  height: 25% !important;
}

.h-50 {
  height: 50% !important;
}

.h-75 {
  height: 75% !important;
}

.h-100 {
  height: 100% !important;
}

.h-auto {
  height: auto !important;
}

.mw-100 {
  max-width: 100% !important;
}

.mh-100 {
  max-height: 100% !important;
}

.min-vw-100 {
  min-width: 100vw !important;
}

.min-vh-100 {
  min-height: 100vh !important;
}

.vw-100 {
  width: 100vw !important;
}

.vh-100 {
  height: 100vh !important;
}

.m-0 {
  margin: 0 !important;
}

.mt-0,
.my-0 {
  margin-top: 0 !important;
}

.mr-0,
.mx-0 {
  margin-right: 0 !important;
}

.mb-0,
.my-0 {
  margin-bottom: 0 !important;
}

.ml-0,
.mx-0 {
  margin-left: 0 !important;
}

.m-1 {
  margin: 0.25rem !important;
}

.mt-1,
.my-1 {
  margin-top: 0.25rem !important;
}

.mr-1,
.mx-1 {
  margin-right: 0.25rem !important;
}

.mb-1,
.my-1 {
  margin-bottom: 0.25rem !important;
}

.ml-1,
.mx-1 {
  margin-left: 0.25rem !important;
}

.m-2 {
  margin: 0.5rem !important;
}

.mt-2,
.my-2 {
  margin-top: 0.5rem !important;
}

.mr-2,
.mx-2 {
  margin-right: 0.5rem !important;
}

.mb-2,
.my-2 {
  margin-bottom: 0.5rem !important;
}

.ml-2,
.mx-2 {
  margin-left: 0.5rem !important;
}

.m-3 {
  margin: 1rem !important;
}

.mt-3,
.my-3 {
  margin-top: 1rem !important;
}

.mr-3,
.mx-3 {
  margin-right: 1rem !important;
}

.mb-3,
.my-3 {
  margin-bottom: 1rem !important;
}

.ml-3,
.mx-3 {
  margin-left: 1rem !important;
}

.m-4 {
  margin: 1.5rem !important;
}

.mt-4,
.my-4 {
  margin-top: 1.5rem !important;
}

.mr-4,
.mx-4 {
  margin-right: 1.5rem !important;
}

.mb-4,
.my-4 {
  margin-bottom: 1.5rem !important;
}

.ml-4,
.mx-4 {
  margin-left: 1.5rem !important;
}

.m-5 {
  margin: 3rem !important;
}

.mt-5,
.my-5 {
  margin-top: 3rem !important;
}

.mr-5,
.mx-5 {
  margin-right: 3rem !important;
}

.mb-5,
.my-5 {
  margin-bottom: 3rem !important;
}

.ml-5,
.mx-5 {
  margin-left: 3rem !important;
}

.p-0 {
  padding: 0 !important;
}

.pt-0,
.py-0 {
  padding-top: 0 !important;
}

.pr-0,
.px-0 {
  padding-right: 0 !important;
}

.pb-0,
.py-0 {
  padding-bottom: 0 !important;
}

.pl-0,
.px-0 {
  padding-left: 0 !important;
}

.p-1 {
  padding: 0.25rem !important;
}

.pt-1,
.py-1 {
  padding-top: 0.25rem !important;
}

.pr-1,
.px-1 {
  padding-right: 0.25rem !important;
}

.pb-1,
.py-1 {
  padding-bottom: 0.25rem !important;
}

.pl-1,
.px-1 {
  padding-left: 0.25rem !important;
}

.p-2 {
  padding: 0.5rem !important;
}

.pt-2,
.py-2 {
  padding-top: 0.5rem !important;
}

.pr-2,
.px-2 {
  padding-right: 0.5rem !important;
}

.pb-2,
.py-2 {
  padding-bottom: 0.5rem !important;
}

.pl-2,
.px-2 {
  padding-left: 0.5rem !important;
}

.p-3 {
  padding: 1rem !important;
}

.pt-3,
.py-3 {
  padding-top: 1rem !important;
}

.pr-3,
.px-3 {
  padding-right: 1rem !important;
}

.pb-3,
.py-3 {
  padding-bottom: 1rem !important;
}

.pl-3,
.px-3 {
  padding-left: 1rem !important;
}

.p-4 {
  padding: 1.5rem !important;
}

.pt-4,
.py-4 {
  padding-top: 1.5rem !important;
}

.pr-4,
.px-4 {
  padding-right: 1.5rem !important;
}

.pb-4,
.py-4 {
  padding-bottom: 1.5rem !important;
}

.pl-4,
.px-4 {
  padding-left: 1.5rem !important;
}

.p-5 {
  padding: 3rem !important;
}

.pt-5,
.py-5 {
  padding-top: 3rem !important;
}

.pr-5,
.px-5 {
  padding-right: 3rem !important;
}

.pb-5,
.py-5 {
  padding-bottom: 3rem !important;
}

.pl-5,
.px-5 {
  padding-left: 3rem !important;
}

.m-n1 {
  margin: -0.25rem !important;
}

.mt-n1,
.my-n1 {
  margin-top: -0.25rem !important;
}

.mr-n1,
.mx-n1 {
  margin-right: -0.25rem !important;
}

.mb-n1,
.my-n1 {
  margin-bottom: -0.25rem !important;
}

.ml-n1,
.mx-n1 {
  margin-left: -0.25rem !important;
}

.m-n2 {
  margin: -0.5rem !important;
}

.mt-n2,
.my-n2 {
  margin-top: -0.5rem !important;
}

.mr-n2,
.mx-n2 {
  margin-right: -0.5rem !important;
}

.mb-n2,
.my-n2 {
  margin-bottom: -0.5rem !important;
}

.ml-n2,
.mx-n2 {
  margin-left: -0.5rem !important;
}

.m-n3 {
  margin: -1rem !important;
}

.mt-n3,
.my-n3 {
  margin-top: -1rem !important;
}

.mr-n3,
.mx-n3 {
  margin-right: -1rem !important;
}

.mb-n3,
.my-n3 {
  margin-bottom: -1rem !important;
}

.ml-n3,
.mx-n3 {
  margin-left: -1rem !important;
}

.m-n4 {
  margin: -1.5rem !important;
}

.mt-n4,
.my-n4 {
  margin-top: -1.5rem !important;
}

.mr-n4,
.mx-n4 {
  margin-right: -1.5rem !important;
}

.mb-n4,
.my-n4 {
  margin-bottom: -1.5rem !important;
}

.ml-n4,
.mx-n4 {
  margin-left: -1.5rem !important;
}

.mr-auto,
.mx-auto {
  margin-right: auto !important;
}

@media (min-width: 576px) {
  .m-sm-0 {
    margin: 0 !important;
  }

  .mt-sm-0,
  .my-sm-0 {
    margin-top: 0 !important;
  }

  .mr-sm-0,
  .mx-sm-0 {
    margin-right: 0 !important;
  }

  .mb-sm-0,
  .my-sm-0 {
    margin-bottom: 0 !important;
  }

  .ml-sm-0,
  .mx-sm-0 {
    margin-left: 0 !important;
  }

  .m-sm-1 {
    margin: 0.25rem !important;
  }

  .mt-sm-1,
  .my-sm-1 {
    margin-top: 0.25rem !important;
  }

  .mr-sm-1,
  .mx-sm-1 {
    margin-right: 0.25rem !important;
  }

  .mb-sm-1,
  .my-sm-1 {
    margin-bottom: 0.25rem !important;
  }

  .ml-sm-1,
  .mx-sm-1 {
    margin-left: 0.25rem !important;
  }

  .m-sm-2 {
    margin: 0.5rem !important;
  }

  .mt-sm-2,
  .my-sm-2 {
    margin-top: 0.5rem !important;
  }

  .mr-sm-2,
  .mx-sm-2 {
    margin-right: 0.5rem !important;
  }

  .mb-sm-2,
  .my-sm-2 {
    margin-bottom: 0.5rem !important;
  }

  .ml-sm-2,
  .mx-sm-2 {
    margin-left: 0.5rem !important;
  }

  .m-sm-3 {
    margin: 1rem !important;
  }

  .mt-sm-3,
  .my-sm-3 {
    margin-top: 1rem !important;
  }

  .mr-sm-3,
  .mx-sm-3 {
    margin-right: 1rem !important;
  }

  .mb-sm-3,
  .my-sm-3 {
    margin-bottom: 1rem !important;
  }

  .ml-sm-3,
  .mx-sm-3 {
    margin-left: 1rem !important;
  }

  .m-sm-4 {
    margin: 1.5rem !important;
  }

  .mt-sm-4,
  .my-sm-4 {
    margin-top: 1.5rem !important;
  }

  .mr-sm-4,
  .mx-sm-4 {
    margin-right: 1.5rem !important;
  }

  .mb-sm-4,
  .my-sm-4 {
    margin-bottom: 1.5rem !important;
  }

  .ml-sm-4,
  .mx-sm-4 {
    margin-left: 1.5rem !important;
  }

  .m-sm-5 {
    margin: 3rem !important;
  }

  .mt-sm-5,
  .my-sm-5 {
    margin-top: 3rem !important;
  }

  .mr-sm-5,
  .mx-sm-5 {
    margin-right: 3rem !important;
  }

  .mb-sm-5,
  .my-sm-5 {
    margin-bottom: 3rem !important;
  }

  .ml-sm-5,
  .mx-sm-5 {
    margin-left: 3rem !important;
  }

  .p-sm-0 {
    padding: 0 !important;
  }

  .pt-sm-0,
  .py-sm-0 {
    padding-top: 0 !important;
  }

  .pr-sm-0,
  .px-sm-0 {
    padding-right: 0 !important;
  }

  .pb-sm-0,
  .py-sm-0 {
    padding-bottom: 0 !important;
  }

  .pl-sm-0,
  .px-sm-0 {
    padding-left: 0 !important;
  }

  .p-sm-1 {
    padding: 0.25rem !important;
  }

  .pt-sm-1,
  .py-sm-1 {
    padding-top: 0.25rem !important;
  }

  .pr-sm-1,
  .px-sm-1 {
    padding-right: 0.25rem !important;
  }

  .pb-sm-1,
  .py-sm-1 {
    padding-bottom: 0.25rem !important;
  }

  .pl-sm-1,
  .px-sm-1 {
    padding-left: 0.25rem !important;
  }

  .p-sm-2 {
    padding: 0.5rem !important;
  }

  .pt-sm-2,
  .py-sm-2 {
    padding-top: 0.5rem !important;
  }

  .pr-sm-2,
  .px-sm-2 {
    padding-right: 0.5rem !important;
  }

  .pb-sm-2,
  .py-sm-2 {
    padding-bottom: 0.5rem !important;
  }

  .pl-sm-2,
  .px-sm-2 {
    padding-left: 0.5rem !important;
  }

  .p-sm-3 {
    padding: 1rem !important;
  }

  .pt-sm-3,
  .py-sm-3 {
    padding-top: 1rem !important;
  }

  .pr-sm-3,
  .px-sm-3 {
    padding-right: 1rem !important;
  }

  .pb-sm-3,
  .py-sm-3 {
    padding-bottom: 1rem !important;
  }

  .pl-sm-3,
  .px-sm-3 {
    padding-left: 1rem !important;
  }

  .p-sm-4 {
    padding: 1.5rem !important;
  }

  .pt-sm-4,
  .py-sm-4 {
    padding-top: 1.5rem !important;
  }

  .pr-sm-4,
  .px-sm-4 {
    padding-right: 1.5rem !important;
  }

  .pb-sm-4,
  .py-sm-4 {
    padding-bottom: 1.5rem !important;
  }

  .pl-sm-4,
  .px-sm-4 {
    padding-left: 1.5rem !important;
  }

  .p-sm-5 {
    padding: 3rem !important;
  }

  .pt-sm-5,
  .py-sm-5 {
    padding-top: 3rem !important;
  }

  .pr-sm-5,
  .px-sm-5 {
    padding-right: 3rem !important;
  }

  .pb-sm-5,
  .py-sm-5 {
    padding-bottom: 3rem !important;
  }

  .pl-sm-5,
  .px-sm-5 {
    padding-left: 3rem !important;
  }

  .m-sm-n1 {
    margin: -0.25rem !important;
  }

  .mt-sm-n1,
  .my-sm-n1 {
    margin-top: -0.25rem !important;
  }

  .mr-sm-n1,
  .mx-sm-n1 {
    margin-right: -0.25rem !important;
  }

  .mb-sm-n1,
  .my-sm-n1 {
    margin-bottom: -0.25rem !important;
  }

  .ml-sm-n1,
  .mx-sm-n1 {
    margin-left: -0.25rem !important;
  }

  .m-sm-n2 {
    margin: -0.5rem !important;
  }

  .mt-sm-n2,
  .my-sm-n2 {
    margin-top: -0.5rem !important;
  }

  .mr-sm-n2,
  .mx-sm-n2 {
    margin-right: -0.5rem !important;
  }

  .mb-sm-n2,
  .my-sm-n2 {
    margin-bottom: -0.5rem !important;
  }

  .ml-sm-n2,
  .mx-sm-n2 {
    margin-left: -0.5rem !important;
  }

  .m-sm-n3 {
    margin: -1rem !important;
  }

  .mt-sm-n3,
  .my-sm-n3 {
    margin-top: -1rem !important;
  }

  .mr-sm-n3,
  .mx-sm-n3 {
    margin-right: -1rem !important;
  }

  .mb-sm-n3,
  .my-sm-n3 {
    margin-bottom: -1rem !important;
  }

  .ml-sm-n3,
  .mx-sm-n3 {
    margin-left: -1rem !important;
  }

  .m-sm-n4 {
    margin: -1.5rem !important;
  }

  .mt-sm-n4,
  .my-sm-n4 {
    margin-top: -1.5rem !important;
  }

  .mr-sm-n4,
  .mx-sm-n4 {
    margin-right: -1.5rem !important;
  }

  .mb-sm-n4,
  .my-sm-n4 {
    margin-bottom: -1.5rem !important;
  }

  .ml-sm-n4,
  .mx-sm-n4 {
    margin-left: -1.5rem !important;
  }

  .m-sm-n5 {
    margin: -3rem !important;
  }

  .mt-sm-n5,
  .my-sm-n5 {
    margin-top: -3rem !important;
  }

  .mr-sm-n5,
  .mx-sm-n5 {
    margin-right: -3rem !important;
  }

  .mb-sm-n5,
  .my-sm-n5 {
    margin-bottom: -3rem !important;
  }

  .ml-sm-n5,
  .mx-sm-n5 {
    margin-left: -3rem !important;
  }

  .m-sm-auto {
    margin: auto !important;
  }

  .mt-sm-auto,
  .my-sm-auto {
    margin-top: auto !important;
  }

  .mr-sm-auto,
  .mx-sm-auto {
    margin-right: auto !important;
  }

  .mb-sm-auto,
  .my-sm-auto {
    margin-bottom: auto !important;
  }

  .ml-sm-auto,
  .mx-sm-auto {
    margin-left: auto !important;
  }
}

@media (min-width: 768px) {
  .m-md-0 {
    margin: 0 !important;
  }

  .mt-md-0,
  .my-md-0 {
    margin-top: 0 !important;
  }

  .mr-md-0,
  .mx-md-0 {
    margin-right: 0 !important;
  }

  .mb-md-0,
  .my-md-0 {
    margin-bottom: 0 !important;
  }

  .ml-md-0,
  .mx-md-0 {
    margin-left: 0 !important;
  }

  .m-md-1 {
    margin: 0.25rem !important;
  }

  .mt-md-1,
  .my-md-1 {
    margin-top: 0.25rem !important;
  }

  .mr-md-1,
  .mx-md-1 {
    margin-right: 0.25rem !important;
  }

  .mb-md-1,
  .my-md-1 {
    margin-bottom: 0.25rem !important;
  }

  .ml-md-1,
  .mx-md-1 {
    margin-left: 0.25rem !important;
  }

  .m-md-2 {
    margin: 0.5rem !important;
  }

  .mt-md-2,
  .my-md-2 {
    margin-top: 0.5rem !important;
  }

  .mr-md-2,
  .mx-md-2 {
    margin-right: 0.5rem !important;
  }

  .mb-md-2,
  .my-md-2 {
    margin-bottom: 0.5rem !important;
  }

  .ml-md-2,
  .mx-md-2 {
    margin-left: 0.5rem !important;
  }

  .m-md-3 {
    margin: 1rem !important;
  }

  .mt-md-3,
  .my-md-3 {
    margin-top: 1rem !important;
  }

  .mr-md-3,
  .mx-md-3 {
    margin-right: 1rem !important;
  }

  .mb-md-3,
  .my-md-3 {
    margin-bottom: 1rem !important;
  }

  .ml-md-3,
  .mx-md-3 {
    margin-left: 1rem !important;
  }

  .m-md-4 {
    margin: 1.5rem !important;
  }

  .mt-md-4,
  .my-md-4 {
    margin-top: 1.5rem !important;
  }

  .mr-md-4,
  .mx-md-4 {
    margin-right: 1.5rem !important;
  }

  .mb-md-4,
  .my-md-4 {
    margin-bottom: 1.5rem !important;
  }

  .ml-md-4,
  .mx-md-4 {
    margin-left: 1.5rem !important;
  }

  .m-md-5 {
    margin: 3rem !important;
  }

  .mt-md-5,
  .my-md-5 {
    margin-top: 3rem !important;
  }

  .mr-md-5,
  .mx-md-5 {
    margin-right: 3rem !important;
  }

  .mb-md-5,
  .my-md-5 {
    margin-bottom: 3rem !important;
  }

  .ml-md-5,
  .mx-md-5 {
    margin-left: 3rem !important;
  }

  .p-md-0 {
    padding: 0 !important;
  }

  .pt-md-0,
  .py-md-0 {
    padding-top: 0 !important;
  }

  .pr-md-0,
  .px-md-0 {
    padding-right: 0 !important;
  }

  .pb-md-0,
  .py-md-0 {
    padding-bottom: 0 !important;
  }

  .pl-md-0,
  .px-md-0 {
    padding-left: 0 !important;
  }

  .p-md-1 {
    padding: 0.25rem !important;
  }

  .pt-md-1,
  .py-md-1 {
    padding-top: 0.25rem !important;
  }

  .pr-md-1,
  .px-md-1 {
    padding-right: 0.25rem !important;
  }

  .pb-md-1,
  .py-md-1 {
    padding-bottom: 0.25rem !important;
  }

  .pl-md-1,
  .px-md-1 {
    padding-left: 0.25rem !important;
  }

  .p-md-2 {
    padding: 0.5rem !important;
  }

  .pt-md-2,
  .py-md-2 {
    padding-top: 0.5rem !important;
  }

  .pr-md-2,
  .px-md-2 {
    padding-right: 0.5rem !important;
  }

  .pb-md-2,
  .py-md-2 {
    padding-bottom: 0.5rem !important;
  }

  .pl-md-2,
  .px-md-2 {
    padding-left: 0.5rem !important;
  }

  .p-md-3 {
    padding: 1rem !important;
  }

  .pt-md-3,
  .py-md-3 {
    padding-top: 1rem !important;
  }

  .pr-md-3,
  .px-md-3 {
    padding-right: 1rem !important;
  }

  .pb-md-3,
  .py-md-3 {
    padding-bottom: 1rem !important;
  }

  .pl-md-3,
  .px-md-3 {
    padding-left: 1rem !important;
  }

  .p-md-4 {
    padding: 1.5rem !important;
  }

  .pt-md-4,
  .py-md-4 {
    padding-top: 1.5rem !important;
  }

  .pr-md-4,
  .px-md-4 {
    padding-right: 1.5rem !important;
  }

  .pb-md-4,
  .py-md-4 {
    padding-bottom: 1.5rem !important;
  }

  .pl-md-4,
  .px-md-4 {
    padding-left: 1.5rem !important;
  }

  .p-md-5 {
    padding: 3rem !important;
  }

  .pt-md-5,
  .py-md-5 {
    padding-top: 3rem !important;
  }

  .pr-md-5,
  .px-md-5 {
    padding-right: 3rem !important;
  }

  .pb-md-5,
  .py-md-5 {
    padding-bottom: 3rem !important;
  }

  .pl-md-5,
  .px-md-5 {
    padding-left: 3rem !important;
  }

  .m-md-n1 {
    margin: -0.25rem !important;
  }

  .mt-md-n1,
  .my-md-n1 {
    margin-top: -0.25rem !important;
  }

  .mr-md-n1,
  .mx-md-n1 {
    margin-right: -0.25rem !important;
  }

  .mb-md-n1,
  .my-md-n1 {
    margin-bottom: -0.25rem !important;
  }

  .ml-md-n1,
  .mx-md-n1 {
    margin-left: -0.25rem !important;
  }

  .m-md-n2 {
    margin: -0.5rem !important;
  }

  .mt-md-n2,
  .my-md-n2 {
    margin-top: -0.5rem !important;
  }

  .mr-md-n2,
  .mx-md-n2 {
    margin-right: -0.5rem !important;
  }

  .mb-md-n2,
  .my-md-n2 {
    margin-bottom: -0.5rem !important;
  }

  .ml-md-n2,
  .mx-md-n2 {
    margin-left: -0.5rem !important;
  }

  .m-md-n3 {
    margin: -1rem !important;
  }

  .mt-md-n3,
  .my-md-n3 {
    margin-top: -1rem !important;
  }

  .mr-md-n3,
  .mx-md-n3 {
    margin-right: -1rem !important;
  }

  .mb-md-n3,
  .my-md-n3 {
    margin-bottom: -1rem !important;
  }

  .ml-md-n3,
  .mx-md-n3 {
    margin-left: -1rem !important;
  }

  .m-md-n4 {
    margin: -1.5rem !important;
  }

  .mt-md-n4,
  .my-md-n4 {
    margin-top: -1.5rem !important;
  }

  .mr-md-n4,
  .mx-md-n4 {
    margin-right: -1.5rem !important;
  }

  .mb-md-n4,
  .my-md-n4 {
    margin-bottom: -1.5rem !important;
  }

  .ml-md-n4,
  .mx-md-n4 {
    margin-left: -1.5rem !important;
  }

  .m-md-n5 {
    margin: -3rem !important;
  }

  .mt-md-n5,
  .my-md-n5 {
    margin-top: -3rem !important;
  }

  .mr-md-n5,
  .mx-md-n5 {
    margin-right: -3rem !important;
  }

  .mb-md-n5,
  .my-md-n5 {
    margin-bottom: -3rem !important;
  }

  .ml-md-n5,
  .mx-md-n5 {
    margin-left: -3rem !important;
  }

  .m-md-auto {
    margin: auto !important;
  }

  .mt-md-auto,
  .my-md-auto {
    margin-top: auto !important;
  }

  .mr-md-auto,
  .mx-md-auto {
    margin-right: auto !important;
  }

  .mb-md-auto,
  .my-md-auto {
    margin-bottom: auto !important;
  }

  .ml-md-auto,
  .mx-md-auto {
    margin-left: auto !important;
  }
}

@media (min-width: 992px) {
  .m-lg-0 {
    margin: 0 !important;
  }

  .mt-lg-0,
  .my-lg-0 {
    margin-top: 0 !important;
  }

  .mr-lg-0,
  .mx-lg-0 {
    margin-right: 0 !important;
  }

  .mb-lg-0,
  .my-lg-0 {
    margin-bottom: 0 !important;
  }

  .ml-lg-0,
  .mx-lg-0 {
    margin-left: 0 !important;
  }

  .m-lg-1 {
    margin: 0.25rem !important;
  }

  .mt-lg-1,
  .my-lg-1 {
    margin-top: 0.25rem !important;
  }

  .mr-lg-1,
  .mx-lg-1 {
    margin-right: 0.25rem !important;
  }

  .mb-lg-1,
  .my-lg-1 {
    margin-bottom: 0.25rem !important;
  }

  .ml-lg-1,
  .mx-lg-1 {
    margin-left: 0.25rem !important;
  }

  .m-lg-2 {
    margin: 0.5rem !important;
  }

  .mt-lg-2,
  .my-lg-2 {
    margin-top: 0.5rem !important;
  }

  .mr-lg-2,
  .mx-lg-2 {
    margin-right: 0.5rem !important;
  }

  .mb-lg-2,
  .my-lg-2 {
    margin-bottom: 0.5rem !important;
  }

  .ml-lg-2,
  .mx-lg-2 {
    margin-left: 0.5rem !important;
  }

  .m-lg-3 {
    margin: 1rem !important;
  }

  .mt-lg-3,
  .my-lg-3 {
    margin-top: 1rem !important;
  }

  .mr-lg-3,
  .mx-lg-3 {
    margin-right: 1rem !important;
  }

  .mb-lg-3,
  .my-lg-3 {
    margin-bottom: 1rem !important;
  }

  .ml-lg-3,
  .mx-lg-3 {
    margin-left: 1rem !important;
  }

  .m-lg-4 {
    margin: 1.5rem !important;
  }

  .mt-lg-4,
  .my-lg-4 {
    margin-top: 1.5rem !important;
  }

  .mr-lg-4,
  .mx-lg-4 {
    margin-right: 1.5rem !important;
  }

  .mb-lg-4,
  .my-lg-4 {
    margin-bottom: 1.5rem !important;
  }

  .ml-lg-4,
  .mx-lg-4 {
    margin-left: 1.5rem !important;
  }

  .m-lg-5 {
    margin: 3rem !important;
  }

  .mt-lg-5,
  .my-lg-5 {
    margin-top: 3rem !important;
  }

  .mr-lg-5,
  .mx-lg-5 {
    margin-right: 3rem !important;
  }

  .mb-lg-5,
  .my-lg-5 {
    margin-bottom: 3rem !important;
  }

  .ml-lg-5,
  .mx-lg-5 {
    margin-left: 3rem !important;
  }

  .p-lg-0 {
    padding: 0 !important;
  }

  .pt-lg-0,
  .py-lg-0 {
    padding-top: 0 !important;
  }

  .pr-lg-0,
  .px-lg-0 {
    padding-right: 0 !important;
  }

  .pb-lg-0,
  .py-lg-0 {
    padding-bottom: 0 !important;
  }

  .pl-lg-0,
  .px-lg-0 {
    padding-left: 0 !important;
  }

  .p-lg-1 {
    padding: 0.25rem !important;
  }

  .pt-lg-1,
  .py-lg-1 {
    padding-top: 0.25rem !important;
  }

  .pr-lg-1,
  .px-lg-1 {
    padding-right: 0.25rem !important;
  }

  .pb-lg-1,
  .py-lg-1 {
    padding-bottom: 0.25rem !important;
  }

  .pl-lg-1,
  .px-lg-1 {
    padding-left: 0.25rem !important;
  }

  .p-lg-2 {
    padding: 0.5rem !important;
  }

  .pt-lg-2,
  .py-lg-2 {
    padding-top: 0.5rem !important;
  }

  .pr-lg-2,
  .px-lg-2 {
    padding-right: 0.5rem !important;
  }

  .pb-lg-2,
  .py-lg-2 {
    padding-bottom: 0.5rem !important;
  }

  .pl-lg-2,
  .px-lg-2 {
    padding-left: 0.5rem !important;
  }

  .p-lg-3 {
    padding: 1rem !important;
  }

  .pt-lg-3,
  .py-lg-3 {
    padding-top: 1rem !important;
  }

  .pr-lg-3,
  .px-lg-3 {
    padding-right: 1rem !important;
  }

  .pb-lg-3,
  .py-lg-3 {
    padding-bottom: 1rem !important;
  }

  .pl-lg-3,
  .px-lg-3 {
    padding-left: 1rem !important;
  }

  .p-lg-4 {
    padding: 1.5rem !important;
  }

  .pt-lg-4,
  .py-lg-4 {
    padding-top: 1.5rem !important;
  }

  .pr-lg-4,
  .px-lg-4 {
    padding-right: 1.5rem !important;
  }

  .pb-lg-4,
  .py-lg-4 {
    padding-bottom: 1.5rem !important;
  }

  .pl-lg-4,
  .px-lg-4 {
    padding-left: 1.5rem !important;
  }

  .p-lg-5 {
    padding: 3rem !important;
  }

  .pt-lg-5,
  .py-lg-5 {
    padding-top: 3rem !important;
  }

  .pr-lg-5,
  .px-lg-5 {
    padding-right: 3rem !important;
  }

  .pb-lg-5,
  .py-lg-5 {
    padding-bottom: 3rem !important;
  }

  .pl-lg-5,
  .px-lg-5 {
    padding-left: 3rem !important;
  }

  .m-lg-n1 {
    margin: -0.25rem !important;
  }

  .mt-lg-n1,
  .my-lg-n1 {
    margin-top: -0.25rem !important;
  }

  .mr-lg-n1,
  .mx-lg-n1 {
    margin-right: -0.25rem !important;
  }

  .mb-lg-n1,
  .my-lg-n1 {
    margin-bottom: -0.25rem !important;
  }

  .ml-lg-n1,
  .mx-lg-n1 {
    margin-left: -0.25rem !important;
  }

  .m-lg-n2 {
    margin: -0.5rem !important;
  }

  .mt-lg-n2,
  .my-lg-n2 {
    margin-top: -0.5rem !important;
  }

  .mr-lg-n2,
  .mx-lg-n2 {
    margin-right: -0.5rem !important;
  }

  .mb-lg-n2,
  .my-lg-n2 {
    margin-bottom: -0.5rem !important;
  }

  .ml-lg-n2,
  .mx-lg-n2 {
    margin-left: -0.5rem !important;
  }

  .m-lg-n3 {
    margin: -1rem !important;
  }

  .mt-lg-n3,
  .my-lg-n3 {
    margin-top: -1rem !important;
  }

  .mr-lg-n3,
  .mx-lg-n3 {
    margin-right: -1rem !important;
  }

  .mb-lg-n3,
  .my-lg-n3 {
    margin-bottom: -1rem !important;
  }

  .ml-lg-n3,
  .mx-lg-n3 {
    margin-left: -1rem !important;
  }

  .m-lg-n4 {
    margin: -1.5rem !important;
  }

  .mt-lg-n4,
  .my-lg-n4 {
    margin-top: -1.5rem !important;
  }

  .mr-lg-n4,
  .mx-lg-n4 {
    margin-right: -1.5rem !important;
  }

  .mb-lg-n4,
  .my-lg-n4 {
    margin-bottom: -1.5rem !important;
  }

  .ml-lg-n4,
  .mx-lg-n4 {
    margin-left: -1.5rem !important;
  }

  .m-lg-n5 {
    margin: -3rem !important;
  }

  .mt-lg-n5,
  .my-lg-n5 {
    margin-top: -3rem !important;
  }

  .mr-lg-n5,
  .mx-lg-n5 {
    margin-right: -3rem !important;
  }

  .mb-lg-n5,
  .my-lg-n5 {
    margin-bottom: -3rem !important;
  }

  .ml-lg-n5,
  .mx-lg-n5 {
    margin-left: -3rem !important;
  }

  .m-lg-auto {
    margin: auto !important;
  }

  .mt-lg-auto,
  .my-lg-auto {
    margin-top: auto !important;
  }

  .mr-lg-auto,
  .mx-lg-auto {
    margin-right: auto !important;
  }

  .mb-lg-auto,
  .my-lg-auto {
    margin-bottom: auto !important;
  }

  .ml-lg-auto,
  .mx-lg-auto {
    margin-left: auto !important;
  }
}

@media (min-width: 1200px) {
  .m-xl-0 {
    margin: 0 !important;
  }

  .mt-xl-0,
  .my-xl-0 {
    margin-top: 0 !important;
  }

  .mr-xl-0,
  .mx-xl-0 {
    margin-right: 0 !important;
  }

  .mb-xl-0,
  .my-xl-0 {
    margin-bottom: 0 !important;
  }

  .ml-xl-0,
  .mx-xl-0 {
    margin-left: 0 !important;
  }

  .m-xl-1 {
    margin: 0.25rem !important;
  }

  .mt-xl-1,
  .my-xl-1 {
    margin-top: 0.25rem !important;
  }

  .mr-xl-1,
  .mx-xl-1 {
    margin-right: 0.25rem !important;
  }

  .mb-xl-1,
  .my-xl-1 {
    margin-bottom: 0.25rem !important;
  }

  .ml-xl-1,
  .mx-xl-1 {
    margin-left: 0.25rem !important;
  }

  .m-xl-2 {
    margin: 0.5rem !important;
  }

  .mt-xl-2,
  .my-xl-2 {
    margin-top: 0.5rem !important;
  }

  .mr-xl-2,
  .mx-xl-2 {
    margin-right: 0.5rem !important;
  }

  .mb-xl-2,
  .my-xl-2 {
    margin-bottom: 0.5rem !important;
  }

  .ml-xl-2,
  .mx-xl-2 {
    margin-left: 0.5rem !important;
  }

  .m-xl-3 {
    margin: 1rem !important;
  }

  .mt-xl-3,
  .my-xl-3 {
    margin-top: 1rem !important;
  }

  .mr-xl-3,
  .mx-xl-3 {
    margin-right: 1rem !important;
  }

  .mb-xl-3,
  .my-xl-3 {
    margin-bottom: 1rem !important;
  }

  .ml-xl-3,
  .mx-xl-3 {
    margin-left: 1rem !important;
  }

  .m-xl-4 {
    margin: 1.5rem !important;
  }

  .mt-xl-4,
  .my-xl-4 {
    margin-top: 1.5rem !important;
  }

  .mr-xl-4,
  .mx-xl-4 {
    margin-right: 1.5rem !important;
  }

  .mb-xl-4,
  .my-xl-4 {
    margin-bottom: 1.5rem !important;
  }

  .ml-xl-4,
  .mx-xl-4 {
    margin-left: 1.5rem !important;
  }

  .m-xl-5 {
    margin: 3rem !important;
  }

  .mt-xl-5,
  .my-xl-5 {
    margin-top: 3rem !important;
  }

  .mr-xl-5,
  .mx-xl-5 {
    margin-right: 3rem !important;
  }

  .mb-xl-5,
  .my-xl-5 {
    margin-bottom: 3rem !important;
  }

  .ml-xl-5,
  .mx-xl-5 {
    margin-left: 3rem !important;
  }

  .p-xl-0 {
    padding: 0 !important;
  }

  .pt-xl-0,
  .py-xl-0 {
    padding-top: 0 !important;
  }

  .pr-xl-0,
  .px-xl-0 {
    padding-right: 0 !important;
  }

  .pb-xl-0,
  .py-xl-0 {
    padding-bottom: 0 !important;
  }

  .pl-xl-0,
  .px-xl-0 {
    padding-left: 0 !important;
  }

  .p-xl-1 {
    padding: 0.25rem !important;
  }

  .pt-xl-1,
  .py-xl-1 {
    padding-top: 0.25rem !important;
  }

  .pr-xl-1,
  .px-xl-1 {
    padding-right: 0.25rem !important;
  }

  .pb-xl-1,
  .py-xl-1 {
    padding-bottom: 0.25rem !important;
  }

  .pl-xl-1,
  .px-xl-1 {
    padding-left: 0.25rem !important;
  }

  .p-xl-2 {
    padding: 0.5rem !important;
  }

  .pt-xl-2,
  .py-xl-2 {
    padding-top: 0.5rem !important;
  }

  .pr-xl-2,
  .px-xl-2 {
    padding-right: 0.5rem !important;
  }

  .pb-xl-2,
  .py-xl-2 {
    padding-bottom: 0.5rem !important;
  }

  .pl-xl-2,
  .px-xl-2 {
    padding-left: 0.5rem !important;
  }

  .p-xl-3 {
    padding: 1rem !important;
  }

  .pt-xl-3,
  .py-xl-3 {
    padding-top: 1rem !important;
  }

  .pr-xl-3,
  .px-xl-3 {
    padding-right: 1rem !important;
  }

  .pb-xl-3,
  .py-xl-3 {
    padding-bottom: 1rem !important;
  }

  .pl-xl-3,
  .px-xl-3 {
    padding-left: 1rem !important;
  }

  .p-xl-4 {
    padding: 1.5rem !important;
  }

  .pt-xl-4,
  .py-xl-4 {
    padding-top: 1.5rem !important;
  }

  .pr-xl-4,
  .px-xl-4 {
    padding-right: 1.5rem !important;
  }

  .pb-xl-4,
  .py-xl-4 {
    padding-bottom: 1.5rem !important;
  }

  .pl-xl-4,
  .px-xl-4 {
    padding-left: 1.5rem !important;
  }

  .p-xl-5 {
    padding: 3rem !important;
  }

  .pt-xl-5,
  .py-xl-5 {
    padding-top: 3rem !important;
  }

  .pr-xl-5,
  .px-xl-5 {
    padding-right: 3rem !important;
  }

  .pb-xl-5,
  .py-xl-5 {
    padding-bottom: 3rem !important;
  }

  .pl-xl-5,
  .px-xl-5 {
    padding-left: 3rem !important;
  }

  .m-xl-n1 {
    margin: -0.25rem !important;
  }

  .mt-xl-n1,
  .my-xl-n1 {
    margin-top: -0.25rem !important;
  }

  .mr-xl-n1,
  .mx-xl-n1 {
    margin-right: -0.25rem !important;
  }

  .mb-xl-n1,
  .my-xl-n1 {
    margin-bottom: -0.25rem !important;
  }

  .ml-xl-n1,
  .mx-xl-n1 {
    margin-left: -0.25rem !important;
  }

  .m-xl-n2 {
    margin: -0.5rem !important;
  }

  .mt-xl-n2,
  .my-xl-n2 {
    margin-top: -0.5rem !important;
  }

  .mr-xl-n2,
  .mx-xl-n2 {
    margin-right: -0.5rem !important;
  }

  .mb-xl-n2,
  .my-xl-n2 {
    margin-bottom: -0.5rem !important;
  }

  .ml-xl-n2,
  .mx-xl-n2 {
    margin-left: -0.5rem !important;
  }

  .m-xl-n3 {
    margin: -1rem !important;
  }

  .mt-xl-n3,
  .my-xl-n3 {
    margin-top: -1rem !important;
  }

  .mr-xl-n3,
  .mx-xl-n3 {
    margin-right: -1rem !important;
  }

  .mb-xl-n3,
  .my-xl-n3 {
    margin-bottom: -1rem !important;
  }

  .ml-xl-n3,
  .mx-xl-n3 {
    margin-left: -1rem !important;
  }

  .m-xl-n4 {
    margin: -1.5rem !important;
  }

  .mt-xl-n4,
  .my-xl-n4 {
    margin-top: -1.5rem !important;
  }

  .mr-xl-n4,
  .mx-xl-n4 {
    margin-right: -1.5rem !important;
  }

  .mb-xl-n4,
  .my-xl-n4 {
    margin-bottom: -1.5rem !important;
  }

  .ml-xl-n4,
  .mx-xl-n4 {
    margin-left: -1.5rem !important;
  }

  .m-xl-n5 {
    margin: -3rem !important;
  }

  .mt-xl-n5,
  .my-xl-n5 {
    margin-top: -3rem !important;
  }

  .mr-xl-n5,
  .mx-xl-n5 {
    margin-right: -3rem !important;
  }

  .mb-xl-n5,
  .my-xl-n5 {
    margin-bottom: -3rem !important;
  }

  .ml-xl-n5,
  .mx-xl-n5 {
    margin-left: -3rem !important;
  }

  .m-xl-auto {
    margin: auto !important;
  }

  .mt-xl-auto,
  .my-xl-auto {
    margin-top: auto !important;
  }

  .mr-xl-auto,
  .mx-xl-auto {
    margin-right: auto !important;
  }

  .mb-xl-auto,
  .my-xl-auto {
    margin-bottom: auto !important;
  }

  .ml-xl-auto,
  .mx-xl-auto {
    margin-left: auto !important;
  }
}

.stretched-link::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  pointer-events: auto;
  content: "";
  background-color: rgba(0, 0, 0, 0);
}

article,
aside,
figcaption,
figure,
footer,
header,
hgroup,
main,
nav,
section {
  display: block;
}

[tabindex="-1"]:focus:not(:focus-visible) {
  outline: 0 !important;
}

hr {
  box-sizing: content-box;
  height: 0;
  overflow: visible;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

p {
  margin-top: 0;
  margin-bottom: 1rem;
}

abbr[data-original-title],
abbr[title] {
  text-decoration: underline;
  -webkit-text-decoration: underline dotted;
  text-decoration: underline dotted;
  cursor: help;
  border-bottom: 0;
  -webkit-text-decoration-skip-ink: none;
  text-decoration-skip-ink: none;
}

dl,
ol,
ul {
  margin-top: 0;
  margin-bottom: 1rem;
}

ol ol,
ol ul,
ul ol,
ul ul {
  margin-bottom: 0;
}

dt {
  font-weight: 700;
}

dd {
  margin-bottom: 0.5rem;
  margin-left: 0;
}

blockquote {
  margin: 0 0 1rem;
}

sub,
sup {
  position: relative;
  font-size: 75%;
  line-height: 0;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

a {
  color: #007bff;
  text-decoration: none;
  background-color: transparent;
}

a:hover {
  color: #0056b3;
  text-decoration: underline;
}

a:not([href]):not([class]) {
  color: inherit;
  text-decoration: none;
}

a:not([href]):not([class]):hover {
  color: inherit;
  text-decoration: none;
}

figure {
  margin: 0 0 1rem;
}

img {
  vertical-align: middle;
  border-style: none;
}

svg {
  overflow: hidden;
  vertical-align: middle;
}

table {
  border-collapse: collapse;
}

caption {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  color: #6c757d;
  text-align: left;
  caption-side: bottom;
}

th {
  text-align: inherit;
}

label {
  display: inline-block;
  margin-bottom: 0.5rem;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  margin: 1em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: #646cff;
}

button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

button,
select {
  text-transform: none;
}

[role="button"] {
  cursor: pointer;
}

select {
  word-wrap: normal;
}

[type="button"]:not(:disabled),
[type="reset"]:not(:disabled),
[type="submit"]:not(:disabled),
button:not(:disabled) {
  cursor: pointer;
}

[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner,
button::-moz-focus-inner {
  padding: 0;
  border-style: none;
}

input[type="checkbox"],
input[type="radio"] {
  box-sizing: border-box;
  padding: 0;
}

textarea {
  overflow: auto;
  resize: vertical;
}

fieldset {
  min-width: 0;
  padding: 0;
  margin: 0;
  border: 0;
}

progress {
  vertical-align: baseline;
}

[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
  height: auto;
}

[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}

::-webkit-file-upload-button {
  font: inherit;
  -webkit-appearance: button;
}

output {
  display: inline-block;
}

summary {
  display: list-item;
  cursor: pointer;
}

template {
  display: none;
}

[hidden] {
  display: none !important;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
  margin-top: 2rem;
  margin-bottom: 0.6rem;
  font-weight: 700;
}

.h2,
h2 {
  font-size: 2rem;
}

.h3,
h3 {
  font-size: 1.75rem;
}

.h4,
h4 {
  font-size: 1.5rem;
}

.h5,
h5 {
  font-size: 1.25rem;
}

.h6,
h6 {
  font-size: 1rem;
}

.form-control {
  display: block;
  width: 100%;
  height: calc(1.5em + 0.75rem + 2px);
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:disabled,
.form-control[readonly] {
  background-color: #e9ecef;
  opacity: 1;
}

input[type="date"].form-control,
input[type="datetime-local"].form-control,
input[type="month"].form-control,
input[type="time"].form-control {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.form-check {
  position: relative;
  display: block;
  padding-left: 1.25rem;
}

.form-check-input {
  position: absolute;
  margin-top: 0.3rem;
  margin-left: -1.25rem;
}

.form-check-input:disabled~.form-check-label,
.form-check-input[disabled]~.form-check-label {
  color: #6c757d;
}

.form-check-label {
  margin-bottom: 0;
}

.form-check-inline {
  display: -ms-inline-flexbox;
  display: inline-flex;
  -ms-flex-align: center;
  align-items: center;
  padding-left: 0;
  margin-right: 0.75rem;
}

.form-check-inline .form-check-input {
  position: static;
  margin-top: 0;
  margin-right: 0.3125rem;
  margin-left: 0;
}

.valid-feedback {
  display: none;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #28a745;
}

.valid-tooltip {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 5;
  display: none;
  max-width: 100%;
  padding: 0.25rem 0.5rem;
  margin-top: 0.1rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #fff;
  background-color: rgba(40, 167, 69, 0.9);
  border-radius: 0.25rem;
}

.is-valid~.valid-feedback,
.is-valid~.valid-tooltip,
.was-validated :valid~.valid-feedback,
.was-validated :valid~.valid-tooltip {
  display: block;
}

.form-control.is-valid,
.was-validated .form-control:valid {
  border-color: #28a745;
  padding-right: calc(1.5em + 0.75rem);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.form-control.is-valid:focus,
.was-validated .form-control:valid:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

.was-validated textarea.form-control:valid,
textarea.form-control.is-valid {
  padding-right: calc(1.5em + 0.75rem);
  background-position: top calc(0.375em + 0.1875rem) right calc(0.375em + 0.1875rem);
}

.custom-select.is-valid,
.was-validated .custom-select:valid {
  border-color: #28a745;
  padding-right: calc(0.75em + 2.3125rem);
  background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5' viewBox='0 0 4 5'%3e%3cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e") no-repeat right 0.75rem center/8px 10px,
    url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e") #fff no-repeat center right 1.75rem / calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.custom-select.is-valid:focus,
.was-validated .custom-select:valid:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

.form-check-input.is-valid~.form-check-label,
.was-validated .form-check-input:valid~.form-check-label {
  color: #28a745;
}

.form-check-input.is-valid~.valid-feedback,
.form-check-input.is-valid~.valid-tooltip,
.was-validated .form-check-input:valid~.valid-feedback,
.was-validated .form-check-input:valid~.valid-tooltip {
  display: block;
}

.custom-control-input.is-valid~.custom-control-label,
.was-validated .custom-control-input:valid~.custom-control-label {
  color: #28a745;
}

.custom-control-input.is-valid~.custom-control-label::before,
.was-validated .custom-control-input:valid~.custom-control-label::before {
  border-color: #28a745;
}

.custom-control-input.is-valid:checked~.custom-control-label::before,
.was-validated .custom-control-input:valid:checked~.custom-control-label::before {
  border-color: #34ce57;
  background-color: #34ce57;
}

.custom-control-input.is-valid:focus~.custom-control-label::before,
.was-validated .custom-control-input:valid:focus~.custom-control-label::before {
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

.custom-control-input.is-valid:focus:not(:checked)~.custom-control-label::before,
.was-validated .custom-control-input:valid:focus:not(:checked)~.custom-control-label::before {
  border-color: #28a745;
}

.custom-file-input.is-valid~.custom-file-label,
.was-validated .custom-file-input:valid~.custom-file-label {
  border-color: #28a745;
}

.custom-file-input.is-valid:focus~.custom-file-label,
.was-validated .custom-file-input:valid:focus~.custom-file-label {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

.invalid-feedback {
  display: none;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #dc3545;
}

.invalid-tooltip {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 5;
  display: none;
  max-width: 100%;
  padding: 0.25rem 0.5rem;
  margin-top: 0.1rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #fff;
  background-color: rgba(220, 53, 69, 0.9);
  border-radius: 0.25rem;
}

.is-invalid~.invalid-feedback,
.is-invalid~.invalid-tooltip,
.was-validated :invalid~.invalid-feedback,
.was-validated :invalid~.invalid-tooltip {
  display: block;
}

.form-control.is-invalid,
.was-validated .form-control:invalid {
  border-color: #dc3545;
  padding-right: calc(1.5em + 0.75rem);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.form-control.is-invalid:focus,
.was-validated .form-control:invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.was-validated textarea.form-control:invalid,
textarea.form-control.is-invalid {
  padding-right: calc(1.5em + 0.75rem);
  background-position: top calc(0.375em + 0.1875rem) right calc(0.375em + 0.1875rem);
}

.custom-select.is-invalid,
.was-validated .custom-select:invalid {
  border-color: #dc3545;
  padding-right: calc(0.75em + 2.3125rem);
  background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5' viewBox='0 0 4 5'%3e%3cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e") no-repeat right 0.75rem center/8px 10px,
    url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e") #fff no-repeat center right 1.75rem / calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.custom-select.is-invalid:focus,
.was-validated .custom-select:invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.form-check-input.is-invalid~.form-check-label,
.was-validated .form-check-input:invalid~.form-check-label {
  color: #dc3545;
}

.form-check-input.is-invalid~.invalid-feedback,
.form-check-input.is-invalid~.invalid-tooltip,
.was-validated .form-check-input:invalid~.invalid-feedback,
.was-validated .form-check-input:invalid~.invalid-tooltip {
  display: block;
}

.custom-control-input.is-invalid~.custom-control-label,
.was-validated .custom-control-input:invalid~.custom-control-label {
  color: #dc3545;
}

.custom-control-input.is-invalid~.custom-control-label::before,
.was-validated .custom-control-input:invalid~.custom-control-label::before {
  border-color: #dc3545;
}

.custom-control-input.is-invalid:checked~.custom-control-label::before,
.was-validated .custom-control-input:invalid:checked~.custom-control-label::before {
  border-color: #e4606d;
  background-color: #e4606d;
}

.custom-control-input.is-invalid:focus~.custom-control-label::before,
.was-validated .custom-control-input:invalid:focus~.custom-control-label::before {
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.custom-control-input.is-invalid:focus:not(:checked)~.custom-control-label::before,
.was-validated .custom-control-input:invalid:focus:not(:checked)~.custom-control-label::before {
  border-color: #dc3545;
}

.custom-file-input.is-invalid~.custom-file-label,
.was-validated .custom-file-input:invalid~.custom-file-label {
  border-color: #dc3545;
}

.custom-file-input.is-invalid:focus~.custom-file-label,
.was-validated .custom-file-input:invalid:focus~.custom-file-label {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.form-inline {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-flow: row wrap;
  flex-flow: row wrap;
  -ms-flex-align: center;
  align-items: center;
}

.form-inline .form-check {
  width: 100%;
}

@media (min-width: 576px) {
  .form-inline label {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: center;
    justify-content: center;
    margin-bottom: 0;
  }

  .form-inline .form-group {
    display: -ms-flexbox;
    display: flex;
    -ms-flex: 0 0 auto;
    flex: 0 0 auto;
    -ms-flex-flow: row wrap;
    flex-flow: row wrap;
    -ms-flex-align: center;
    align-items: center;
    margin-bottom: 0;
  }

  .form-inline .form-control {
    display: inline-block;
    width: auto;
    vertical-align: middle;
  }

  .form-inline .form-control-plaintext {
    display: inline-block;
  }

  .form-inline .custom-select,
  .form-inline .input-group {
    width: auto;
  }

  .form-inline .form-check {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: center;
    justify-content: center;
    width: auto;
    padding-left: 0;
  }

  .form-inline .form-check-input {
    position: relative;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    margin-top: 0;
    margin-right: 0.25rem;
    margin-left: 0;
  }

  .form-inline .custom-control {
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: center;
    justify-content: center;
  }

  .form-inline .custom-control-label {
    margin-bottom: 0;
  }
}

.btn {
  display: inline-block;
  font-weight: 400;
  color: #212529;
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
  .btn {
    transition: none;
  }
}

.btn:hover {
  color: #212529;
  text-decoration: none;
}

.btn.focus,
.btn:focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn.disabled,
.btn:disabled {
  opacity: 0.65;
}

.btn:not(:disabled):not(.disabled) {
  cursor: pointer;
}

a.btn.disabled,
fieldset:disabled a.btn {
  pointer-events: none;
}

.btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  color: #fff;
  background-color: #0069d9;
  border-color: #0062cc;
}

.btn-primary.focus,
.btn-primary:focus {
  color: #fff;
  background-color: #0069d9;
  border-color: #0062cc;
  box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.5);
}

.btn-primary.disabled,
.btn-primary:disabled {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:not(:disabled):not(.disabled).active,
.btn-primary:not(:disabled):not(.disabled):active,
.show>.btn-primary.dropdown-toggle {
  color: #fff;
  background-color: #0062cc;
  border-color: #005cbf;
}

.btn-primary:not(:disabled):not(.disabled).active:focus,
.btn-primary:not(:disabled):not(.disabled):active:focus,
.show>.btn-primary.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.5);
}

.btn-secondary {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-secondary:hover {
  color: #fff;
  background-color: #5a6268;
  border-color: #545b62;
}

.btn-secondary.focus,
.btn-secondary:focus {
  color: #fff;
  background-color: #5a6268;
  border-color: #545b62;
  box-shadow: 0 0 0 0.2rem rgba(130, 138, 145, 0.5);
}

.btn-secondary.disabled,
.btn-secondary:disabled {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-secondary:not(:disabled):not(.disabled).active,
.btn-secondary:not(:disabled):not(.disabled):active,
.show>.btn-secondary.dropdown-toggle {
  color: #fff;
  background-color: #545b62;
  border-color: #4e555b;
}

.btn-secondary:not(:disabled):not(.disabled).active:focus,
.btn-secondary:not(:disabled):not(.disabled):active:focus,
.show>.btn-secondary.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(130, 138, 145, 0.5);
}

.btn-success {
  color: #fff;
  background-color: #28a745;
  border-color: #28a745;
}

.btn-success:hover {
  color: #fff;
  background-color: #218838;
  border-color: #1e7e34;
}

.btn-success.focus,
.btn-success:focus {
  color: #fff;
  background-color: #218838;
  border-color: #1e7e34;
  box-shadow: 0 0 0 0.2rem rgba(72, 180, 97, 0.5);
}

.btn-success.disabled,
.btn-success:disabled {
  color: #fff;
  background-color: #28a745;
  border-color: #28a745;
}

.btn-success:not(:disabled):not(.disabled).active,
.btn-success:not(:disabled):not(.disabled):active,
.show>.btn-success.dropdown-toggle {
  color: #fff;
  background-color: #1e7e34;
  border-color: #1c7430;
}

.btn-success:not(:disabled):not(.disabled).active:focus,
.btn-success:not(:disabled):not(.disabled):active:focus,
.show>.btn-success.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(72, 180, 97, 0.5);
}

.btn-info {
  color: #fff;
  background-color: #17a2b8;
  border-color: #17a2b8;
}

.btn-info:hover {
  color: #fff;
  background-color: #138496;
  border-color: #117a8b;
}

.btn-info.focus,
.btn-info:focus {
  color: #fff;
  background-color: #138496;
  border-color: #117a8b;
  box-shadow: 0 0 0 0.2rem rgba(58, 176, 195, 0.5);
}

.btn-info.disabled,
.btn-info:disabled {
  color: #fff;
  background-color: #17a2b8;
  border-color: #17a2b8;
}

.btn-info:not(:disabled):not(.disabled).active,
.btn-info:not(:disabled):not(.disabled):active,
.show>.btn-info.dropdown-toggle {
  color: #fff;
  background-color: #117a8b;
  border-color: #10707f;
}

.btn-info:not(:disabled):not(.disabled).active:focus,
.btn-info:not(:disabled):not(.disabled):active:focus,
.show>.btn-info.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(58, 176, 195, 0.5);
}

.btn-warning {
  color: #212529;
  background-color: #ffc107;
  border-color: #ffc107;
}

.btn-warning:hover {
  color: #212529;
  background-color: #e0a800;
  border-color: #d39e00;
}

.btn-warning.focus,
.btn-warning:focus {
  color: #212529;
  background-color: #e0a800;
  border-color: #d39e00;
  box-shadow: 0 0 0 0.2rem rgba(222, 170, 12, 0.5);
}

.btn-warning.disabled,
.btn-warning:disabled {
  color: #212529;
  background-color: #ffc107;
  border-color: #ffc107;
}

.btn-warning:not(:disabled):not(.disabled).active,
.btn-warning:not(:disabled):not(.disabled):active,
.show>.btn-warning.dropdown-toggle {
  color: #212529;
  background-color: #d39e00;
  border-color: #c69500;
}

.btn-warning:not(:disabled):not(.disabled).active:focus,
.btn-warning:not(:disabled):not(.disabled):active:focus,
.show>.btn-warning.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(222, 170, 12, 0.5);
}

.btn-danger {
  color: #fff;
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-danger:hover {
  color: #fff;
  background-color: #c82333;
  border-color: #bd2130;
}

.btn-danger.focus,
.btn-danger:focus {
  color: #fff;
  background-color: #c82333;
  border-color: #bd2130;
  box-shadow: 0 0 0 0.2rem rgba(225, 83, 97, 0.5);
}

.btn-danger.disabled,
.btn-danger:disabled {
  color: #fff;
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-danger:not(:disabled):not(.disabled).active,
.btn-danger:not(:disabled):not(.disabled):active,
.show>.btn-danger.dropdown-toggle {
  color: #fff;
  background-color: #bd2130;
  border-color: #b21f2d;
}

.btn-danger:not(:disabled):not(.disabled).active:focus,
.btn-danger:not(:disabled):not(.disabled):active:focus,
.show>.btn-danger.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(225, 83, 97, 0.5);
}

input[type="button"].btn-block,
input[type="reset"].btn-block,
input[type="submit"].btn-block {
  width: 100%;
}

.fade {
  transition: opacity 0.15s linear;
}

@media (prefers-reduced-motion: reduce) {
  .fade {
    transition: none;
  }
}

.fade:not(.show) {
  opacity: 0;
}

.btn-group,
.btn-group-vertical {
  position: relative;
  display: -ms-inline-flexbox;
  display: inline-flex;
  vertical-align: middle;
}

.btn-group-vertical>.btn,
.btn-group>.btn {
  position: relative;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
}

.btn-group-vertical>.btn:hover,
.btn-group>.btn:hover {
  z-index: 1;
}

.btn-group-vertical>.btn.active,
.btn-group-vertical>.btn:active,
.btn-group-vertical>.btn:focus,
.btn-group>.btn.active,
.btn-group>.btn:active,
.btn-group>.btn:focus {
  z-index: 1;
}

.btn-toolbar {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -ms-flex-pack: start;
  justify-content: flex-start;
}

.btn-toolbar .input-group {
  width: auto;
}

.btn-group>.btn-group:not(:first-child),
.btn-group>.btn:not(:first-child) {
  margin-left: -1px;
}

.btn-group>.btn-group:not(:last-child)>.btn,
.btn-group>.btn:not(:last-child):not(.dropdown-toggle) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.btn-group>.btn-group:not(:first-child)>.btn,
.btn-group>.btn:not(:first-child) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.dropdown-toggle-split {
  padding-right: 0.5625rem;
  padding-left: 0.5625rem;
}

.dropdown-toggle-split::after,
.dropright .dropdown-toggle-split::after,
.dropup .dropdown-toggle-split::after {
  margin-left: 0;
}

.dropleft .dropdown-toggle-split::before {
  margin-right: 0;
}

.btn-group-sm>.btn+.dropdown-toggle-split,
.btn-sm+.dropdown-toggle-split {
  padding-right: 0.375rem;
  padding-left: 0.375rem;
}

.btn-group-lg>.btn+.dropdown-toggle-split,
.btn-lg+.dropdown-toggle-split {
  padding-right: 0.75rem;
  padding-left: 0.75rem;
}

.btn-group-vertical {
  -ms-flex-direction: column;
  flex-direction: column;
  -ms-flex-align: start;
  align-items: flex-start;
  -ms-flex-pack: center;
  justify-content: center;
}

.btn-group-vertical>.btn,
.btn-group-vertical>.btn-group {
  width: 100%;
}

.btn-group-vertical>.btn-group:not(:first-child),
.btn-group-vertical>.btn:not(:first-child) {
  margin-top: -1px;
}

.btn-group-vertical>.btn-group:not(:last-child)>.btn,
.btn-group-vertical>.btn:not(:last-child):not(.dropdown-toggle) {
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.btn-group-vertical>.btn-group:not(:first-child)>.btn,
.btn-group-vertical>.btn:not(:first-child) {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.btn-group-toggle>.btn input[type="checkbox"],
.btn-group-toggle>.btn input[type="radio"],
.btn-group-toggle>.btn-group>.btn input[type="checkbox"],
.btn-group-toggle>.btn-group>.btn input[type="radio"] {
  position: absolute;
  clip: rect(0, 0, 0, 0);
  pointer-events: none;
}

.input-group {
  position: relative;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -ms-flex-align: stretch;
  align-items: stretch;
  width: 100%;
}

.input-group-append .btn:focus,
.input-group-prepend .btn:focus {
  z-index: 3;
}

.input-group-append .btn+.btn,
.input-group-prepend .btn+.btn,
.input-group-prepend .btn+.input-group-text {
  margin-left: -1px;
}

.input-group>.input-group-append:last-child>.btn:not(:last-child):not(.dropdown-toggle) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.input-group>.input-group-prepend:first-child>.btn:not(:first-child) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>
