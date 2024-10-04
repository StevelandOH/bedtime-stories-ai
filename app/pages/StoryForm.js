"use client";

import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SELECTOR_DATA } from "../lib/selectorData";
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
    <div className="max-w-lg mx-auto rounded-3xl shadow-[0.1rem_0.1rem_.1rem_rgb(0,0,0,0.2)]">
      <div className="max-w-lg mx-auto px-6 py-2 rounded-3xl shadow-[-0.2rem_-0.1rem_0.1rem_rgb(255,255,255,0.8)] bg-whiteSmoke">
        {!loading && (
          <h1 className="text-center font-mono text-smokeyGrey text-bold text-xs py-12 mb-8">
            BedtimeStories.AI
          </h1>
        )}
        {!loading && !story && (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 font-mono text-darkGrey"
          >
            <div className="grid grid-cols-2 gap-4 mb-12 px-12">
              {/* Character 1 Input */}
              <div className="shadow-[-0.1rem_-0.1rem_.1rem_rgb(0,0,0,0.2)] rounded-full">
                <input
                  id="character-one"
                  placeholder="character one"
                  type="text"
                  value={characterOne}
                  onChange={(e) => setCharacterOne(e.target.value)}
                  className="bg-whiteSmoke placeholder-coolGray text-mono text-center appearance-none w-full shadow-[0.2rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white transition duration-200 text-smokeyGrey text-xs"
                  required
                />
              </div>

              {/* Character 2 Input */}
              <div className="shadow-[-0.1rem_-0.1rem_.1rem_rgb(0,0,0,0.2)] rounded-full">
                <input
                  placeholder="character two"
                  id="character-two"
                  type="text"
                  value={characterTwo}
                  onChange={(e) => setCharacterTwo(e.target.value)}
                  className="bg-whiteSmoke placeholder-coolGray text-mono text-center appearance-none w-full shadow-[0.2rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white transition duration-200 text-smokeyGrey text-xs"
                />
              </div>

              {/* Character 3 Input */}
              <div className="shadow-[-0.1rem_-0.1rem_.1rem_rgb(0,0,0,0.2)] rounded-full">
                <input
                  placeholder="character three"
                  id="character-three"
                  type="text"
                  value={characterThree}
                  onChange={(e) => setCharacterThree(e.target.value)}
                  className="bg-whiteSmoke placeholder-coolGray text-mono text-center appearance-none w-full shadow-[0.2rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white transition duration-200 text-smokeyGrey text-xs"
                />
              </div>

              {/* Character 4 Input */}
              <div className="shadow-[-0.1rem_-0.1rem_.1rem_rgb(0,0,0,0.2)] rounded-full">
                <input
                  placeholder="character four"
                  id="character-four"
                  type="text"
                  value={characterFour}
                  onChange={(e) => setCharacterFour(e.target.value)}
                  className="bg-whiteSmoke placeholder-coolGray text-mono text-center appearance-none w-full shadow-[0.2rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white transition duration-200 text-smokeyGrey text-xs"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="w-full text-center px-12 ">
              <button
                type="submit"
                className="m-1 text-center text-whiteSmoke font-bold px-5 py-10 rounded-full bg-indigo-400 border-none focus:outline-none focus:ring-2 focus:ring-white transition duration-300 text-xs"
              >
                generate
              </button>
            </div>

            {/* Dropdown Selectors */}
            <div className="grid grid-cols-2 gap-4 p-10 text-center">
              {/* Story Length */}
              <div
                className={
                  storyLength === ""
                    ? "shadow-[0.1rem_0.1rem_.1rem_rgb(0,0,0,0.2)] rounded-full"
                    : "shadow-[-0.1rem_-0.1rem_.1rem_rgb(0,0,0,0.2)] rounded-full"
                }
              >
                <select
                  disabled={storyLength != ""}
                  id="story-length"
                  value={storyLength}
                  onChange={(e) => setStoryLength(e.target.value)}
                  className={
                    storyLength === ""
                      ? "text-center w-full shadow-[-0.2rem_-0.1rem_0.1rem_rgb(255,255,255,0.8)] p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white transition duration-200 text-xs text-coolGray bg-whiteSmoke"
                      : "text-center appearance-none w-full shadow-[0.2rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white transition duration-200 text-xs text-smokeyGray bg-whiteSmoke"
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

              {/* Age Range */}
              <div
                className={
                  age === ""
                    ? "shadow-[0.1rem_0.1rem_.1rem_rgb(0,0,0,0.2)] rounded-full"
                    : "shadow-[-0.1rem_-0.1rem_.1rem_rgb(0,0,0,0.2)] rounded-full"
                }
              >
                <select
                  disabled={age != ""}
                  id="age-range"
                  value={age.toString()}
                  onChange={(e) => setAge(e.target.value)}
                  className={
                    age === ""
                      ? "text-center w-full shadow-[-0.2rem_-0.1rem_0.1rem_rgb(255,255,255,0.8)] p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white transition duration-200 text-xs text-coolGray bg-whiteSmoke"
                      : "text-center appearance-none w-full shadow-[0.2rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white transition duration-200 text-xs text-smokeyGray bg-whiteSmoke"
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

              {/* Genre */}
              <div
                className={
                  genre === ""
                    ? "shadow-[0.1rem_0.1rem_.1rem_rgb(0,0,0,0.2)] rounded-full"
                    : "shadow-[-0.1rem_-0.1rem_.1rem_rgb(0,0,0,0.2)] rounded-full"
                }
              >
                <select
                  disabled={genre != ""}
                  id="story-genre"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className={
                    genre === ""
                      ? "text-center w-full shadow-[-0.2rem_-0.1rem_0.1rem_rgb(255,255,255,0.8)] p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white transition duration-200 text-xs text-coolGray bg-whiteSmoke"
                      : "text-center appearance-none w-full shadow-[0.2rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white transition duration-200 text-xs text-smokeyGray bg-whiteSmoke"
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

              {/* Theme */}
              <div
                className={
                  theme === ""
                    ? "shadow-[0.1rem_0.1rem_.1rem_rgb(0,0,0,0.2)] rounded-full"
                    : "shadow-[-0.1rem_-0.1rem_.1rem_rgb(0,0,0,0.2)] rounded-full"
                }
              >
                <select
                  disabled={theme != ""}
                  id="story-theme"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className={
                    theme === ""
                      ? "text-center w-full shadow-[-0.2rem_-0.1rem_0.1rem_rgb(255,255,255,0.8)] p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white transition duration-200 text-xs text-coolGray bg-whiteSmoke"
                      : "text-center appearance-none w-full shadow-[0.2rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white transition duration-200 text-xs text-smokeyGray bg-whiteSmoke"
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

              {/* Ending Style */}
              <div
                className={
                  ending === ""
                    ? "shadow-[0.1rem_0.1rem_.1rem_rgb(0,0,0,0.2)] rounded-full"
                    : "shadow-[-0.1rem_-0.1rem_.1rem_rgb(0,0,0,0.2)] rounded-full"
                }
              >
                <select
                  disabled={ending != ""}
                  id="ending-style"
                  value={ending}
                  onChange={(e) => setEnding(e.target.value)}
                  className={
                    ending === ""
                      ? "text-center w-full shadow-[-0.2rem_-0.1rem_0.1rem_rgb(255,255,255,0.8)] p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white transition duration-200 text-xs text-coolGray bg-whiteSmoke"
                      : "text-center appearance-none w-full shadow-[0.2rem_0.1rem_0.1rem_rgb(255,255,255,0.8)] p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white transition duration-200 text-xs text-smokeyGray bg-whiteSmoke"
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
          </form>
        )}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default StoryForm;
