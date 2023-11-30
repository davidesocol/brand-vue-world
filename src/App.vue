<script setup lang="ts">
  import Highscores from './components/Highscores.vue'
  import Login from './components/Login.vue'
  import Stats from './components/Stats.vue'
  import NewPost from './components/NewPost.vue'
  import Debug from './components/Debug.vue'
  
  import { useLoginStore } from './stores/login';

  const loginStore = useLoginStore()
</script>

<template>
  <div class="grid grid-flow-row auto-rows-max">
    <Highscores />
    <Transition>
      <template v-if="!loginStore.isLoggedIn">
        <Login />
      </template>
    </Transition>
    <Transition>
      <div v-if="loginStore.isLoggedIn">
        <Stats />
        <NewPost />
      </div>
    </Transition>
    <Debug class="absolute bottom-0 w-full"/>
  </div>
</template>
