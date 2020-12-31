![Deploy to Digital Ocean](https://github.com/rappo-ai/editor-web-app/workflows/Deploy%20to%20Digital%20Ocean/badge.svg?event=deployment_status)

This repository contains the the codebase for Rappo editor front-end web application. Additionally it also contains the codebase for the Rappo server, which will eventually be moved into a different repository.

Environment Variables

You will first need to set some environment variables. See files .env.server.template and .env.webpack.template for the list of variables. Obtain credentials manually or by contacting the Github code owner. Then create new files .env.server and .env.webpack and add the credentials.

Commands to build and run the app for development

npm i
npm run start

This will start the development server on localhost:3000, build the front-end using webpack and serve it.

Basic tech stack - React, Express, NodeJS, Webpack
