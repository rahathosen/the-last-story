import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — The Last Story",
  description: "Terms and conditions for using The Last Story platform.",
};

export default function TermsPage() {
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Legal
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-slate-100 mb-3 leading-snug">
            Terms of Service
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
              By accessing or using{" "}
              <span className="text-slate-300 font-medium">The Last Story</span>, you
              agree to be bound by these Terms of Service. Please read them carefully.
              If you do not agree, you may not use this platform.
            </p>

            <section className="space-y-3">
              <h2 className="text-lg font-serif text-slate-100 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-indigo-500/60 shrink-0" />
                1. Acceptance of Terms
              </h2>
              <p>
                These terms govern your access to and use of The Last Story website and
                services. By submitting a story, browsing the site, or interacting with
                any content, you accept these terms in full.
              </p>
            </section>

            <div className="h-px bg-slate-700/40" />

            <section className="space-y-3">
              <h2 className="text-lg font-serif text-slate-100 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-indigo-500/60 shrink-0" />
                2. Content Standards
              </h2>
              <p>
                All stories submitted to this platform must:
              </p>
              <ul className="list-none space-y-2 pl-4">
                {[
                  "Be truthful and respectful to those mentioned",
                  "Honor the dignity and memory of the deceased",
                  "Not contain hate speech, harassment, or harmful content",
                  "Not violate any applicable laws or third-party rights",
                  "Be content you have the right to share",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-slate-400">
                    <span className="w-1 h-1 rounded-full bg-indigo-400/60 mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-slate-400">
                We reserve the right to reject, edit, or remove any story that does not
                meet these standards, at our sole discretion.
              </p>
            </section>

            <div className="h-px bg-slate-700/40" />

            <section className="space-y-3">
              <h2 className="text-lg font-serif text-slate-100 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-indigo-500/60 shrink-0" />
                3. Intellectual Property
              </h2>
              <p>
                You retain ownership of the stories you submit. By submitting, you grant
                The Last Story a non-exclusive, royalty-free, worldwide licence to display,
                store, and share your story on this platform for its intended purpose of
                honoring memories.
              </p>
              <p className="text-slate-400">
                The platform design, code, and branding are owned by The Last Story and
                may not be reproduced without written permission.
              </p>
            </section>

            <div className="h-px bg-slate-700/40" />

            <section className="space-y-3">
              <h2 className="text-lg font-serif text-slate-100 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-indigo-500/60 shrink-0" />
                4. Review & Moderation
              </h2>
              <p>
                All submitted stories undergo a manual review before being published.
                Submission does not guarantee publication. We aim to review stories within
                a reasonable time but do not guarantee specific timelines.
              </p>
            </section>

            <div className="h-px bg-slate-700/40" />

            <section className="space-y-3">
              <h2 className="text-lg font-serif text-slate-100 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-indigo-500/60 shrink-0" />
                5. Privacy
              </h2>
              <p>
                Your use of this platform is also governed by our{" "}
                <Link
                  href="/privacy"
                  className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
                >
                  Privacy Policy
                </Link>
                , which is incorporated into these terms by reference.
              </p>
            </section>

            <div className="h-px bg-slate-700/40" />

            <section className="space-y-3">
              <h2 className="text-lg font-serif text-slate-100 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-indigo-500/60 shrink-0" />
                6. Disclaimer of Warranties
              </h2>
              <p>
                This platform is provided &ldquo;as is&rdquo; without warranties of any
                kind. We do not guarantee uninterrupted access, error-free operation, or
                that content will remain available indefinitely. We are not responsible for
                emotional distress arising from reading stories on this platform.
              </p>
            </section>

            <div className="h-px bg-slate-700/40" />

            <section className="space-y-3">
              <h2 className="text-lg font-serif text-slate-100 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-indigo-500/60 shrink-0" />
                7. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by law, The Last Story and its operators
                shall not be liable for any indirect, incidental, or consequential damages
                arising from your use of this platform or the content published here.
              </p>
            </section>

            <div className="h-px bg-slate-700/40" />

            <section className="space-y-3">
              <h2 className="text-lg font-serif text-slate-100 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-indigo-500/60 shrink-0" />
                8. Changes to Terms
              </h2>
              <p>
                We may revise these terms at any time. The &ldquo;Last updated&rdquo; date
                at the top of this page will reflect any changes. Continued use of the
                platform after changes constitutes your acceptance of the revised terms.
              </p>
            </section>

            {/* Contact CTA */}
            <div className="mt-4 p-5 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
              <p className="text-slate-400 text-sm">
                Questions about these terms?{" "}
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
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-slate-500 hover:text-slate-300 transition-colors">
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
