import React from 'react';

export default function CourseList({ courses, onDeleteCourse }) {
  return (
    <table className="table table-striped table-bordered align-middle">
      <thead>
        <tr>
          <th>Mata Kuliah</th>
          <th>Nilai</th>
          <th>SKS</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {courses.length === 0 ? (
          <tr>
            <td colSpan="4" className="text-center text-muted">
              Belum ada mata kuliah yang ditambahkan.
            </td>
          </tr>
        ) : (
          courses.map((course, index) => (
            <tr key={index}>
              <td>{course.name}</td>
              <td>{course.grade}</td>
              <td>{course.sks}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onDeleteCourse(index)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
