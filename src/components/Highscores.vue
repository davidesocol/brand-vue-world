<script setup lang="ts">
    import { useLoginStore } from '@/stores/login';
    import { useUsersStore } from '@/stores/users';
    const usersStore = useUsersStore()
    const loginStore = useLoginStore()
</script>
<template>
    <div>
        <table class="table">
            <TransitionGroup name="ranking" tag="tbody">
                <tr v-for="rank in usersStore.ranks" :key="rank.id" class="rank" :class="rank.id! <= 3 ? 'rank-' + rank.id: ''">
                    <td class="text-lg text-right rank-num">
                        <div class="stat-value">
                            {{ rank.id }}°
                        </div>
                        <div class="stat-desc" v-if="rank.users.find(user => user.id == loginStore.loggedUserId)">
                            <div class="badge badge-primary">YOU</div>
                        </div>
                    </td>
                    <td>
                        <TransitionGroup name="user">
                            <div v-for="user in rank.users" :key="user.id" :class="user.id == loginStore.loggedUserId ? 'rank-you' : ''">
                                <div class="stat-title text-bg">{{ user.name }}</div>
                                <div class="stat-desc font-bold">{{ user.postsAmount }} posts</div>
                            </div>
                        </TransitionGroup>
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
        transition: all .8s ease;
    }

    .ranking-enter-from,
    .ranking-leave-to {
        opacity: 0;
        transform: translateX(-30px);
    }

    .ranking-leave-active {
        position: absolute;
    }

    .user-enter {
        opacity: 0;
    }

    .user-move,
    .user-enter-active,
    .user-leave-active {
        transition: all .2s ease;
    }

    .user-enter-from,
    .user-leave-to {
        opacity: 0;
        transform: translateY(16px);
    }

    .user-leave-active {
        position: absolute;
    }

    .rank-1 {
        color: gold;
        @apply text-xl;
    }

    .rank-2 {
        color: paleturquoise;
    }

    .rank-3 {
        color: indianred;
    }

    .rank-you * {
        @apply text-primary
    }
</style>