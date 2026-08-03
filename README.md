This project provides a simple verifiable credential wallet. It consists of two parts:

- the frontend in `./frontend` which is written in React and was created using [vite](https://vite.dev/)
- the backend in `./backend` which is implemented as a [NestJS](https://nestjs.com/) application

## Development

To develop this application you can run `npm run docker:dev` in the root of the project. This will start both the backend and the frontend in docker containers with all the required dependencies installed.

## Building

To build an executable docker image you can run `npm run docker:build <image-name>` in the root of the project. This will create a docker image containing the build output of both the frontend and the backend.

To start the built image you can run `docker run --rm --name <container-name> -d -p 3000:3000 <image-name>`
