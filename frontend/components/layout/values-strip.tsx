const values = [
  {
    title: "Solid hardwood",
    body: "No veneers, no particleboard. Every frame is kiln-dried walnut, oak, or ash.",
  },
  {
    title: "Hand joinery",
    body: "Mortise-and-tenon joints assembled by cabinet makers, not staples or glue alone.",
  },
  {
    title: "10-year guarantee",
    body: "We stand behind the frame construction of every piece we sell.",
  },
];

export function ValuesStrip() {
  return (
    <section className="border-y border-border-subtle bg-surface-muted py-16">
      <div className="container-page grid gap-10 md:grid-cols-3">
        {values.map((value) => (
          <div key={value.title}>
            <h3 className="font-serif text-xl text-charcoal">{value.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{value.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
