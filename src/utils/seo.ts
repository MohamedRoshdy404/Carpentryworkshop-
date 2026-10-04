export const updateMetaTags = (
  title: string,
  description: string,
  image?: string,
  canonicalUrl?: string,
  structuredData?: Record<string, unknown>,
) => {
  document.title = title;

  setMeta('meta[name="description"]', "name", "description", description);
  setMeta('meta[property="og:title"]', "property", "og:title", title);
  setMeta(
    'meta[property="og:description"]',
    "property",
    "og:description",
    description,
  );
  setMeta('meta[property="og:type"]', "property", "og:type", "website");

  if (image) {
    setMeta('meta[property="og:image"]', "property", "og:image", image);
  } else {
    document.querySelector('meta[property="og:image"]')?.remove();
  }

  const canonical = document.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (canonicalUrl) {
    const link = canonical ?? document.createElement("link");
    link.rel = "canonical";
    link.href = canonicalUrl;
    if (!canonical) document.head.append(link);
  } else {
    canonical?.remove();
  }

  document.getElementById("product-structured-data")?.remove();
  if (structuredData) {
    const script = document.createElement("script");
    script.id = "product-structured-data";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(structuredData);
    document.head.append(script);
  }
};

function setMeta(
  selector: string,
  attribute: "name" | "property",
  key: string,
  content: string,
): void {
  const meta =
    document.querySelector<HTMLMetaElement>(selector) ??
    document.createElement("meta");
  meta.setAttribute(attribute, key);
  meta.content = content;
  if (!meta.isConnected) document.head.append(meta);
}
