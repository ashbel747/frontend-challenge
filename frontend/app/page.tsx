import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <Navbar />
      <main className="flex min-h-screen items-center justify-center pt-16">
        Main page content
      </main>
    </div>
  );
}