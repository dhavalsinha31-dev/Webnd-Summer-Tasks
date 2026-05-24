function getDustMetrics(level) {
  switch (level.toLowerCase()) {
    case 'low':
      return { percentage: 25, color: '#10b981' };
    case 'moderate':
      return { percentage: 50, color: '#f59e0b' };
    case 'high':
      return { percentage: 75, color: '#f97316' };
    case 'extreme':
      return { percentage: 100, color: '#ef4444' };
    default:
      return { percentage: 40, color: '#6b7280' };
  }
}

function parseTemperature(tempStr) {
  if (typeof tempStr === 'number') return tempStr;
  const num = parseInt(tempStr, 10);
  return isNaN(num) ? -50 : num;
}

function getFriendlyAdvisory(tempStr, dustLevel) {
  const tempVal = parseTemperature(tempStr);
  const dust = dustLevel.toLowerCase();
  
  let advisoryText;
  let recommendations = [];
  
  if (dust === 'extreme') {
    advisoryText = 'Heavy dust storm active! It is highly dangerous outside right now.';
    recommendations.push('Stay completely inside your home dome. Airlocks are closed.');
    recommendations.push('Do not attempt to go outside or drive rovers.');
  } else if (dust === 'high') {
    advisoryText = 'High dust warnings are active. Visibility outside is very poor.';
    recommendations.push('Avoid going outside if possible. If you must go, wear a safety visor.');
    recommendations.push('Clean and wash your spacesuit filters as soon as you get back.');
  } else if (dust === 'moderate') {
    advisoryText = 'Light dust storm blowing. Standard safety is recommended.';
    recommendations.push('Keep your spacesuit helmet filters turned on.');
    recommendations.push('Watch out for sudden gusts of wind in sandy areas.');
  } else {
    advisoryText = 'Calm and clear skies! Safe for standard colony walks.';
    recommendations.push('Great time to enjoy walks or do outdoor chores.');
    recommendations.push('A peaceful day to appreciate the red colony views.');
  }
  
  if (tempVal < -90) {
    advisoryText += ' Also, it is freezing cold outside.';
    recommendations.push('Make sure your suit heater is set to the highest warmth.');
    recommendations.push('Keep outdoor trips under 15 minutes to save battery power.');
  } else if (tempVal < -50) {
    advisoryText += ' Quite cold outside, standard Martian weather.';
    recommendations.push('Charge and wear your thermal suit layer before stepping out.');
    recommendations.push('Monitor your spacesuit battery power while heaters are active.');
  } else {
    advisoryText += ' Relatively mild outdoor temperature today.';
    recommendations.push('Regular insulation clothing layers are warm enough.');
  }
  
  return { advisoryText, recommendations };
}

export default function Dashboard({ cities, selectedCityId, onSelectCity }) {
  const selectedCity = cities.find(c => c.id === selectedCityId) || cities[0];

  if (!selectedCity) {
    return (
      <div className="terminal-card text-center" style={{ padding: '3rem' }}>
        <p className="terminal-title">Awaiting Database Sync...</p>
      </div>
    );
  }

  const tempVal = parseTemperature(selectedCity.temp);
  const minTemp = -130;
  const maxTemp = 20;
  const tempPercent = Math.max(0, Math.min(100, ((tempVal - minTemp) / (maxTemp - minTemp)) * 100));

  const dustMetrics = getDustMetrics(selectedCity.dustLevel);
  const isHighDanger = selectedCity.dustLevel.toLowerCase() === 'extreme' || 
                        selectedCity.dustLevel.toLowerCase() === 'high' ||
                        selectedCity.advisory.toLowerCase().includes('alert') || 
                        selectedCity.advisory.toLowerCase().includes('warning');

  const friendlyAdvisory = getFriendlyAdvisory(selectedCity.temp, selectedCity.dustLevel);

  return (
    <>
      <div className="city-selector-bar">
        {cities.map((city) => (
          <button
            key={city.id}
            onClick={() => onSelectCity(city.id)}
            className={`city-btn ${city.id === selectedCityId ? 'active' : ''}`}
            style={{ '--btn-theme': city.theme }}
          >
            <span className="beacon-light"></span>
            <span>{city.name}</span>
          </button>
        ))}
      </div>

      <div className="dashboard-grid">
        
        <div className="telemetry-main-panel">
          <div className="terminal-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
            
            <div className="station-meta" style={{ borderBottom: '1px solid var(--border-dim)', paddingBottom: '1rem' }}>
              <div className="station-identity">
                <h2 style={{ margin: 0 }}>{selectedCity.name}</h2>
                <div className="station-region" style={{ marginTop: '0.4rem' }}>
                  Sector Location: {selectedCity.region}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div className="metric-card" style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '1.25rem' }}>
                <div className="thermometer-wrapper">
                  <div className="thermometer-track" style={{ height: '100px' }}>
                    <div 
                      className="thermometer-fill" 
                      style={{ height: `${tempPercent}%` }}
                    ></div>
                  </div>
                  <div className="temperature-readout">
                    <span className="temperature-value" style={{ fontSize: '2.5rem' }}>{selectedCity.temp}</span>
                    <span className="temperature-label">Thermal Index</span>
                  </div>
                </div>
              </div>

              <div className="metric-card" style={{ padding: '1.25rem' }}>
                <div className="metric-header" style={{ marginBottom: '0.5rem' }}>Atmospheric Particulates</div>
                <div className="metric-value">
                  <span style={{ color: dustMetrics.color }}>{selectedCity.dustLevel}</span>
                </div>
                <div className="dust-bar-container" style={{ marginTop: '0.75rem' }}>
                  <div 
                    className="dust-bar-fill" 
                    style={{ width: `${dustMetrics.percentage}%`, backgroundColor: dustMetrics.color }}
                  ></div>
                </div>
              </div>

            </div>

          </div>
        </div>

        <div className="life-support-panel">
          <div className="terminal-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.5rem' }}>
            
            <div>
              <div className="life-support-status-header" style={{ borderBottom: '1px dashed var(--border-dim)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                <span className="guideline-title" style={{ margin: 0 }}>System Advisory Status</span>
                <span className={`advisory-badge-pulse ${isHighDanger ? 'alert-high' : ''}`}>
                  <span className="alert-indicator-light"></span>
                  {isHighDanger ? 'Advisory Warning' : 'Stable'}
                </span>
              </div>

              <div className="advisory-heading" style={{ marginBottom: '0.5rem' }}>Technical Telemetry Advisory</div>
              <div className="advisory-content" style={{ margin: '0 0 1.25rem 0', fontSize: '0.85rem', opacity: 0.8, fontStyle: 'italic' }}>
                "{selectedCity.advisory}"
              </div>

              <div className="advisory-heading" style={{ marginBottom: '0.5rem', color: 'var(--colony-theme)' }}>Living Advisory (Understandable)</div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-dim)',
                borderRadius: '4px',
                padding: '1rem',
                fontSize: '0.9rem',
                lineHeight: '1.5'
              }}>
                <p style={{ fontWeight: '600', color: '#fff', marginBottom: '0.75rem' }}>
                  {friendlyAdvisory.advisoryText}
                </p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: 0 }}>
                  {friendlyAdvisory.recommendations.map((rec, idx) => (
                    <li key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', color: '#9ca3af', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--colony-theme)' }}>•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>


          </div>
        </div>

      </div>
    </>
  );
}
