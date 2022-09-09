# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
yarn docs:build

# 进入生成的文件夹，这里是默认的路径，可以自定义
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.isunbeam.cn' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:<BranchName>
git push -f git@github.com:maniacflow/vuepress.git master:gh-pages

cd -
