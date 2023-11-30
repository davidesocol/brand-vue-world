import { defineStore } from "pinia";
import { computed, ref, watchEffect } from "vue";

export const useUsersStore = defineStore('users', () => {
    const rawUsers = ref<User[]>([])

    fetch('https://jsonplaceholder.typicode.com/users')
    .then(res => res.json())
    .then(data => {
        rawUsers.value = data
    })

    const users = computed(() => {
        return rawUsers.value.map(user => {
            user.postsAmount = posts.value.filter(post => post.userId == user.id).length
            return user
        })
    })

    const usersByRank = computed(() => {
        return [...users.value].sort( (a, b) => {
            if (a.postsAmount < b.postsAmount) {
                return 1
            } else if (a.postsAmount > b.postsAmount) {
                return -1
            }
            
            return 0
        })
    })

    function getUser(userId: number) {
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

    const bestRanks = ref<number[]>([])

    watchEffect(async () => {
        usersByRank.value.map((user, index) => {
            if (!user.bestRank || user.bestRank > index) {
                user.bestRank = index
            }
        })
    })

    return { users, usersByRank, bestRanks, getUser, posts, newPost }
})

export class User {
    id?: number;
    name?: string;
    email?: string;
    postsAmount = 0;
    bestRank?: number;
}

export class Post {
    id?: number;
    userId?: number;
    title?: string;
    body?: string;
}