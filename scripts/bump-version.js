const fs = require('fs');
const path = require('path');

// Czytaj package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const versionJsPath = path.join(__dirname, '..', 'app', 'version.js');

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

// Zaktualizuj app/version.js
const versionJsContent = `export const APP_VERSION = "${version}";\n`;
fs.writeFileSync(versionJsPath, versionJsContent, 'utf8');

console.log(`✓ Zaktualizowano wersję do ${version} w app/version.js`);

