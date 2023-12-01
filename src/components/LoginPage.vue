<script setup lang="ts">
    import { useLoginStore } from '@/stores/login'
    import { useUsersStore, User } from '@/stores/users'
    import { ref } from 'vue'

    const loginStore = useLoginStore()

    const email = ref("")

    const password = ref("")

    const showAlert = ref(false)

    const usersStore = useUsersStore()

    function login() {
        loginStore.login(email.value, password.value)
        if (loginStore.isLoggedIn) {
            showAlert.value = true
        }
    }

    function randomLogin() {
        const pickedUser = pickRandomUser()
        loginStore.login(pickedUser.email! , "pwd")
    }

    function pickRandomUser(): User {
        return usersStore.users[Math.floor(Math.random() * usersStore.users.length)]
    }
</script>
<template>
    <div class="flex justify-center content-center">
        <form @submit.prevent="login()" class="w-80 space-y-4 my-8 lg:my-16">
            <h1 class="text-5xl font-bold w-full text-center mb-8 max-md:hidden">Login</h1>
            <div v-if="showAlert" role="alert" class="alert alert-error">
                <span><b>{{ email }}</b> is not a registered user.</span>
                <button type="reset" @click="showAlert = false" class="btn btn-sm btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                        <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
            <input v-model="email" name="email" type="email" class="input input-bordered w-full rounded-full" placeholder="Email" required autocomplete="email"/>
            <input v-model="password" name="password" type="password" class="input input-bordered w-full rounded-full" placeholder="Password" required/>
            <button type="submit" class="btn btn-primary rounded-full w-full">Login</button>
            <button type="button" class="btn btn-neutral rounded-full w-full" @click="randomLogin()">Random Login</button>
        </form>
    </div>
</template>
