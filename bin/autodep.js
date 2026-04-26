#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const builtinModules = require("module").builtinModules;

const cwd = process.cwd();

const exts = [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"];
const files = [];

const builtins = new Set([
    ...builtinModules,
    ...builtinModules.map(m => `node:${m}`)
]);

const frameworkMap = {
    "next/image": "next",
    "next/head": "next",
    "next/router": "next",
    "next/navigation": "next",
    "react/jsx-runtime": "react",
    "react/jsx-dev-runtime": "react"
};

function walk(dir) {
    for (const file of fs.readdirSync(dir)) {
        const full = path.join(dir, file);
        if (full.includes("node_modules") || full.includes(".git")) continue;
        if (!fs.existsSync(full)) continue;

        const stat = fs.statSync(full);
        if (stat.isDirectory()) walk(full);
        else if (exts.includes(path.extname(file))) files.push(full);
    }
}

function isLocal(mod) {
    return (
        mod.startsWith(".") ||
        mod.startsWith("/") ||
        mod.startsWith("@/") ||
        mod.startsWith("~/") ||
        mod.startsWith("#")
    );
}

function resolvePackage(importPath) {
    if (frameworkMap[importPath]) return frameworkMap[importPath];

    if (importPath.startsWith("@")) {
        const parts = importPath.split("/");
        return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : parts[0];
    }

    return importPath.split("/")[0];
}

const importRegex = /import\s+(?:.*?\s+from\s+)?["']([^"']+)["']/g;
const requireRegex = /require\(["']([^"']+)["']\)/g;
const dynamicImportRegex = /import\(["']([^"']+)["']\)/g;

const deps = new Set();

walk(cwd);

for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");

    let match;

    while ((match = importRegex.exec(content))) {
        const mod = match[1];

        if (!mod || isLocal(mod)) continue;
        if (builtins.has(mod) || builtins.has(`node:${mod}`)) continue;

        deps.add(resolvePackage(mod));
    }

    while ((match = requireRegex.exec(content))) {
        const mod = match[1];

        if (!mod || isLocal(mod)) continue;
        if (builtins.has(mod) || builtins.has(`node:${mod}`)) continue;

        deps.add(resolvePackage(mod));
    }

    while ((match = dynamicImportRegex.exec(content))) {
        const mod = match[1];

        if (!mod || isLocal(mod)) continue;
        if (builtins.has(mod) || builtins.has(`node:${mod}`)) continue;

        deps.add(resolvePackage(mod));
    }
}

const list = [...deps];

if (list.length === 0) {
    console.log("no dependencies found");
    process.exit(0);
}

console.log("installing:", list.join(", "));
execSync(`npm install ${list.join(" ")}`, { stdio: "inherit" });