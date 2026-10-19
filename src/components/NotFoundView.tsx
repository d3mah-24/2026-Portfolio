import { Nav } from "@/components/Nav";
import { Terminal, Prompt, Output } from "@/components/Terminal";
import { CrossLine } from "@/components/CrossLine";
import { localeNames, locales, defaultLocale } from "@/lib/i18n";
import { getPortfolio } from "@/lib/portfolio";

// A 404 can't know which language the visitor wanted, so the copy is
// bilingual and the navigation falls back to the default locale.
export function NotFoundView() {
  const data = getPortfolio(defaultLocale);

  return (
    <div className="pt-6 pb-6">
      <Nav
        locale={defaultLocale}
        links={data.navLinks.map((l) => ({ ...l, href: `/${defaultLocale}${l.href}` }))}
        name={data.personal.navName}
        homeHref={`/${defaultLocale}`}
        resumePath={data.personal.resumePath}
        resumeLang={data.personal.resumeLang}
        ui={data.ui}
      />

      <main className="max-w-4xl mx-auto border-x border-neutral-200 dark:border-neutral-800 min-h-screen relative">
        <div className="hidden lg:block absolute top-0 left-0 right-0">
          <CrossLine />
        </div>

        <div className="px-5 md:px-10 pt-32 md:pt-44 pb-16 md:pb-20 flex flex-col items-center text-center relative overflow-hidden">
          <div className="grid-bg" />
          <div className="relative z-10">
            <h1 className="text-6xl sm:text-7xl md:text-9xl font-bold tracking-tight shimmer-text">
              404
            </h1>
            <p className="text-neutral-400 dark:text-neutral-500 text-xs uppercase tracking-[0.3em] mt-6 mb-12">
              Page not found · <span lang="it">Pagina non trovata</span>
            </p>

            <div className="max-w-md mx-auto text-left">
              <Terminal>
                <Prompt>cd /lost-page</Prompt>
                <Output>bash: cd: /lost-page: No such file or directory</Output>
                <Prompt>echo $SUGGESTION</Prompt>
                <Output>
                  Maybe try the homepage? ·{" "}
                  <span lang="it">Prova dalla home page.</span>
                </Output>
              </Terminal>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-10 text-xs justify-center">
              {/* Plain links (full page load): the 404 and /en, /it use different
                  root layouts, so client-side <Link> navigation would only
                  change the URL. */}
              {locales.map((l, i) => (
                <a
                  key={l}
                  href={`/${l}`}
                  hrefLang={l}
                  lang={l}
                  className={
                    i === 0
                      ? "text-white dark:text-black bg-black dark:bg-white px-5 py-3 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors uppercase tracking-widest text-center"
                      : "text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 px-5 py-3 hover:text-black dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors uppercase tracking-widest text-center"
                  }
                >
                  {localeNames[l]}
                </a>
              ))}
              <a
                href={`mailto:${data.personal.email}`}
                className="text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 px-5 py-3 hover:text-black dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors uppercase tracking-widest text-center"
              >
                Report Issue · <span lang="it">Segnala</span>
              </a>
            </div>
          </div>
        </div>

        <div className="hidden lg:block absolute bottom-0 left-0 right-0">
          <CrossLine />
        </div>
        <div className="lg:hidden h-px bg-neutral-200 dark:bg-neutral-800" />
      </main>

      <footer className="max-w-4xl mx-auto text-center py-8">
        <p className="text-neutral-400 dark:text-neutral-600 text-[11px] tracking-widest uppercase">
          Made with love by {data.personal.footerName} &copy;{" "}
          {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
