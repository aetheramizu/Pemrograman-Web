import React from 'react';

export default function GPAStatistics({ courses }) {
  // Map grade letter to numeric grade point
  const gradePoints = { A: 4.0, B: 3.0, C: 2.0, D: 1.0 };

  const totalSks = courses.reduce((acc, c) => acc + c.sks, 0);
  const totalPoints = courses.reduce((acc, c) => acc + gradePoints[c.grade] * c.sks, 0);
  const gpa = totalSks > 0 ? (totalPoints / totalSks).toFixed(2) : "0.00";

  return (
    <div className="row g-3">
      <div className="col-6">
        <div className="p-3 bg-light rounded text-center border">
          <span className="d-block text-muted small">Total SKS</span>
          <strong>{totalSks} SKS</strong>
        </div>
      </div>
      <div className="col-6">
        <div className="p-3 bg-primary text-white rounded text-center border">
          <span className="d-block text-white-50 small">Indeks Prestasi (IP)</span>
          <strong>{gpa}</strong>
        </div>
      </div>
    </div>
  );
}
