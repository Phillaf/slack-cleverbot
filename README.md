# Slack Cleverbot

## Setup

### Setup with Docker & Docker-Compose

1. Create an alias for node and npm:
  - ``alias npm='docker run -it --rm -v $(pwd):$(pwd) -w $(pwd) node:latest npm'``
  - ``alias node='docker run -it --rm -v $(pwd):$(pwd) -w $(pwd) node:latest node'``
2. Install npm packages: ``npm install``.
3. Start your docker stack: ``docker-compose up -d``
4. Hope it works!

## License

Licensed under [MIT License](LICENSE)
