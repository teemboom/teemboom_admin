import { useState } from "react";
import "./changeplan.css";

const plans = [
  { name: "Free", price: "$0", features: ["Basic support", "Limited features"] },
  { name: "Plus", price: "$11/mo", features: ["Priority support", "More features"] },
  { name: "Pro", price: "$65/mo", features: ["24/7 support", "All features"] },
];

export default function BillingPlans() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan.name);
    alert(`You selected the ${plan.name} plan`);
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
