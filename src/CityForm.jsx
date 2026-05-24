import { useState } from 'react';

// Preset Sci-Fi glows to match high-tech colony themes
const COLOR_PRESETS = [
  { name: 'Solar Orange', hex: '#e2583e', label: 'Mars Core' },
  { name: 'Bio-Green', hex: '#2e7d32', label: 'Ecosystem' },
  { name: 'Red Alert', hex: '#b71c1c', label: 'Danger/Foundry' },
  { name: 'Ice Blue', hex: '#1565c0', label: 'Subsurface/Ice' },
  { name: 'Void Violet', hex: '#7e57c2', label: 'Refinery' },
];

export default function CityForm({ onAddCity, onCancel }) {
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [temp, setTemp] = useState(-50); // initial moderate Mars temperature
  const [dustLevel, setDustLevel] = useState('Moderate');
  const [advisory, setAdvisory] = useState('');
  const [theme, setTheme] = useState(COLOR_PRESETS[0].hex); // default to Solar Orange
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations
    if (!name.trim()) {
      setError('Outpost Designation Name is required.');
      return;
    }
    if (!region.trim()) {
      setError('Sector / Region Location is required.');
      return;
    }
    if (!advisory.trim()) {
      setError('Life Support Advisory alert broadcast is required.');
      return;
    }

    const uniqueId = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const newCity = {
      id: uniqueId || `colony-${Math.floor(Math.random() * 10000)}`,
      name: name.trim(),
      region: region.trim(),
      temp: `${temp}°C`,
      dustLevel,
      advisory: advisory.trim(),
      theme,
    };

    onAddCity(newCity);
  };

  return (
    <div className="form-panel">
      <div className="terminal-card">
        
        {/* Form Title */}
        <div className="form-header">
          <h2>Outpost Registry Portal</h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--colony-theme)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Transponder Node Sync
          </span>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            color: '#fca5a5',
            padding: '0.75rem',
            borderRadius: '4px',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-mono)'
          }}>
            ⚠️ SIGNAL CORRUPTION: {error}
          </div>
        )}

        {/* Input fields */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="form-grid">
            {/* Outpost Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="station-name">Station Designation</label>
              <input
                id="station-name"
                type="text"
                placeholder="e.g. Sagan Outpost"
                className="form-input"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                maxLength={30}
              />
            </div>

            {/* Region */}
            <div className="form-group">
              <label className="form-label" htmlFor="station-region">Colony Sector / Region</label>
              <input
                id="station-region"
                type="text"
                placeholder="e.g. Chryse Planitia"
                className="form-input"
                value={region}
                onChange={(e) => {
                  setRegion(e.target.value);
                  setError('');
                }}
                maxLength={40}
              />
            </div>
          </div>

          <div className="form-grid">
            {/* Temperature Slider */}
            <div className="form-group">
              <label className="form-label">Thermal Index (°C)</label>
              <div className="slider-group">
                <input
                  type="range"
                  min="-130"
                  max="20"
                  value={temp}
                  onChange={(e) => setTemp(Number(e.target.value))}
                />
                <span className="slider-val">{temp}°C</span>
              </div>
            </div>

            {/* Dust Level Dropdown */}
            <div className="form-group">
              <label className="form-label" htmlFor="station-dust">Particulate Level</label>
              <select
                id="station-dust"
                className="form-select"
                value={dustLevel}
                onChange={(e) => setDustLevel(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
                <option value="Extreme">Extreme</option>
              </select>
            </div>
          </div>

          {/* Life Support Advisory */}
          <div className="form-group full-width">
            <label className="form-label" htmlFor="station-advisory">Safety / Advisory broadcast</label>
            <textarea
              id="station-advisory"
              rows="3"
              placeholder="Enter active weather warnings, environmental advisory, or safety protocol instructions..."
              className="form-input"
              style={{ resize: 'none', lineHeight: '1.4', fontFamily: 'var(--font-mono)' }}
              value={advisory}
              onChange={(e) => {
                setAdvisory(e.target.value);
                setError('');
              }}
              maxLength={150}
            />
          </div>

          {/* Theme Color Presets */}
          <div className="form-group full-width">
            <label className="form-label">Holographic Grid Accent Theme</label>
            <div className="theme-picker-grid">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() => setTheme(preset.hex)}
                  className={`color-swatch ${theme === preset.hex ? 'selected' : ''}`}
                  style={{ 
                    backgroundColor: preset.hex,
                    '--swatch-color': preset.hex
                  }}
                  title={`${preset.name} - ${preset.label}`}
                />
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={onCancel}
            >
              Abort & Exit
            </button>
            <button
              type="submit"
              className="primary-btn"
            >
              Commit Outpost Data
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
