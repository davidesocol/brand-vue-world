import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useUsersStore = defineStore('users', () => {
    const rawUsers = ref<User[]>([])

    fetch('https://jsonplaceholder.typicode.com/users')
    .then(res => res.json())
    .then(data => {
        rawUsers.value = data
        console.log(rawUsers.value)
    })

    const users = computed(() => {
        return rawUsers.value.map(user => {
            user.postsAmount = posts.value.filter(post => post.userId == user.id).length
            return user
        })
    })

    const usersByRank = computed(() => {
        return users.value.sort( (a, b) => a.postsAmount <= b.postsAmount ? 1 : -1)
    })

    function getUser(userId: number) {
        console.log(rawUsers.value)
        const foundUser = rawUsers.value.find(user=> user.id == userId)
        return foundUser
    }

    const posts = ref<Post[]>([])

    fetch('https://jsonplaceholder.typicode.com/posts')
    .then(res => res.json())
    .then(data => (posts.value = data))

    function newPost(post: Post) {
        posts.value.push(post)
    }

    return { users, usersByRank, getUser, posts, newPost }
})

export class User {
    id?: number;
    name?: string;
    email?: string;
    postsAmount = 0;
}

export class Post {
    id?: number;
    userId?: number;
    title?: string;
    body?: string;
}