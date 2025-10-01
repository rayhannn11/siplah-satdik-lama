const fs = require('fs');
const path = require('path');

const versionFilePath = path.join(__dirname, 'src', 'store', 'version.js');
const versionFileContent = fs.readFileSync(versionFilePath, 'utf8');

const versionMatch = versionFileContent.match(/const\s+version\s*=\s*(\d+)/);
if (!versionMatch) {
  console.error('Could not find version number in version.js');
  process.exit(1);
}

const currentVersion = parseInt(versionMatch[1], 10);
const newVersion = currentVersion + 1;

// Update version.js with new version
const updatedVersionContent = versionFileContent.replace(
  /const\s+version\s*=\s*\d+/,
  `const version = ${newVersion}`
);
fs.writeFileSync(versionFilePath, updatedVersionContent);

// Update version.json in public directory
const versionJsonPath = path.join(__dirname, 'public', 'version.json');
const versionJson = {
  version: newVersion,
  buildTime: new Date().toISOString()
};
fs.writeFileSync(versionJsonPath, JSON.stringify(versionJson, null, 2));

console.log(`Version updated from ${currentVersion} to ${newVersion}`);
