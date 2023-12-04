<script setup lang="ts">
    import { useLoginStore } from '@/stores/login';
    import { useUsersStore } from '@/stores/users';
import { computed, ref } from 'vue';

    const loginStore = useLoginStore()

    function logout() {
        loginStore.logout()
    }

    const usersStore = useUsersStore()
    
    const user = computed(() => usersStore.getUser(loginStore.loggedUserId))
    const userIndex = computed(() => usersStore.users.findIndex(user => user.id == loginStore.loggedUserId))

    const nextUser = computed(() => usersStore.users[userIndex.value > 0 ? userIndex.value - 1 : 0])

    const postsNeededToSurpass = computed(() => nextUser.value.postsAmount - user.value!.postsAmount + 1)

    const usersSurpassed = usersStore.users
    .filter((opponent, index) => {
        if (opponent.id == user.value!.id) {
            return false
        }
        if (index > userIndex.value) {
            return false
        }
        if (opponent.postsAmount > postsNeededToSurpass.value + user.value!.postsAmount) {
            return false
        }

        return true
    }).length

    const userBelow = computed(() => usersStore.users[userIndex.value + 1])
    const userBelowDistance = computed(() => user.value!.postsAmount! - userBelow.value.postsAmount)

    const showForm = ref(false)

    const postForm = ref(null)
    const title = ref("")
    const body = ref("")

    function post() {
        usersStore.newPost({
            userId: loginStore.loggedUserId,
            title: title.value,
            body: body.value
        })

        clearForm()
        showForm.value = false
    }

    function cancelPost() {
        clearForm()
        showForm.value = false
    }

    function clearForm() {
        title.value = ""
        body.value = ""
    }
</script>
<template>
    <div class="w-full h-full">
        <div class="w-full h-[100vh]" v-if="!showForm">
            <div class="flex w-full justify-between items-center p-4 md:p-8">
                <h1 class="text-3xl md:text-5xl font-bold">
                    {{ user?.name }}
                </h1>
                <button type="submit" class="btn btn-primary btn-circle" @click="logout()">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                </button>
            </div>
            <div class="flex items-center justify-center w-full">
                <div class="stats stats-vertical shadow my-4 sm:my-16">
                    <div class="stat place-items-center">
                        <div class="stat-title">Ranking</div>
                        <div class="stat-value">{{ user!.rank!}}°</div>
                        <div class="stat-desc whitespace-normal" v-if="user!.bestRank && user!.bestRank < userIndex">You've been {{ user!.bestRank! + 1}} ° before, get back to posting!</div>
                        <div class="stat-desc whitespace-normal" v-if="user!.bestRank && userIndex <= user!.bestRank">You've never been higher rank, keep posting!</div>
                        <div class="stat-desc whitespace-normal" v-if="userIndex == 0">You are 1°, keep posting before the others catch up!</div>
                    </div>
                    <div class="stat place-items-center">
                        <div class="stat-title">To Next Rank</div>
                        <div class="stat-value">{{ userIndex > 0 ? postsNeededToSurpass : '-' }}</div>
                        <div class="stat-desc whitespace-normal" v-if="userIndex > 0">Post{{ postsNeededToSurpass > 1 ? 's' : ''}} needed to surpass {{ nextUser.name }} <span v-if="usersSurpassed > 1">and {{ usersSurpassed - 1 }} others</span></div>
                        <div class="stat-desc whitespace-normal" v-else>You are first! Keep posting before {{ usersStore.users[1].name }} catches up!</div>
                    </div>
                    <div class="stat place-items-center">
                        <div class="stat-title">Watch out for</div>
                        <div class="stat-value whitespace-normal text-2xl">{{ userBelow.name }}</div>
                        <div class="stat-desc whitespace-normal" v-if="userIndex > 0">They need {{ userBelowDistance }} post{{ userBelowDistance > 1 ? 's' : '' }} to get you!</div>
                    </div>
                    <div class="stat place-items-center">
                        <div class="stat-title">Total Posts</div>
                        <div class="stat-value">{{ user?.postsAmount }}</div>
                        <div class="stat-desc">Keep posting!</div>
                    </div>
                    <button class="btn btn-primary rounded-full m-4 w-auto" @click="showForm = true">Add New Post</button>
                </div>
            </div>
        </div>
        <div class="w-full h-[100vh]" v-else>
            <div class="flex items-center justify-center w-full">
                <div class="flex justify-center content-center mx-4">
                    <form ref="postForm" @submit.prevent="post()" class="w-full max-w-md space-y-4 my-32">
                        <h1 class="text-3xl font-bold text-center">New Post</h1>
                        <input v-model="title" name="title" type="text" class="input input-bordered w-full rounded-bg" placeholder="Title" required minlength="1"/>
                        <textarea v-model="body" name="body" type="text" class="textarea textarea-bordered w-full" placeholder="What's on your mind?" required minlength="1"></textarea>
                        <button type="submit" class="btn btn-primary rounded-full w-full">Post</button>
                        <button type="button" class="btn btn-neutral rounded-full w-full" @click="cancelPost()">Cancel</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .stat-desc {
        @apply mt-1
    }
</style>