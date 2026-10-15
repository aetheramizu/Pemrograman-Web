import React, { useState } from 'react';

export default function CourseForm({ onAddCourse }) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("A");
  const [sks, setSks] = useState(3);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Send new course data to parent component via callback prop
    onAddCourse({ name, grade, sks: parseInt(sks, 10) });
    setName(""); // Reset course name input
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3 mb-4">
      <div className="col-md-5">
        <input
          type="text"
          className="form-control"
          placeholder="Nama Mata Kuliah..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="col-md-3">
        <select
          className="form-select"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        >
          <option value="A">Nilai A (4.0)</option>
          <option value="B">Nilai B (3.0)</option>
          <option value="C">Nilai C (2.0)</option>
          <option value="D">Nilai D (1.0)</option>
        </select>
      </div>
      <div className="col-md-2">
        <select
          className="form-select"
          value={sks}
          onChange={(e) => setSks(e.target.value)}
        >
          <option value="1">1 SKS</option>
          <option value="2">2 SKS</option>
          <option value="3">3 SKS</option>
          <option value="4">4 SKS</option>
        </select>
      </div>
      <div className="col-md-2">
        <button type="submit" className="btn btn-success w-100">
          Tambah
        </button>
      </div>
    </form>
  );
}
