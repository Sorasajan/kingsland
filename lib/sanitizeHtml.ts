import sanitizeHtml from "sanitize-html";

// Matches exactly what the TipTap toolbar in RichTextEditor can produce.
// Anything else (script, iframe, arbitrary style, event handlers, etc.)
// gets stripped, even if a request is crafted directly against the API
// rather than going through the editor UI.
export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "strong", "em", "u", "s", "blockquote",
      "ul", "ol", "li", "h2", "h3", "a", "code", "pre", "img",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "style"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https"] },
    // Only the float-wrap properties the editor's toolbar can set —
    // nothing else survives, even if "style" is tampered with directly.
    allowedStyles: {
      img: {
        float: [/^(left|right|none)$/],
        display: [/^(block|inline-block)$/],
        margin: [/^[0-9.]+(px|rem|em)?(\s[0-9.]+(px|rem|em)?){0,3}$/],
        "max-width": [/^\d{1,3}%$/],
        "border-radius": [/^[0-9.]+(px|rem)$/],
      },
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer", target: "_blank" }),
    },
  });
}
