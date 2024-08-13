"use client"
import React, { useState, useEffect } from 'react';
import './GlossaryPage.css';
import Logo from "../../public/Offical_3High_Res_Logo.png";


interface GlossaryItem {
  term: string;
  definition: string;
}

const GlossaryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLetter, setFilterLetter] = useState('');
  const [glossaryItems, setGlossaryItems] = useState<GlossaryItem[]>([]);

  useEffect(() => {
    fetch('/glossary.json')
      .then(response => response.json())
      .then((data: GlossaryItem[]) => setGlossaryItems(data))
      .catch(error => console.error('Error loading glossary:', error));
  }, []);

  const filteredItems = glossaryItems.filter(item =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterLetter === '' || item.term.toLowerCase().startsWith(filterLetter.toLowerCase()))
  );

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="glossary-page">
      <div className="title-container">
        <img src="/Offical_3High_Res_Logo.png" alt="Glossary Icon" width={40} height={40} className="rounded-full" />
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
          Glossary
        </h1>
      </div>

      <div className="subtitle-container">
      <h3 className="text-1xl text-gray-700 text-center">
          All definitions are taken from Merriam-Webster.com. Retrieved May 8, 2011
        </h3>
      </div>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search terms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="content">
        <div className="glossary-list">
          {filteredItems.map((item, index) => (
            <div key={index} className="glossary-item">
              <h3>{item.term}</h3>
              <p>{item.definition}</p>
            </div>
          ))}
        </div>

        <div className="filter">
          <h3>Filter <span className="reset" onClick={() => setFilterLetter('')}>Reset</span></h3>
          <div className="letter-buttons">
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => setFilterLetter(letter === filterLetter ? '' : letter)}
                className={letter === filterLetter ? 'active' : ''}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlossaryPage;