import Head from "next/head";

const GeneratedStory = ({ story, onBack, resubmit }) => {
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
        <meta property="og:image" content="/path-to-your-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="max-w-md mx-auto p-6 rounded-lg shadow-lg bg-lightBeige text-gray-900">
        <h2 className="font-bold text-2xl mb-4">{title}</h2>
        <p className="whitespace-pre-wrap">{extractedStory}</p>

        <div className="flex justify-between mt-6 space-x-4">
          {/* Back button */}
          <button
            onClick={() => onBack()}
            className="w-full p-3 bg-coralRed rounded hover:bg-softPeach focus:outline-none focus:ring-4 focus:ring-softPeach transition duration-300 transform hover:scale-105"
          >
            back
          </button>

          {/* Refresh button */}
          <button
            onClick={(e) => resubmit(e)}
            className="w-full p-3 bg-warmOrange  rounded hover:bg-lightBeige focus:outline-none focus:ring-4 focus:ring-lightBeige transition duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            re-generate
          </button>
        </div>
      </div>
    </>
  );
};

export default GeneratedStory;
