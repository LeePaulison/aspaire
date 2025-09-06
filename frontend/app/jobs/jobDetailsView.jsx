import SafeHtml from '@/components/safeHtml';

export function JobDetailsView({ job }) {
  console.log('[JobDetailsView] raw_payload', job.raw_payload);
  console.log('[JobDetailsView] raw_payload url', job.raw_payload?.url);
  console.log('[JobDetailsView] raw_payload apply_options', job.raw_payload?.apply_options);

  // simple http/https guard
  const isHttpUrl = (href) => {
    try {
      const u = new URL(href);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const payloadPretty = useMemo(() => {
    try {
      return JSON.stringify(job.raw_payload ?? {}, null, 2);
    } catch {
      return '{}';
    }
  }, [job?.raw_payload]);

  // Build apply links from payload.apply_options or fallback URL fields
  const applyLinks = useMemo(() => {
    const p = job?.raw_payload || {};
    const fromOptions = Array.isArray(p.apply_options)
      ? p.apply_options
        .map((o) => ({ href: o?.link, label: o?.title || 'Apply' }))
        .filter((x) => typeof x.href === 'string' && isHttpUrl(x.href))
      : [];

    if (fromOptions.length) return fromOptions;

    const fallbackKey = ['url', 'job_url', 'apply_url', 'redirect_url', 'link', 'jobUrl', 'application_url'].find(
      (k) => typeof p[k] === 'string' && isHttpUrl(p[k])
    );

    return fallbackKey ? [{ href: p[fallbackKey], label: 'Apply' }] : [];
  }, [job?.raw_payload]);

  return (
    <div className='space-y-3'>
      <header>
        <h3 className='text-xl font-semibold leading-tight'>{job.title}</h3>
        <div className='text-sm text-muted-foreground'>
          {job.company} • {job.location || '—'}
        </div>
        <div className='mt-1 text-xs opacity-80'>
          Type: {job.job_type} • Source: {job.source}
          {job.salary ? <span className='ml-2'>• {job.salary}</span> : null}
        </div>
        <div className='mt-1 text-xs opacity-70'>Posted: {new Date(job.publication_date).toLocaleDateString()}</div>
      </header>

      {/* Apply */}
      {applyLinks.length > 0 && (
        <section className='flex flex-wrap gap-2'>
          {applyLinks.map(({ href, label }, i) => (
            <a
              key={href + i}
              href={href}
              target='_blank'
              rel='noopener noreferrer nofollow'
              className='rounded-xl bg-primary px-4 py-2 text-primary-foreground hover:opacity-95'
              aria-label={`Apply via ${label}`}
            >
              {i === 0 ? `Apply on ${label}` : label}
            </a>
          ))}
        </section>
      )}

      <section className='prose prose-sm max-w-none'>
        <h4>Description</h4>
        <SafeHtml className='whitespace-pre-wrap text-sm leading-relaxed' html={job.description} />
      </section>

      {(job.tags?.length || job.job_highlights?.length) && (
        <section>
          <h4 className='mb-1 text-sm font-medium'>Highlights</h4>
          <div className='flex flex-wrap gap-1.5'>
            {job.tags?.map((t) => (
              <span key={t} className='rounded-full border px-2 py-0.5 text-xs'>
                {t}
              </span>
            ))}
            {job.job_highlights?.map((h, i) => (
              <span key={i} className='rounded-full border px-2 py-0.5 text-xs'>
                {h}
              </span>
            ))}
          </div>
        </section>
      )}

      <details className='rounded-xl border bg-muted/30 p-3'>
        <summary className='cursor-pointer text-sm font-medium'>View original payload</summary>
        <pre className='mt-2 overflow-auto rounded-lg bg-black/80 p-3 text-xs text-white'>{payloadPretty}</pre>
      </details>
    </div>
  );
}
