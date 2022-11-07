# Design Manager (design-manager)

Design Manager

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Lint the files
```bash
yarn lint
# or
npm run lint
```


### Format the files
```bash
yarn format
# or
npm run format
```



### Build the app for production
```bash
quasar build
```

### Launch json mock api server 
First, switch mode before quasar dev:
```
$env:JSON_SERVER = 'true' 
# or 
JSON_SERVER=true
```
after that start the server:
```
json-server --watch demo/db.json --routes demo/routes.json
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
