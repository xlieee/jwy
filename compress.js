const compressing = require('compressing')
const fs = require('fs')
const chalk = require('chalk')

const { npm_package_name, npm_config_argv } = process.env
let [isBuild, env] = JSON.parse(npm_config_argv).original
env = env ? env.replace(/-*/, '') : (isBuild === 'build' ? 'test' : 'dev')

const dirName = `${npm_package_name}-${env}`

if (fs.existsSync(dirName + '.zip')) { 
  fs.unlinkSync(dirName + '.zip')
}
compressing.zip.compressDir(dirName, dirName + '.zip')
  .then(() => {
    console.log(
      chalk.green(`项目 ${dirName} 压缩完成! \n`) + 
      chalk.green(`输出 ${dirName}.zip`)
    )
  })
  .catch(() => {
    console.log(
      chalk.red(`项目 ${dirName} 压缩失败！`)
    )
  })

