import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentForm from './components/StudentForm';
import SubmissionDisplay from './components/SubmissionDisplay';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentForm />} />
        <Route path="/submitted/:id" element={<SubmissionDisplay />} />
      </Routes>
    </Router>
  );
}

export default App;
