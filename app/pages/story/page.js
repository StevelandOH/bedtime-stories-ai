"use client";

import Link from "next/link";

const GeneratedStory = ({ story, onBack, resubmit }) => {
  const extractTitleAndStory = (storyText) => {
    if (!storyText) return { title: "", story: "" };
    const lines = storyText.split("\n");
    const title = lines.find((line) => line.trim() !== "")?.trim() || "";
    const storyBody = lines.slice(1).join("\n");
    return { title, story: storyBody };
  };

  const { title, story: extractedStory } = extractTitleAndStory(story || "");

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg shadow-lg">
      <h2 className="font-bold text-2xl mb-4">{title || ""}</h2>
      <p className="whitespace-pre-wrap">{extractedStory || ""}</p>

      <div className="flex justify-between mt-6 space-x-4">
        {/* Back button */}
        <Link
          href="/story-generator"
          className="w-full p-3 bg-coralRed rounded hover:bg-softPeach focus:outline-none focus:ring-4 focus:ring-softPeach transition duration-300 transform hover:scale-105"
        >
          back
        </Link>

        {/* Refresh button */}
        <button
          onClick={(e) => resubmit(e)}
          className="w-full p-3 bg-warmOrange rounded hover:bg-lightBeige focus:outline-none focus:ring-4 focus:ring-lightBeige transition duration-300 transform hover:scale-105 flex items-center justify-center"
        >
          re-generate
        </button>
      </div>
    </div>
  );
};

export default GeneratedStory;
