# Slack Cleverbot

A slackbot integration of [cleverbot](http://www.cleverbot.com/).

## Configuration

Copy `example/config.js.example` to `example/config.js` and update it with your own tokens.

## Installation

Installation using npm and node 7.4

```
npm install
npm run start
```

Installation using docker and docker-compose

```
docker run -it --rm -v $(pwd):$(pwd) -w $(pwd) node:latest npm install
docker-compose up -d
```

## License

Licensed under [MIT License](LICENSE)
