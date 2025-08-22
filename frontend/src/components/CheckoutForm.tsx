import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setMessage("Payment in progress...");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required", // THIS prevents automatic redirect
    });

    if (error) {
      setMessage("Payment failed: " + error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("Payment successful!");
      setIsSuccess(true);
    } else {
      setMessage("Payment processing. Please wait...");
    }
    setIsLoading(false);
  };

  if (isSuccess) {
    return (
      <div className="success-message" style={{color:"black"}}>
        <h1>Your payment was successful!</h1>
        
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ maxWidth: "450px", margin: "10px auto" }}>
        <PaymentElement />
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <button
          disabled={isLoading || !stripe || !elements}
          type="submit"
          style={{ padding: "10px 20px", backgroundColor:"whitesmoke" }}
        >
          {isLoading ? "Processing..." : "Pay now"}
        </button>
      </div>
      {message && <div className="message">{message}</div>}
    </form>
  );
};

export default CheckoutForm;
