/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://robertsoftware.com",
  generateRobotsText: true,
  generateIndexSitemap: false,
  exclude: ["/admin/*", "/api/*", "/panel/*"],
  alternateRefs: [
    {
      href: "https://robertsoftware.com/es",
      hreflang: "es",
    },
    {
      href: "https://robertsoftware.com/en",
      hreflang: "en",
    },
    {
      href: "https://robertsoftware.com/es",
      hreflang: "x-default",
    },
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/panel/", "/_next/"],
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "ChatGPT-User",
        disallow: "/",
      },
    ],
    additionalSitemaps: [
      "https://robertsoftware.com/sitemap-images.xml",
      "https://robertsoftware.com/sitemap-cases.xml",
    ],
  },
  transform: async (config, path) => {
    // Prioridades SEO personalizadas
    const priorities = {
      "/es": 1.0,
      "/en": 1.0,
      "/es/servicios": 0.9,
      "/en/services": 0.9,
      "/es/casos": 0.8,
      "/en/cases": 0.8,
      "/legal/privacidad": 0.3,
      "/legal/terminos": 0.3,
      "/legal/cookies": 0.3,
      "/legal/aviso-legal": 0.3,
    }

    return {
      loc: path,
      changefreq: path.includes("/legal/") ? "yearly" : "weekly",
      priority: priorities[path] || 0.5,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
}
