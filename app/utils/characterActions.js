export const addNewCharacter = (e, newCharacter, characters) => {
  e.preventDefault();
  if (newCharacter === "") return;
  let updatedCharacters = characters;
  updatedCharacters.push(newCharacter);
  return updatedCharacters;
};

export const removeCharacterFromList = (e, characterName, characters) => {
  e.preventDefault();
  if (!characterName || !characters.length) return;
  let updatedCharacters = [];
  characters.map((character) => {
    if (character != characterName) {
      updatedCharacters.push(character);
    }
  });
  return updatedCharacters;
};
