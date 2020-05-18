const util = require('util')
const exec = util.promisify(require('child_process').exec);
const fs = require('fs')
const path = require('path')

async function lsWithGrep() {
    try {
        const alreadyExistedDirs = (await fs.promises.readdir(__dirname)).filter(source => {
            return fs.lstatSync(source).isDirectory()
        })
        await exec('tar zxf ' + process.argv[2]);
        await Promise.all((await fs.promises.readdir(__dirname))
            .filter(source => {
                return fs.lstatSync(source).isDirectory()
            })
            .map(async dir => {
                if (!fs.existsSync(__dirname + path.sep + dir + path.sep + 'asset')) {
                    return
                }
                const assetFilePath = await (await fs.promises.readFile(__dirname + path.sep + dir + path.sep + 'pathname'))
                    .toString()
                    .split(/\r?\n/)[0]
                const assetDirectory = __dirname + path.sep + path.dirname(assetFilePath)
                await fs.promises.mkdir(assetDirectory, { recursive: true });
                return fs.promises.copyFile(__dirname + path.sep + dir + path.sep + 'asset', assetDirectory + path.sep + path.basename(assetFilePath))
            }))
        const newDirs = (await fs.promises.readdir(__dirname))
            .filter(source => {
                return fs.lstatSync(source).isDirectory()
            })
            .filter(dir => !alreadyExistedDirs.includes(dir) && !dir.startsWith('Asset'))
        newDirs.forEach(dir => fs.rmdirSync(dir, { recursive: true }))
    } catch (err) {
        console.error(err);
    };
};
lsWithGrep()
