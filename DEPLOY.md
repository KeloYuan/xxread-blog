# xxread.top/blog 部署说明

这个项目部署到纽约 VPS，使用 AstroPaper 静态构建，最终通过 Nginx 以子路径形式挂载到：

- `https://xxread.top/blog/`

## 本地内容目录

- 文章目录：`src/data/essays/`
- 站点配置：`src/config.ts`
- 子路径配置：`astro.config.ts` 中的 `base: "/blog"`

## 线上目录

- 源码目录：`/var/www/xxread-blog-src`
- 构建目录：`/var/www/xxread-blog`

## Nginx 挂载方式

在 `xxread.top` 对应的 `server {}` 中加入：

```nginx
location = /blog {
    return 301 /blog/;
}

location ^~ /blog/ {
    alias /var/www/xxread-blog/;
    index index.html;
    try_files $uri $uri/ /blog/index.html;
}
```

这两段 location 要放在通用的 `location /` 反代规则之前。

## 发布流程

1. 把项目同步到服务器源码目录
2. 在服务器运行 `npm install`
3. 运行 `npm run build`
4. 把 `dist/` 内容同步到 `/var/www/xxread-blog/`
5. `nginx -t && systemctl reload nginx`
