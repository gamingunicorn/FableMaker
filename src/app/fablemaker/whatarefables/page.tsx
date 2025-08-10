import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What Are Fables? - Fablemaker",
  description: "Learn about fables, their history, and the famous storyteller Aesop who created timeless moral tales.",
};

export default function Home() {
  return (
    <div>
      <h1>What are fables?</h1>
      <p>Fables are short stories that typically feature animals as characters 
        and convey moral lessons. These tales often use simple narratives 
        to highlight human virtues or flaws, teaching lessons about wisdom, 
        kindness, honesty, and more. Aesop, an ancient Greek storyteller 
        believed to have lived around the 6th century BCE, is one of the
        most famous creators of fables. His collection of stories, known 
        as Aesop's Fables, has been passed down through generations and 
        remains widely read today. Each fable usually concludes with a 
        clear moral, such as "Slow and steady wins the race" or "Don't
        count your chickens before they hatch." Aesop's work has had a
        lasting impact on literature and education, demonstrating the
        power of storytelling to impart valuable life lessons to both 
        children and adults.
      </p>
    </div>
  );
}
