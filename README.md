## Deployment

---

### Main API setup

1. Copy the `/main-api` directory.

2. Go to `/main-api` directory.

```
$ cd main-api
```

3. Install node modules.

```
main-api$ npm install
```

4. Copy the `/main-api/.env.example` to `/main-api/.env` then, fill out the config by editing the `.env` file. You may refer to the config documentation.

5. Start the app using [pm2](https://pm2.keymetrics.io/).

```
main-api$ pm2 start dist/main.js -i 0 -n main-api
```

_Note:_

- The `-i 0` is the number of instances (0 means the maximum number of CPUs).
- The `-n main-api` is the name of instance in [pm2](https://pm2.keymetrics.io/).
- Make sure you are in the `/main-api` directory when starting the app to read the `.env` config file.

_Please refer to [pm2 documentation](https://pm2.keymetrics.io/docs/usage/quick-start/) for other configs._

6. Check the status of the instance(s).

```
main-api$ pm2 list
```

or

```
main-api$ pm2 monit
```

7. Save the instance(s) to automatically start on server startup.

```
main-api$ pm2 save
```

### Main App setup

1. Copy the `/main-app` directory.

2. Go to `/main-app` directory.

```
$ cd main-app
```

3. Install node modules.

```
main-app$ npm install
```

_Note: The app is not yet running, let's go to the [Nginx setup](#nginx-setup)._

### PDF.js App setup

1. Just copy the `/pdfjs` directory.

### Nginx setup

1. Create a server for the Main App.

```
server {
  listen 3000;

  location / {
    root [BASE_PATH]/main-app/build;
    index index.html index.htm;
    try_files $uri /index.html;
  }
}
```

2. Create a server for the PDF.js App.

```
server {
  listen 3001;

  location / {
    root [BASE_PATH]/pdfjs;
    index index.html index.htm;
    try_files $uri /index.html;
  }
}
```

3. Set up the reverse proxy in the root server.

```
location / {
    proxy_pass http://localhost:3000;
}

location /pdfjs {
    rewrite /pdfjs/(.*) /$1 break;

    proxy_pass http://localhost:3001;
}

location /api {
    #rewrite /api/(.*) /$1 break;

    proxy_pass http://localhost:3002;
}
```

_Note:_

- Replace the `[BASE_URL]` to the location of the directories.
- `3002` is the port of Main API running from [pm2](https://pm2.keymetrics.io/).
- You may add `client_max_body_size` if documents' file sizes are larger than the default.
