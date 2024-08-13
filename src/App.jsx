import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import MainPage from './pages/MainPage';
import ListPage from './pages/ListPage';
import WordPage from './pages/WordPage';
import RepeatPage from './pages/RepeatPage';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/list/:id" element={<ListPage />} />
            <Route path="/word/:id" element={<WordPage />} />
            <Route path="/repeat" element={<RepeatPage />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;