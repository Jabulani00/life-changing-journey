const path = require('path')

const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, '..')
const expoMetroPath = require.resolve('expo/metro-config', {
  paths: [projectRoot, monorepoRoot],
})
const { getDefaultConfig } = require(expoMetroPath)
const config = getDefaultConfig(projectRoot)

config.watchFolders = [...new Set([...(config.watchFolders || []), monorepoRoot])]

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
]

module.exports = config
