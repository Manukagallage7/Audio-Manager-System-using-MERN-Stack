import {CiCirclePlus} from "react-icons/ci";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Items() {

  const [items, setItems] = useState([]);

  


  return (
    <div className="relative w-full h-full bg-red-700">
      <div>
        <table className="w-full text-left border-0">
          <thead>
            <tr>
              <th className="border-b-2 border-black p-2">Item Key</th>
              <th className="border-b-2 border-black p-2">Item Name</th>
              <th className="border-b-2 border-black p-2">Category</th>
              <th className="border-b-2 border-black p-2">Price</th>
              <th className="border-b-2 border-black p-2">Dimensions</th>
              <th className="border-b-2 border-black p-2">Availability</th>
              </tr>
          </thead>
          <tbody>
            {
              items.map((item) => (
                <tr key={item.key}>
                  <td className="border-b border-black p-2">{item.key}</td>
                  <td className="border-b border-black p-2">{item.name}</td>
                  <td className="border-b border-black p-2">{item.category}</td>
                  <td className="border-b border-black p-2">${item.price}</td>
                  <td className="border-b border-black p-2">{item.dimensions}</td>
                  <td className="border-b border-black p-2">{item.availability}</td>
                </tr>
              ))
            }
          </tbody>
      </table>
              
      </div>

      <Link to="/adminPage/items/add" >
        <CiCirclePlus className="absolute bottom-1.5 right-1.5 text-[50px] hover:text-white" />
      </Link>
      
    </div>
  )
}