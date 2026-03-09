import ThemeToggle from "./ThemeToggle";
import { tokens } from "../tokens/colors";

export default function Navbar() {
  return (
    <nav 
      className="fixed top-0 left-0 right-0 flex items-center justify-between border-b"
      style={{
        zIndex: tokens.layout.navZ,
        paddingLeft: tokens.spacing.navPx,
        paddingRight: tokens.spacing.navPx,
        paddingTop: tokens.spacing.navPy,
        paddingBottom: tokens.spacing.navPy,
        backgroundColor: tokens.colors.bgNav,
        borderColor: tokens.colors.borderSubtle,
      }}
    >
      <h1 
        className="text-xl font-bold"
        style={{ color: tokens.colors.textHeader }}
      >
        Frontend Challenge
      </h1>
      <ThemeToggle />
    </nav>
  );
}