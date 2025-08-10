import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About the Developer - Fablemaker",
  description: "Learn about the developer behind Fablemaker, a new coder creating educational storytelling tools.",
};

export default function Home() {
  return (
    <div>
      <h1>About the developer</h1>
      <p>The developer is gamingunicorn, a new coder and this is my first website.</p>
    </div>
  );
}
