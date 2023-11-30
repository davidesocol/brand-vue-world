import { defineStore } from "pinia";
import { computed, ref, type Ref } from "vue";
import { useUsersStore, User } from "./users";

export const useLoginStore = defineStore('login', () => {
    const loggedUserId = ref(-1)

    const usersStore = useUsersStore()

    const isLoggedIn = computed(() => loggedUserId.value >= 0)


    function login(email:string, password:string) {
        const foundUser = usersStore.users.find(user => user.email?.toLowerCase() == email.toLowerCase())
        loggedUserId.value = foundUser?.id ? foundUser.id : -1
    }

    function logout() {
        loggedUserId.value = -1
    }

    return { loggedUserId, isLoggedIn, login, logout }
})
