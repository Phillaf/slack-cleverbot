# Slack Cleverbot


## Setup

Make sure to copy ``example/config.js.example`` to ``example/config.js`` and modify its content.

### Setup with node.js & npm

#### Requirements

- npm@4.0.5
- node@7.4.0

#### Steps

1. Run ``npm install``.
2. Run ``npm run start``.

### Setup with Docker & Docker-Compose

#### Requirements

- docker@1.12.3
- docker-compose@1.8.1

Make sure you have installed the latest version of docker & docker-compose. Read the [official documentation](https://www.docker.com/products/overview) on how to install Docker engine.

#### Steps

1. Create an alias for node and npm:
  - ``alias npm='docker run -it --rm -v $(pwd):$(pwd) -w $(pwd) node:latest npm'``
  - ``alias node='docker run -it --rm -v $(pwd):$(pwd) -w $(pwd) node:latest node'``
2. Install npm packages: ``npm install``.
3. Start your docker stack: ``docker-compose up -d``

## License

Licensed under [MIT License](LICENSE)
