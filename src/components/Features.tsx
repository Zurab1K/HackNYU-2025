import { useReveal } from "../hooks/useReveal";

const features = [
  {
    title: "Tiny rituals",
    icon: "🌱",
    copy: "Drop in, declare what you'll try, and check back later. That's it. No dashboards or sales talk."
  },
  {
    title: "Gentle nudges",
    icon: "💌",
    copy: "Personal prompts and co-op dares that nudge you without yelling. Friends cheer, not chase."
  },
  {
    title: "Micro victories",
    icon: "✨",
    copy: "Celebrate the small wins with cozy streaks, emoji reactions, and screenshots worth sharing."
  }
];

function FeatureCard({ title, icon, copy }: (typeof features)[number]) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <article ref={ref} className="feature-card reveal">
      <div className="icon" role="img" aria-label={title}>
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{copy}</p>
    </article>
  );
}

export function Features() {
  return (
    <section id="features" className="section features">
      <div className="section__header">
        <p className="eyebrow">Just enough structure</p>
        <h2>It's a side project keeping our friends honest about movement.</h2>
      </div>
      <div className="features__grid">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}
