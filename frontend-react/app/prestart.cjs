const fs = require('node:fs');
const path = require('node:path');

const assetsDir = path.join(__dirname, 'dist', 'assets');
if (!fs.existsSync(assetsDir)) process.exit(0);

const replacements = {
  __BACKEND_URL__: process.env.BACKEND_URL || '',
  __APP_TITLE__: process.env.APP_TITLE || 'Chat Assistant',
};

for (const file of fs.readdirSync(assetsDir)) {
  if (!file.endsWith('.js')) continue;
  const filePath = path.join(assetsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  for (const [placeholder, value] of Object.entries(replacements)) {
    if (content.includes(placeholder)) {
      content = content.replaceAll(placeholder, value);
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(filePath, content);
}
