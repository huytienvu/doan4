"use client"
import { ToastContainer } from 'react-toastify';
import Header from '../../components/user/Header/header'
import Footer from '../../components/user/Footer/footer'



export default function UserLayout({ children }) {
  return (
    <>
      {<Header />}
      <main>{children}</main>
      {<Footer />}
      <ToastContainer/>
    </>
  );
}
