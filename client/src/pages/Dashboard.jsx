import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";




export default function Dashboard() {

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      <SideBar />
      <Outlet />

    </div>
  );
}
