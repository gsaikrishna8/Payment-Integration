import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./components/CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_PUBLISH_KEY);

const PaymentSuccess = () => (
  <div className="success-message" style={{color:"black"}}>
    <h1>Your payment was successful!</h1>
    
  </div>
);

const App = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/checkout", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((err) => console.error("Error fetching client secret:", err));
  }, []);

  if (!clientSecret) return <div>Loading payment details...</div>;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="app-container">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm />
              </Elements>
            </div>
          }
        />
        <Route path="/success" element={<PaymentSuccess />} />
      </Routes>
    </Router>
  );
};

export default App;
