"use client";

import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SELECTOR_DATA } from "../lib/selectorData";
import dynamic from "next/dynamic";
import Head from "next/head";

const GeneratedStory = dynamic(() => import("./GeneratedStory"), {
  ssr: false,
});
const Loading = dynamic(() => import("./Loading"), { ssr: false });

const StoryTeller = () => {
  const [genre, setGenre] = useState("");
  const [protagonist, setProtagonist] = useState("");
  const [antagonist, setAntagonist] = useState("");
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
    setProtagonist("");
    setAntagonist("");
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
    - Main Character: ${protagonist} 
    - Antagonist: ${antagonist} 
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
    return <GeneratedStory story={story} onBack={() => clearValues()} />;

  return (
    <>
      <Head>
        <title>Generate Bedtime Stories | BedtimeStories.AI</title>
        <meta
          name="description"
          content="Create personalized bedtime stories for kids using BedtimeStories.AI. Select genre, theme, and characters, and generate a unique story!"
        />
        <meta
          name="keywords"
          content="bedtime stories, AI generated stories, children's stories, story generator, kids storytelling"
        />
        <meta
          property="og:title"
          content="Generate Bedtime Stories | BedtimeStories.AI"
        />
        <meta
          property="og:description"
          content="Create personalized bedtime stories for kids using BedtimeStories.AI. Choose genre, theme, and characters for a unique adventure!"
        />
        <meta property="og:image" content="/images/og-image.png" />{" "}
        {/* Update with your image path */}
        <meta property="og:url" content="https://your-domain.com" />{" "}
        {/* Update with your domain */}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="max-w-md mx-auto p-6 rounded-lg shadow-lg bg-gray-800 text-white">
        {!loading && (
          <h1 className="font-bold text-2xl text-center sm:text-left mb-6 font-[family-name:var(--font-geist-mono)]">
            BedtimeStories.AI
          </h1>
        )}
        {!loading && !story && (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 text-gray-300 font-[family-name:var(--font-geist-mono)]"
          >
            <select
              value={storyLength}
              onChange={(e) => setStoryLength(e.target.value)}
              className={
                age === ""
                  ? "text-gray-400 w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                  : "w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              }
              required
            >
              <option value="" disabled>
                story length
              </option>
              {SELECTOR_DATA.STORY_LENGTH.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              value={age.toString()}
              onChange={(e) => setAge(e.target.value)}
              className={
                age === ""
                  ? "text-gray-400 w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                  : "w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              }
              required
            >
              <option value="" disabled>
                child's age
              </option>
              {SELECTOR_DATA.AGE_SELECTOR.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="protagonist's name"
              value={protagonist}
              onChange={(e) => setProtagonist(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              required
            />
            <input
              type="text"
              placeholder="antagonist's name"
              value={antagonist}
              onChange={(e) => setAntagonist(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              required
            />
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className={
                genre === ""
                  ? "text-gray-400 w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                  : "w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              }
              required
            >
              <option value="" disabled>
                select genre
              </option>
              {SELECTOR_DATA.STORY_TYPES.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className={
                theme === ""
                  ? "text-gray-400 w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                  : "w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              }
              required
            >
              <option value="" disabled>
                select theme
              </option>
              {SELECTOR_DATA.MORALS.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              value={ending}
              onChange={(e) => setEnding(e.target.value)}
              className={
                ending === ""
                  ? "text-gray-400 w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                  : "w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              }
              required
            >
              <option value="" disabled>
                select ending
              </option>
              {SELECTOR_DATA.ENDING_TYPES.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400 transition duration-300 transform hover:scale-105"
            >
              Generate Story
            </button>
          </form>
        )}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </>
  );
};

export default StoryTeller;
