"use client";

import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SELECTOR_DATA } from "../lib/selectorData";
import GenerateStoryButton from "../components/GenerateStoryButton";
import dynamic from "next/dynamic";

const GeneratedStory = dynamic(() => import("./GeneratedStory"), {
  ssr: false,
});
const Loading = dynamic(() => import("./Loading"), { ssr: false });

export const metadata = {
  title: "Generate Bedtime Stories | BedtimeStories.AI",
  description:
    "Create personalized bedtime stories for kids using BedtimeStories.AI. Select genre, theme, and characters, and generate a unique story!",
  keywords: [
    "bedtime stories",
    "AI generated stories",
    "children's stories",
    "story generator",
    "kids storytelling",
  ],
  openGraph: {
    title: "Generate Bedtime Stories | BedtimeStories.AI",
    description:
      "Create personalized bedtime stories for kids using BedtimeStories.AI. Choose genre, theme, and characters for a unique adventure!",
    images: [
      {
        url: "/images/og-image.png", // Update this with your image path
        width: 1200,
        height: 630,
        alt: "BedtimeStories.AI Open Graph Image",
      },
    ],
    url: "https://your-domain.com", // Update with your domain
  },
  twitter: {
    card: "summary_large_image",
    title: "Generate Bedtime Stories | BedtimeStories.AI",
    description:
      "Create personalized bedtime stories for kids using BedtimeStories.AI. Select genre, theme, and characters for a unique story.",
    images: ["/images/og-image.png"], // Update this with your image path
  },
};

