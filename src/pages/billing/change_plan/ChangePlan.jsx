import { useState } from "react";
import "./changeplan.css";

const plans = [
  { name: "Free", price: "$0", features: ["Basic support", "Limited features"] },
  { name: "Plus", price: "$5/mo", features: ["Priority support", "More features"] },
  { name: "Pro", price: "$11/mo", features: ["24/7 support", "All features"] },
];

export default function BillingPlans() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan.name);
    alert(`You selected the ${plan.name} plan`);
  };

  return (
    <div className="BPcontainer">
      <div className="BPplans-grid">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="BPplan-card"
          >
            <h2 className="BPplan-name">{plan.name}</h2>
            <p className="BPplan-price">{plan.price}</p>
            <ul className="BPplan-features">
              {plan.features.map((feature, index) => (
                <li key={index} className="BPfeature">✔ {feature}</li>
              ))}
            </ul>
            <button
              onClick={() => handleSelectPlan(plan)}
              className="BPselect-button"
            >
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
