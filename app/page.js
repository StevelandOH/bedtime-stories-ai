import LandingPage from "./pages/LandingPage";

export default function Home() {
  return (
    <div className="p-8 bg-whiteSmoke font-[family-name:var(--font-geist-sans)] min-h-screen">
      <main className="p-8">
        <LandingPage />
      </main>
      <footer
        style={{ visibility: "hidden" }}
        className="row-start-3 flex gap-6 flex-wrap items-center justify-center"
      ></footer>
    </div>
  );
}
