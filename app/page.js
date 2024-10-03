import LandingPage from "./pages/LandingPage";

export default function Home() {
  return (
    <div className="p-8 bg-softPeach font-[family-name:var(--font-geist-sans)] min-h-screen">
      <main className="shadow-neumorphism p-6 bg-softPeach rounded-lg">
        <LandingPage />
      </main>
      <footer
        style={{ visibility: "hidden" }}
        className="row-start-3 flex gap-6 flex-wrap items-center justify-center"
      ></footer>
    </div>
  );
}
