function readPackage(pkg, context) {
  if (pkg.name === 'esbuild' || pkg.name === 'sharp') {
    pkg.pnpm = pkg.pnpm || {};
    pkg.pnpm.allowBuild = true;
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
}
