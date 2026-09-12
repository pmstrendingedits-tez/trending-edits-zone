const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Trending Edits Zone";

export const staticPages = {
  "about-us": {
    title: "About Us",
    content: `Welcome to ${siteName}! We share Alight Motion presets, XML files, Lightroom presets, video editing BGMs, photo editing prompts and step-by-step tutorials for content creators. Edit the content of this page in lib/staticPages.js.`
  },
  "contact-us": {
    title: "Contact Us",
    content: `Have a question, request, or business inquiry? Reach us at contact@yourdomain.com. Edit this page in lib/staticPages.js.`
  },
  "privacy-policy": {
    title: "Privacy Policy",
    content: `This Privacy Policy describes how ${siteName} collects, uses and protects information when you visit our website. Replace this placeholder with your actual privacy policy before going live.`
  },
  "disclaimer": {
    title: "Disclaimer",
    content: `All presets, templates and materials shared on ${siteName} are for educational purposes. We do not claim ownership of third-party trademarks referenced on this site. Replace this placeholder with your actual disclaimer.`
  },
  "terms-and-conditions": {
    title: "Terms and Conditions",
    content: `By using ${siteName}, you agree to these terms and conditions. Replace this placeholder with your actual terms before going live.`
  }
};
