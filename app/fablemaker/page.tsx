'use client';

import { useState, useEffect } from "react";

// Configuration arrays for all dropdown options (sorted alphabetically)
const ANIMALS_1 = ['Eagle', 'Elephant', 'Fox', 'Gorilla', 'Lion', 'Owl', 'Shark'];
const ANIMALS_2 = ['Ant', 'Bee', 'Crow', 'Dolphin', 'Fish', 'Hummingbird', 'Mole', 'Mouse', 'Snake', 'Worm'];
const SETTINGS = ['Desert', 'Forest', 'Jungle', 'Meadow', 'Underwater'];
const MORALS = [
  "Be kind to others",
  "Don't be greedy", 
  "Don't judge a book by it's cover",
  "Don't make the same mistake twice",
  "Have a growth mindset",
  "Honesty is the best policy",
  "Never give up"
];
const MODELLED_OPTIONS = [
  { value: "make this fable correctly spelt and with powerful language features", label: "no" },
  { value: "Use only a few powerful language features, misspell words and include grammatical errors.", label: "yes" }
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [fable, setFable] = useState<string>('');

  useEffect(() => {
    document.title = "Fablemaker - Create Your Own Fables";
  }, []);

  const createFable = async () => {
    // Get form values
    const modelledMode = (document.getElementById('modelledMode') as HTMLSelectElement)?.value || '';
    const animal1 = (document.getElementById('animal1') as HTMLSelectElement)?.value || '';
    const animal2 = (document.getElementById('animal2') as HTMLSelectElement)?.value || '';
    const setting = (document.getElementById('setting') as HTMLSelectElement)?.value || '';
    const moral = (document.getElementById('moral') as HTMLSelectElement)?.value || '';

    // Validation - check if all fields are selected
    const missingFields = [];
    if (!modelledMode || modelledMode === '') missingFields.push('Modelled mode');
    if (!animal1 || animal1 === '') missingFields.push('Animal 1');
    if (!animal2 || animal2 === '') missingFields.push('Animal 2');
    if (!setting || setting === '') missingFields.push('Setting');
    if (!moral || moral === '') missingFields.push('Moral');

    if (missingFields.length > 0) {
      alert(`Please select the following fields: ${missingFields.join(', ')}`);
      return;
    }

    // Check if same animal is selected for both
    if (animal1 === animal2) {
      alert('Please select different animals for Animal 1 and Animal 2.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/create-fable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelledMode,
          animal1,
          animal2,
          setting,
          moral,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create fable');
      }

      const data = await response.json();
      setFable(data.fable);
    } catch (error) {
      console.error('Error creating fable:', error);
      alert('Failed to create fable. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <h1>Fablemaker</h1>
      <h2>Perfect for bedtime, school and social stories</h2>
      <p>More coming soon...</p>
      <p>Make a Fable!</p>
      <p>Modelled mode:</p>
      <label>Less powerful language and grammatical errors. Perfect for modelled writing:</label>
      <select id="modelledMode" name="modelledMode" defaultValue="">
        <option value="">Please select...</option>
        {MODELLED_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
        
      <p>Animal 1:</p>
      <label>Choose your animal:</label>
      <select id="animal1" name="animal1" defaultValue="">
        <option value="">Please select...</option>
        {ANIMALS_1.map((animal) => (
          <option key={animal} value={animal}>
            {animal}
          </option>
        ))}
      </select>
    
    <br/>
    <p>Animal 2</p>
    <label>Choose your second animal:</label>
        <select id="animal2" name="animal2" defaultValue="">
          <option value="">Please select...</option>
          {ANIMALS_2.map((animal) => (
            <option key={animal} value={animal}>
              {animal}
            </option>
          ))}
        </select>
<br/>
<p>Setting:</p>
<label>Choose your setting:</label>
    <select id="setting" name="setting" defaultValue="">
      <option value="">Please select...</option>
      {SETTINGS.map((setting) => (
        <option key={setting} value={setting}>
          {setting}
        </option>
      ))}
    </select>
 
<br/>
<p>Moral:</p>
<label>Choose your moral:</label>
    <select id="moral" name="moral" defaultValue="">
      <option value="">Please select...</option>
      {MORALS.map((moral) => (
        <option key={moral} value={moral}>
          {moral}
        </option>
      ))}
    </select>

<br/>
<button 
  onClick={createFable} 
  disabled={isLoading}
  style={{
    backgroundColor: isLoading ? '#45a049' : '#4CAF50',
    border: 'none',
    color: 'white',
    padding: '15px 32px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    borderRadius: '4px',
    opacity: isLoading ? 0.8 : 1,
    transition: 'all 0.2s ease'
  }}
>
  {isLoading && (
    <div
      style={{
        width: '16px',
        height: '16px',
        border: '2px solid #ffffff40',
        borderTop: '2px solid #ffffff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}
    />
  )}
  {isLoading ? 'Creating Fable...' : 'Create Fable'}
</button>

<style jsx>{`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`}</style>

{fable && (
  <div style={{ 
    marginTop: '20px', 
    padding: '20px', 
    border: '1px solid #ddd', 
    borderRadius: '8px',
    backgroundColor: '#f9f9f9'
  }}>
    <h3>Your Fable:</h3>
    <p style={{ whiteSpace: 'pre-wrap' }}>{fable}</p>
  </div>
)}

<br/>
<div className="news">
    <p>News: 26/12/24: The backdrop has been created and this news section was also created.</p>
    <p>News: 01/03/25: Started to dev on a new pc.</p>
</div>

  <a href="/fablemaker/about">About the developer</a>
  </div>
  );
}
