# James

Forked from the original [Boole](https://github.com/ShazzAmin/Boole), created by Shazz Amin and Derek Yin

A modern, feature-enhanced front end for George, building upon the foundation of the original Boole project. This fork introduces new improvements for usability, performance, and workflow efficiency.

![](/docs/screenshots/main.png)

### What's New in This Fork

- Enhanced debugging features for Z-specs ![](/docs/gifs/z-debugger.gif)

- Expression evaluator ![](/docs/gifs/expression-evaluator.gif)

- Automatic submission to MarkUs

- Dark and Light Mode Support: A new theme option for better readability

- Quality of life improvements: Collapsible panels, text wrapping, keyboard shortcuts

### Features

- Auto-complete for George

- File management for assignments and homeworks (auto-fetching, saving, downloading)

- Verification by George (with distinct indicators for different types of feedback)

### Deploying on student server
- After repo is cloned on the SE212 Account, change language server URL in src/context/LanguageServerContext.tsx
    - This needs to match the port used for the language server
    - For details, please see README.md in LS Repo
- Run `npm install` if you haven't
- Run `npm run build`, which creates a build/ dir
- Move the build/ dir into public_html/james
- Set permissions:
    `chmod 0644 index.html`
    `chmod 0644 favicon.ico`
    `chmod 0644 static/js/<main js file>`
    `chmod 0644 static/css/<main css file>`

### Set-up

##### Prerequisites:

- Node.js (^16.0.0)
- npm (^8.0.0)

`npm install`

### Run

`npm run start`

### Build

`npm run build`

### License

[MIT](LICENSE)

This project is based on the original James by Shazz Amin and Derek Yin and is maintained with additional features by new contributors.
