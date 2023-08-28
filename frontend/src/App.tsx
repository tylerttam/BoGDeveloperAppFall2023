import React, { useState, useEffect } from 'react';
import './App.css';
import { VolunteerTableDataProvider } from './components/VolunteerTable/VolunteerTableDataProvider';
import { VolunteerNotes } from './components/VolunteerTable/VolunteerNotes';
import { Routes, Route } from 'react-router-dom';

const App = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  useEffect(() => {
    const handleWindowResizeWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleWindowResizeWidth);

    return () => {
      window.removeEventListener('resize', handleWindowResizeWidth);
    };
  });

  useEffect(() => {
    const handleWindowResizeHeight = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleWindowResizeHeight);

    return () => {
      window.removeEventListener('resize', handleWindowResizeHeight);
    };
  });

  return (
    <div className="ag-theme-alpine" style={{
      width: windowWidth - (windowWidth * 0.001),
      height: windowHeight - (windowHeight * 0.01), padding: '1%'
    }}>
      <Routes>
        <Route path="/" element={<VolunteerTableDataProvider isAdmin={false} />} />
        <Route path="/viewer/" element={<VolunteerTableDataProvider isAdmin={false} />} />
        <Route path="/admin/" element={<VolunteerTableDataProvider isAdmin={true} />} />
        <Route path="/volunteernotes/:id" element={<VolunteerNotes />} />
      </Routes>
    </div>
  );
};

export default App;
