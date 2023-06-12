<template>
  <header v-if="!$route.meta.hideNavbar">
    <Navbar />
  </header>
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
</script>
