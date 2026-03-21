import { Slide } from '@/store/useEditorStore';

function slideToHtml(slide: Slide, index: number, total: number): string {
  const contentHtml = (() => {
    switch (slide.layout) {
      case 'title-only':
        return `<h1 style="font-size:2.5rem;font-weight:700;text-align:center;margin:0">${slide.title}</h1>`;
      case 'title-body':
        return `
          <h1 style="font-size:2rem;font-weight:700;margin:0 0 1rem">${slide.title}</h1>
          <p style="font-size:1.1rem;opacity:0.8;line-height:1.6;margin:0">${slide.body}</p>`;
      case 'bullet-list':
        return `
          <h1 style="font-size:2rem;font-weight:700;margin:0 0 1rem">${slide.title}</h1>
          <ul style="list-style:none;padding:0;margin:0;space-y:0.5rem">
            ${slide.bullets.map((b) => `<li style="display:flex;align-items:flex-start;gap:0.5rem;font-size:1rem;opacity:0.85;margin-bottom:0.5rem">
              <span style="width:8px;height:8px;border-radius:50%;background:${slide.textColor};flex-shrink:0;margin-top:0.4rem"></span>${b}
            </li>`).join('')}
          </ul>`;
      case 'quote':
        return `
          <p style="font-size:1.5rem;font-style:italic;font-weight:300;text-align:center;margin:0 0 1rem;opacity:0.9">"${slide.quote}"</p>
          ${slide.author ? `<p style="font-size:0.9rem;text-align:center;opacity:0.6;margin:0">— ${slide.author}</p>` : ''}`;
    }
  })();

  return `
    <section style="
      width:960px;height:540px;
      background:${slide.background};color:${slide.textColor};
      display:flex;flex-direction:column;justify-content:center;
      padding:4rem 5rem;box-sizing:border-box;
      position:relative;page-break-after:always;
      font-family:system-ui,sans-serif;
    ">
      ${contentHtml}
      <span style="position:absolute;bottom:1rem;right:1.5rem;font-size:0.7rem;opacity:0.4">${index + 1} / ${total}</span>
    </section>`;
}

export function exportCarouselHtml(title: string, slides: Slide[]): void {
  const slidesHtml = slides.map((s, i) => slideToHtml(s, i, slides.length)).join('\n');
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #111; display: flex; flex-direction: column; align-items: center; gap: 2rem; padding: 2rem; }
    section { border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
    @media print {
      body { background: white; padding: 0; gap: 0; }
      section { border-radius: 0; box-shadow: none; }
    }
  </style>
</head>
<body>
  ${slidesHtml}
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
