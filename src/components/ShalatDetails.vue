<template>
  <div class="shalat-details pb-24 relative" @touchstart="handleTouchStart" @touchend="handleTouchEnd">
    <div class="progress-indicator absolute top-0 left-0 h-[5px] bg-primary" :style="{ width: `${progress}%` }"></div>
    <div v-if="shalatData.length" class="slide-container">
      <transition name="fade" mode="out-in">
        <div :key="currentSlide" class="slide p-4">
            <div class="flex items-center gap-2 mb-5 justify-between md:justify-normal">
                <h3 class="text-xl font-semibold">{{ shalatData[currentSlide].rukun }}</h3>
                <p class="badge badge-sm"><strong v-if="!isNaN(shalatData[currentSlide].rakaat)">Rakaat:</strong> {{ shalatData[currentSlide].rakaat }}</p>
            </div>
            <img v-if="shalatData[currentSlide].ilustrasi" :src="shalatData[currentSlide].ilustrasi" alt="Ilustrasi" class="max-w-full h-auto mb-4 mx-auto">
            <p v-if="shalatData[currentSlide].note" class="mb-2 italic text-center">{{ shalatData[currentSlide].note }}</p>
            <p v-if="shalatData[currentSlide].bacaan_ar" class="mb-2 text-center font-arabic text-xl" v-html="shalatData[currentSlide].bacaan_ar"></p>
            <p v-if="shalatData[currentSlide].bacaan_tr" class="mb-2 text-center"><em v-html="shalatData[currentSlide].bacaan_tr"></em></p>
            <p v-if="shalatData[currentSlide].bacaan_id" class="mb-4 text-center text-xs" v-html="shalatData[currentSlide].bacaan_id"></p>
            <p v-if="shalatData[currentSlide].sumber" class="text-sm text-gray-600 text-center">
              Sumber:<br>
              <a 
                v-if="isValidUrl(shalatData[currentSlide].sumber)" 
                :href="shalatData[currentSlide].sumber" 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-primary hover:underline"
              >
                {{ shalatData[currentSlide].sumber }}
              </a>
              <span v-else>{{ shalatData[currentSlide].sumber }}</span>
            </p>
        </div>
      </transition>
    </div>
    <p v-else class="text-center py-4">Loading...</p>

    <footer class="fixed bottom-0 left-0 right-0 bg-base-200 shadow-lg">
      <div class="flex justify-between items-center px-4 py-2">
        <button @click="prevSlide" class="btn btn-primary btn-sm" :disabled="currentSlide === 0">&lt; Prev</button>
        
        <div class="dropdown dropdown-top">
          <label tabindex="0" class="btn btn-sm m-1">Jump to Step</label>
          <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-64 max-h-[60vh] overflow-y-auto flex-nowrap">
            <li v-for="(group, groupIndex) in groupedSteps" :key="groupIndex" class="menu-title">
              <span class="whitespace-nowrap text-base-content mb-2">{{ isNaN(group.rakaat) ? group.rakaat : `Rakaat ${group.rakaat}` }}</span>
              <ul>
                <li v-for="(step, stepIndex) in group.steps" :key="stepIndex">
                  <a 
                    @click="goToSlide(step.index)" 
                    class="py-1 flex items-center"
                    :class="{ 'bg-primary text-primary-content': currentSlide === step.index }"
                  >
                    <span class="flex-grow">{{ stepIndex + 1 }}. {{ step.rukun }}</span>
                    <span v-if="currentSlide === step.index" class="badge badge-sm badge-outline ml-2">Current</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <button @click="nextSlide" class="btn btn-primary btn-sm" :disabled="currentSlide === shalatData.length - 1">Next &gt;</button>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Papa from 'papaparse'

export default {
  name: 'ShalatDetails',
  props: ['name'],
  setup(props) {
    const shalatData = ref([])
    const currentSlide = ref(0)
    const touchStartX = ref(0)
    const touchEndX = ref(0)

    const loadCSV = async () => {
      try {
        const response = await fetch(`/data/${props.name}.csv`)
        const csvText = await response.text()
        const result = Papa.parse(csvText, { header: true })
        shalatData.value = result.data
      } catch (error) {
        console.error('Error loading CSV:', error)
      }
    }

    const groupedSteps = computed(() => {
      const grouped = []
      let currentGroup = null

      shalatData.value.forEach((step, index) => {
        if (!currentGroup || currentGroup.rakaat !== step.rakaat) {
          if (currentGroup) {
            grouped.push(currentGroup)
          }
          currentGroup = { rakaat: step.rakaat, steps: [] }
        }
        currentGroup.steps.push({ ...step, index })
      })

      if (currentGroup) {
        grouped.push(currentGroup)
      }

      console.log('Grouped Steps:', grouped) // Add this line for debugging
      return grouped
    })

    const nextSlide = () => {
      if (currentSlide.value < shalatData.value.length - 1) {
        currentSlide.value++
      }
    }

    const prevSlide = () => {
      if (currentSlide.value > 0) {
        currentSlide.value--
      }
    }

    const goToSlide = (index) => {
      currentSlide.value = index
    }

    const handleKeydown = (event) => {
      if (event.key === 'ArrowLeft') {
        prevSlide()
      } else if (event.key === 'ArrowRight') {
        nextSlide()
      }
    }

    const handleTouchStart = (event) => {
      touchStartX.value = event.touches[0].clientX
    }

    const handleTouchEnd = (event) => {
      touchEndX.value = event.changedTouches[0].clientX
      handleSwipe()
    }

    const handleSwipe = () => {
      const swipeThreshold = 50 // minimum distance (in pixels) to trigger a swipe
      const swipeDistance = touchEndX.value - touchStartX.value

      if (swipeDistance > swipeThreshold) {
        prevSlide() // Swipe right
      } else if (swipeDistance < -swipeThreshold) {
        nextSlide() // Swipe left
      }
    }

    const progress = computed(() => {
      if (shalatData.value.length === 0) return 0
      return (currentSlide.value + 1) / shalatData.value.length * 100
    })

    const isValidUrl = (string) => {
      try {
        new URL(string);
        return true;
      } catch (_) {
        return false;
      }
    }

    onMounted(() => {
      loadCSV()
      window.addEventListener('keydown', handleKeydown)
    })

    onUnmounted(() => {
      window.removeEventListener('keydown', handleKeydown)
    })

    return {
      shalatData,
      currentSlide,
      groupedSteps,
      nextSlide,
      prevSlide,
      goToSlide,
      handleTouchStart,
      handleTouchEnd,
      progress,
      isValidUrl
    }
  }
}
</script>

<style scoped>
.font-arabic {
  font-family: 'Scheherazade New', serif;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar for Webkit browsers */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.dropdown-content {
  bottom: 100%;
  top: auto;
  max-height: 60vh;
  overflow-y: auto;
}

.menu-title {
  font-weight: bold;
  margin-top: 0.5rem;
}

.menu-title:first-child {
  margin-top: 0;
}

.menu-title > span {
  display: block;
  padding: 0.5rem;
  background-color: #f0f0f0;
  border-radius: 0.25rem;
}

.menu-title ul {
  margin-left: 0.5rem;
}

.menu-title ul li a {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  white-space: normal;
  line-height: 1.2;
}

.shalat-details {
  padding-top: 5px;
}

.progress-indicator {
  transition: width 0.3s ease-in-out;
}
</style>