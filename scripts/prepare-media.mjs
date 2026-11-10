import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import ffmpeg from 'ffmpeg-static';
const frames = { bunny: 9.6, sunflower: 0, bag: 3, cushion: 4, daisy: 0, keychain: 4.5, gajra: 9, rangoli: 5 };
for (const [name, second] of Object.entries(frames)) {
  if (!fs.existsSync(`public/media/${name}.mp4`)) continue;
  execFileSync(ffmpeg, ['-y', '-ss', String(second), '-i', `public/media/${name}.mp4`, '-frames:v', '1', '-vf', 'scale=720:-2', '-q:v', '3', `public/images/${name}.jpg`], { stdio: 'ignore' });
  if (!fs.existsSync(`public/images/${name}.jpg`)) throw new Error(`No poster generated for ${name}`);
  console.log(`Prepared ${name}.jpg`);
}
