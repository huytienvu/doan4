import { jwtDecode } from "jwt-decode";
export function Gettoken() {
    let token = localStorage.getItem("token");
    return token;
}
export function Getiduser() {
    const token = Gettoken();
    if (!token) {
      return null;
      
    } 

    try {
        const decoded = jwtDecode(token);
        
        return decoded.id || null; // tùy thuộc vào token của bạn
    } catch (error) {
        return null;
    }
}
export function getRole() {
  const token = Gettoken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.role || null;
  } catch (error) {
    return null;
  }
}
export function getuserName() {
  const token = Gettoken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.username || null;
  } catch (error) {
    return null;
  }
}
export function getVip() {
  const token = Gettoken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const vip = decoded.vip
    if(vip=="VIP"){
      return true;
    }
    else{
      return false
    }
  } catch (error) {
    return null;
  }
}