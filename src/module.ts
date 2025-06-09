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
    configKey: "unaxt",
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url);

    nuxt.options.unaxt = options;
    nuxt.options.alias["#unaxt"] = resolve("./runtime");

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
