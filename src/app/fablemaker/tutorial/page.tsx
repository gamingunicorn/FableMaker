import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tutorial - How to Use Fablemaker",
  description: "Learn how to create your own fables by selecting animals, settings, and morals on Fablemaker.",
};

export default function Home() {
  return (
    <div>
      <h1>Tutorial</h1>
      <p>On this website, you can create your own fables by selecting two animals,
         one setting, and a moral. With these elements, you can generate a 
         unique fable every time, combining different animals, settings, and morals
         to create a new story with a meaningful message.
      </p>
    </div>
  );
}
