'use client';

import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

const products: Product[] = [
  { id: 1, name: 'Wireless Headphones', price: 99.99, image: '/headphone.jpg' },
  { id: 2, name: 'Smart Watch', price: 199.99, image: '/watch.jpg' },
  { id: 3, name: 'VR Headset', price: 299.99, image: '/vr.jpg' },
];

export default function ProductGrid() {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    console.log('Product added to cart:', product);
    // Here you would also call your backend to save the cart state
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4 shadow-lg">
          <div className="w-full h-48 bg-gray-200 rounded-md mb-4">
             {/* In a real app, you'd use an <Image> tag here */}
          </div>
          <h2 className="text-xl font-bold">{product.name}</h2>
          <p className="text-gray-500">${product.price}</p>
          <button
            onClick={() => addToCart(product)}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
