<script setup lang="ts">
    import { useUsersStore } from '@/stores/users';
    const usersStore = useUsersStore()
</script>
<template>
    <ul>
        <li v-for="user in usersStore.usersByRank">{{ user.name }} | {{ user.postsAmount }}</li>
    </ul>
</template>