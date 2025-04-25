import { useState, useEffect } from "react";
import { initializePaddle } from "@paddle/paddle-js";
import "./changeplan.css";
import { useSelector } from "react-redux";
const plans = [
  { name: "Free", price: "$0", features: ["Basic support", "Limited features"] },
  { name: "Plus", price: "$11/mo", features: [], paddleId: "pri_01jr1a3k45bnxrgdaxj9jxk9nh" },
  // { name: "Pro", price: "$65/mo", features: [], paddleId: "pri_01jr1a581na0k75nxshw6c9wq6" },
];

export default function BillingPlans() {
  const currentSite = useSelector((state) => state.site.site)
  const user = useSelector((state) => state.user.user)
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paddleLoaded, setPaddleLoaded] = useState(false);
  const [paddle, setPaddle] = useState(null);

  useEffect(() => {
    // Initialize Paddle
    initializePaddle({token: 'live_f2d865c5801506505a5d65c5862' }).then(
      (paddleInstance) => {
        if (paddleInstance) {
          setPaddle(paddleInstance);
        }
      },
    );
    setPaddleLoaded(true);
  }, []);

  const openCheckout = (plan) => {
    console.log(plan);
    paddle?.Checkout.open({
      items: [{ 
        priceId: plan.paddleId, 
        quantity: 1
      }],
      customData: {
        "site_id": currentSite._id,
        "user_id": user._id
      }
    });
  };

  const handleSelectPlan = async (plan) => {
    setSelectedPlan(plan.name);
    
    if (plan.name === "Free") {
      alert(`You selected the ${plan.name} plan`);
      return;
    }

    if (!paddleLoaded) {
      alert('Payment system is still loading. Please try again in a moment.');
      return;
    }

    try {
      openCheckout(plan);
    } catch (error) {
      console.error('Error opening checkout:', error);
      alert('There was an error opening the checkout. Please try again.');
    }
  };

  return (
    <div>
      <div className="hero">
        <h1>Choose Your Plan</h1>
        <p>Select the best plan that suits your needs.</p>
      </div>
      <div className="plans">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`plan-card ${selectedPlan === plan.name ? 'selected' : ''}`}
          >
            <h2 className="plan-name">{plan.name}</h2>
            <p className="plan-price">{plan.price}</p>
            <ul className="plan-features">
              {plan.features.map((feature, index) => (
                <li key={index} className="plan-feature">✔ {feature}</li>
              ))}
            </ul>
            <button
              onClick={() => handleSelectPlan(plan)}
              className="select-button"
            >
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
