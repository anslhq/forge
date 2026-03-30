export const legalPages = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    description: "How we collect, use, and protect information.",
    body: [
      "We only collect the information required to operate and improve the product.",
      "We do not sell personal data. Access is limited to authorized systems and team members.",
      "If you have questions about privacy or data handling, contact support.",
    ],
  },
  {
    slug: "terms",
    title: "Terms of Service",
    description: "The rules for using the product and website.",
    body: [
      "Use the product lawfully and do not interfere with the service or other users.",
      "We may update the product over time and will publish material changes here.",
      "If you need custom contractual terms, contact the team directly.",
    ],
  },
] as const;

export const blogPosts = [
  {
    slug: "scaffold-update",
    title: "Scaffold update",
    description:
      "A local placeholder post for the Forge-based marketing scaffold.",
    date: "2026-03-19",
    body: [
      "This baseline marketing site intentionally avoids an external CMS dependency.",
      "Replace this placeholder with your actual publishing workflow once the platform scaffold is stable.",
    ],
  },
] as const;
