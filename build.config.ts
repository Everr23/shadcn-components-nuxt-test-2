import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  hooks: {
    "mkdist:entry:options"(ctx, entry, options) {
      options.addRelativeDeclarationExtensions = false;
    },
  },
  externals: ["#build/unaxt", "vite"],
});
