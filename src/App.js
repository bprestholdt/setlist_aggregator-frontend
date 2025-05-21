import React, { useState, useEffect } from "react";
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResultsPage from './pages/ResultsPage';

function App() {
return (
<Router>
<Routes>
<Route path = "/" element = {<Home />} />
<Route path = "results" element = {<ResultsPage />} />
</Routes>
</Router>
);
  }
export default App;
