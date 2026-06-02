# Icons & Branding Assets

## 🎨 Design Concept

The SituationalMap NP icons feature:

- **Shield** - Represents Nepal Police authority and protection
- **Map Marker** - Real-time location tracking
- **Radio Waves** - Communication and coordination
- **Badge Star** - Police emblem
- **Color Scheme**:
  - Primary Blue (#003893) - Nepal Police official color
  - Dark Background (#0A0E1A) - Professional command center aesthetic
  - Accent Blue (#4F6EBD) - Modern tech look
  - Alert Colors - Critical (Red), High (Orange), Info (Blue)

## 📦 Available Assets

### SVG Icons (Scalable)

- **`icon.svg`** (512×512) - Main app icon, high resolution
- **`favicon.svg`** (32×32) - Browser tab icon
- **`apple-touch-icon.svg`** (180×180) - iOS home screen icon

### Web App Manifest

- **`manifest.json`** - PWA configuration with app metadata

## 🚀 Usage

### Browser Tab Icon

Automatically loaded via:

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

### iOS Home Screen

```html
<link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
```

### Progressive Web App

```html
<link rel="manifest" href="/manifest.json" />
```

### Open Graph (Social Sharing)

```html
<meta property="og:image" content="/icon.svg" />
```

## 🎯 Icon Specifications

### Main Icon (icon.svg)

- **Size**: 512×512px
- **Format**: SVG (vector, scales to any size)
- **Usage**: App launcher, PWA install, high-res displays
- **Elements**:
  - Shield outline with NP text
  - Map marker with location indicator
  - Radio wave signals
  - Badge star

### Favicon (favicon.svg)

- **Size**: 32×32px
- **Format**: SVG
- **Usage**: Browser tabs, bookmarks
- **Simplified**: Fewer details for small size visibility

### Apple Touch Icon (apple-touch-icon.svg)

- **Size**: 180×180px
- **Format**: SVG
- **Usage**: iOS/iPadOS home screen
- **Design**: Optimized for Apple's rounded square mask

## 🌈 Color Palette

```css
/* Primary Colors */
--nepal-police-blue: #003893;
--dark-bg: #0a0e1a;
--accent-blue: #4f6ebd;
--border-color: #2a3248;

/* Status Colors */
--critical: #ff4d4d;
--high: #f59e0b;
--medium: #3b82f6;
--low: #10b981;
--resolved: #10b981;

/* Text Colors */
--text-primary: #e8eaf0;
--text-secondary: #8b94b0;
--text-muted: #5a6480;

/* Badge/Accent */
--gold: #ffd700;
```

## 📱 Platform Support

### ✅ Supported Platforms

- **Desktop Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Browsers**: Safari (iOS), Chrome (Android)
- **PWA Install**: Chrome (desktop/mobile), Edge, Safari
- **iOS Home Screen**: Optimized icon with proper sizing
- **Android Home Screen**: Adaptive icons

### 📐 Icon Sizes Generated

- 32×32 - Favicon (browser tab)
- 180×180 - Apple Touch Icon (iOS)
- 512×512 - Main app icon (PWA, desktop)
- SVG - Scalable for all resolutions

## 🔧 Customization

### To Update Colors

Edit the SVG files and change the `fill` attributes:

```svg
<!-- Shield background -->
<rect fill="#003893" />  <!-- Change this -->

<!-- Status indicators -->
<path fill="#3B82F6" />  <!-- Map marker blue -->
<path stroke="#F59E0B" /> <!-- Radio waves orange -->
<path fill="#FFD700" />   <!-- Badge star gold -->
```

### To Generate PNG Versions (if needed)

Use any SVG converter or online tool:

1. Upload SVG file
2. Export as PNG at desired size
3. Save to `/public/` directory
4. Update `manifest.json` to reference PNG files

## 📝 SEO & Metadata

The icons are integrated with:

- **Page Title**: "SituationalMap NP — Nepal Police Command Operations"
- **Description**: Real-time incident tracking and resource management
- **Theme Color**: #003893 (matches icon color scheme)
- **Open Graph**: Optimized for social media sharing
- **PWA Manifest**: Full app name, short name, and description

## 🎨 Design Files

If you need to edit the original design:

1. Open SVG files in vector editor (Illustrator, Inkscape, Figma)
2. Maintain 512×512 artboard for main icon
3. Keep design elements grouped for easy editing
4. Export as optimized SVG

## ✨ PWA Features

The manifest enables:

- **Add to Home Screen** - One-click install
- **Standalone Mode** - Runs like native app
- **Custom Splash Screen** - Uses icon and theme colors
- **App Shortcuts** - Quick access to Map, Incidents, Resources
- **Orientation**: Any (portrait/landscape support)

## 🔍 Testing

### Test Icon Visibility

1. **Desktop**: Check browser tab
2. **Mobile**: Add to home screen
3. **PWA**: Install app, check launcher icon
4. **Dark Mode**: Verify icon contrast

### Test Commands

```bash
# Verify files exist
ls -lah public/*.svg public/manifest.json

# Test in browser
open http://localhost:3000

# Check manifest
open http://localhost:3000/manifest.json
```

## 📊 File Sizes

All icons are SVG (vector format):

- **icon.svg**: ~2KB (scales infinitely)
- **favicon.svg**: ~1KB (optimized for small size)
- **apple-touch-icon.svg**: ~2KB
- **manifest.json**: <1KB

Total asset size: **~5KB** - incredibly lightweight! 🚀

---

**Icons are production-ready and optimized for all platforms!** ✅
