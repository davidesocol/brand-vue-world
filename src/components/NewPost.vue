<script setup lang="ts">
    import { useLoginStore } from '@/stores/login';
    import { useUsersStore } from '@/stores/users';
    import { ref } from 'vue';

    const loginStore = useLoginStore()
    const usersStore = useUsersStore()
    
    const postForm = ref(null)
    const title = ref("")
    const body = ref("")

    function post() {
        usersStore.newPost({
            userId: loginStore.loggedUserId,
            title: title.value,
            body: body.value
        })

        title.value = ""
        body.value = ""
    }
</script>
<template>
    <div class="flex justify-center content-center">
        <form ref="postForm" @submit.prevent="post()" class="w-80 space-y-4 my-32">
            <input v-model="title" name="title" type="text" class="input input-bordered w-full rounded-full" placeholder="Title" required minlength="1"/>
            <textarea v-model="body" name="body" type="text" class="input input-bordered w-full" placeholder="Message" required minlength="1"></textarea>
            <button type="submit" class="btn btn-primary rounded-full w-full">New Post</button>
        </form>
    </div>
</template>
