# sockets-against-humanity
A webapp version of cards against humanity (and apples to apples by extension) using React and Socket.io

## Folder Structure
Static files are copied over to public with `npm run copy`, src files are compiled into lib using `npm run build` and then bundled from lib into public with `npm run bundle`. Development contains files not used in final version but useful for development (usually compiling different json files).

To serve website, run src/server.js with `npm run serve`, which points to the public directory for files.

To completely re-copy/build/bundle/serve, run `npm run start`.

## Current tasks
* **Comment code**
* Actually serving the site externally
* Allowing users to switch between decks on creation
* Save games?
