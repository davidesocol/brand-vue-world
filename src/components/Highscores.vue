<script setup lang="ts">
    import { useLoginStore } from '@/stores/login';
    import { useUsersStore } from '@/stores/users';
    import { watchEffect } from 'vue';
    const usersStore = useUsersStore()
    const loginStore = useLoginStore()

    watchEffect(async () => {
        // TODO: Fix. Animation of the ranking occurs only if usersByRank is already accessed before
        usersStore.usersByRank
    })
</script>
<template>
    <div class="overflow-x-hidden">
        <table class="table">
            <TransitionGroup name="ranking" tag="tbody">
                <tr v-for="(user, index) in usersStore.usersByRank" :key="user.id" :class="[index <= 2 ? 'rank-' + (index + 1): '', user.id == loginStore.loggedUserId ? 'rank-you' : '']">
                    <td class="text-lg text-right">
                        {{ index + 1 }}°
                    </td>
                    <td class="stat">
                        <div class="stat-title">{{ user.name }}</div>
                        <div class="stat-desc">{{ user.postsAmount }} posts</div>
                    </td>
                </tr>
            </TransitionGroup>
        </table>
    </div>
</template>

<style scoped>
    .ranking-enter {
        opacity: 0;
    }

    .ranking-move,
    .ranking-enter-active,
    .ranking-leave-active {
        transition: all 0.5s ease;
    }

    .ranking-enter-from,
    .ranking-leave-to {
        opacity: 0;
        transform: translateX(30px);
    }

    .ranking-leave-active {
        position: absolute;
    }

    .rank-1 {
        color: gold;
        font-weight: 800;
    }

    .rank-2 {
        color: paleturquoise;
        font-weight: 700;
    }

    .rank-3 {
        color: indianred;
        font-weight: 600;
    }

    .rank-you *{
        @apply bg-primary text-black
    }
</style>