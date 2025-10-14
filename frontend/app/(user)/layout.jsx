"use client"
import { ToastContainer } from 'react-toastify';
import Header from '../../components/user/Header/header'



export default function UserLayout({ children }) {
  return (
    <>
      {<Header />}
      <main>{children}</main>
      <ToastContainer/>
    </>
  );
}
