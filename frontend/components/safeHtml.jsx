// components/SafeHtml.js
'use client';
import { useEffect, useMemo } from 'react';
import DOMPurify from 'isomorphic-dompurify';

function useOnceDomPurifyHooks() {
  useEffect(() => {
    // Ensure external links are safe
    const hook = (node) => {
      if (node.tagName === 'A') {
        const href = node.getAttribute('href') || '';
        // strip javascript: and other dangerous protocols
        if (/^\s*javascript:/i.test(href)) node.removeAttribute('href');
        // open external links safely
        const isExternal = /^https?:\/\//i.test(href);
        if (isExternal) {
          node.setAttribute('target', '_blank');
          node.setAttribute('rel', 'noopener noreferrer nofollow');
        }
      }
    };
    DOMPurify.addHook('afterSanitizeAttributes', hook);
    return () => DOMPurify.removeHook('afterSanitizeAttributes', hook);
  }, []);
}

export default function SafeHtml({ html, className }) {
  useOnceDomPurifyHooks();

  const clean = useMemo(() => {
    return DOMPurify.sanitize(html || '', {
      // keep it conservative; expand if you need more formatting
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
        'span', 'div', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
      ],
      ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'class', 'id'],
      FORBID_ATTR: [/^on/i, 'style'],   // no inline JS or styles
      // Block images/iframes to avoid trackers; allow only if you explicitly need them
      FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'img', 'video', 'audio'],
      // Trusted Types if available; harmless otherwise
      RETURN_TRUSTED_TYPE: true
    });
  }, [html]);

  return (
    <div
      className={className}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
