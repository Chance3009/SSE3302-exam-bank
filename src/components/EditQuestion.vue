<template>
    <div v-if="show" class="modal">
        <div class="modal-content">
            <span class="close" @click="closeModal">&times;</span>
            <h2>Edit Question</h2>
            <form @submit.prevent="submitEdit">
                <input type="text" placeholder="Question No." v-model="editQuesNo" required />
                <input type="text" placeholder="Question Description" v-model="editDescription" required />
                <button type="submit">Save Changes</button>
            </form>
        </div>
    </div>
</template>
  
<script>
export default {
    props: {
        show: Boolean,
        question: Object
    },
    data() {
        return {
            editQuesNo: this.question?.quesNo || '',
            editDescription: this.question?.description || ''
        };
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
        submitEdit() {
            this.$emit('edit', { ...this.question, quesNo: this.editQuesNo, description: this.editDescription });
            this.closeModal();
        }
    }
};
</script>