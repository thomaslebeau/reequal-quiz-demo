<template>
  <v-form>
    <v-text-field v-model="title" label="Quiz title" />
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const title = ref('')
</script>
