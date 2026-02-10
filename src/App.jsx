import React, { useState } from "react";
import jsPDF from "jspdf";

export default function App() {

  // ===== ADMIN SETTINGS =====
  const ADMIN_PASSWORD = "hillchill123";
  const UPI_ID = "sathishshanavi-4@okaxis";
  const WHATSAPP_NUMBER = "917094853346";

  // Admin controlled delivery charges
  const [metroCharge, setMetroCharge] = useState(40);
  const [otherCharge, setOtherCharge] = useState(80);

  const metroPrefixes = ["11", "40", "56"]; 
  // 11 = Delhi, 40 = Mumbai, 56 = Bangalore

  // ===== STATE =====
  const [cart, setCart] = useState([]);
  const [adminLogged, setAdminLogged] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [locationNote, setLocationNote] = useState("");

  const [orders, setOrders] = useState([]);

  // ===== PRODUCTS =====
  const products = [
    { id: 1, name: "Nilgiris Leaf Tea", price: 250 },
    { id: 2, name: "Masala Chai", price: 220 },
    { id: 3, name: "Ooty Varkey", price: 180 },
    { id: 4, name: "Kombu Honey", price: 450 },
  ];

  // ===== CART FUNCTIONS =====
  const addToCart = (product) => setCart([...cart, product]);

  const removeFromCart = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const productTotal = cart.reduce((sum, item) => sum + item.price, 0);

  // ===== DELIVERY CALCULATION =====
  const isMetro = metroPrefixes.some(prefix => pincode.startsWith(prefix));
  const deliveryCharge = pincode.length === 6
    ? (isMetro ? metroCharge : otherCharge)
    : 0;

  const finalTotal = productTotal + deliveryCharge;

  // ===== ORDER ID =====
  const generateOrderId = () => {
    return "HC" + Math.floor(100000 + Math.random() * 900000);
  };

  // ===== PLACE ORDER =====
  const handleOrder = () => {

    if (!name || !email || !address || pincode.length !== 6) {
      alert("Please fill all details correctly (6-digit pincode required)");
      return;
    }

    const orderId = generateOrderId();

    const newOrder = {
      id: orderId,
      name,
      email,
      address,
      pincode,
      total: finalTotal,
      date: new Date().toLocaleString()
    };

    setOrders([...orders, newOrder]);

    // UPI LINK (Final Total)
    const upiLink =
      `upi://pay?pa=${UPI_ID}&pn=Hill%20%26%20Chill&am=${finalTotal}&cu=INR`;

    // WhatsApp Message
    const message =
      `Hello Hill & Chill,%0A` +
      `Order ID: ${orderId}%0A` +
      `Name: ${name}%0A` +
      `Pincode: ${pincode}%0A` +
      `Address: ${address}%0A` +
      `Total: ₹${finalTotal}`;

    const whatsappURL =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    window.open(upiLink);
    window.open(whatsappURL);

    alert("Order Placed! Your Order ID: " + orderId);

    setCart([]);
  };

  // ===== INVOICE =====
  const downloadInvoice = (order) => {
    const doc = new jsPDF();
    doc.text("Hill & Chill Invoice", 20, 20);
    doc.text(`Order ID: ${order.id}`, 20, 30);
    doc.text(`Name: ${order.name}`, 20, 40);
    doc.text(`Pincode: ${order.pincode}`, 20, 50);
    doc.text(`Address: ${order.address}`, 20, 60);
    doc.text(`Total: ₹${order.total}`, 20, 70);
    doc.save(`Invoice_${order.id}.pdf`);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>

      <h1>Hill & Chill</h1>

      {/* PRODUCTS */}
      <h2>Products</h2>
      {products.map((p) => (
        <div key={p.id}>
          {p.name} - ₹{p.price}
          <button onClick={() => addToCart(p)}>Add</button>
        </div>
      ))}

      {/* CART */}
      <h2>Cart</h2>
      {cart.map((item, i) => (
        <div key={i}>
          {item.name}
          <button onClick={() => removeFromCart(i)}>Remove</button>
        </div>
      ))}

      <p>Product Total: ₹{productTotal}</p>

      <input
        placeholder="6-digit Pincode"
        value={pincode}
        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
      />

      <p>Delivery Charge: ₹{deliveryCharge}</p>
      <h3>Final Total: ₹{finalTotal}</h3>

      {/* CUSTOMER DETAILS */}
      <input placeholder="Full Name" onChange={(e)=>setName(e.target.value)} />
      <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
      <textarea placeholder="Full Address"
        onChange={(e)=>setAddress(e.target.value)} />

      <button onClick={handleOrder}>
        Pay with UPI
      </button>

      {/* ADMIN PANEL */}
      <hr />
      <h2>Admin Panel</h2>

      {!adminLogged ? (
        <>
          <input
            type="password"
            placeholder="Admin Password"
            onChange={(e)=>setAdminPassInput(e.target.value)}
          />
          <button onClick={()=>{
            if(adminPassInput===ADMIN_PASSWORD){
              setAdminLogged(true)
            } else {
              alert("Wrong Password")
            }
          }}>Login</button>
        </>
      ) : (
        <>
          <h3>Delivery Charges</h3>
          <input
            type="number"
            value={metroCharge}
            onChange={(e)=>setMetroCharge(Number(e.target.value))}
          /> Metro Charge
          <br/>
          <input
            type="number"
            value={otherCharge}
            onChange={(e)=>setOtherCharge(Number(e.target.value))}
          /> Other India Charge

          <h3>Orders</h3>
          {orders.map(order=>(
            <div key={order.id}>
              {order.id} - ₹{order.total}
              <button onClick={()=>downloadInvoice(order)}>
                Download Invoice
              </button>
            </div>
          ))}
        </>
      )}

    </div>
  );
}
