import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const PlanDetails = () => {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    axios.get(`/api/learning-plans/${id}`).then(res => setPlan(res.data));
  }, [id]);

  const handleDelete = () => {
    axios.delete(`/api/learning-plans/${id}`).then(() => window.location.href = '/plans');
  };

  if (!plan) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold">{plan.title}</h2>
      <p>{plan.description}</p>
      <p><strong>Steps:</strong> {plan.steps.join(', ')}</p>
      <p><strong>User:</strong> {plan.userId}</p>
      <p><strong>Public:</strong> {plan.isPublic ? 'Yes' : 'No'}</p>
      <div className="mt-4 space-x-4">
        <Link to={`/edit/${plan.id}`} className="text-blue-600">Edit</Link>
        <button onClick={handleDelete} className="text-red-600">Delete</button>
      </div>
    </div>
  );
};

export default PlanDetails;