import LoginAndRegister from "@/views/LoginAndRegister/LoginAndRegister";
import Index from "@/views/Index";
import EditUserInfo from "@/views/Header/User/EditUserInfo";

const Routers = [
    {
        key: 'LoginAndRegister',
        path: '/login',
        requiresAuth: false,
        component: LoginAndRegister
    },
    {
        key: 'Register',
        path: '/register',
        requiresAuth: false,
        component: LoginAndRegister
    },
    {
        key: 'Index',
        path: '/index',
        requiresAuth: false,
        component: Index
    },
    {
        key: 'EditUserInfo',
        path: '/editUserInfo',
        requiresAuth: true,
        component: EditUserInfo
    },
]

export default Routers;