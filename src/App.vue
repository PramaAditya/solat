<template>
  <div class="min-h-screen bg-base-100 text-base-content">
    <div class="navbar bg-base-200">
      <div class="flex-1">
        <router-link to="/" class="btn btn-ghost normal-case text-xl">Tata Cara Sholat</router-link>
      </div>
    </div>
    <main class="container mx-auto">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>