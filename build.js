import esbuild from "esbuild";

const baseConfig = {
  entryPoints: ["src/index.ts"],
  outdir: "lib",
  bundle: true,
};

Promise.all([
  esbuild.build({
    ...baseConfig,
    format: "cjs",
    // minify: true,
    outExtension: {
      ".js": ".cjs",
    },
  }),

  esbuild.build({
    ...baseConfig,
    format: "esm",
    // minify: true,
  }),
]).catch(() => {
  console.log("Build failed");
  process.exit(1);
});
