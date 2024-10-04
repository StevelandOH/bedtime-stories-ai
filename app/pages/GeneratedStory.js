export const metadata = {
  title: `${title} | BedtimeStories.AI`,
  description: `Read the generated story titled "${title}" created with BedtimeStories.AI.`,
  keywords: [
    "bedtime story",
    "AI story",
    "children's story",
    "generated story",
  ],
  openGraph: {
    title: `${title} | BedtimeStories.AI`,
    description: `Read the generated story titled "${title}" created with BedtimeStories.AI.`,
    images: [
      {
        url: "/path-to-your-image.png", // Update this with the actual path
        width: 1200,
        height: 630,
        alt: "Generated Story Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | BedtimeStories.AI`,
    description: `Read the generated story titled "${title}" created with BedtimeStories.AI.`,
    images: ["/path-to-your-image.png"], // Update this with the actual path
  },
};

const GeneratedStory = ({ story, onBack, resubmit }) => {
  const extractTitleAndStory = (storyText) => {
    const lines = storyText.split("\n");
    const title = lines.find((line) => line.trim() !== "").trim();
    const story = lines.slice(1).join("\n");
    return { title, story };
  };

  const { title, story: extractedStory } = extractTitleAndStory(story);

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg shadow-lg">
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
          className="w-full p-3 bg-warmOrange rounded hover:bg-lightBeige focus:outline-none focus:ring-4 focus:ring-lightBeige transition duration-300 transform hover:scale-105 flex items-center justify-center"
        >
          re-generate
        </button>
      </div>
    </div>
  );
};

export default GeneratedStory;
