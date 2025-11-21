import Link from "next/link"
import { ROUTES } from "@/utils/constants"

export function Footer() {
  const footerSections = [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Press", href: "#" },
        { label: "Blog", href: ROUTES.PUBLIC.BLOG },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contact", href: ROUTES.PUBLIC.CONTACT },
        { label: "FAQ", href: "#" },
        { label: "Terms", href: "#" },
        { label: "Privacy", href: "#" },
      ],
    },
    {
      title: "For Partners",
      links: [
        { label: "List Your Hotel", href: "#" },
        { label: "Partner Dashboard", href: "#" },
        { label: "Pricing", href: "#" },
        { label: "Resources", href: "#" },
      ],
    },
    {
      title: "Follow Us",
      links: [
        { label: "Facebook", href: "#" },
        { label: "Twitter", href: "#" },
        { label: "Instagram", href: "#" },
        { label: "LinkedIn", href: "#" },
      ],
    },
  ]

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Footer content grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} EliteStay. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-sm">Payment Methods:</span>
            <div className="flex gap-2">
              {["Visa", "Mastercard", "PayPal"].map((method) => (
                <span key={method} className="text-xs bg-card px-2 py-1 rounded border border-border">
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
