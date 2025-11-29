import { defineConfig, loadConfigFromFile } from "vite";
    import type { Plugin, ConfigEnv } from "vite";
    import tailwindcss from "tailwindcss";
    import autoprefixer from "autoprefixer";
    import fs from "fs/promises";
    import path from "path";
    import {
      makeTagger,
      injectedGuiListenerPlugin,
      injectOnErrorPlugin
    } from "miaoda-sc-plugin";

    const env: ConfigEnv = { command: "serve", mode: "development" };
    const configFile = path.resolve(__dirname, "vite.config.ts");
    const result = await loadConfigFromFile(env, configFile);
    const userConfig = result?.config;

    export default defineConfig({
      ...userConfig,
      server: {
        ...userConfig?.server,
        hmr: false,
      },
      plugins: [
        makeTagger(),
        injectedGuiListenerPlugin({
          path: 'https://miaoda-resource-static.s3cdn.medo.dev/common/v2/injected.js'
        }),
        injectOnErrorPlugin(),
        ...(userConfig?.plugins || []),
      ]
    });
