# Rappo / Editor Web App

<a href="https://stage.rappo.ai" target="_blank"><span>Stage Deployment</span> <img style="vertical-align: middle; margin-left: 8px;" src="https://github.com/rappo-ai/editor-web-app/workflows/Deploy%20to%20Digital%20Ocean/badge.svg?branch=master"></a>

This repository contains the codebase for Rappo editor front-end web application. Additionally it also contains the codebase for the Rappo server, which will eventually be moved into a different repository.


## Steps to Build & Run the app

1.  ### Environment Variables
    You will first need to set some environment variables. Create a copy of *.env.server.template* and *.env.webpack.template* without the *template* extension. Contact the Github code owner for credentials before proceeding.

2.  ### Build & Run
    #### Development build
    ```bash
    npm i
    npm run start
    ```
    This will start the development server on localhost:3000.

    #### Production build
    ```bash
    npm i
    npm run start:production
    ```
    This will start the production server on localhost:3000.
    
    You can change the port by setting the PORT env variable.

## Documentation

Please visit [docs/README.md](docs/README.md) for detailed documentation of this codebase.

## License

Please read [LICENSE](LICENSE.md) for the terms and conditions of using, modifying or distributing this source code.
