import { BsGraphDown } from "react-icons/bs";
import { FaRegBookmark, FaRegListAlt, FaRegUser } from "react-icons/fa";
import { Route, Routes, Link } from "react-router-dom";
export default function AdminPage() {
    return (
        <div className="w-screen h-screen flex">
            <div className="w-[480px] h-full bg-green-300 items-center  flex flex-col gap-5 pt-20 md:gap-10">
                <Link to="/adminPage" className="w-full h-[40px] text-[25px] font-bold flex justify-center items-center"><BsGraphDown/>Dashboard</Link>
                <Link to="/adminPage/booking" className="w-full h-[40px] text-[25px] font-bold flex justify-center items-center"><FaRegBookmark />Booking</Link>
                <Link to="/adminPage/items" className="w-full h-[40px] text-[25px] font-bold flex justify-center items-center"><FaRegListAlt />Items</Link>
                <Link to="/adminPage/users" className="w-full h-[40px] text-[25px] font-bold flex justify-center items-center"><FaRegUser /> Users</Link>
            </div>
            <div className="w-[calc(100vw-480px)] bg-blue-300">
                <Routes path="/*">
                    <Route path="/" element={<h1>Dashboard</h1>} />
                    <Route path="/booking" element={<h1>Booking</h1>} />
                    <Route path="/items" element={<h1>Items</h1>} />
                    <Route path="/users" element={<h1>Users</h1>} />
                </Routes>
            </div>
        </div>
    )
}