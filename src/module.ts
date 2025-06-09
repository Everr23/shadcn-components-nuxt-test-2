import { name, version } from "../package.json";
import { defu } from "defu";
import {
  createResolver,
  defineNuxtModule,
  addComponentsDir,
  addImportsDir,
  addVitePlugin,
  addPlugin,
  installModule,
  hasNuxtModule,
} from "@nuxt/kit";
import { addTemplates } from "./templates";

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: "b24ui",
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    nuxt.options.b24ui = options;
    nuxt.options.alias["#b24ui"] = resolve("./runtime");

    // Isolate root node from portaled components
    nuxt.options.app.rootAttrs = nuxt.options.app.rootAttrs || {};
    nuxt.options.app.rootAttrs.class = [
      nuxt.options.app.rootAttrs.class,
      "isolate",
    ]
      .filter(Boolean)
      .join(" ");

    if (nuxt.options.builder === "@nuxt/vite-builder") {
      const plugin = await import("@tailwindcss/vite").then((r) => r.default);
      addVitePlugin(plugin());
    } else {
      nuxt.options.postcss.plugins["@tailwindcss/postcss"] = {};
    }

    addComponentsDir(
      {
        path: resolve("./runtime/components/ui"),
        extensions: [".vue"],
        prefix: "",
        pathPrefix: false,
        global: true,
      },
      {
        prepend: true,
      }
    );

    addTemplates();
  },
});
