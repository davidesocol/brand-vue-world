<script setup lang="ts">
import HighScores from './components/HighScores.vue'
import LoginPage from './components/LoginPage.vue'
import StatsPage from './components/StatsPage.vue'
import NewPost from './components/NewPost.vue'
import DebugBar from './components/DebugBar.vue'

import { useLoginStore } from './stores/login'

const loginStore = useLoginStore()
</script>

<template>
  <div class="grid md:grid-cols-10">
    <div class="col-span-5 md:col-span-3 lg:col-span-2 max-md:max-h-[30vh] overflow-y-auto  max-md:shadow-[inset_0_-35px_60px_-15px_rgba(0,0,0,0.3)] ">
      <HighScores />
    </div>
    <div class="col-span-5 md:col-span-7 lg:col-span-8 max-md:max-h-[70vh] overflow-y-auto overflow-x-hidden">
      <Transition>
        <template v-if="!loginStore.isLoggedIn">
          <LoginPage class="overflow-hidden"/>
        </template>
      </Transition>
      <Transition>
        <div v-if="loginStore.isLoggedIn">
          <StatsPage />
          <NewPost />
        </div>
      </Transition>
      <DebugBar class="absolute bottom-0 max-md:hidden" />
    </div>
  </div>
</template>
