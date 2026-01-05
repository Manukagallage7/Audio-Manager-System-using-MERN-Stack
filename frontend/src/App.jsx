import React from 'react'
import { ProductCard } from './components/productCard.jsx'

const App = () => {
  return (
    <div>
      <ProductCard
        title="Wireless Headphones"
        description="High-quality wireless headphones with noise cancellation."
        price="99.99"
        imageUrl="https://example.com/headphones.jpg"
      />
      <ProductCard
        title="Bluetooth Speaker"
        description="Portable Bluetooth speaker with deep bass."
        price="49.99"
        imageUrl="https://example.com/speaker.jpg"
      />
    </div>
  )
}

export default App