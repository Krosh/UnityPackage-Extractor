const util = require('util')
const exec = util.promisify(require('child_process').exec);
const fs = require('fs')
const path = require('path')

async function lsWithGrep() {
    try {
        await exec('tar zxf ' + process.argv[2]);
        (await fs.promises.readdir(__dirname))
            .filter(source => {
                return fs.lstatSync(source).isDirectory()
            })
            .forEach(async dir => {
                if (!fs.existsSync(__dirname + path.sep + dir + path.sep + 'asset')) {
                    return
                }
                const assetFilePath = await (await fs.promises.readFile(__dirname + path.sep + dir + path.sep + 'pathname')).toString()
                const assetDirectory = __dirname + path.sep + path.dirname(assetFilePath)
                await fs.promises.mkdir(assetDirectory, { recursive: true });
                await fs.promises.copyFile(__dirname + path.sep + dir + path.sep + 'asset', assetDirectory + path.basename(assetFilePath))
            })
    } catch (err) {
        console.error(err);
    };
};
lsWithGrep()
