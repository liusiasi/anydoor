module.exports = (totalSize, req, res) => {
  const range = req.headers['range'];
  if(!range){
    return {code: 200};
  }
  const size = range.match(/bytes=(\d*)-(\d*)/);
  const start_match = size[1];
  const end_match = size[2];
  let start = start_match || 0;
  let end = end_match || totalSize - 1;
  if(!start_match && end_match){
    start = totalSize - end_match;
    end = totalSize - 1;
  }

  if(start < 0 || end > totalSize-1 || start > end ){
    res.setHeader('Content-Range',`bytes*/(${totalSize})`);
    return {
      code: 416,
    }
  }else{
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Range',`bytes (${start}-${end})/(${totalSize})`);
    res.setHeader('Content-Length',end-start+1);
    return {
      code: 206,
      start: parseInt(start),
      end: parseInt(end),
    }
  }

}
