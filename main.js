const electron = require('electron');
const url = require('url');
const path = require('path');
const DataStore = require('./services/DataStore');

const todosData = new DataStore({name: 'My Todos'});

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let xPosition;
let yPosition;

// Listen for the app to be ready
app.on('ready', function(){
    //
    const initial_position = todosData.getPosition();
    if(initial_position){
        xPosition = initial_position["x"]
        yPosition = initial_position["y"]
    }
    // create new window
    mainWindow = new BrowserWindow({
        show: false,
        frame: false ,
        resizable: true,
        minWidth:400,
        minHeight:400,
        width:400,
        height:400,
        maxWidth:800,
        maxHeight:800,
        x: xPosition,
        y: yPosition,
        icon: __dirname + '/assets/img/app.icns',
        webPreferences: {
            nodeIntegration: true
        }
    });

    // load html in to window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/views/mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    // inset menu
    Menu.setApplicationMenu(mainMenu);

    // build context menu
    const contextMenu = Menu.buildFromTemplate(contextMenuTemplate);
    
    // inserting context menu
    mainWindow.webContents.on('context-menu', function(e, parms){
        contextMenu.popup(mainWindow, parms.x, parms.y)
    });

    // Quit app when close
    mainWindow.on('closed', function(){
        app.quit();
    });

    // showing the main window when its ready
    mainWindow.webContents.on('did-finish-load', function() {
        mainWindow.show();
        // getting todos
        getTodo();
    });
});

// getting all todos
function getTodo(){
    const todos = todosData.getTodos()
   
    mainWindow.webContents.send('todos:show', todos.todos);
}

// Catch item add
ipcMain.on('item:add', function(e, item){
    const todo = {
        id: Math.random(),
        item: item,
        isCompleted: false
    };
    todosData.addTodo(todo);
    mainWindow.webContents.send('item:add', todo);
});

// Catch close app
ipcMain.on('app:close', function(){
    app.quit();
});


// Catch delete todos item
ipcMain.on('todos:delete', function(e, id){
    todosData.deleteTodo(id);
    getTodo();
});

// Catch update todo item
ipcMain.on('todos:updateStatus', function(e, id){
    todosData.updateTodoStatus(id);
    getTodo();
});

// Catch position on widnow move
ipcMain.on('window:position', function(e, position){
    todosData.addPosition(position)
});

// create application menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
               label: 'Add Todo',
               click(){
                   createAddWindow();
               }
            },
            {
                type: 'separator',
            },
            {
                label: 'Clear Todo',
                click(){
                    todosData.deleteAllTodos();
                    getTodo();
                }
            },
            {
                type: 'separator',
            },
            {
                label: 'Quit',
                accelerator: 'CmdOrCtrl + Q',
                click:function(){
                    app.quit();
                }
            }
        ]

    }
];

// create context menu template
const contextMenuTemplate = [
    {
        label: 'Add Todo',
        click(){
            createAddWindow();
        }
     },
     {
         type: 'separator',
     },
     {
         label: 'Clear Todo',
         click(){
            todosData.deleteAllTodos();
            getTodo();
         }
     },
     {
         type: 'separator',
     },
     {
        role: 'reload',
        accelerator: "CmdOrCtrl + R",
     },
    {
        type: 'separator',
    },
     {
         label: 'Quit',
         accelerator: 'CmdOrCtrl + Q',
         click:function(){
             app.quit();
         }
     }
];

// if mac, add empty object to menu
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

//Add developer tools if not in produciton
if(process.env.NODE_ENV !== 'production'){
    contextMenuTemplate.push(
        {
            type: "separator"
        },
        {
        label: 'Toggle DevTools',
        accelerator: "CmdOrCtrl + I",
        click(Item, focusedWindow){
            focusedWindow.toggleDevTools();
        }
    });
}
