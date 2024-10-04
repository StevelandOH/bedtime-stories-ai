import LandingPage from "./pages/LandingPage";

export default function Home() {
  return (
    <div className="p-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-[family-name:var(--font-geist-sans)] min-h-screen">
      <main className="p-6 rounded-lg">
        <LandingPage />
      </main>
      <footer
        style={{ visibility: "hidden" }}
        className="row-start-3 flex gap-6 flex-wrap items-center justify-center"
      ></footer>
    </div>
  );
}
