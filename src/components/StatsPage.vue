<script setup lang="ts">
    import { useLoginStore } from '@/stores/login';
    import { useUsersStore } from '@/stores/users';
    import { computed, ref, watchEffect } from 'vue';
    import ConfettiExplosion from 'vue-confetti-explosion';

    const loginStore = useLoginStore()

    function logout() {
        loginStore.logout()
    }

    const usersStore = useUsersStore()
    
    const user = computed(() => usersStore.getUser(loginStore.loggedUserId))

    const userIndex = computed(() => usersStore.users.findIndex(x => x == user.value))

    const nextUser = computed(() => usersStore.users[userIndex.value > 0 ? userIndex.value - 1 : 0])

    const postsNeededToReach = computed(() => nextUser.value.postsAmount - user.value!.postsAmount)

    const usersToReach = usersStore.users
    .filter((opponent, index) => {
        if (userIndex.value == 0) {
            return false
        }

        if (opponent.id == user.value!.id) {
            return false
        }
        if (index > userIndex.value) {
            return false
        }
        if (opponent.postsAmount > postsNeededToReach.value + user.value!.postsAmount) {
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

    let lastRanking = user.value!.rank!

    const showPodiumMessage = ref(false)
    const showFirstMessage = ref(false)

    watchEffect(() => {
        if (showPodiumMessage.value || showFirstMessage.value) {
            return
        }
        showPodiumMessage.value = false
        showFirstMessage.value = false

        if (!lastRanking) {
            lastRanking = user.value!.rank!
            return
        }

        if (lastRanking > 3 && user.value!.rank! <= 3) {
            showPodiumMessage.value = true
        }

        if (lastRanking > 1 && user.value!.rank! == 1) {
            showFirstMessage.value = true
        }

        lastRanking = user.value!.rank!
    })
</script>
<template>
    <Transition name="splash">
        <div class="absolute overflow-hidden top-0 left-0 z-[100] w-[100vw] h-[100vh] hero" v-if="showPodiumMessage || showFirstMessage">
            <div class="hero-content text-center">
                <div class="max-w-xl">
                    <h1 class="text-3xl md:text-5xl font-bold" v-if="showFirstMessage">You reached first place!<br>Now stay in the lead!</h1>
                    <h1 class="text-3xl md:text-5xl font-bold" v-else>You reached {{user!.rank}}° place!<br>Keep posting!</h1>
                    <button class="btn rounded-full my-8" @click="showPodiumMessage = false; showFirstMessage = false">Keep Posting!</button>
                </div>
            </div>
            <ConfettiExplosion v-if="showFirstMessage"/>
        </div>
    </Transition>
    <div class="w-full h-full" v-if="!showPodiumMessage && !showFirstMessage">
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
                        <div class="stat-desc whitespace-normal" v-if="user!.rank == 1">You are 1°, keep posting to stay in the lead!</div>
                        <div class="stat-desc whitespace-normal" v-else-if="user!.bestRank && user!.bestRank < userIndex">You've been {{ user!.bestRank!}} ° before, get back to posting!</div>
                        <div class="stat-desc whitespace-normal" v-else-if="user!.bestRank && userIndex <= user!.bestRank">You've never been higher rank, keep posting!</div>
                    </div>
                    <div class="stat place-items-center">
                        <div class="stat-title">To Next Rank</div>
                        <div class="stat-value">{{ user!.rank! > 1 ? postsNeededToReach : '-' }}</div>
                        <div class="stat-desc whitespace-normal" v-if="user!.rank! > 1">Post{{ postsNeededToReach > 1 ? 's' : ''}} needed to reach {{ nextUser.name }} <span v-if="usersToReach > 1">and {{ usersToReach - 1 }} others</span></div>
                        <div class="stat-desc whitespace-normal" v-else>You are first! Keep posting before {{ usersStore.users[userIndex + 1].name }} catches up!</div>
                    </div>
                    <div class="stat place-items-center" v-if="userIndex + 1 >= usersStore.users.length">
                        <div class="stat-title">You are last!</div>
                        <div class="stat-desc whitespace-normal" v-if="userIndex > 0">Get back to posting!</div>
                    </div>
                    <div class="stat place-items-center" v-else>
                        <div class="stat-title">Watch out for</div>
                        <div class="stat-value whitespace-normal text-2xl">{{ userBelow.name }}</div>
                        <div class="stat-desc whitespace-normal" v-if="userIndex > 0">They need {{ userBelowDistance + 1}} post{{ userBelowDistance > 1 ? 's' : '' }} to surpass you!</div>
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
    .hero {
        background-size: 120px;
        background-image: url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M81.28 88H68.413l19.298 19.298L81.28 88zm2.107 0h13.226L90 107.838 83.387 88zm15.334 0h12.866l-19.298 19.298L98.72 88zm-32.927-2.207L73.586 78h32.827l.5.5 7.294 7.293L115.414 87l-24.707 24.707-.707.707L64.586 87l1.207-1.207zm2.62.207L74 80.414 79.586 86H68.414zm16 0L90 80.414 95.586 86H84.414zm16 0L106 80.414 111.586 86h-11.172zm-8-6h11.173L98 85.586 92.414 80zM82 85.586L87.586 80H76.414L82 85.586zM17.414 0L.707 16.707 0 17.414V0h17.414zM4.28 0L0 12.838V0h4.28zm10.306 0L2.288 12.298 6.388 0h8.198zM180 17.414L162.586 0H180v17.414zM165.414 0l12.298 12.298L173.612 0h-8.198zM180 12.838L175.72 0H180v12.838zM0 163h16.413l.5.5 7.294 7.293L25.414 172l-8 8H0v-17zm0 10h6.613l-2.334 7H0v-7zm14.586 7l7-7H8.72l-2.333 7h8.2zM0 165.414L5.586 171H0v-5.586zM10.414 171L16 165.414 21.586 171H10.414zm-8-6h11.172L8 170.586 2.414 165zM180 163h-16.413l-7.794 7.793-1.207 1.207 8 8H180v-17zm-14.586 17l-7-7h12.865l2.333 7h-8.2zM180 173h-6.613l2.334 7H180v-7zm-21.586-2l5.586-5.586 5.586 5.586h-11.172zM180 165.414L174.414 171H180v-5.586zm-8 5.172l5.586-5.586h-11.172l5.586 5.586zM152.933 25.653l1.414 1.414-33.94 33.942-1.416-1.416 33.943-33.94zm1.414 127.28l-1.414 1.414-33.942-33.94 1.416-1.416 33.94 33.943zm-127.28 1.414l-1.414-1.414 33.94-33.942 1.416 1.416-33.943 33.94zm-1.414-127.28l1.414-1.414 33.942 33.94-1.416 1.416-33.94-33.943zM0 85c2.21 0 4 1.79 4 4s-1.79 4-4 4v-8zm180 0c-2.21 0-4 1.79-4 4s1.79 4 4 4v-8zM94 0c0 2.21-1.79 4-4 4s-4-1.79-4-4h8zm0 180c0-2.21-1.79-4-4-4s-4 1.79-4 4h8z' fill='%0' fill-opacity='.15' fill-rule='evenodd'/%3E%3C/svg%3E");
        @apply bg-primary text-black
    }

    .hero .btn {
        @apply bg-black text-primary
    }
    .stat-desc {
        @apply mt-1
    }

    .splash-enter {
        opacity: 0;
    }

    .splash-move,
    .splash-enter-active,
    .splash-leave-active {
        transition: all 1s ease;
    }

    .splash-enter-from,
    .splash-leave-to {
        opacity: 0;
    }

    .splash-leave-active {
        position: absolute;
    }
</style>