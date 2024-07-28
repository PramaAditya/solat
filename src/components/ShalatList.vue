<template>
  <div class="shalat-list grid gap-4">
    <router-link 
      v-for="shalat in shalats" 
      :key="shalat" 
      :to="`/shalat/${shalat}`"
      class="btn btn-primary w-full"
    >
      {{ capitalizeFirstLetter(shalat) }}
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'ShalatList',
  data() {
    return {
      shalats: ['subuh', 'zuhur', 'asar', 'magrib', 'isya']
    }
  },
  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }
}
</script>