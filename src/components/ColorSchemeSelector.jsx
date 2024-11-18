import React from 'react';
import { useTheme } from './ThemeProvider';

function ColorSchemeSelector() {
  const { setColorScheme } = useTheme();

  return (
    <select
      onChange={(e) => setColorScheme(e.target.value)}
      className="bg-white text-gray-800 px-3 py-1 rounded-md"
    >
      <option value="default">Default</option>
      <option value="blue">Blue</option>
      <option value="green">Green</option>
      <option value="purple">Purple</option>
    </select>
  );
}

export default ColorSchemeSelector;