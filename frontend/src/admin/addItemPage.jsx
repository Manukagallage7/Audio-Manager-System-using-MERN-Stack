import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddItemPage() {

    const [ItemKey, setItemKey] = useState("");
    const [ItemName, setItemName] = useState("");
    const [ItemPrice, setItemPrice] = useState(0);
    const [ItemCategory, setItemCategory] = useState("audio");
    const [ItemDimensions, setItemDimensions] = useState("");
    const [ItemDescription, setItemDescription] = useState("");
    const [ItemImages, setItemImages] = useState([]);
    const navigate = useNavigate();
    

    async function handleAddItem() {
        const token = localStorage.getItem("token")

        if(token) {
            try{

                const backendURL = import.meta.env.VITE_BACKEND_URL
                
                const result = await axios.post(`${backendURL}/api/product`, {
                    key: ItemKey,
                    name: ItemName,
                    price: ItemPrice,
                    category: ItemCategory,
                    dimensions: ItemDimensions,
                    description: ItemDescription,
                    image: ItemImages
                }, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                console.log(result.data);
                toast.success("Item added successfully!");
                navigate("/adminPage/items");
            } catch (error) {
                console.error("Error adding item:", error);
                toast.error("An unexpected error occurred.");
            }
        } else {
            toast.error("You must be logged in first.");
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#E7F0FA] p-6">
            <div className="w-full max-w-2xl mx-auto bg-gradient-to-b from-[#7BA4D0] to-[#E7F0FA] backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-[rgba(13,36,64,0.08)]">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#0D2440]">Add Item</h1>
                        <p className="text-sm text-[#0D2440]">Create a new item for the catalog.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input onChange={(e) => setItemKey(e.target.value)} type="text" placeholder="Item Key" className="w-full px-4 py-3 bg-white border border-[#E7F0FA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#7BA4D0] transition" />
                    <input onChange={(e) => setItemName(e.target.value)} type="text" placeholder="Item Name" className="w-full px-4 py-3 bg-white border border-[#E7F0FA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#7BA4D0] transition" />
                    <input onChange={(e) => setItemPrice(Number(e.target.value))} type="number" placeholder="Item Price" className="w-full px-4 py-3 bg-white border border-[#E7F0FA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#7BA4D0] transition" />
                    <select onChange={(e) => setItemCategory(e.target.value)} className="w-full px-4 py-3 bg-white border border-[#E7F0FA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#7BA4D0] transition">
                        <option value="audio">Audio</option>
                        <option value="lighting">Lighting</option>
                        <option value="electronics">Electronics</option>
                        <option value="uncategorized">Uncategorized</option>
                    </select>
                    <input onChange={(e) => setItemDimensions(e.target.value)} type="text" placeholder="Item Dimensions" className="w-full md:col-span-2 px-4 py-3 bg-white border border-[#E7F0FA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#7BA4D0] transition" />
                    <textarea onChange={(e) => setItemDescription(e.target.value)} placeholder="Item Description" className="w-full md:col-span-2 px-4 py-3 h-28 bg-white border border-[#E7F0FA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#7BA4D0] transition"></textarea>
                    <input onChange={(e) => setItemImages(e.target.value.split(","))} type="text" placeholder="Image URLs (comma separated)" className="w-full md:col-span-2 px-4 py-3 bg-white border border-[#E7F0FA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#7BA4D0] transition" />
                </div>

                <div className="flex items-center justify-end gap-3 mt-6">
                    <button onClick={()=> {navigate("/adminPage/items")}} className="px-5 py-2 bg-[#E7F0FA] text-[#0D2440] rounded-md border border-[#7BA4D0] hover:bg-[#dfeaf6] transition">Cancel</button>
                    <button onClick={handleAddItem} className="px-5 py-2 bg-[#2E5E99] text-white rounded-md hover:bg-[#0D2440] transition">Add Item</button>
                </div>
            </div>
        </div>
    )
}