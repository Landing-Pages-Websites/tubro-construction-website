import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";
const require = createRequire(import.meta.url);

/** Execute the actual TypeScript boundary with an isolated env and no real network. */
export function loadModule(file, globals = {}, cache = new Map()) {
  const resolved = path.resolve(file);
  if (resolved.endsWith(".json")) return JSON.parse(readFileSync(resolved, "utf8"));
  if (resolved.endsWith(".css")) return {};
  if (cache.has(resolved)) return cache.get(resolved).exports;
  const module = { exports: {} };
  cache.set(resolved, module);
  const localRequire = (name) => {
    if (globals.moduleMocks?.[name]) return globals.moduleMocks[name];
    if (name.startsWith("@/") || name.startsWith(".")) {
      const base = name.startsWith("@/") ? path.resolve("src", name.slice(2)) : path.resolve(path.dirname(resolved), name);
      const target = [base, `${base}.ts`, `${base}.tsx`].find(existsSync);
      if (!target) throw new Error(`Cannot resolve ${name} from ${resolved}`);
      return loadModule(target, globals, cache);
    }
    return require(name);
  };
  const compiled = ts.transpileModule(readFileSync(resolved, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const sandbox = { module, exports: module.exports, require: localRequire, Buffer, crypto, TextEncoder, TextDecoder, Request, Response, Headers, AbortSignal, URL, setTimeout, clearTimeout, ...globals };
  vm.runInNewContext(compiled, sandbox, { filename: resolved });
  return module.exports;
}
