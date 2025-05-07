import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePlan = () => {
  const [form, setForm] = useState({ title: '', description: '', steps: '', userId: '', isPublic: false });
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const stepsArray = form.steps.split(',').map(s => s.trim());
    axios.post('/api/learning-plans', { ...form, steps: stepsArray }).then(() => navigate('/plans'));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="border p-2 w-full" />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 w-full" />
      <input name="steps" placeholder="Steps (comma-separated)" value={form.steps} onChange={handleChange} className="border p-2 w-full" />
      <input name="userId" placeholder="User ID" value={form.userId} onChange={handleChange} className="border p-2 w-full" />
      <label className="block">
        <input type="checkbox" name="isPublic" checked={form.isPublic} onChange={handleChange} />
        Public?
      </label>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create</button>
    </form>
  );
};

export default CreatePlan;