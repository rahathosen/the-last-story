import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — The Last Story",
  description: "How we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800/50">
        <nav className="container mx-auto px-4 py-3 flex items-center justify-between max-w-3xl">
          <Link
            href="/"
            className="text-base font-serif text-slate-200 hover:text-white transition-colors"
          >
            The Last Story
          </Link>
          <div className="flex items-center gap-1">
            <Link href="/">
              <button className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-all">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-10 md:py-14 max-w-3xl">
        {/* Page header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs mb-5">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Legal
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-slate-100 mb-3 leading-snug">
            Privacy Policy
          </h1>
          <p className="text-slate-500 text-sm">
            Last updated: January 2025
          </p>
        </div>

        {/* Article card */}
        <article className="relative bg-slate-800/40 border border-slate-700/40 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          <div className="p-6 sm:p-8 md:p-10 space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed">

            <p className="text-slate-400">
              At <span className="text-slate-300 font-medium">The Last Story</span>, we
              are deeply committed to protecting your privacy. This policy explains how we
              handle information when you use our platform to share or read stories of love
              and memory.
            </p>

            {/* Section */}
            <section className="space-y-3">
              <h2 className="text-lg font-serif text-slate-100 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-indigo-500/60 shrink-0" />
                1. Information We Collect
              </h2>
              <p>
                We collect only the information you voluntarily provide when submitting a
                story:
              </p>
              <ul className="list-none space-y-2 pl-4">
                {[
                  "Your name (optional — you may remain anonymous)",
                  "A social media profile link (optional)",
                  "Your story title and content",
                  "The date and time of submission",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-slate-400">
                    <span className="w-1 h-1 rounded-full bg-indigo-400/60 mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-slate-400">
                We also collect basic, anonymized usage data (page views, browser type)
                through Vercel Analytics to understand how the site is used. No personal
                identifiers are stored.
              </p>
            </section>

            <div className="h-px bg-slate-700/40" />

            <section className="space-y-3">
              <h2 className="text-lg font-serif text-slate-100 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-indigo-500/60 shrink-0" />
                2. How We Use Your Information
              </h2>
              <ul className="list-none space-y-2 pl-4">
                {[
                  "To display your story on the platform after review and approval",
                  "To allow other visitors to read and connect with your story",
                  "To improve the site experience using aggregated analytics",
                  "We do not sell, rent, or share your personal information with third parties",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-slate-400">
                    <span className="w-1 h-1 rounded-full bg-indigo-400/60 mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <div className="h-px bg-slate-700/40" />

            <section className="space-y-3">
              <h2 className="text-lg font-serif text-slate-100 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-indigo-500/60 shrink-0" />
                3. Story Content & Public Display
              </h2>
              <p>
                By submitting a story, you consent to it being displayed publicly on this
                platform. Stories are reviewed before publication. If you wish to have your
                story removed at any time, please{" "}
                <Link
                  href="/contact"
                  className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
                >
                  contact us
                </Link>{" "}
                and we will remove it promptly.
              </p>
            </section>

            <div className="h-px bg-slate-700/40" />

            <section className="space-y-3">
              <h2 className="text-lg font-serif text-slate-100 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-indigo-500/60 shrink-0" />
                4. Cookies & Local Storage
              </h2>
              <p>
                We use browser <span className="text-slate-200">localStorage</span> to
                store an anonymous viewer ID that tracks which stories you have liked. This
                data lives only in your browser and is never sent to any third party. We do
                not use advertising cookies.
              </p>
            </section>

            <div className="h-px bg-slate-700/40" />

            <section className="space-y-3">
              <h2 className="text-lg font-serif text-slate-100 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-indigo-500/60 shrink-0" />
                5. Data Retention
              </h2>
              <p>
                Stories and any associated names are stored indefinitely as part of the
                public archive unless a removal request is made. Anonymized analytics
                data may be retained by Vercel per their own privacy policy.
              </p>
            </section>

            <div className="h-px bg-slate-700/40" />

            <section className="space-y-3">
              <h2 className="text-lg font-serif text-slate-100 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-indigo-500/60 shrink-0" />
                6. Your Rights
              </h2>
              <p>
                You have the right to request removal of your story or any personal
                information you have provided. To exercise this right, please reach out
                via our{" "}
                <Link
                  href="/contact"
                  className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
                >
                  contact page
                </Link>
                .
              </p>
            </section>

            <div className="h-px bg-slate-700/40" />

            <section className="space-y-3">
              <h2 className="text-lg font-serif text-slate-100 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-indigo-500/60 shrink-0" />
                7. Changes to This Policy
              </h2>
              <p>
                We may update this policy from time to time. Changes will be reflected by
                the &ldquo;Last updated&rdquo; date at the top of this page. Continued use
                of the site after changes constitutes acceptance.
              </p>
            </section>

            {/* Contact CTA */}
            <div className="mt-4 p-5 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
              <p className="text-slate-400 text-sm">
                Questions about this policy?{" "}
                <Link
                  href="/contact"
                  className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  Get in touch →
                </Link>
              </p>
            </div>
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="py-10 md:py-14 px-4 border-t border-slate-800/50 mt-4">
        <div className="container mx-auto max-w-3xl text-center">
          <p className="text-slate-500 text-sm italic mb-5 font-light">
            &ldquo;Sometimes the most powerful stories are the ones we only tell
            once.&rdquo;
          </p>
          <div className="flex justify-center gap-6 text-xs text-slate-600">
            <Link href="/privacy" className="text-slate-500 hover:text-slate-300 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-slate-400 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
