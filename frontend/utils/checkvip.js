import { Checkvip } from "@/services/vip";
import { Getiduser } from "./auth";
import Swal from "sweetalert2";

export const xemphim= async(id,router) => {
    const check =await Checkvip(Getiduser())
    const phimvip = true;
    if(!phimvip){
      router.push(`/movie?id=${id}`)
      return;
    }
    if(phimvip && check){
      router.push(`/movie?id=${id}`)
      return;
    }
    else{
      Swal.fire({
        title: "Phim danh cho tài khoản VIP",
      footer:  '<a href="/upgrade">Nâng cấp?</a>'});
      return;
    }
    
  }