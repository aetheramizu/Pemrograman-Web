import React, { useState } from 'react';
import CanvasBanner from './components/CanvasBanner';
import CourseForm from './components/CourseForm';
import CourseList from './components/CourseList';
import GPAStatistics from './components/GPAStatistics';

export default function App() {
  // Main application state holding list of registered courses
  const [courses, setCourses] = useState([
    { name: "Pemrograman Web", grade: "A", sks: 3 },
    { name: "Struktur Data & Algoritma", grade: "B", sks: 4 }
  ]);

  const handleAddCourse = (newCourse) => {
    // Immutable state update using spread operator
    setCourses([...courses, newCourse]);
  };

  const handleDeleteCourse = (indexToDelete) => {
    // Filter array immutably to exclude targeted index
    const updatedCourses = courses.filter((_, index) => index !== indexToDelete);
    setCourses(updatedCourses);
  };

  return (
    <div className="container py-4" style={{ maxWidth: "720px" }}>
      {/* Top Banner combining HTML5 Canvas Animation */}
      <CanvasBanner />

      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white text-center py-3">
          <h1 className="h4 mb-0">Platform Kalkulator IPK Mahasiswa</h1>
        </div>
        <div className="card-body p-4">
          {/* Sub-component Form */}
          <CourseForm onAddCourse={handleAddCourse} />

          <h2 className="h5 mb-3 border-bottom pb-2">Daftar Pengambilan Mata Kuliah</h2>
          {/* Sub-component List */}
          <CourseList courses={courses} onDeleteCourse={handleDeleteCourse} />

          <h2 className="h5 my-3 border-bottom pb-2">Analisis Hasil Studi</h2>
          {/* Sub-component Statistics */}
          <GPAStatistics courses={courses} />
        </div>
      </div>
    </div>
  );
}
