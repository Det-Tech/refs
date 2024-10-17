import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function Notification() {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={2000}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      draggable
      theme="light"
    />
  )
}
