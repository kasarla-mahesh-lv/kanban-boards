import axios from "axios";

export const getDashboardStats = async ()=>{
    const res=await axios.get("/api/dashboard/stats");
    return res.data;
}