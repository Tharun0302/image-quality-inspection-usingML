import React, { useState } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="App min-h-screen font-sans bg-background text-foreground">
      {isAuthenticated ? (
        <Home />
      ) : (
        <Login onLoginSuccess={() => setIsAuthenticated(true)} />
      )}
    </div>
  );
}

export default App;
