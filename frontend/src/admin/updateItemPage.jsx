import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import uploadMedia from "../utils/mediaUpload.jsx";

export default function UpdateItemPage() {

    const [ItemKey, setItemKey] = useState("");
    const [ItemName, setItemName] = useState("");
    const [ItemPrice, setItemPrice] = useState(0);
    const [ItemCategory, setItemCategory] = useState("audio");
    const [ItemDimensions, setItemDimensions] = useState("");
    const [ItemDescription, setItemDescription] = useState("");
    const [ItemAvailability, setItemAvailability] = useState(true);
    const [ItemImages, setItemImages] = useState([]);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const MAX_IMAGES = 4;

    useEffect(() => {
        // try prefill if key provided in state or query
        const keyFromState = location.state && location.state.key;
        const params = new URLSearchParams(location.search);
        const keyFromQuery = params.get('key');
        const key = keyFromState || keyFromQuery || ItemKey;

        async function fetchAndPrefill(k) {
            if (!k) return;
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get(`http://localhost:5000/api/product/${k}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                console.log('fetch product response:', res.data);
                const prod = res.data && (res.data.product || res.data);
                if (prod) {
                    setItemKey(prod.key || '');
                    setItemName(prod.name || '');
                    setItemPrice(prod.price || 0);
                    setItemCategory(prod.category || 'audio');
                    setItemDimensions(prod.dimensions || '');
                    setItemDescription(prod.description || '');
                    setItemAvailability(prod.availability !== undefined ? prod.availability : true);
                    setItemImages(prod.image || prod.images || []);
                }
            } catch (err) {
                console.error("Error fetching item data:", err);
                toast.error("Failed to fetch item data.");
            }
        }

        fetchAndPrefill(key);
    }, [location]);

    async function uploadFiles() {
        if (files.length === 0) {
            toast.error("Please select files first.");
            return;
        }

        // Check if total images would exceed the limit
        const totalImages = ItemImages.length + files.length;
        if (totalImages > MAX_IMAGES) {
            toast.error(`Maximum ${MAX_IMAGES} images allowed. You can only add ${MAX_IMAGES - ItemImages.length} more image(s).`);
            return;
        }

        setUploading(true);
        
        try {
            // Create upload promises for all selected files
            const uploadPromises = Array.from(files).map((file) => uploadMedia(file));
            
            // Upload all files at once using Promise.all
            const uploadedUrls = await Promise.all(uploadPromises);
            
            console.log("All files uploaded successfully:", uploadedUrls);
            setItemImages((prevImages) => [...prevImages, ...uploadedUrls]);
            toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
            setFiles([]);
        } catch (err) {
            console.error("Error uploading files:", err);
            toast.error("Failed to upload images.");
        } finally {
            setUploading(false);
        }
    }

    function removeImage(indexToRemove) {
        setItemImages(ItemImages.filter((_, index) => index !== indexToRemove));
    }

    async function handleUpdateItem() {
        const token = localStorage.getItem("token");
        if (!token) return toast.error("You must be logged in first.");
        try {
            const result = await axios.put(`http://localhost:5000/api/product/${ItemKey}`, {
                key: ItemKey,
                name: ItemName,
                price: ItemPrice,
                category: ItemCategory,
                dimensions: ItemDimensions,
                description: ItemDescription,
                availability: ItemAvailability,
                image: ItemImages
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            console.log(result.data);
            toast.success("Item updated successfully!");
            navigate('/adminPage/items');
        } catch (err) {
            console.error("Error updating item:", err);
            toast.error("An unexpected error occurred.");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#E7F0FA] p-6">
            <div className="w-full max-w-2xl mx-auto bg-gradient-to-b from-[#7BA4D0] to-[#E7F0FA] backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-[rgba(13,36,64,0.08)]">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#0D2440]">Update Item</h1>
                        <p className="text-sm text-[#0D2440]">Edit the item details and save your changes.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input value={ItemKey} onChange={(e) => setItemKey(e.target.value)} type="text" placeholder="Item Key" className="w-full px-4 py-3 bg-white border border-[#E7F0FA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#7BA4D0] transition"/>
                    <input value={ItemName} onChange={(e) => setItemName(e.target.value)} type="text" placeholder="Item Name" className="w-full px-4 py-3 bg-white border border-[#E7F0FA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#7BA4D0] transition"/>
                    <input value={ItemPrice} onChange={(e) => setItemPrice(Number(e.target.value))} type="number" placeholder="Item Price" className="w-full px-4 py-3 bg-white border border-[#E7F0FA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#7BA4D0] transition"/>
                    <select value={ItemCategory} onChange={(e) => setItemCategory(e.target.value)} className="w-full px-4 py-3 bg-white border border-[#E7F0FA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#7BA4D0] transition">
                        <option value="audio">Audio</option>
                        <option value="lighting">Lighting</option>
                        <option value="electronics">Electronics</option>
                        <option value="uncategorized">Uncategorized</option>
                    </select>
                    <input value={ItemDimensions} onChange={(e) => setItemDimensions(e.target.value)} type="text" placeholder="Item Dimensions" className="w-full md:col-span-2 px-4 py-3 bg-white border border-[#E7F0FA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#7BA4D0] transition"/>
                    <textarea value={ItemDescription} onChange={(e) => setItemDescription(e.target.value)} placeholder="Item Description" className="w-full md:col-span-2 px-4 py-3 h-28 bg-white border border-[#E7F0FA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#7BA4D0] transition"></textarea>
                    
                    <div className="w-full md:col-span-2 flex items-center gap-3 px-4 py-3 bg-white border border-[#E7F0FA] rounded-md">
                        <label className="text-sm font-medium text-[#0D2440]">Availability:</label>
                        <button
                            type="button"
                            onClick={() => setItemAvailability(!ItemAvailability)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${ItemAvailability ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${ItemAvailability ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                        <span className={`text-sm font-medium ${ItemAvailability ? 'text-green-600' : 'text-red-500'}`}>
                            {ItemAvailability ? 'Available' : 'Not Available'}
                        </span>
                    </div>
                    
                    <div className="w-full md:col-span-2">
                        <label className="block text-sm font-medium text-[#0D2440] mb-2">Upload Images (Max {MAX_IMAGES})</label>
                        <div className="flex gap-2">
                            <input
                                multiple
                                onChange={(e) => setFiles(e.target.files)}
                                type="file"
                                accept="image/*"
                                className="flex-1 px-4 py-3 bg-white border border-[#E7F0FA] rounded-md focus:outline-none focus:ring-2 focus:ring-[#7BA4D0] transition" 
                            />
                            <button
                                onClick={uploadFiles}
                                disabled={uploading || files.length === 0}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {uploading ? "Uploading..." : `Upload ${files.length > 0 ? files.length : ''} Image${files.length !== 1 ? 's' : ''}`}
                            </button>
                        </div>
                        {ItemImages.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {ItemImages.map((img, index) => (
                                    <div key={index} className="relative group">
                                        <img src={img} alt={`Image ${index + 1}`} className="w-20 h-20 object-cover rounded" />
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6">
                    <button onClick={() => navigate('/adminPage/items')} className="px-5 py-2 bg-[#E7F0FA] text-[#0D2440] rounded-md border border-[#7BA4D0] hover:bg-[#dfeaf6] transition">Cancel</button>
                    <button onClick={handleUpdateItem} className="px-5 py-2 bg-[#2E5E99] text-white rounded-md hover:bg-[#0D2440] transition">Save Changes</button>
                </div>
            </div>
        </div>
    )
}