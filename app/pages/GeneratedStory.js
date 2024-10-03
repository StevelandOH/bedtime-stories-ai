import Head from "next/head";

const GeneratedStory = ({ story, onBack }) => {
  const extractTitleAndStory = (storyText) => {
    const lines = storyText.split("\n");
    const title = lines.find((line) => line.trim() !== "").trim();
    const story = lines.slice(1).join("\n");
    return { title, story };
  };

  const { title, story: extractedStory } = extractTitleAndStory(story);

  return (
    <>
      <Head>
        <title>{title} | BedtimeStories.AI</title>
        <meta
          name="description"
          content={`Read the generated story titled "${title}" created with BedtimeStories.AI.`}
        />
        <meta
          name="keywords"
          content="bedtime story, AI story, children's story, generated story"
        />
        <meta property="og:title" content={title} />
        <meta
          property="og:description"
          content={`Read the generated story titled "${title}" created with BedtimeStories.AI.`}
        />
        <meta property="og:image" content="/path-to-your-image.png" />{" "}
        {/* Update with your image path */}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="max-w-md mx-auto p-6 rounded-lg shadow-lg bg-gray-800 text-white">
        <h2 className="font-bold text-2xl mb-4">{title}</h2>
        <p className="whitespace-pre-wrap text-gray-300">{extractedStory}</p>

        <button
          onClick={onBack}
          className="mt-6 w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400 transition duration-300 transform hover:scale-105"
        >
          Back
        </button>
      </div>
    </>
  );
};

export default GeneratedStory;
