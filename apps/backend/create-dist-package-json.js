const fs = require('fs');
const path = require('path');

/**
 * Creates a copy of the package.json without the devDependencies and copies it to the outDir for the build
 *
 * Should be run automatically by the build script
 */
function transformAndCopyPackageJson() {
  const tsConfig = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'tsconfig.json'), 'utf8'),
  );
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'),
  );

  delete packageJson.devDependencies;
  delete packageJson.scripts;
  packageJson.main = 'main.js';
  delete packageJson.jest;
  delete packageJson.exports;

  const outFile = path.join(
    __dirname,
    tsConfig.compilerOptions.outDir,
    'package.json',
  );
  fs.writeFileSync(outFile, JSON.stringify(packageJson, undefined, 2));
}

transformAndCopyPackageJson();
