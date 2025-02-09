import axios from "../lib/axios"
import {create} from "zustand"
import {toast} from "react-hot-toast"


export const useUserStore = create((set,get)=>({
    user:null,
    loading:false,
    checkingAuth:false,
    signup:async({name,email,password,confirmPassword})=>{
        set({loading:true})

        if(password !== confirmPassword){
            set({loading:false})
            return toast.error("Passwords do not match")
        }

        try {
            const res = await axios.post("/auth/signup",{name,email,password})
            set({user:res.data,loading:false})
        } catch (error) {
            set({loading:false})
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
    },
    login:async(email,password)=>{
        set({loading:true})
        try {
            const res = await axios.post("/auth/login",{email,password})
            console.log(res.data);
            set({user:res.data.user,loading:false})
        } catch (error) {
            set({loading:false})
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
    },
    checkAuth:async()=>{
        set({checkingAuth:true})
        try {
            const res = await axios.get('/auth/profile')
            set({user:res.data,checkingAuth:false})
        } catch (error) {
            set({checkingAuth:false,user:null})
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
    },
    logout:async()=>{
        try {
            await axios.post('/auth/logout')
            set({user:null})
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
    }
}))
