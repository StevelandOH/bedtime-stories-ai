import Head from "next/head";
import StoryForm from "./StoryForm";

const LandingPage = () => {
  return (
    <>
      <Head>
        <title>Welcome to BedtimeStories.AI</title>
        <meta
          name="description"
          content="Generate personalized bedtime stories for your children with BedtimeStories.AI. Choose genres, themes, and characters to create unique stories."
        />
        <meta
          name="keywords"
          content="bedtime stories, AI stories, children's stories, story generator, personalized stories"
        />
        <meta property="og:title" content="Welcome to BedtimeStories.AI" />
        <meta
          property="og:description"
          content="Generate personalized bedtime stories for your children with BedtimeStories.AI."
        />
        <meta property="og:image" content="/images/og-landing.png" />{" "}
        {/* Update with your image path */}
        <meta property="og:url" content="https://your-domain.com" />{" "}
        {/* Update with your domain */}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <StoryForm />
    </>
  );
};

export default LandingPage;
