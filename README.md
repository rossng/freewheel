# Freewheel

Freewheel is a Web Extension that automatically scrolls the current browser tab so that you can make slick screen recordings.

![An example recording while using Freewheel](docs/demo.mp4)

![Screenshot of the Freewheel UI](docs/screenshot.png)

## Development

- Install Node
- Enable [corepack](https://nodejs.org/api/corepack.html) by running `corepack enable`
  - This will allow you to use the correct version of pnpm without explicitly installing it.
- `pnpm install`
- `pnpm build` to build the extension to the `dist` directory.
- `pnpm build:prod` will build the extension to the `dist` directory without source maps.
