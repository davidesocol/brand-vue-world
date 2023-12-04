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
                    </td>
                    <td>
                        <TransitionGroup name="user">
                            <div v-for="user in rank.users" :key="user.id" :class="user.id == loginStore.loggedUserId ? 'rank-you' : ''">
                                <div class="stat-title text-bg whitespace-normal">{{ user.name }}</div>
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
        transition: all .5s ease;
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
        background-color: #cfb53b;
        background-size: 32px;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='12' viewBox='0 0 20 12'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='charlie-brown' fill='%236d6d6d' fill-opacity='0.1'%3E%3Cpath d='M9.8 12L0 2.2V.8l10 10 10-10v1.4L10.2 12h-.4zm-4 0L0 6.2V4.8L7.2 12H5.8zm8.4 0L20 6.2V4.8L12.8 12h1.4zM9.8 0l.2.2.2-.2h-.4zm-4 0L10 4.2 14.2 0h-1.4L10 2.8 7.2 0H5.8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        border: none;
        @apply text-xl;
    }
    
    .rank-1 * {
        @apply text-black
    }
    
    .rank-2 {
        background-color: #bccbce;
        background-size: 32px;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='12' viewBox='0 0 20 12'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='charlie-brown' fill='%236d6d6d' fill-opacity='0.1'%3E%3Cpath d='M9.8 12L0 2.2V.8l10 10 10-10v1.4L10.2 12h-.4zm-4 0L0 6.2V4.8L7.2 12H5.8zm8.4 0L20 6.2V4.8L12.8 12h1.4zM9.8 0l.2.2.2-.2h-.4zm-4 0L10 4.2 14.2 0h-1.4L10 2.8 7.2 0H5.8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        box-shadow: inset 0px 16px 32px -6px rgba(0,0,0,0.2);
        border: none;
    }

    .rank-2 * {
        @apply text-black
    }

    .rank-3 {
        background-color: #d88a7f;
        background-size: 32px;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='12' viewBox='0 0 20 12'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='charlie-brown' fill='%23e4e5c6' fill-opacity='0.14'%3E%3Cpath d='M9.8 12L0 2.2V.8l10 10 10-10v1.4L10.2 12h-.4zm-4 0L0 6.2V4.8L7.2 12H5.8zm8.4 0L20 6.2V4.8L12.8 12h1.4zM9.8 0l.2.2.2-.2h-.4zm-4 0L10 4.2 14.2 0h-1.4L10 2.8 7.2 0H5.8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        box-shadow: inset 0px 16px 32px -6px rgba(0,0,0,0.2);
        border: none;
    }

    .rank-3 * {
        @apply text-black
    }

    .rank-you .stat-title {
        @apply bg-primary text-black font-bold rounded-full pl-[18px] ml-[-18px] py-1;
    }

    .rank-1 .rank-you .stat-title {
        @apply bg-black text-base-content
    }

    .rank-2 .rank-you .stat-title {
        @apply bg-black text-base-content
    }

    .rank-3 .rank-you .stat-title {
        @apply bg-black text-base-content
    }
</style>