const StoryForm = () => {
  const [genre, setGenre] = useState("");
  const [characterOne, setCharacterOne] = useState("");
  const [characterTwo, setCharacterTwo] = useState("");
  const [characterThree, setCharacterThree] = useState("");
  const [characterFour, setCharacterFour] = useState("");
  const [theme, setTheme] = useState("");
  const [ending, setEnding] = useState("");
  const [age, setAge] = useState("");
  const [storyLength, setStoryLength] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newCharacter, setNewCharacter] = useState("");
  const [characters, setCharacters] = useState([]);

  const getWordCount = (lengthDescription) => {
    const multiplier =
      SELECTOR_DATA.STORY_LENGTH.indexOf(lengthDescription) + 1;
    return multiplier * 200;
  };

  const clearValues = () => {
    setGenre("");
    setCharacterOne("");
    setCharacterTwo("");
    setCharacterThree("");
    setCharacterFour("");
    setTheme("");
    setEnding("");
    setAge("");
    setStoryLength("");
    setStory("");
  };

  const addNewCharacter = (e) => {
    e.preventDefault();
    if (newCharacter === "") return;
    let updatedCharacters = characters;
    updatedCharacters.push(newCharacter);
    setCharacters(updatedCharacters);
    setNewCharacter("");
  };

  const removeCharacterFromList = (e, characterName) => {
    e.preventDefault();
    if (!characterName || !characters.length) return;
    let updatedCharacters = [];
    characters.map((character) => {
      if (character != characterName) {
        updatedCharacters.push(character);
      }
    });
    setCharacters(updatedCharacters);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const wordCount = getWordCount(storyLength);
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const prompt = `Write a ${wordCount}-word story for a child aged ${age}. Use a narrator, mark character voices, and add a line break plus an empty line when switching characters. Start the response off with a title for the story on its own line.
    - Genre: ${genre} 
    - Character 1: ${characterOne} 
    - Character 2: ${characterTwo} 
    - Character 3: ${characterThree} 
    - Character 4: ${characterFour} 
    - Theme: ${theme} 
    - Ending: ${ending}.`;

    let result;

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      result = await model.generateContent(prompt);
      const text = result.response.text();
      if (!text) {
        throw new Error("Failed to fetch story");
      }
      setStory(text);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (story)
    return (
      <GeneratedStory
        story={story}
        onBack={() => clearValues()}
        resubmit={(e) => handleSubmit(e)}
      />
    );

  return (
    <div className="max-w-sm mx-auto rounded-3xl shadow-[0.1rem_0.1rem_0.3rem_0.1rem_rgb(0,0,0,0.1)]">
      <div className="max-w-lg mx-auto p-6 rounded-3xl shadow-[-0.1rem_-0.1rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] bg-whiteSmoke">
        {/*  TITLE  */}
        {!loading && (
          <h1 className="text-right font-mono text-smokeyGrey text-opacity-30 text-xs mb-10">
            story generator
          </h1>
        )}
        {/*  STORY FORM  */}
        {!loading && !story && (
          <form
            onSubmit={handleSubmit}
            className="font-mono text-darkGrey text-center grid grid-cols-1 gap-4"
          >
            <div className="flex shadow-[-0.2rem_-0.1rem_0.2rem_rgb(0,0,0,0.2)] rounded-full">
              <input
                required={!characters.length}
                style={{ borderRadius: "1rem 0 0 1rem" }}
                placeholder="character name"
                type="text"
                value={newCharacter}
                onChange={(e) => setNewCharacter(e.target.value)}
                className={
                  newCharacter === ""
                    ? "bg-whiteSmoke placeholder-smokeyGrey placeholder-opacity-40 text-center shadow-[0.2rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] appearance-none w-full shadow-inner-15 shadow-white p-3 focus:outline-none transition-duration-200 text-xs"
                    : "bg-whiteSmoke text-center text-smokeyGrey text-opacity-40 appearance-none w-full shadow-[0.2rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] p-3 appearance-none w-full shadow-inner-15 shadow-white focus:outline-none transition-duration-200 text-xs font-bold"
                }
              />
              <button
                style={{ borderRadius: "0 1rem 1rem 0" }}
                onClick={(e) => addNewCharacter(e)}
                className="px-4 py-1 text-md font-bold text-green-400 bg-smokeWhite"
              >
                +
              </button>
            </div>
            <div>
              {characters.length &&
                characters.map((character, index) => {
                  return (
                    <div className="flex">
                      <div className="bg-whiteSmoke text-mono text-left w-full text-smokeyGrey text-opacity-60 text-xs font-bold">
                        {character}
                      </div>
                      <button
                        style={{ borderRadius: "0 1rem 1rem 0" }}
                        onClick={(e) => removeCharacterFromList(e, character)}
                        className="px-4 text-md font-bold text-red-400 bg-smokeWhite"
                      >
                        -
                      </button>
                    </div>
                  );
                })}
            </div>
            {/* Add new character INPUT */}

            {/* Story Length SELECTOR */}
            <div
              className={
                storyLength === ""
                  ? "shadow-[0.1rem_0.1rem_0.1rem_0.1rem_rgb(0,0,0,0.1)] rounded-full transition duration-200"
                  : "shadow-[-0.2rem_-0.1rem_0.2rem_rgb(0,0,0,0.2)] rounded-full transition duration-200"
              }
            >
              <select
                disabled={storyLength != ""}
                id="story-length"
                value={storyLength}
                onChange={(e) => setStoryLength(e.target.value)}
                className={
                  storyLength === ""
                    ? "text-center w-full shadow-[-0.2rem_-0.1rem_0.1rem_rgb(255,255,255,0.8)] p-3 rounded-full focus:outline-none transition duration-200 text-xs text-smokeyGrey text-opacity-40 bg-whiteSmoke"
                    : "shadow-inner-15 shadow-white bg-whiteSmoke text-center rounded-full appearance-none w-full shadow-[0.2rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] p-3 focus:outline-none transition duration-200 text-xs font-bold text-smokeyGrey text-opacity-60"
                }
                required
              >
                <option value="" disabled>
                  choose a length for the story
                </option>
                {SELECTOR_DATA.STORY_LENGTH.map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Age Range SELECTOR */}
            <div
              className={
                age === ""
                  ? "shadow-[0.1rem_0.1rem_0.1rem_0.1rem_rgb(0,0,0,0.1)] rounded-full transition duration-200"
                  : "shadow-[-0.2rem_-0.1rem_0.2rem_rgb(0,0,0,0.2)] rounded-full transition duration-200"
              }
            >
              <select
                disabled={age != ""}
                id="age-range"
                value={age.toString()}
                onChange={(e) => setAge(e.target.value)}
                className={
                  age === ""
                    ? "text-center w-full shadow-[-0.2rem_-0.1rem_0.1rem_rgb(255,255,255,0.8)] p-3 rounded-full focus:outline-none transition duration-200 text-xs text-smokeyGrey text-opacity-40 bg-whiteSmoke"
                    : "shadow-inner-15 shadow-white bg-whiteSmoke text-center rounded-full appearance-none w-full shadow-[0.2rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] p-3 focus:outline-none transition duration-200 text-xs font-bold text-smokeyGrey text-opacity-60"
                }
                required
              >
                <option value="" disabled>
                  choose an age range
                </option>
                {SELECTOR_DATA.AGE_SELECTOR.map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Genre SELECTOR*/}
            <div
              className={
                genre === ""
                  ? "shadow-[0.1rem_0.1rem_0.1rem_0.1rem_rgb(0,0,0,0.1)] rounded-full transition duration-200"
                  : "shadow-[-0.2rem_-0.1rem_0.2rem_rgb(0,0,0,0.2)] rounded-full transition duration-200"
              }
            >
              <select
                disabled={genre != ""}
                id="story-genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className={
                  genre === ""
                    ? "text-center w-full shadow-[-0.2rem_-0.1rem_0.1rem_rgb(255,255,255,0.8)] p-3 rounded-full focus:outline-none transition duration-200 text-xs text-smokeyGrey text-opacity-40 bg-whiteSmoke"
                    : "shadow-inner-15 shadow-white bg-whiteSmoke text-center rounded-full appearance-none w-full shadow-[0.2rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] p-3 focus:outline-none transition duration-200 text-xs font-bold text-smokeyGrey text-opacity-60"
                }
                required
              >
                <option value="" disabled>
                  choose a genre
                </option>
                {SELECTOR_DATA.STORY_TYPES.map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme SELECTOR*/}
            <div
              className={
                theme === ""
                  ? "shadow-[0.1rem_0.1rem_0.1rem_0.1rem_rgb(0,0,0,0.1)] rounded-full transition duration-200"
                  : "shadow-[-0.2rem_-0.1rem_0.2rem_rgb(0,0,0,0.2)] rounded-full transition duration-200"
              }
            >
              <select
                disabled={theme != ""}
                id="story-theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className={
                  theme === ""
                    ? "text-center w-full shadow-[-0.2rem_-0.1rem_0.1rem_rgb(255,255,255,0.8)] p-3 rounded-full focus:outline-none transition duration-200 text-xs text-smokeyGrey text-opacity-40 bg-whiteSmoke"
                    : "shadow-inner-15 shadow-white bg-whiteSmoke text-center rounded-full appearance-none w-full shadow-[0.2rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] p-3 focus:outline-none transition duration-200 text-xs font-bold text-smokeyGrey text-opacity-60"
                }
                required
              >
                <option value="" disabled>
                  choose a theme
                </option>
                {SELECTOR_DATA.MORALS.map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Ending Style SELECTOR*/}
            <div
              className={
                ending === ""
                  ? "shadow-[0.1rem_0.1rem_0.1rem_0.1rem_rgb(0,0,0,0.1)] rounded-full transition duration-200"
                  : "shadow-[-0.2rem_-0.1rem_0.2rem_rgb(0,0,0,0.2)] rounded-full transition duration-200"
              }
            >
              <select
                disabled={ending != ""}
                id="ending-style"
                value={ending}
                onChange={(e) => setEnding(e.target.value)}
                className={
                  ending === ""
                    ? "text-center w-full shadow-[-0.2rem_-0.1rem_0.1rem_rgb(255,255,255,0.8)] p-3 rounded-full focus:outline-none transition duration-200 text-xs text-smokeyGrey text-opacity-40 bg-whiteSmoke"
                    : "shadow-inner-15 shadow-white bg-whiteSmoke text-center rounded-full appearance-none w-full shadow-[0.2rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] p-3 focus:outline-none transition duration-200 text-xs font-bold text-smokeyGrey text-opacity-60"
                }
                required
              >
                <option value="" disabled>
                  choose an ending style
                </option>
                {SELECTOR_DATA.ENDING_TYPES.map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-center mt-4">
              <button
                type="submit"
                className="rounded-full border-none focus:outline-none shadow-[0.1rem_0.1rem_0.2rem_rgb(0,0,0,0.2)] "
              >
                <GenerateStoryButton />
              </button>
            </div>
          </form>
        )}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default StoryForm;
