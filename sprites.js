(function () {
  'use strict';

  const outline = '#171b24';

  function drawBackground(ctx, width, height, time) {
    ctx.save();
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, '#8bb8cc');
    sky.addColorStop(0.58, '#d7b798');
    sky.addColorStop(1, '#9a6f62');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    // Warm evening light between tall alley walls.
    ctx.fillStyle = '#f3c978';
    ctx.beginPath();
    ctx.arc(width * 0.76, height * 0.2, 42, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#5d4b58';
    ctx.fillRect(0, 0, width * 0.22, height * 0.73);
    ctx.fillStyle = '#725360';
    ctx.fillRect(width * 0.78, 0, width * 0.22, height * 0.73);

    ctx.fillStyle = '#413b4a';
    for (let y = 30; y < height * 0.67; y += 58) {
      ctx.fillRect(18, y, 42, 18);
      ctx.fillRect(width - 60, y + 12, 42, 18);
    }

    ctx.fillStyle = '#382f39';
    ctx.beginPath();
    ctx.moveTo(width * 0.22, height * 0.73);
    ctx.lineTo(width * 0.78, height * 0.73);
    ctx.lineTo(width * 0.67, height * 0.38);
    ctx.lineTo(width * 0.33, height * 0.38);
    ctx.closePath();
    ctx.fill();

    // A subtle moving glow keeps the alley alive without changing its layout.
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = '#ffe3a1';
    const glowX = width * 0.5 + Math.sin(time * 0.8) * 18;
    ctx.fillRect(glowX - 3, height * 0.37, 6, height * 0.35);
    ctx.restore();
  }

  function drawGround(ctx, width, height, groundHeight, offset) {
    ctx.save();
    const top = height - groundHeight;
    ctx.fillStyle = '#2d3435';
    ctx.fillRect(0, top, width, groundHeight);
    ctx.strokeStyle = outline;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, top + 2);
    ctx.lineTo(width, top + 2);
    ctx.stroke();

    ctx.fillStyle = '#b8a47a';
    const step = 46;
    const shift = ((offset % step) + step) % step;
    for (let x = -step + shift; x < width + step; x += step) {
      ctx.fillRect(x, top + 22, 20, 7);
      ctx.fillStyle = '#c76e52';
      ctx.fillRect(x + 25, top + 48, 11, 9);
      ctx.fillStyle = '#b8a47a';
    }
    ctx.fillStyle = '#6f875c';
    ctx.fillRect(30 - shift, top + 66, 13, 6);
    ctx.fillRect(173 - shift, top + 38, 9, 5);
    ctx.fillRect(294 - shift, top + 70, 15, 6);
    ctx.restore();
  }

  function drawBird(ctx, x, y, size, velocity) {
    ctx.save();
    const tilt = Math.max(-0.28, Math.min(0.32, velocity / 900));
    ctx.translate(x, y);
    ctx.rotate(tilt);
    const s = size / 34;

    // Fictional adult alley runner with a bright rain jacket.
    ctx.fillStyle = '#f0c7a8';
    ctx.strokeStyle = outline;
    ctx.lineWidth = 2.5 * s;
    ctx.beginPath();
    ctx.arc(0, -8 * s, 7 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#283443';
    ctx.beginPath();
    ctx.arc(0, -11 * s, 7.5 * s, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#e2a83f';
    ctx.beginPath();
    ctx.moveTo(-9 * s, 1 * s);
    ctx.lineTo(8 * s, 1 * s);
    ctx.lineTo(11 * s, 14 * s);
    ctx.lineTo(-11 * s, 14 * s);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#263546';
    ctx.fillRect(-8 * s, 14 * s, 6 * s, 7 * s);
    ctx.fillRect(2 * s, 14 * s, 6 * s, 7 * s);
    ctx.strokeRect(-8 * s, 14 * s, 6 * s, 7 * s);
    ctx.strokeRect(2 * s, 14 * s, 6 * s, 7 * s);
    ctx.restore();
  }

  function drawPipe(ctx, x, gapTop, gapBottom, pipeWidth, height) {
    ctx.save();
    function obstacle(y, h) {
      if (h <= 0) return;
      ctx.fillStyle = '#263d52';
      ctx.fillRect(x, y, pipeWidth, h);
      ctx.strokeStyle = outline;
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 1.5, y + 1.5, pipeWidth - 3, h - 3);
      ctx.fillStyle = '#d6a33e';
      ctx.fillRect(x + 7, y + 8, pipeWidth - 14, 7);
      ctx.fillStyle = '#b94e4e';
      ctx.fillRect(x + pipeWidth * 0.35, y + 25, pipeWidth * 0.3, 10);
      ctx.fillStyle = '#1d2732';
      for (let windowY = y + 48; windowY < y + h - 8; windowY += 24) {
        ctx.fillRect(x + 9, windowY, 8, 7);
        ctx.fillRect(x + pipeWidth - 17, windowY, 8, 7);
      }
    }
    obstacle(0, gapTop);
    obstacle(gapBottom, height - gapBottom);
    ctx.restore();
  }

  window.SPRITES = { drawBackground, drawGround, drawBird, drawPipe };
})();
