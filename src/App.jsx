import React, { useState } from "react";

export default function App() {
  const UPI_ID = "sathishshanavi-4@okaxis";
  const WHATSAPP = "919585191952";
  const ADMIN_USER = "admin";
  const ADMIN_PASS = "Hill@123";

  const [products, setProducts] = useState([
    { id: 1, name: "Nilgiris Tea", price: 250 },
    { id: 2, name: "Masala Chai", price: 220 }
  ]);

  const [locations, setLocations] = useState([
    { name: "Chennai", charge: 40 },
    { name: "Delhi", charge: 80 }
  ]);

  const [cart, setCart] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");

  const [showAdmin, setShowAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [newProduct, setNewProduct] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newCharge, setNewCharge] = useState("");

  const addToCart = (product) => setCart([...cart, product]);
  const clearCart = () => setCart([]);

  const productTotal = cart.reduce((sum, item) => sum + item.price, 0);
  const deliveryCharge =
    locations.find((l) => l.name === selectedLocation)?.charge || 0;
  const finalTotal = productTotal + deliveryCharge;

  const handlePayment = () => {
    if (!/^[0-9]{6}$/.test(pincode)) {
      alert("Enter valid 6 digit pincode");
      return;
    }

    if (!address || !selectedLocation) {
      alert("Fill address and select location");
      return;
    }

    const upiLink = `upi://pay?pa=${UPI_ID}&pn=Hill%20Chill&am=${finalTotal}&cu=INR`;

    const message = `
🛍 Hill & Chill Order

Products:
${cart.map((c) => `- ${c.name}`).join("\n")}

Address:
${address}

Pincode: ${pincode}
Location: ${selectedLocation}

Delivery: ₹${deliveryCharge}
Total: ₹${finalTotal}
`;

    const whatsappLink =
      "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(message);

    window.open(upiLink);
    window.open(whatsappLink);

    clearCart();
  };

  const loginAdmin = () => {
    if (adminUser === ADMIN_USER && adminPass === ADMIN_PASS) {
      setLoggedIn(true);
    } else {
      alert("Wrong credentials");
    }
  };

  const addProduct = () => {
    if (!newProduct || !newPrice) return;
    setProducts([
      ...products,
      { id: Date.now(), name: newProduct, price: Number(newPrice) }
    ]);
    setNewProduct("");
    setNewPrice("");
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const addLocation = () => {
    if (!newLocation || !newCharge) return;
    setLocations([
      ...locations,
      { name: newLocation, charge: Number(newCharge) }
    ]);
    setNewLocation("");
    setNewCharge("");
  };

  const deleteLocation = (name) => {
    setLocations(locations.filter((l) => l.name !== name));
  };

  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #ddd",
        paddingBottom: 10
      }}>
        <h2>🌿 Hill & Chill</h2>
        <button onClick={() => setShowAdmin(true)}>Admin Login</button>
      </header>

      <h3 style={{ marginTop: 20 }}>Products</h3>
      {products.map((p) => (
        <div key={p.id} style={{ marginBottom: 10 }}>
          {p.name} - ₹{p.price}
          <button onClick={() => addToCart(p)} style={{ marginLeft: 10 }}>
            Add
          </button>
        </div>
      ))}

      <hr />

      <h3>Checkout</h3>
      <p>Product Total: ₹{productTotal}</p>

      <select
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
      >
        <option value="">Select Location</option>
        {locations.map((loc) => (
          <option key={loc.name}>{loc.name}</option>
        ))}
      </select>

      <p>Delivery: ₹{deliveryCharge}</p>
      <h4>Final Total: ₹{finalTotal}</h4>

      <input
        placeholder="6 Digit Pincode"
        value={pincode}
        onChange={(e) => setPincode(e.target.value)}
      />
      <br /><br />

      <textarea
        placeholder="Full Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <br /><br />

      <button onClick={handlePayment}>Pay with UPI</button>
      <button onClick={clearCart} style={{ marginLeft: 10 }}>
        Clear Cart
      </button>

      {showAdmin && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{ background: "white", padding: 20, width: 300 }}>
            {!loggedIn ? (
              <>
                <h3>Admin Login</h3>
                <input placeholder="Username" onChange={(e) => setAdminUser(e.target.value)} />
                <br /><br />
                <input type="password" placeholder="Password" onChange={(e) => setAdminPass(e.target.value)} />
                <br /><br />
                <button onClick={loginAdmin}>Login</button>
              </>
            ) : (
              <>
                <h3>Admin Panel</h3>

                <h4>Add Product</h4>
                <input placeholder="Product Name" value={newProduct} onChange={(e) => setNewProduct(e.target.value)} />
                <input placeholder="Price" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
                <button onClick={addProduct}>Add</button>

                {products.map((p) => (
                  <div key={p.id}>
                    {p.name}
                    <button onClick={() => deleteProduct(p.id)}>Delete</button>
                  </div>
                ))}

                <h4>Add Location</h4>
                <input placeholder="Location" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} />
                <input placeholder="Delivery Charge" value={newCharge} onChange={(e) => setNewCharge(e.target.value)} />
                <button onClick={addLocation}>Add</button>

                {locations.map((l) => (
                  <div key={l.name}>
                    {l.name}
                    <button onClick={() => deleteLocation(l.name)}>Delete</button>
                  </div>
                ))}
              </>
            )}

            <br />
            <button onClick={() => setShowAdmin(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
