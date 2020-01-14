# Todo App - Desktop Electron

This is a todo app developed in Electron Js. This app has following functionalities
- Show all todo items on main window
- Add new todo item from main window
- Positioning of application window
- Saving data to system in json format
# Quick Start

**Clone and run for a quick way to see Todo Application in action.**

- `package.json` - Points to the app's main file and lists its details and dependencies.
- `main.js` - Starts the app and creates a browser window to render HTML. This is the app's **main process**.
- `renderer/mainWindow.js` - A **renderer process** to handle the todo app events
- `views/mainWindow.html` - A HTML page showing Todo Items and form to add new Todo Item
- `services/DataStore.js` - DataStore class which extends electron-store, to process data storing related operations

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
https://github.com/masim5722/electron-todolist-app.git
# Go into the repository
cd electron-todolist-app
# Install dependencies
npm install
# Run the app
npm start
```

## License

[ MIT License](LICENSE.md)
