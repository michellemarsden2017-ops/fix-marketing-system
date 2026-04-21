export default function Home() {
  return (
    <main className="min-h-screen bg-[#f3efef] flex items-center justify-center px-6 py-16">
      <div className="max-w-2xl w-full text-center">

        {/* Top label */}
        <p className="text-xs tracking-[0.2em] uppercase text-[#62493c] mb-4">
          GlowSpark Digital
        </p>

        {/* Headline */}
        <h1 className="text-3xl md:text-4xl font-semibold text-[#0d0b09] mb-6 leading-tight">
          Fix your marketing system
          <br />
          <span className="text-[#62493c]">(in 10 minutes)</span>
        </h1>

        {/* Subheadline */}
        <p className="text-base md:text-lg text-[#2a1f1c] mb-8 leading-relaxed">
          This is not about doing more.
          <br />
          It’s about seeing where your setup is making marketing harder to trust, explain, or maintain.
        </p>

        {/* CTA */}
        <a
          href="/quiz"
          className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition hover:opacity-90"
          style={{
            backgroundColor: "#2a1f1c",
            color: "#eedac4"
          }}
        >
          Start the 10-minute check
        </a>

        {/* Trust reinforcement */}
        <p className="text-xs text-[#62493c] mt-4">
          No signup required to start
        </p>

      </div>
    </main>
  );
}