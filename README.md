# vue-electron for crawler and monitoring

This is a desktop front-end app for controlling crawler, line notify and window10 screen monitoring. And also you need to provide a config.json for configuring your settings. The format of config.json is down below.

```
{
    "tokens": [
   {
            "name": "id",
            "token": "your token ..."
        }
    ],
    "time": [
        {
            "HH": "14",
            "mm": "00"
        },
        {
            "HH": "16",
            "mm": "30"
        }
    ],
    "frequency": "20",
    "directory": "C:\\Users\\Specific Directory"
}
```

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

