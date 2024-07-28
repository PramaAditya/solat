<template>
  <div class="home">
    <h1 class="text-2xl font-bold mb-4">Tata Cara Sholat</h1>
    <ShalatList />
  </div>
</template>

<script>
import ShalatList from '@/components/ShalatList.vue'

export default {
  name: 'Home',
  components: {
    ShalatList
  }
}
</script>