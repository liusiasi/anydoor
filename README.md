# anydoor-liusisi
Tiny  NodeJS Static Web Service

```
npm i -g anydoor-liusisi
```

## 使用方法
```
anydoor # 把当前文件夹作为静态资源服务器根目录

anydoor -p 8080 # 设置端口号为 8080

anydoor -h localhost # 设置 host 为 localhost

anydoor -d /usr # 设置根目录为根目录
```

## 一些问题
### 1.当文件路径有中文的时候，url请求之后经过编码，server读取不到文件。
解决办法：将文件路径用decodeURI转码
```js
decodeURI(filePath);
```
### 2.当返回text/plain普通文本响应内容的时候，中文乱码。
解决办法：setHeader的时候指定content-type编码格式

```js
res.setHeader('Content-Type','text/plain; charset=utf-8')
```


