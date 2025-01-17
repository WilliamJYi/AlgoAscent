import React, { useState } from "react";
import "./App.css";
import Character from "./character/Character";

type Attributes = {
  Strength: number;
  Dexterity: number;
  Constitution: number;
  Intelligence: number;
  Wisdom: number;
  Charisma: number;
};

type Skills = {
  [key: string]: number;
};

type CharacterData = {
  id: number;
  attributes: Attributes;
  skills: Skills;
};

function App() {
  const [characters, setCharacters] = useState<CharacterData[]>([]);

  // Function to add a new character
  const addCharacter = () => {
    const newCharacter: CharacterData = {
      id: characters.length + 1,
      attributes: {
        Strength: 10,
        Dexterity: 10,
        Constitution: 10,
        Intelligence: 10,
        Wisdom: 10,
        Charisma: 10,
      },
      skills: {
        Acrobatics: 0,
        "Animal Handling": 0,
        Arcana: 0,
        Athletics: 0,
        Deception: 0,
        History: 0,
        Insight: 0,
        Intimidation: 0,
        Investigation: 0,
        Medicine: 0,
        Nature: 0,
        Perception: 0,
        Performance: 0,
        Persuasion: 0,
        Religion: 0,
        "Sleight of Hand": 0,
        Stealth: 0,
        Survival: 0,
      },
    };
    setCharacters((prevCharacters) => [...prevCharacters, newCharacter]);
  };

  // Function to update attributes for a specific character
  const updateCharacterAttributes = (id: number, newAttributes: Attributes) => {
    setCharacters((prevCharacters) =>
      prevCharacters.map((character) =>
        character.id === id
          ? { ...character, attributes: newAttributes }
          : character
      )
    );
  };

  // Function to update skills for a specific character
  const updateCharacterSkills = (id: number, newSkills: Skills) => {
    setCharacters((prevCharacters) =>
      prevCharacters.map((character) =>
        character.id === id ? { ...character, skills: newSkills } : character
      )
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise - William Yi</h1>
      </header>
      <section className="App-section">
        <button onClick={addCharacter}>Add Character</button>
        <button onClick={() => console.log(characters)}>Save Characters</button>
        {characters.map((character) => (
          <Character
            key={character.id}
            id={character.id}
            attributes={character.attributes}
            skills={character.skills}
            setAttributes={(newAttributes) =>
              updateCharacterAttributes(character.id, newAttributes)
            }
            setSkills={(newSkills) => updateCharacterSkills(character.id, newSkills)}
          />
        ))}
      </section>
    </div>
  );
}

export default App;

import React from "react";
import "./Character.css";

function Character({ id, attributes, skills, setAttributes, setSkills }) {
  // Update attribute functions
  const increaseAttribute = (attribute) => {
    setAttributes((prevAttributes) => ({
      ...prevAttributes,
      [attribute]: prevAttributes[attribute] + 1,
    }));
  };

  const decreaseAttribute = (attribute) => {
    setAttributes((prevAttributes) => ({
      ...prevAttributes,
      [attribute]: prevAttributes[attribute] - 1,
    }));
  };

  // Update skill functions
  const increaseSkill = (skill) => {
    setSkills((prevSkills) => ({
      ...prevSkills,
      [skill]: prevSkills[skill] + 1,
    }));
  };

  const decreaseSkill = (skill) => {
    setSkills((prevSkills) => ({
      ...prevSkills,
      [skill]: prevSkills[skill] - 1,
    }));
  };

  return (
    <div className="character">
      <h2>Character {id}</h2>
      <div>
        <h3>Attributes</h3>
        {Object.keys(attributes).map((key) => (
          <div key={key}>
            <span>
              {key}: {attributes[key]}
            </span>
            <button onClick={() => increaseAttribute(key)}>+</button>
            <button onClick={() => decreaseAttribute(key)}>-</button>
          </div>
        ))}
      </div>
      <div>
        <h3>Skills</h3>
        {Object.keys(skills).map((key) => (
          <div key={key}>
            <span>
              {key}: {skills[key]}
            </span>
            <button onClick={() => increaseSkill(key)}>+</button>
            <button onClick={() => decreaseSkill(key)}>-</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Character;
