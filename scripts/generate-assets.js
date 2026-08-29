import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateAssets() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Base standard SVG (for crisp icons)
  const standardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
    <linearGradient id="rimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#fef3c7" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000000" flood-opacity="0.22" />
    </filter>
    <filter id="handShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#0f172a" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- Squircle Base for App Icon -->
  <rect width="512" height="512" rx="115" fill="url(#bgGrad)" />
  <rect x="16" y="16" width="480" height="480" rx="99" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="6" />

  <!-- Clock Outer Base with Shadow -->
  <circle cx="256" cy="256" r="190" fill="#fed7aa" filter="url(#shadow)" />
  <circle cx="256" cy="256" r="180" fill="url(#rimGrad)" stroke="#fbbf24" stroke-width="10" />

  <!-- Stars -->
  <path d="M100 80 Q105 100 125 105 Q105 110 100 130 Q95 110 75 105 Q95 100 100 80 Z" fill="#ffffff" opacity="0.95" />
  <path d="M420 90 Q424 105 440 108 Q424 112 420 128 Q416 112 400 108 Q416 105 420 90 Z" fill="#ffffff" opacity="0.95" />

  <!-- Digits -->
  <text x="256" y="125" font-family="'Tajawal', 'Fredoka', 'Segoe UI', Arial, sans-serif" font-size="38" font-weight="900" fill="#1e293b" text-anchor="middle">12</text>
  <text x="390" y="267" font-family="'Tajawal', 'Fredoka', 'Segoe UI', Arial, sans-serif" font-size="38" font-weight="900" fill="#1e293b" text-anchor="middle">3</text>
  <text x="256" y="410" font-family="'Tajawal', 'Fredoka', 'Segoe UI', Arial, sans-serif" font-size="38" font-weight="900" fill="#1e293b" text-anchor="middle">6</text>
  <text x="122" y="267" font-family="'Tajawal', 'Fredoka', 'Segoe UI', Arial, sans-serif" font-size="38" font-weight="900" fill="#1e293b" text-anchor="middle">9</text>

  <!-- Dots -->
  <circle cx="328" cy="132" r="7" fill="#64748b" />
  <circle cx="380" cy="184" r="7" fill="#64748b" />
  <circle cx="380" cy="328" r="7" fill="#64748b" />
  <circle cx="328" cy="380" r="7" fill="#64748b" />
  <circle cx="184" cy="380" r="7" fill="#64748b" />
  <circle cx="132" cy="328" r="7" fill="#64748b" />
  <circle cx="132" cy="184" r="7" fill="#64748b" />
  <circle cx="184" cy="132" r="7" fill="#64748b" />

  <!-- Hands -->
  <g filter="url(#handShadow)">
    <line x1="256" y1="256" x2="175" y2="155" stroke="#dc2626" stroke-width="18" stroke-linecap="round" />
    <circle cx="175" cy="155" r="4" fill="#ef4444" />
  </g>
  <g filter="url(#handShadow)">
    <line x1="256" y1="256" x2="345" y2="125" stroke="#0284c7" stroke-width="12" stroke-linecap="round" />
    <circle cx="345" cy="125" r="3" fill="#38bdf8" />
  </g>

  <!-- Center Hub -->
  <circle cx="256" cy="256" r="22" fill="#d97706" />
  <circle cx="256" cy="256" r="14" fill="#fbbf24" />
  <circle cx="256" cy="256" r="6" fill="#ffffff" />
