import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const isAuthenticated = ref(false);
let logoutTimer;

export function useAuth() {
    const router = useRouter();

    const login = (username, password) => {
        if (username === 'admintrackmail' && password === 'admin123') {
            isAuthenticated.value = true;
            localStorage.setItem('loginTimestamp', Date.now());
            router.push('/admin');
            return true;
        }
        return false;
    };

    const logout = () => {
        isAuthenticated.value = false;
        localStorage.removeItem('loginTimestamp');
        router.push('/');
    };

    const checkSession = () => {
        const loginTime = localStorage.getItem('loginTimestamp');
        if (loginTime) {
            const fiveMinutes = 5 * 60 * 1000;
            if (Date.now() - loginTime < fiveMinutes) {
                isAuthenticated.value = true;
            } else {
                logout();
            }
        } else {
            isAuthenticated.value = false;
        }
    };

    watch(isAuthenticated, (isLoggedIn) => {
        clearTimeout(logoutTimer);
        if (isLoggedIn) {
            const fiveMinutes = 5 * 60 * 1000;
            logoutTimer = setTimeout(() => {
                console.log("Sessão expirada. Deslogando...");
                logout();
            }, fiveMinutes);
        }
    });

    return {
        isAuthenticated,
        login,
        logout,
        checkSession
    };
}
