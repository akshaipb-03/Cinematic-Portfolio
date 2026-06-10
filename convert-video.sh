#!/bin/bash
# Re-encode intro video from HEVC to H.264 for browser compatibility
INPUT="./public/assets/intro-compressed.mp4"
OUTPUT="./public/assets/intro-h264.mp4"
BACKUP="./public/assets/intro-hevc-backup.mp4"

echo "Backing up original..."
cp "$INPUT" "$BACKUP"

echo "Re-encoding HEVC -> H.264..."
ffmpeg -y -i "$INPUT" \
  -c:v libx264 -preset slow -crf 23 \
  -profile:v high -pix_fmt yuv420p \
  -movflags +faststart \
  -c:a aac -b:a 96k \
  "$OUTPUT"

if [ $? -eq 0 ]; then
  echo "Replacing original with H.264 version..."
  mv "$OUTPUT" "$INPUT"
  echo "Done! Original backed up to $BACKUP"
  echo "New file info:"
  ls -lh "$INPUT"
else
  echo "Encoding failed!"
  exit 1
fi
