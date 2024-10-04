import LandingPage from "./pages/LandingPage";

export default function Home() {
  return (
    <div className="flex items-center justify-center bg-gradient-to-tl from-pastelLime via-pastelPeach to-pastelPurple font-[family-name:var(--font-geist-sans)] min-h-screen">
      <main>
        <LandingPage />
      </main>
      <footer
        style={{ visibility: "hidden" }}
        className="row-start-3 flex gap-6 flex-wrap items-center justify-center"
      ></footer>
    </div>
  );
}
