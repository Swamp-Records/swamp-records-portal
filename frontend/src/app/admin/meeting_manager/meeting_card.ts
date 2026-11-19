import logo from "../../../../images/black_swamp_records_logo.png";

export type MeetingCardInfo = {
  id: string;
  name: string;
  location: string;
  pin: string;
};

// card size in CSS pixels; drawn at SCALE x so it stays sharp when pasted
const WIDTH = 520;
const SCALE = 2;

// gap between the outer card's edge and the details panel, top and bottom
const MARGIN = 30;
// details panel; text positions below are measured from its top edge
const PANEL = { x: 270, y: MARGIN, w: 215, h: 220 };
const HEIGHT = PANEL.y + PANEL.h + MARGIN;

const INK = "#000000";
const OUTER_FILL = "#AAAAAA";
const INNER_FILL = "#EDEDED";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Couldn't load ${src}`));
    img.src = src;
  });
}

// uses the site's monospace font (Geist Mono, loaded by the root layout) and falls back to the browser's
async function monoFont() {
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-geist-mono").trim() || "monospace";
  await Promise.all(["400 13px", "700 13px", "700 19px"].map((style) => document.fonts.load(`${style} ${family}`)));
  return family;
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string, border: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = border;
  ctx.strokeStyle = INK;
  ctx.stroke();
}

// draws the text at the largest size up to maxSize that fits in maxWidth (for text that should never be cut short)
function shrinkToFit(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, weight: number, maxSize: number, family: string) {
  let size = maxSize;
  ctx.font = `${weight} ${size}px ${family}`;
  while (size > 8 && ctx.measureText(text).width > maxWidth) {
    size -= 0.5;
    ctx.font = `${weight} ${size}px ${family}`;
  }
  ctx.fillText(text, x, y);
}

// draws the text, cutting it short with "…" if it's wider than maxWidth
function fitText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number) {
  let shown = text;
  while (shown.length > 1 && ctx.measureText(shown).width > maxWidth) shown = shown.slice(0, -2) + "…";
  ctx.fillText(shown, x, y);
}

// draws the meeting's attendance card (logo on the left, details on the right) and returns it as a png
export async function renderMeetingCard(meeting: MeetingCardInfo): Promise<Blob> {
  const [logoImg, font] = await Promise.all([loadImage(logo.src), monoFont()]);

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH * SCALE;
  canvas.height = HEIGHT * SCALE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas isn't supported");
  ctx.scale(SCALE, SCALE);

  // outer card, inset by half the border so the border isn't clipped at the edges
  roundedRect(ctx, 4, 4, WIDTH - 8, HEIGHT - 8, 24, OUTER_FILL, 7);

  // logo, centered in the left half
  const logoSize = 160;
  ctx.drawImage(logoImg, 140 - logoSize / 2, HEIGHT / 2 - logoSize / 2, logoSize, logoSize);

  // details panel
  const panel = PANEL;
  roundedRect(ctx, panel.x, panel.y, panel.w, panel.h, 20, INNER_FILL, 5);

  const textX = panel.x + 16;
  const textWidth = panel.w - 32;
  ctx.fillStyle = INK;
  ctx.textBaseline = "alphabetic";

  shrinkToFit(ctx, "Swamp Records Attendance", textX, panel.y + 36, textWidth, 700, 13, font);

  ctx.font = `400 13px ${font}`;
  fitText(ctx, `Name: ${meeting.name}`, textX, panel.y + 72, textWidth);
  fitText(ctx, `Location: ${meeting.location}`, textX, panel.y + 106, textWidth);
  fitText(ctx, `ID: #${meeting.id}`, textX, panel.y + 140, textWidth);

  // dashed divider between the details and the pin, edge to edge inside the panel's border like the site's dashed dividers
  ctx.beginPath();
  ctx.setLineDash([6, 4]);
  ctx.moveTo(panel.x + 2.5, panel.y + 163);
  ctx.lineTo(panel.x + panel.w - 2.5, panel.y + 163);
  ctx.lineWidth = 2;
  ctx.strokeStyle = INK;
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.font = `700 19px ${font}`;
  fitText(ctx, `Pin: ${meeting.pin}`, textX, panel.y + 196, textWidth);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Couldn't create the image"))), "image/png");
  });
}
