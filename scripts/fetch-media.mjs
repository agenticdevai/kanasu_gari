import fs from 'node:fs';
const posts = JSON.parse(fs.readFileSync('research/instagram/kanasu-gari-posts.json', 'utf8')).posts;
const ids = { bunny: 'DewQPr8N8su', sunflower: 'DeJcimvtZG3', bag: 'DeecLyjhzBB', cushion: 'Dbfkb1MPUkF', daisy: 'DeJcwChNKrY', keychain: 'DeecN4Whedn', gajra: 'DfR8JjnBjrs', rangoli: 'DYY_S5jNS_w' };
fs.mkdirSync('public/media', { recursive: true });
await Promise.all(Object.entries(ids).map(async ([name, id]) => {
  try {
    const post = posts.find(p => p.url.includes(id));
    const response = await fetch(post.mediaUrl, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(`public/media/${name}.mp4`, data);
    console.log(`${name}: ${data.length} bytes`);
  } catch (error) { console.error(`${name}: ${error.message}`); process.exitCode = 1; }
}));
