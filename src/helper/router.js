const fs = require('fs');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const Handlebars = require('handlebars');
const path = require('path');
const tplPath = path.join(__dirname,'../template/dir.tpl');
const source = fs.readFileSync(tplPath);
const template = Handlebars.compile(source.toString());
const config = require('../config/defaultConfig');

module.exports = async function(req, res, filePath ) {
  try {
    const stats = await stat(filePath);
    if(stats.isFile()){
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/plain');
      fs.createReadStream(filePath).pipe(res);
    }else if(stats.isDirectory()){
        const files = await readdir(filePath);
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/plain');
        const data = {
          title: path.basename(filePath),
          dir: path.relative(config.root, filePath),
          files,
        }
        res.end(template(data));
    }
  } catch (error) {
    res.statusCode = 404;
    res.setHeader('Content-type', 'text/plain');
    res.end(`${filePath} is not a direction or file`);
  }
}