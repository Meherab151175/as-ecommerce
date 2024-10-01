import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useProductStore = create((set)=>({
    products:[],
    loading:false,
    setProducts:(products)=>set({products}),
    createProduct:async(productData)=>{
        set({loading:true})
        try {
            const res = await axios.post("/api/products",productData)
            set(prevState=>({
                products:[...prevState.products,res.data],
                loading:false
            }))
        } catch (error) {
            set({loading:false})
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
    },
    fetchAllProduct:async()=>{
        set({loading:true})
        try {
            const response = await axios.get("/products")
            set({products:response.data.products,loading:false})
        } catch (error) {
            set({loading:false})
            toast.error(error?.response?.data?.error || "Something went wrong")
        }
    },
    toogleFeaturedProduct:async(id)=>{},
    deleteProduct:async(id)=>{},
}))