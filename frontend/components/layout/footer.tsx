import Link from "next/link";
import { APP_NAME, APP_TAGLINE, FOOTER_LINKS } from "@/utils/constants";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border-subtle bg-charcoal text-ivory">
      <div className="container-page grid gap-10 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-serif text-xl">{APP_NAME}</p>
          <p className="mt-3 max-w-xs text-sm text-ivory/60">{APP_TAGLINE}</p>
        </div>

        <FooterColumn title="Shop" links={FOOTER_LINKS.shop} />
        <FooterColumn title="Company" links={FOOTER_LINKS.company} />
        <FooterColumn title="Support" links={FOOTER_LINKS.support} />
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-ivory/50 md:flex-row">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-ivory">Privacy</Link>
            <Link href="/terms" className="hover:text-ivory">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-sm font-medium text-ivory/80">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-ivory/60 transition-colors hover:text-ivory">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
