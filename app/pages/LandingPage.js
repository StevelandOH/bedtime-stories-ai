import StoryForm from "./StoryForm";

// Exporting the metadata for this specific page
export const metadata = {
  title: "Welcome to BedtimeStories.AI",
  description:
    "Generate personalized bedtime stories for your children with BedtimeStories.AI. Choose genres, themes, and characters to create unique stories.",
  keywords: [
    "bedtime stories",
    "AI stories",
    "children's stories",
    "story generator",
    "personalized stories",
  ],
  openGraph: {
    title: "Welcome to BedtimeStories.AI",
    description:
      "Generate personalized bedtime stories for your children with BedtimeStories.AI.",
    images: [
      {
        url: "/images/og-landing.png", // Update with your image path
        width: 1200,
        height: 630,
        alt: "Bedtime Stories AI Landing Page Image",
      },
    ],
    url: "https://your-domain.com", // Update with your domain
  },
  twitter: {
    card: "summary_large_image",
    title: "Welcome to BedtimeStories.AI",
    description:
      "Generate personalized bedtime stories for your children with BedtimeStories.AI.",
    images: ["/images/og-landing.png"], // Update with your image path
  },
};

const LandingPage = () => {
  return (
    <div>
      <StoryForm />
    </div>
  );
};

export default LandingPage;
