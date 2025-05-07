import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LearningPlans = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    axios.get('/api/learning-plans').then(res => setPlans(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Learning Plans</h2>
      <ul className="space-y-2">
        {plans.map(plan => (
          <li key={plan.id} className="border p-2 rounded">
            <h3 className="font-bold">{plan.title}</h3>
            <p>{plan.description}</p>
            <Link to={`/plans/${plan.id}`} className="text-blue-500">View Details</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LearningPlans;