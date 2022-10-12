[![CodeFactor](https://www.codefactor.io/repository/github/oparaskos/vscode-fountain/badge)](https://www.codefactor.io/repository/github/oparaskos/vscode-fountain)

![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/oliverparaskos.fountain-lsp)

# <img src="https://github.com/oparaskos/vscode-fountain/blob/main/assets/fountain-logo-monochrome@1x.png" alt="icon" width="36" style="display: inline; margin-bottom: -10px"/> Fountain Language Server and Client

## Functionality

This Language Server works for fountain files. It has the following language features:
- Completions
<!-- - Diagnostics regenerated on each file change or configuration change -->

<!-- It also includes an End-to-End test. -->

## Folder Structure

```
.
├── client // Language Client
│   ├── src
│   │   ├── test // End to End tests for Language Client / Server
│   │   └── extension.ts // Language Client entry point
├── package.json // The extension manifest.
├── syntaxes // The extension manifest.
│   └── fountain.tmLanguage.json // Grammar for syntax highlighting
├── server // Language Server
│   └── src
│       └── server.ts // Language Server entry point
└── webviews // VSCode UI Framework Webview, shows stats etc.
```

## Running the Language Server and Extension

- Run `npm install` in this folder. This installs all necessary npm modules in both the client and server folder
- Open VS Code on this folder.
- Press Ctrl+Shift+B to start compiling the client and server in [watch mode](https://code.visualstudio.com/docs/editor/tasks#:~:text=The%20first%20entry%20executes,the%20HelloWorld.js%20file.).
- Switch to the Run and Debug View in the Sidebar (Ctrl+Shift+D).
- Select `Launch Client` from the drop down (if it is not already).
- Press ▷ to run the launch config (F5).
- If you want to debug the server as well, use the launch configuration `Attach to Server`
- In the [Extension Development Host](https://code.visualstudio.com/api/get-started/your-first-extension#:~:text=Then%2C%20inside%20the%20editor%2C%20press%20F5.%20This%20will%20compile%20and%20run%20the%20extension%20in%20a%20new%20Extension%20Development%20Host%20window.) instance of VSCode, open a document in 'fountain' language mode.
