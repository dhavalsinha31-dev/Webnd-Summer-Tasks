import { useState } from 'react';
import initialCities from '../db.json';
import Dashboard from './Dashboard';
import './App.css';

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;
  return `${r}, ${g}, ${b}`;
}

function App() {
  const [selectedCityId, setSelectedCityId] = useState(initialCities[0].id);

  const activeCity = initialCities.find(c => c.id === selectedCityId) || initialCities[0];

  const activeThemeColor = activeCity?.theme || '#e2583e';
  const activeThemeRgb = hexToRgb(activeThemeColor);

  return (
    <div 
      className="terminal-layout" 
      style={{
        '--colony-theme': activeThemeColor,
        '--colony-theme-rgb': activeThemeRgb,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%'
      }}
    >
      <header className="terminal-header">
        <div className="terminal-title-area">
          <div className="terminal-logo-glow"></div>
          <div>
            <h1 className="terminal-title" style={{ margin: 0, fontSize: '1.4rem' }}>
              Mars Colony Weather Dashboard
            </h1>
            <div className="terminal-subtitle">Direct Station Database Telemetry</div>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Dashboard 
          cities={initialCities}
          selectedCityId={selectedCityId}
          onSelectCity={setSelectedCityId}
        />
      </main>

      <footer className="terminal-footer">
        <div style={{ color: '#4b5563' }}>
          Mars Colony Environmental Data System // Verified db.json Feed
        </div>
      </footer>
    </div>
  );
}

export default App;
