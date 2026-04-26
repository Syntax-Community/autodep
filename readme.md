# depify

Auto scan JavaScript / TypeScript imports and install missing dependencies automatically.

---

## 🚀 What is depify?

**depify** is a CLI tool that scans your project source code, detects external imports, resolves them to root npm packages, and installs them in one step.

It is designed for projects that are:
- newly cloned
- empty `node_modules`
- missing setup dependencies
- or need quick bootstrap from source code

---

## ⚙️ How it works

```
source code
   ↓
scan imports (js / ts / jsx / tsx)
   ↓
filter local + built-in modules
   ↓
resolve import → root package
   ↓
deduplicate
   ↓
npm install
```

---

## 📦 Features

- Scan `.js`, `.jsx`, `.ts`, `.tsx`, `.mjs`, `.cjs`
- Detect `import`, `require`, and dynamic imports
- Ignore local paths (`./`, `../`, `@/`, `~/`)
- Ignore Node.js built-in modules
- Resolve sub-path imports to root package (e.g. `next/image → next`)
- Deduplicate dependencies before install
- Simple CLI usage

---

## 🧑‍💻 Installation

```bash
npm install -g depify
```

or

```bash
npm link
```

---

## ▶️ Usage

Run inside your project:

```bash
depify
```

It will:

1. Scan all source files
2. Detect dependencies
3. Install missing packages

---

## 🧪 Example

### Input code:
```js
import React from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
```

### Output:
```bash
installing: react, next, @tanstack/react-query
```

---

## ⚠️ Notes

- This tool does not replace `package.json`
- It does not manage versions
- It is intended for bootstrap / setup purposes only
- Dev dependencies may also be detected depending on project structure

---

## 🧠 Limitations

- Uses static scanning (not full AST parsing yet)
- May include false positives in complex monorepos
- Does not distinguish devDependencies vs dependencies automatically
- Does not resolve TypeScript path aliases (`tsconfig paths`) yet

---

## 🔮 Future improvements

- AST-based parsing for higher accuracy
- Detect dev vs production dependencies
- Support monorepo & workspace
- Read `tsconfig.json` aliases
- Dry-run mode (`--dry-run`)
- Smart install grouping

---

## 📄 License

MIT
```