"use client";

import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SELECTOR_TYPES } from "../../lib/selectorData";
import GenerateStoryButton from "../../components/GenerateStoryButton";
import dynamic from "next/dynamic";

const GeneratedStory = dynamic(() => import("../story/page"), {
  ssr: false,
});
const Loading = dynamic(() => import("../Loading"), { ssr: false });

// export const metadata = {
//   title: "Generate Bedtime Stories | BedtimeStories.AI",
//   description:
//     "Create personalized bedtime stories for kids using BedtimeStories.AI. Select genre, theme, and characters, and generate a unique story!",
//   keywords: [
//     "bedtime stories",
//     "AI generated stories",
//     "children's stories",
//     "story generator",
//     "kids storytelling",
//   ],
//   openGraph: {
//     title: "Generate Bedtime Stories | BedtimeStories.AI",
//     description:
//       "Create personalized bedtime stories for kids using BedtimeStories.AI. Choose genre, theme, and characters for a unique adventure!",
//     images: [
//       {
//         url: "/images/og-image.png", // Update this with your image path
//         width: 1200,
//         height: 630,
//         alt: "BedtimeStories.AI Open Graph Image",
//       },
//     ],
//     url: "https://your-domain.com", // Update with your domain
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Generate Bedtime Stories | BedtimeStories.AI",
//     description:
//       "Create personalized bedtime stories for kids using BedtimeStories.AI. Select genre, theme, and characters for a unique story.",
//     images: ["/images/og-image.png"], // Update this with your image path
//   },
// };

const StoryForm = () => {
  const [initialFormState, setInitialFormState] = useState({
    age: "",
    genre: "",
    theme: "",
    length: "",
    ending: "",
    newCharacter: "",
    characterList: [],
    showCharacterList: false,
  });
  const [story, setStory] = useState("");
  const [formState, setFormState] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clearValues = () => {
    setFormState(initialFormState);
    setError("");
    setStory("");
  };

  const handleSubmit = async (e) => {
    let result;
    e.preventDefault();
    setLoading(true);
    setError("");

    const getFormattedCharacters = () => {
      if (!formState.characterList.length) return;
      let characterString = `Main Character: ${formState.characterList[0]}`;
      for (let i = 1; i < formState.characterList.length; i++) {
        characterString += `, Character ${i + 1}: ${
          formState.characterList[i]
        }`;
      }
      return characterString;
    };
    const formattedCharacters = getFormattedCharacters();
    const wordCount =
      (SELECTOR_TYPES.length.indexOf(formState.length) + 1) * 200;
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    const prompt = `Write a ${wordCount}-word story for a child aged ${formState.age}. Use a narrator, mark character voices, and add a line break plus an empty line when switching characters. Start the response off with a title for the story on its own line.
    - Character(s): ${formattedCharacters}
    - Genre: ${formState.genre} 
    - Theme: ${formState.theme} 
    - Ending: ${formState.ending}.`;

    try {
      console.log(prompt);
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
    if (formState.newCharacter === "") return;
    let updatedCharacters = formState.characterList;
    updatedCharacters.push(formState.newCharacter);
    setFormState({
      ...formState,
      characterList: updatedCharacters,
      newCharacter: "",
    });
  };

  const removeCharacterFromList = (e, characterToRemove) => {
    e.preventDefault();
    let updatedCharacters = [];
    formState.characterList.forEach((character) => {
      if (character != characterToRemove) {
        updatedCharacters.push(character);
      }
    });
    const showListBoolean = updatedCharacters.length > 0;
    setFormState({
      ...formState,
      characterList: updatedCharacters,
      showCharacterList: showListBoolean,
    });
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
                  {["age", "genre", "theme", "length", "ending"].map(
                    (currentSelectorValue, idx) => (
                      <div
                        key={idx}
                        className={
                          formState[currentSelectorValue] === ""
                            ? "shadow-[-0.1rem_-0.1rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] rounded-xl transition duration-200"
                            : "shadow-[-0.2rem_-0.1rem_0.2rem_rgb(0,0,0,0.2)] rounded-xl transition duration-200"
                        }
                      >
                        <select
                          disabled={formState[currentSelectorValue] != ""}
                          value={formState[currentSelectorValue]}
                          onChange={(e) => {
                            setFormState({
                              ...formState,
                              [currentSelectorValue]: e.target.value,
                            });
                          }}
                          className={
                            formState[currentSelectorValue] === ""
                              ? "w-full p-3 rounded-xl font-thin text-center text-xs text-smokeyGrey text-opacity-40 bg-whiteSmoke shadow-[0.1rem_0.1rem_0.1rem_rgb(120,120,120,0.1)] focus:outline-none transition duration-200"
                              : "w-full p-3 rounded-xl font-thin text-center text-xs text-smokeyGrey appearance-none bg-whiteSmoke shadow-[0.2rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] shadow-inner-15 shadow-white  focus:outline-none transition duration-200"
                          }
                          required
                        >
                          <option value="" disabled>
                            {`select ${currentSelectorValue}`}
                          </option>
                          {SELECTOR_TYPES[currentSelectorValue].map(
                            (type, idx) => (
                              <option key={idx} value={type}>
                                {type}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="flex shadow-[-0.2rem_-0.1rem_0.2rem_rgb(120,120,120,0.2)] rounded-xl m-6">
                <input
                  required={!formState.characterList.length}
                  style={{ borderRadius: "1rem 0 0 1rem" }}
                  placeholder="character name"
                  type="text"
                  value={formState.newCharacter}
                  onChange={(e) => {
                    setFormState({
                      ...formState,
                      newCharacter: e.target.value,
                    });
                  }}
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

              <div
                onClick={(e) => {
                  e.preventDefault();
                  if (formState.characterList.length) {
                    setFormState({
                      ...formState,
                      showCharacterList: !formState.showCharacterList,
                    });
                  }
                }}
                className="m-2 shadow-[-0.1rem_-0.1rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] rounded-2xl"
              >
                <div className="shadow-[0.1rem_0.1rem_0.1rem_0.1rem_rgb(120,120,120,0.1)] drop-shadow-sm bg-whiteSmoke p-3 rounded-2xl grid grid-cols-1 gap-4">
                  {formState.characterList.length === 0 ? (
                    <p className="cursor-default max-h-content font-thin bg-whiteSmoke text-mono text-center w-full text-whiteSmoke text-opacity-40 text-xs">
                      placeholder text for sizing
                    </p>
                  ) : (
                    <p className="font-thin cursor-pointer text-mono w-full text-smokeyGrey text-opacity-40 text-xs">
                      {formState.showCharacterList === true
                        ? "hide characters"
                        : `show characters (${formState.characterList.length})`}
                    </p>
                  )}
                </div>
              </div>

              {formState.characterList.length >= 1 &&
                formState.showCharacterList === true &&
                formState.characterList.map((character, index) => {
                  return (
                    <div
                      key={index}
                      className="m-2 shadow-[-0.1rem_-0.1rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] rounded-2xl"
                    >
                      <div className="shadow-[0.1rem_0.1rem_0.1rem_0.1rem_rgb(120,120,120,0.1)] drop-shadow-sm bg-whiteSmoke p-3 rounded-2xl grid grid-cols-1 gap-4">
                        <div key={index} className="flex px-4">
                          <div className="bg-whiteSmoke text-mono text-left w-full text-smokeyGrey text-opacity-70 font-thin text-xs">
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
                })}

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
