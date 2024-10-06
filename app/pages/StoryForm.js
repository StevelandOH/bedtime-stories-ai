"use client";

import { useState, useEffect } from "react";
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
  const [theme, setTheme] = useState("");
  const [ending, setEnding] = useState("");
  const [age, setAge] = useState("");
  const [storyLength, setStoryLength] = useState("");
  const [story, setStory] = useState("");
  const [newCharacter, setNewCharacter] = useState("");
  const [characterList, setCharacterList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWordCount = (lengthDescription) => {
    const multiplier =
      SELECTOR_DATA.STORY_LENGTH.indexOf(lengthDescription) + 1;
    return multiplier * 200;
  };

  const clearValues = () => {
    setGenre("");
    setTheme("");
    setEnding("");
    setAge("");
    setStoryLength("");
    setStory("");
    setNewCharacter("");
    setCharacterList("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const wordCount = getWordCount(storyLength);
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const prompt = `Write a ${wordCount}-word story for a child aged ${age}. Use a narrator, mark character voices, and add a line break plus an empty line when switching characters. Start the response off with a title for the story on its own line.
    - Genre: ${genre} 
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

  const addNewCharacter = (e) => {
    e.preventDefault();
    if (newCharacter === "") return;
    let updatedCharacters = characterList;
    updatedCharacters.push(newCharacter);
    setCharacterList(updatedCharacters);
    setNewCharacter("");
  };

  const removeCharacterFromList = (e, characterToRemove) => {
    e.preventDefault();
    if (!characterToRemove || !characterList.length) return;
    let updatedCharacters = [];
    characterList.map((character) => {
      if (character != characterToRemove) {
        updatedCharacters.push(character);
      }
    });
    setCharacterList(updatedCharacters);
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
    <div className="mt-10 w-max rounded-xl shadow-[0rem_2rem_1rem_3rem_whiteSmoke] p-8 bg-whiteSmoke">
      <div className="m-2 shadow-[-0.1rem_-0.1rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] rounded-xl">
        <div className="shadow-[0.1rem_0.1rem_0.1rem_0.1rem_rgb(120,120,120,0.1)] drop-shadow-sm bg-whiteSmoke p-3 rounded-xl ">
          {/* FORM */}
          {!loading && !story && (
            <form
              onSubmit={handleSubmit}
              className="font-mono text-darkGrey text-center"
            >
              <div className="m-2 shadow-[-0.1rem_-0.1rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] rounded-2xl">
                <div className="shadow-[0.1rem_0.1rem_0.1rem_0.1rem_rgb(120,120,120,0.1)] drop-shadow-sm bg-whiteSmoke p-3 rounded-2xl grid grid-cols-1 gap-4">
                  {/* Story Length SELECTOR */}
                  <div
                    className={
                      storyLength === ""
                        ? "shadow-[-0.1rem_-0.1rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] rounded-xl transition duration-200"
                        : "shadow-[-0.2rem_-0.1rem_0.2rem_rgb(0,0,0,0.2)] rounded-xl transition duration-200"
                    }
                  >
                    <select
                      disabled={storyLength != ""}
                      id="story-length"
                      value={storyLength}
                      onChange={(e) => setStoryLength(e.target.value)}
                      className={
                        storyLength === ""
                          ? "w-full p-3 rounded-xl font-thin text-center text-xs text-smokeyGrey text-opacity-40 bg-whiteSmoke shadow-[0.1rem_0.1rem_0.1rem_rgb(120,120,120,0.1)] focus:outline-none transition duration-200"
                          : "w-full p-3 rounded-xl font-thin text-center text-xs text-smokeyGrey appearance-none bg-whiteSmoke shadow-[0.2rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] shadow-inner-15 shadow-white  focus:outline-none transition duration-200"
                      }
                      required
                    >
                      <option value="" disabled>
                        choose a story length
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
                        ? "shadow-[-0.1rem_-0.1rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] rounded-xl transition duration-200"
                        : "shadow-[-0.2rem_-0.1rem_0.2rem_rgb(0,0,0,0.2)] rounded-xl transition duration-200"
                    }
                  >
                    <select
                      disabled={age != ""}
                      id="age-range"
                      value={age.toString()}
                      onChange={(e) => setAge(e.target.value)}
                      className={
                        age === ""
                          ? "w-full p-3 rounded-xl font-thin text-center text-xs text-smokeyGrey text-opacity-40 bg-whiteSmoke shadow-[0.1rem_0.1rem_0.1rem_rgb(120,120,120,0.1)] focus:outline-none transition duration-200"
                          : "w-full p-3 rounded-xl font-thin text-center text-xs text-smokeyGrey appearance-none bg-whiteSmoke shadow-[0.2rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] shadow-inner-15 shadow-white  focus:outline-none transition duration-200"
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
                        ? "shadow-[-0.1rem_-0.1rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] rounded-xl transition duration-200"
                        : "shadow-[-0.2rem_-0.1rem_0.2rem_rgb(0,0,0,0.2)] rounded-xl transition duration-200"
                    }
                  >
                    <select
                      disabled={genre != ""}
                      id="story-genre"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className={
                        genre === ""
                          ? "w-full p-3 rounded-xl font-thin text-center text-xs text-smokeyGrey text-opacity-40 bg-whiteSmoke shadow-[0.1rem_0.1rem_0.1rem_rgb(120,120,120,0.1)] focus:outline-none transition duration-200"
                          : "w-full p-3 rounded-xl font-thin text-center text-xs text-smokeyGrey appearance-none bg-whiteSmoke shadow-[0.2rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] shadow-inner-15 shadow-white  focus:outline-none transition duration-200"
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
                        ? "shadow-[-0.1rem_-0.1rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] rounded-xl transition duration-200"
                        : "shadow-[-0.2rem_-0.1rem_0.2rem_rgb(0,0,0,0.2)] rounded-xl transition duration-200"
                    }
                  >
                    <select
                      disabled={theme != ""}
                      id="story-theme"
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className={
                        theme === ""
                          ? "w-full p-3 rounded-xl font-thin text-center text-xs text-smokeyGrey text-opacity-40 bg-whiteSmoke shadow-[0.1rem_0.1rem_0.1rem_rgb(120,120,120,0.1)] focus:outline-none transition duration-200"
                          : "w-full p-3 rounded-xl font-thin text-center text-xs text-smokeyGrey appearance-none bg-whiteSmoke shadow-[0.2rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] shadow-inner-15 shadow-white  focus:outline-none transition duration-200"
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
                        ? "shadow-[-0.1rem_-0.1rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] rounded-xl transition duration-200"
                        : "shadow-[-0.2rem_-0.1rem_0.2rem_rgb(0,0,0,0.2)] rounded-xl transition duration-200"
                    }
                  >
                    <select
                      disabled={ending != ""}
                      id="ending-style"
                      value={ending}
                      onChange={(e) => setEnding(e.target.value)}
                      className={
                        ending === ""
                          ? "w-full p-3 rounded-xl font-thin text-center text-xs text-smokeyGrey text-opacity-40 bg-whiteSmoke shadow-[0.1rem_0.1rem_0.1rem_rgb(120,120,120,0.1)] focus:outline-none transition duration-200"
                          : "w-full p-3 rounded-xl font-thin text-center text-xs text-smokeyGrey appearance-none bg-whiteSmoke shadow-[0.2rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] shadow-inner-15 shadow-white  focus:outline-none transition duration-200"
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
                </div>
              </div>
              <div className="flex shadow-[-0.2rem_-0.1rem_0.2rem_rgb(120,120,120,0.2)] rounded-xl m-6">
                <input
                  required={!characterList.length}
                  style={{ borderRadius: "1rem 0 0 1rem" }}
                  placeholder="character name"
                  type="text"
                  value={newCharacter}
                  onChange={(e) => setNewCharacter(e.target.value)}
                  className="shadow-inner-15 shadow-white bg-whiteSmoke text-center rounded-xl appearance-none w-full shadow-[0.2rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] p-3 focus:outline-none transition duration-200 text-xs text-smokeyGrey text-opacity-40 placeholder-smokeyGrey placeholder-opacity-40"
                />
                <button
                  style={{ borderRadius: "0 1rem 1rem 0" }}
                  onClick={(e) => addNewCharacter(e)}
                  className="px-4 py-1 text-md font-bold text-green-400 bg-smokeWhite"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={5}
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </button>
              </div>
              {/* {characterList.length >= 1 &&
                characterList.map((character, index) => {
                  return (
                    <div className="m-2 shadow-[-0.1rem_-0.1rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] rounded-2xl">
                      <div className="shadow-[0.1rem_0.1rem_0.1rem_0.1rem_rgb(120,120,120,0.1)] drop-shadow-sm bg-whiteSmoke p-3 rounded-2xl grid grid-cols-1 gap-4">
                        <div key={index} className="flex px-4">
                          <div className="bg-whiteSmoke text-mono text-left w-full text-smokeyGrey text-opacity-50 text-xs">
                            {character}
                          </div>
                          <button
                            style={{ borderRadius: "0 1rem 1rem 0" }}
                            onClick={(e) =>
                              removeCharacterFromList(e, character)
                            }
                            className="pl-4 text-md font-bold text-red-400 bg-smokeWhite"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={5}
                              stroke="currentColor"
                              className="size-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 12h14"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })} */}
              <div className="m-2 shadow-[-0.1rem_-0.1rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] rounded-2xl">
                <div className="shadow-[0.1rem_0.1rem_0.1rem_0.1rem_rgb(120,120,120,0.1)] drop-shadow-sm bg-whiteSmoke p-3 rounded-2xl grid grid-cols-1 gap-4">
                  {characterList.length === 0 ? (
                    <p className="bg-whiteSmoke text-mono text-left w-full text-smokeyGrey text-opacity-20 text-xs">
                      no characters to show
                    </p>
                  ) : (
                    <p className="bg-whiteSmoke text-mono text-left w-full text-smokeyGrey text-xs">
                      {characterList.length === 1
                        ? `${characterList.length} character added`
                        : `${characterList.length} characters added`}
                    </p>
                  )}
                </div>
              </div>

              <div className="fixed translate-x-full text-center ml-4">
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
    </div>
  );
};

export default StoryForm;
