This project provides a simple verifiable credential wallet. It consists of two parts:

- the frontend in `./frontend` which is written in React and was created using [vite](https://vite.dev/)
- the backend in `./backend` which is implemented as a [NestJS](https://nestjs.com/) application

## Development

To develop this application you can run `npm run docker:dev` in the root of the project. This will start both the backend and the frontend in docker containers with all the required dependencies installed. The frontend will be available under `http://localhost:3001`. The backend can be accessed under `http://localhost:3000/api/...`

## Building

To build an executable docker image you can run `npm run docker:build <image-name>` in the root of the project. This will create a docker image containing the build output of both the frontend and the backend.

To start the built image you can run `docker run --rm --name <container-name> -d -p 3000:3000 <image-name>`. The frontend will then be available under `http://localhost:3000`.

To test the interaction between two wallets you can run `docker run -it --name <container-1-name> --rm --net=host -e PORT=4000 -e WALLET_URL=http://localhost:4000 <image-name>` and `docker run -it --name <container-2-name> --rm --net=host -e PORT=3000 -e WALLET_URL=http://localhost:3000 <image-name>`. The frontends should then be available under `http://localhost:3000` and `http://localhost:4000` and the backends should be able to communicate with one another. Credentials issued in one wallet can then be verified in the other wallet.
