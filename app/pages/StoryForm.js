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
  const [ending, setEnding] = useState(""); // Ending state now included
  const [age, setAge] = useState("");
  const [storyLength, setStoryLength] = useState("");
  const [step, setStep] = useState(0); // Track current input step
  const [isNextDisabled, setIsNextDisabled] = useState(true); // Disable the Next button until input is valid
  const [showModal, setShowModal] = useState(false); // Show modal with form values for confirmation
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
    setEnding(""); // Reset ending
    setAge("");
    setStoryLength("");
    setStep(0);
    setIsNextDisabled(true);
  };

  const handleSubmit = async () => {
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

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (!text) throw new Error("Failed to fetch story");
      setStory(text);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setShowModal(false); // Close modal after submission
    }
  };

  const handleNext = () => {
    if (step === 6) {
      // On the last step (after selecting ending), show the modal
      setShowModal(true);
    } else {
      // Move to the next input step
      setStep(step + 1);
      setIsNextDisabled(true); // Disable "Next" button until the next input is valid
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setIsNextDisabled(e.target.value === ""); // Enable "Next" button only when input is valid
  };

  const preventFormReset = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form reset when pressing "Enter"
    }
  };

  if (loading) return <Loading />;
  if (story) return <GeneratedStory story={story} onBack={clearValues} />;

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
        <meta property="og:image" content="/images/og-image.png" />
        <meta property="og:url" content="https://your-domain.com" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="max-w-md mx-auto p-6 rounded-lg shadow-lg bg-gray-800 text-white">
        <h1 className="font-bold text-2xl text-center mb-6">
          BedtimeStories.AI
        </h1>

        <form className="space-y-4 text-gray-300" onKeyDown={preventFormReset}>
          {/* Render inputs based on the current step */}
          {step === 0 && (
            <select
              value={storyLength}
              onChange={handleInputChange(setStoryLength)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded"
              required
            >
              <option value="" disabled>
                Select story length
              </option>
              {SELECTOR_DATA.STORY_LENGTH.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </select>
          )}
          {step === 1 && (
            <select
              value={age}
              onChange={handleInputChange(setAge)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded"
              required
            >
              <option value="" disabled>
                Select child's age
              </option>
              {SELECTOR_DATA.AGE_SELECTOR.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </select>
          )}
          {step === 2 && (
            <input
              type="text"
              placeholder="Protagonist's name"
              value={protagonist}
              onChange={handleInputChange(setProtagonist)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded"
              required
            />
          )}
          {step === 3 && (
            <input
              type="text"
              placeholder="Antagonist's name"
              value={antagonist}
              onChange={handleInputChange(setAntagonist)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded"
              required
            />
          )}
          {step === 4 && (
            <select
              value={genre}
              onChange={handleInputChange(setGenre)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded"
              required
            >
              <option value="" disabled>
                Select genre
              </option>
              {SELECTOR_DATA.STORY_TYPES.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </select>
          )}
          {step === 5 && (
            <select
              value={theme}
              onChange={handleInputChange(setTheme)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded"
              required
            >
              <option value="" disabled>
                Select theme
              </option>
              {SELECTOR_DATA.MORALS.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </select>
          )}
          {step === 6 && (
            <select
              value={ending}
              onChange={handleInputChange(setEnding)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded"
              required
            >
              <option value="" disabled>
                Select ending
              </option>
              {SELECTOR_DATA.ENDING_TYPES.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </select>
          )}

          {/* Next button */}
          <button
            type="button"
            className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleNext}
            disabled={isNextDisabled}
          >
            {step === 6 ? "Review" : "Next"}
          </button>
        </form>

        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>

      {/* Modal for reviewing the form values */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-gray-800">
            <h2 className="text-xl font-bold mb-4">Review Your Selections</h2>
            <p>
              <strong>Story Length:</strong> {storyLength}
            </p>
            <p>
              <strong>Age:</strong> {age}
            </p>
            <p>
              <strong>Protagonist:</strong> {protagonist}
            </p>
            <p>
              <strong>Antagonist:</strong> {antagonist}
            </p>
            <p>
              <strong>Genre:</strong> {genre}
            </p>
            <p>
              <strong>Theme:</strong> {theme}
            </p>
            <p>
              <strong>Ending:</strong> {ending}
            </p>

            <div className="mt-6 flex justify-between">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleSubmit}
              >
                Generate
              </button>
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                onClick={clearValues}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StoryTeller;
