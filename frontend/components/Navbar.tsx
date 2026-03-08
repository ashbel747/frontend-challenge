import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-black">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Frontend Challenge
            </h1>
            <ThemeToggle />
        </nav>
    );
}