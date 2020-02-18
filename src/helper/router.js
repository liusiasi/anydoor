const fs = require('fs');
const promisify = require('util').promisify;

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

const Handlebars = require('handlebars');
const path = require('path');
const tplPath = path.join(__dirname,'../template/dir.tpl');
const source = fs.readFileSync(tplPath);
const template = Handlebars.compile(source.toString());
const mime = require('./mime');
const compress = require('../config/compress');
const range = require('../helper/range');
const isFresh = require('../helper/cache');
module.exports = async function(req, res, filePath, config ) {
  try {
    const fileDecodePath = decodeURI(filePath);
    const stats = await stat(fileDecodePath);
    if(stats.isFile()){
      const contentType = mime(fileDecodePath);
      if(isFresh(stats, req, res)){
        res.statusCode = 304;
        res.end();
      }
      res.statusCode = 200;
      res.setHeader('Content-type', contentType);
      const { code, start, end } = range(stats.size, req, res);
      let rs;
      if(code === 200){
        rs = fs.createReadStream(fileDecodePath);
      }else if(code === 416){
        res.statusCode = 416;
        res.end();
      }else {
        res.statusCode = 206;
        rs = fs.createReadStream(fileDecodePath,{start, end});
      }
      if(fileDecodePath.match(config.compress)){
        rs = compress(rs, req, res);
      }
      rs.pipe(res);
    }else if(stats.isDirectory()){
        const files = await readdir(fileDecodePath);
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/html');
        const dir = path.relative(config.root, fileDecodePath);
        const data = {
          title: path.basename(fileDecodePath),
          dir: dir?`/${dir}`:'',
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
