# PWA Icons Directory

This directory should contain the following icon files for the Progressive Web App (PWA) manifest:

## Required Icon Sizes

- `icon-72x72.png` (72x72 pixels)
- `icon-96x96.png` (96x96 pixels)
- `icon-128x128.png` (128x128 pixels)
- `icon-144x144.png` (144x144 pixels)
- `icon-152x152.png` (152x152 pixels)
- `icon-192x192.png` (192x192 pixels) - **Required for Android**
- `icon-384x384.png` (384x384 pixels)
- `icon-512x512.png` (512x512 pixels) - **Required for Android**

## How to Generate Icons

### Option 1: Use an Online Tool
1. Create a base icon image (minimum 512x512px recommended)
2. Use a free tool like:
   - https://www.pwabuilder.com/imageGenerator
   - https://favicon.io/favicon-converter/
   - https://realfavicongenerator.net/
3. Upload your base icon and download the generated set
4. Place all PNG files in this directory

### Option 2: Use ImageMagick (Command Line)
If you have ImageMagick installed, you can generate all sizes from a single source image:

```bash
# From a 512x512 source icon
convert icon-source.png -resize 72x72 icon-72x72.png
convert icon-source.png -resize 96x96 icon-96x96.png
convert icon-source.png -resize 128x128 icon-128x128.png
convert icon-source.png -resize 144x144 icon-144x144.png
convert icon-source.png -resize 152x152 icon-152x152.png
convert icon-source.png -resize 192x192 icon-192x192.png
convert icon-source.png -resize 384x384 icon-384x384.png
convert icon-source.png -resize 512x512 icon-512x512.png
```

### Option 3: Create Placeholder SVG Icons
For testing purposes, you can use simple SVG placeholders that will be converted to PNG.

## Design Guidelines

- Use a simple, recognizable design that works at small sizes
- Consider a weather-related icon (cloud, sun, etc.)
- Ensure sufficient contrast and readability
- Use a transparent or solid background
- Test icons on both light and dark backgrounds

## Temporary Placeholder

Until proper icons are added, the PWA will still function but may show default browser icons when installed.

The manifest.json file references these icons in the `/static/manifest.json` file.
