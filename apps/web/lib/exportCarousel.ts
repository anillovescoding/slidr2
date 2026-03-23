import { Slide } from '@/store/useEditorStore';

// ─── HTML export ─────────────────────────────────────────────────────────────

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
          <ul style="list-style:none;padding:0;margin:0">
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

  triggerDownload(new Blob([html], { type: 'text/html' }), `${sanitize(title)}.html`);
}

// ─── Canvas renderer ──────────────────────────────────────────────────────────

const W = 1080;
const H = 1080;
const PAD = 80;

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function renderSlideToCanvas(slide: Slide): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = slide.background;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = slide.textColor;
  ctx.textBaseline = 'top';
  const maxW = W - PAD * 2;

  if (slide.layout === 'title-only') {
    ctx.font = `bold 72px system-ui, sans-serif`;
    const lines = wrapText(ctx, slide.title || 'Slide Title', maxW);
    const lineH = 84;
    const totalH = lines.length * lineH;
    let y = (H - totalH) / 2;
    ctx.textAlign = 'center';
    for (const line of lines) {
      ctx.fillText(line, W / 2, y);
      y += lineH;
    }
    // Decorative underline
    ctx.globalAlpha = 0.2;
    ctx.fillRect(W / 2 - 60, y + 16, 120, 6);
    ctx.globalAlpha = 1;
  }

  if (slide.layout === 'title-body') {
    ctx.textAlign = 'left';
    ctx.font = `bold 60px system-ui, sans-serif`;
    const titleLines = wrapText(ctx, slide.title || 'Title', maxW);
    let y = PAD + 60;
    for (const line of titleLines) {
      ctx.fillText(line, PAD, y);
      y += 70;
    }
    y += 20;
    ctx.font = `400 36px system-ui, sans-serif`;
    ctx.globalAlpha = 0.8;
    const bodyLines = wrapText(ctx, slide.body || '', maxW);
    for (const line of bodyLines) {
      ctx.fillText(line, PAD, y);
      y += 48;
    }
    ctx.globalAlpha = 1;
  }

  if (slide.layout === 'bullet-list') {
    ctx.textAlign = 'left';
    ctx.font = `bold 56px system-ui, sans-serif`;
    const titleLines = wrapText(ctx, slide.title || 'Key Points', maxW);
    let y = PAD + 60;
    for (const line of titleLines) {
      ctx.fillText(line, PAD, y);
      y += 66;
    }
    y += 24;
    ctx.font = `400 34px system-ui, sans-serif`;
    ctx.globalAlpha = 0.85;
    const bullets = slide.bullets.length > 0 ? slide.bullets : ['Point one', 'Point two', 'Point three'];
    for (const bullet of bullets) {
      // Bullet dot
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(PAD + 8, y + 16, 7, 0, Math.PI * 2);
      ctx.fillStyle = slide.textColor;
      ctx.fill();
      ctx.fillStyle = slide.textColor;
      ctx.globalAlpha = 0.85;
      const bLines = wrapText(ctx, bullet, maxW - 36);
      for (const bLine of bLines) {
        ctx.fillText(bLine, PAD + 28, y);
        y += 44;
      }
      y += 8;
    }
    ctx.globalAlpha = 1;
  }

  if (slide.layout === 'quote') {
    ctx.textAlign = 'center';
    ctx.font = `italic bold 48px Georgia, serif`;
    ctx.globalAlpha = 0.9;
    const quoteText = `"${slide.quote || 'Inspiring message goes here.'}"`;
    const lines = wrapText(ctx, quoteText, maxW);
    const lineH = 62;
    const totalH = lines.length * lineH + (slide.author ? 60 : 0);
    let y = (H - totalH) / 2;
    for (const line of lines) {
      ctx.fillText(line, W / 2, y);
      y += lineH;
    }
    if (slide.author) {
      ctx.globalAlpha = 0.6;
      ctx.font = `bold 32px system-ui, sans-serif`;
      ctx.fillText(`— ${slide.author}`, W / 2, y + 16);
    }
    ctx.globalAlpha = 1;
  }

  // Slide number
  ctx.textAlign = 'right';
  ctx.font = `400 24px system-ui, sans-serif`;
  ctx.globalAlpha = 0.3;
  ctx.fillText(`${W}×${H}`, W - PAD, H - 40);
  ctx.globalAlpha = 1;

  return canvas;
}

// ─── Image export ─────────────────────────────────────────────────────────────

export type ImageFormat = 'png' | 'jpeg' | 'webp';

export function exportSlideAsImage(slide: Slide, index: number, format: ImageFormat = 'png'): void {
  const canvas = renderSlideToCanvas(slide);
  const mimeType = `image/${format}`;
  canvas.toBlob(
    (blob) => {
      if (blob) triggerDownload(blob, `slide_${String(index + 1).padStart(2, '0')}.${format}`);
    },
    mimeType,
    0.92
  );
}

export async function exportCarouselAsImages(
  title: string,
  slides: Slide[],
  format: ImageFormat = 'png'
): Promise<void> {
  // Try ZIP export if JSZip is available, otherwise download individually
  try {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    const folder = zip.folder(sanitize(title)) ?? zip;

    for (let i = 0; i < slides.length; i++) {
      const canvas = renderSlideToCanvas(slides[i]);
      const dataUrl = canvas.toDataURL(`image/${format}`, 0.92);
      const base64 = dataUrl.split(',')[1];
      folder.file(`slide_${String(i + 1).padStart(2, '0')}.${format}`, base64, { base64: true });
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    triggerDownload(blob, `${sanitize(title)}.zip`);
  } catch {
    // JSZip not available — fall back to individual downloads
    for (let i = 0; i < slides.length; i++) {
      exportSlideAsImage(slides[i], i, format);
    }
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sanitize(name: string): string {
  return name.replace(/[^a-z0-9]/gi, '_') || 'carousel';
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
