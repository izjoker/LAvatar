
cp -a ../build/. /usr/share/nginx/html
cp ../nginx.conf /etc/nginx/conf.d/default.conf
systemctl reload nginx
