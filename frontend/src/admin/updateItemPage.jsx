import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export default function UpdateItemPage() {

    const [ItemKey, setItemKey] = useState("");
    const [ItemName, setItemName] = useState("");
    const [ItemPrice, setItemPrice] = useState(0);
    const [ItemCategory, setItemCategory] = useState("audio");
    const [ItemDimensions, setItemDimensions] = useState("");
    const [ItemDescription, setItemDescription] = useState("");
    const [ItemImages, setItemImages] = useState([]);
    

    async function handleAddItem() {
        const token = localStorage.getItem("token")

        if(token) {
            try{
                const result = await axios.post(`http://localhost:5000/api/product/:${ItemKey}`, {
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
            } catch {
                toast.error("An unexpected error occurred.");
            }
        } else {
            toast.error("You must be logged in first.");
        }
    }

    return (
        <div className="flex flex-col w-full h-full items-center gap-5 pt-10">
            <h1>Update Items </h1>
            <div className="flex flex-col w-[400px] backdrop-blur-2xl border-0 gap-2 p-5 rounded-sm bg-yellow-300">
                <input onChange={(e) => setItemKey(e.target.value)} type="text" placeholder="Item Key" className="w-full h-[40px] mb-2 rounded-sm p-2"/>
                <input onChange={(e) => setItemName(e.target.value)} type="text" placeholder="Item Name" className="w-full h-[40px] mb-2 rounded-sm p-2"/>
                <input onChange={(e) => setItemPrice(Number(e.target.value))} type="number" placeholder="Item Price" className="w-full h-[40px] mb-2 rounded-sm p-2"/>
                <select onChange={(e) => setItemCategory(e.target.value)} className="w-full h-[40px] mb-2 rounded-sm p-2">
                    <option value="audio">Audio</option>
                    <option value="lighting">Lighting</option>
                    <option value="electronics">Electronics</option>
                    <option value="uncategorized">Uncategorized</option>
                </select>
                <input onChange={(e) => setItemDimensions(e.target.value)} type="text" placeholder="Item Dimensions" className="w-full h-[40px] mb-2 rounded-sm p-2"/>
                <textarea onChange={(e) => setItemDescription(e.target.value)} placeholder="Item Description" className="w-full h-[80px] mb-2 rounded-sm p-2"></textarea>
                <input onChange={(e) => setItemImages(e.target.value.split(","))} type="text" placeholder="Image URLs (comma separated)" className="w-full h-[40px] mb-2 rounded-sm p-2"/>
                <button onClick={handleAddItem} className="w-full h-[40px] bg-green-400 rounded-sm hover:bg-green-500">Update Item</button>
                <button className="w-full h-[40px] bg-green-400 rounded-sm hover:bg-green-500">Cancel</button>
            </div>
        </div>
    )
}