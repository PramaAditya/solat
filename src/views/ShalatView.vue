<template>
  <div class="shalat-view">
    <ShalatDetails :name="name" />
  </div>
</template>

<script>
import ShalatDetails from '@/components/ShalatDetails.vue'

export default {
  name: 'ShalatView',
  components: {
    ShalatDetails
  },
  props: ['name'],
  computed: {
    capitalizedName() {
      return this.name.charAt(0).toUpperCase() + this.name.slice(1)
    }
  }
}
</script>