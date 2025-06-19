import { build } from "esbuild";

build({
  entryPoints: ["index.js"],
  bundle: true,
  platform: "node",
  target: "node18",
  outfile: "bundle.js",
}).catch(() => process.exit(1));
console.log("Arquivo build.js executado com sucesso.");
