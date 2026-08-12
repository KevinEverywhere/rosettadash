const path = require('node:path');
const { pathToFileURL } = require('node:url');

const { setShadowPackageSrcRoot, registerAllShadowBases } = require('./src/lib/shadow-base.ts');

setShadowPackageSrcRoot(pathToFileURL(path.join(__dirname, 'src') + path.sep).href);
registerAllShadowBases();
