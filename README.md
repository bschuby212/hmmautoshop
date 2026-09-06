# Auto Shop van parts

Prototype for the Auto Shop parts browser, built on the existing Sticker Stand / Swipe Stack sheet flow.

## Develop

```bash
cd sticker-prototype
npm install
npm run dev
```

## Flow

1. Map drive to the stand (unchanged)
2. Bottom sheet opens with the original motion (unchanged)
3. After the sheet is fully open, Auto Shop content mounts
4. Browse parts with arrows; camera pans/zooms to each part
5. Add to Van saves the equipped part and opens the existing beach drive-off screen with the part attached
