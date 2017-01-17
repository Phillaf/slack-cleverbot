# Slack Cleverbot

A slackbot integration of [cleverbot](http://www.cleverbot.com/).

```
npm install slack-cleverbot
```

## Getting started

Copy `example/config.js.example` to `example/config.js` and update it with your own tokens. Then run

```
npm install
npm run start
```

## Docker installation

```
docker run -it --rm -v $(pwd):$(pwd) -w $(pwd) node:latest npm install
docker-compose up -d
```

## License

Licensed under [MIT License](LICENSE)
