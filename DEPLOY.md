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

## GitHub 自动部署

仓库已经预留了 GitHub Actions 自动部署流程：

- 工作流文件：`.github/workflows/deploy.yml`
- 触发条件：推送到 `main` 或手动触发
- 部署方式：GitHub Actions 本地构建后，`rsync` 到纽约 VPS

需要的仓库 secret / variables：

- Secret: `DEPLOY_SSH_KEY`
- Variable: `DEPLOY_HOST`
- Variable: `DEPLOY_USER`
- Variable: `DEPLOY_PATH`
- Variable: `DEPLOY_URL`
- Variable: `POST_SMOKE_URL`
- Variable: `RSS_URL`

配置完成后，日常发布流程会变成：

1. 修改 `src/data/essays/*.md`
2. `git add .`
3. `git commit -m "publish new post"`
4. `git push`
