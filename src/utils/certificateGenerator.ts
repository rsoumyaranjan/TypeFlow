// src/utils/certificateGenerator.ts

/**
 * Draws a certificate on a canvas and triggers a PNG download.
 */
export function downloadCertificate(userName: string, wpm: number, accuracy: number): void {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background Gradient
  const grad = ctx.createRadialGradient(400, 300, 50, 400, 300, 500);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(1, '#f1f2f6');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 600);

  // Borders
  ctx.strokeStyle = '#6C5CE7';
  ctx.lineWidth = 15;
  ctx.strokeRect(20, 20, 760, 560);

  ctx.strokeStyle = '#FFB347';
  ctx.lineWidth = 4;
  ctx.strokeRect(35, 35, 730, 530);

  // Title
  ctx.fillStyle = '#2f3542';
  ctx.font = 'bold 36px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('TypeFlow Curriculum', 400, 100);

  ctx.fillStyle = '#6C5CE7';
  ctx.font = 'italic 20px Georgia, serif';
  ctx.fillText('Certificate of Completion', 400, 140);

  // Decorative element
  ctx.fillStyle = '#FFB347';
  ctx.font = '24px serif';
  ctx.fillText('★ ★ ★ ★ ★', 400, 180);

  // Recipient details
  ctx.fillStyle = '#2f3542';
  ctx.font = '18px Arial, sans-serif';
  ctx.fillText('This certifies that', 400, 240);

  ctx.fillStyle = '#1e272e';
  ctx.font = 'bold 28px Georgia, serif';
  ctx.fillText(userName || 'Valued Typist', 400, 290);

  ctx.fillStyle = '#2f3542';
  ctx.font = '18px Arial, sans-serif';
  ctx.fillText('has successfully completed the 200-Stage TypeFlow Curriculum', 400, 340);
  ctx.fillText('demonstrating touch-typing proficiency and core muscle memory.', 400, 370);

  // Stats block background
  ctx.fillStyle = '#eef0f7';
  ctx.fillRect(200, 410, 400, 80);
  ctx.strokeStyle = '#dcdde1';
  ctx.lineWidth = 1;
  ctx.strokeRect(200, 410, 400, 80);

  // Stats
  ctx.fillStyle = '#2f3542';
  ctx.font = 'bold 18px Arial, sans-serif';
  ctx.fillText(`Average Speed: ${wpm} WPM`, 300, 455);
  ctx.fillText(`Accuracy: ${accuracy}%`, 500, 455);

  // Footer / Date
  const dateStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  ctx.font = '14px Arial, sans-serif';
  ctx.fillStyle = '#57606f';
  ctx.fillText(`Date: ${dateStr}`, 400, 530);

  // Trigger download
  try {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `TypeFlow_Certificate_${userName.replace(/\s+/g, '_')}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Failed to export certificate image:', err);
  }
}
