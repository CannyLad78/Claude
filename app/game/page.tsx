import MandoGame from "@/components/game/MandoGame";

export const metadata = {
  title: "The Mandalorian — CYOA Deck Builder",
  description: "A text-based choose your own adventure game set in the Mandalorian universe, with deck building combat.",
};

export default function GamePage() {
  return <MandoGame />;
}
