import { useState } from "react";

export default function App() {
  const [cart, setCart] = useState([]);
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [orderId, setOrderId] = useState("");

  const products = [
    {
      id: 1,
      name: "Nilgiris Herbal Tea",
      price: 299,
      image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7"
    },
    {
      id: 2,
      name: "Organic Turmeric Powder",
      price: 199,
      image: "https://images.unsplash.com/photo-1604908176997-4310c09fbcdd"
    },
    {
      id: 3,
      name: "Pure Forest Honey",
      price: 399,
      image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38"
    }
  ];

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const productTotal = cart.reduce((sum, item) => sum + item.price, 0);

  // Metro city prefixes (Admin editable)
  const isMetro =
    pincode.startsWith("110") || // Delhi
    pincode.startsWith("400") || // Mumbai
    pincode.startsWith("560");   // Bangalore

  const deliveryCharge =
    pincode.length === 6
      ? isMetro
        ? 40
        : 80
      : 0;

  const finalTotal =
    productTotal > 0 ? productTotal + deliveryCharge : 0;

  const generateOrderId = () => {
    const id = "HC" + Math.floor(100000 + Math.random() * 900000);
    setOrderId(id);
    return id;
  };

  const generateUPILink = () => {
    const upiID = "sathishshanavi-4@okaxis";
    return `upi://pay?pa=${upiID}&pn=HillChill&am=${finalTotal}&cu=INR`;
  };

  const sendWhatsApp = () => {
    if (!pincode || pincode.length !== 6) {
      alert("Enter valid 6-digit pincode");
      return;
    }

    if (!address) {
      alert("Enter delivery address");
      return;
    }

    const newOrderId = generateOrderId();

    const message = `🛍 Hill & Chill Order

Order ID: ${newOrderId}
Total Amount: ₹${finalTotal}

Pincode: ${pincode}
Address: ${address}

Payment UPI: sathishshanavi-4@okaxis

Thank you for shopping with us!`;

    window.open(
      `https://wa.me/919876543210?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>
      <h1>Hill & Chill</h1>
      <h3>Premium Nilgiris Ingredients</h3>

      <h2>Products</h2>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              padding: 15,
              width: 200,
              borderRadius: 10
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              width="100%"
              style={{ borderRadius: 10 }}
            />
            <h4>{product.name}</h4>
            <p>₹{product.price}</p>
            <button onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <hr />

      <h2>Checkout</h2>

      <p><strong>Product Total:</strong> ₹{productTotal}</p>
      <p><strong>Delivery Charge:</strong> ₹{deliveryCharge}</p>
      <h3>Final Total: ₹{finalTotal}</h3>

      <input
        type="text"
        placeholder="Enter 6-digit Pincode"
        value={pincode}
        maxLength="6"
        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
        style={{ padding: 8, width: "100%", marginBottom: 10 }}
      />

      <textarea
        placeholder="Enter Full Delivery Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={{ padding: 8, width: "100%", marginBottom: 10 }}
      />

      {finalTotal > 0 && (
        <>
          <a href={generateUPILink()}>
            <button style={{ marginRight: 10 }}>
              Pay via UPI
            </button>
          </a>

          <button onClick={sendWhatsApp}>
            Confirm Order on WhatsApp
          </button>
        </>
      )}
    </div>
  );
}
