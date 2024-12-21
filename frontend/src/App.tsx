import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage.tsx';
import RestaurantForm from './components/RestaurantForm.tsx';
import RestaurantDetails from './components/RestaurantDetails.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<RestaurantForm />} />
        <Route path="/edit/:id" element={<RestaurantForm />} />
        <Route path="/details/:id" element={<RestaurantDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
