import { defineStore } from "pinia";
import { computed, ref, watchEffect } from "vue";
import { useLoginStore } from "./login";

export const useUsersStore = defineStore('users', () => {
    const rawUsers = ref<User[]>([])

    fetch('https://jsonplaceholder.typicode.com/users')
    .then(res => res.json())
    .then(data => {
        rawUsers.value = data
    })

    let latestUpdate = new Date(0)
    const updateLimit = 5000

    const users = computed(() => {
        let rankedUsers = [...rawUsers.value]
    
        rankedUsers = rankedUsers.map((user, index) => {
            user.postsAmount = posts.value.filter(post => post.userId == user.id).length
            return user
        })

        const loginStore = useLoginStore()

        rankedUsers.sort( (a, b) => {
            if (a.postsAmount < b.postsAmount) {
                return 1
            } else if (a.postsAmount > b.postsAmount) {
                return -1
            }

            if (a.id == loginStore.loggedUserId) {
                return -1
            } else if (a.id! < b.id!) {
                return 1
            } else {
                return -1
            }
        })

        rankedUsers = rankedUsers.map((user, index) => {
            const rankedUser = user;
            
            if (index == 0) {
                rankedUser.rank = 1
                return rankedUser
            }

            const prevUser = rankedUsers[index - 1]

            if (user.postsAmount == prevUser.postsAmount) {
                rankedUser.rank = prevUser.rank
            } else {
                rankedUser.rank = index + 1
            }

            return rankedUser
        })

        return rankedUsers
    })

    const ranks = computed(() => {
        let groupedUsers: {id: number, users: User[]}[] = []

        users.value.forEach(user => {
            const rankId = groupedUsers.findIndex(rank => rank.id == user.rank)
            if (rankId < 0) {
                groupedUsers.push({
                    id: user.rank!,
                    users: [user]
                })
            } else {
                groupedUsers[rankId].users.push(user)
            }
        })

        return groupedUsers
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

    watchEffect(async () => {
        users.value.map(user => {
            if (!user.bestRank || user.bestRank > user.rank!) {
                user.bestRank = user.rank
            }
        })
    })

    return { users, ranks, getUser, posts, newPost }
})

export class User {
    id?: number;
    name?: string;
    email?: string;
    postsAmount = 0;
    rank?: number;
    bestRank?: number;
    betterUsers?: number;
}

export class Post {
    id?: number;
    userId?: number;
    title?: string;
    body?: string;
}