</svg>`;

  // 2. Maskable SVG (full bleed amber background, with icon content scaled safely inside the central 80% safe zone)
  const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="mBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
    <linearGradient id="mRimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#fef3c7" />
    </linearGradient>
    <filter id="mShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.2" />
    </filter>
  </defs>

  <!-- Full Bleed Background for Maskable Icon -->
  <rect width="512" height="512" fill="url(#mBgGrad)" />

  <!-- Group scaled to 78% and centered at (256, 256) -->
  <g transform="translate(56, 56) scale(0.78)">
    <circle cx="256" cy="256" r="190" fill="#fed7aa" filter="url(#mShadow)" />
    <circle cx="256" cy="256" r="180" fill="url(#mRimGrad)" stroke="#fbbf24" stroke-width="12" />

    <!-- Stars -->
    <path d="M100 80 Q105 100 125 105 Q105 110 100 130 Q95 110 75 105 Q95 100 100 80 Z" fill="#ffffff" opacity="0.95" />
    <path d="M420 90 Q424 105 440 108 Q424 112 420 128 Q416 112 400 108 Q416 105 420 90 Z" fill="#ffffff" opacity="0.95" />

    <!-- Digits -->
    <text x="256" y="125" font-family="'Tajawal', 'Fredoka', sans-serif" font-size="38" font-weight="900" fill="#1e293b" text-anchor="middle">12</text>
    <text x="390" y="267" font-family="'Tajawal', 'Fredoka', sans-serif" font-size="38" font-weight="900" fill="#1e293b" text-anchor="middle">3</text>
    <text x="256" y="410" font-family="'Tajawal', 'Fredoka', sans-serif" font-size="38" font-weight="900" fill="#1e293b" text-anchor="middle">6</text>
    <text x="122" y="267" font-family="'Tajawal', 'Fredoka', sans-serif" font-size="38" font-weight="900" fill="#1e293b" text-anchor="middle">9</text>

    <!-- Dots -->
    <circle cx="328" cy="132" r="7" fill="#64748b" />
    <circle cx="380" cy="184" r="7" fill="#64748b" />
    <circle cx="380" cy="328" r="7" fill="#64748b" />
    <circle cx="328" cy="380" r="7" fill="#64748b" />
    <circle cx="184" cy="380" r="7" fill="#64748b" />
    <circle cx="132" cy="328" r="7" fill="#64748b" />
    <circle cx="132" cy="184" r="7" fill="#64748b" />
    <circle cx="184" cy="132" r="7" fill="#64748b" />

    <!-- Hands -->
    <line x1="256" y1="256" x2="175" y2="155" stroke="#dc2626" stroke-width="18" stroke-linecap="round" />
    <line x1="256" y1="256" x2="345" y2="125" stroke="#0284c7" stroke-width="12" stroke-linecap="round" />

    <!-- Center Hub -->
    <circle cx="256" cy="256" r="22" fill="#d97706" />
    <circle cx="256" cy="256" r="14" fill="#fbbf24" />
    <circle cx="256" cy="256" r="6" fill="#ffffff" />
  </g>
</svg>`;

  const stdBuffer = Buffer.from(standardSvg);
  const maskBuffer = Buffer.from(maskableSvg);

  console.log('Generating PNG icons...');

  // 512x512 Standard
  await sharp(stdBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'icon-512.png'));
  // 192x192 Standard
  await sharp(stdBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'icon-192.png'));

  // 512x512 Maskable
  await sharp(maskBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'icon-512-maskable.png'));
  // 192x192 Maskable
  await sharp(maskBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'icon-192-maskable.png'));

  // Apple Touch Icon 180x180
  await sharp(stdBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // Favicon 64x64, 32x32, 16x16
  await sharp(stdBuffer).resize(64, 64).png().toFile(path.join(publicDir, 'favicon.png'));
  await sharp(stdBuffer).resize(32, 32).png().toFile(path.join(publicDir, 'favicon-32x32.png'));
  await sharp(stdBuffer).resize(16, 16).png().toFile(path.join(publicDir, 'favicon-16x16.png'));

  console.log('Generating High-Resolution Screenshots...');

  // Desktop Screenshot (1920x1080)
  if (fs.existsSync(path.join(publicDir, 'screenshot-desktop.jpg'))) {
    await sharp(path.join(publicDir, 'screenshot-desktop.jpg'))
      .resize(1920, 1080, { fit: 'contain', background: '#fffbeb' })
      .png()
      .toFile(path.join(publicDir, 'screenshot-desktop.png'));
  } else {
    // Generate SVG fallback
    const desktopSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
      <rect width="1920" height="1080" fill="#fffbeb"/>
      <rect x="80" y="60" width="1760" height="960" rx="24" fill="#ffffff" stroke="#fde68a" stroke-width="4"/>
      <text x="960" y="200" font-family="'Tajawal', sans-serif" font-size="52" font-weight="900" fill="#d97706" text-anchor="middle">ساعتي التفاعلية - التعلم الممتع</text>
      <text x="960" y="260" font-family="'Tajawal', sans-serif" font-size="28" font-weight="700" fill="#475569" text-anchor="middle">تطبيق تعليمي وصوتي تفاعلي لتعليم قراءة وضبط الساعة</text>
    </svg>`;
    await sharp(Buffer.from(desktopSvg)).resize(1920, 1080).png().toFile(path.join(publicDir, 'screenshot-desktop.png'));
  }

  // Mobile Screenshot (1080x1920)
  if (fs.existsSync(path.join(publicDir, 'screenshot-mobile.jpg'))) {
    await sharp(path.join(publicDir, 'screenshot-mobile.jpg'))
      .resize(1080, 1920, { fit: 'contain', background: '#fffbeb' })
      .png()
      .toFile(path.join(publicDir, 'screenshot-mobile.png'));
  } else {
    const mobileSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
      <rect width="1080" height="1920" fill="#fffbeb"/>
      <rect x="60" y="80" width="960" height="1760" rx="32" fill="#ffffff" stroke="#fde68a" stroke-width="4"/>
      <text x="540" y="300" font-family="'Tajawal', sans-serif" font-size="46" font-weight="900" fill="#d97706" text-anchor="middle">ساعتي التفاعلية</text>
    </svg>`;
    await sharp(Buffer.from(mobileSvg)).resize(1080, 1920).png().toFile(path.join(publicDir, 'screenshot-mobile.png'));
  }

  console.log('✅ All assets generated successfully!');
}

generateAssets().catch(console.error);
