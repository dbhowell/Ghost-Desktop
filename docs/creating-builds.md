# Creating Builds
While you can always run the current source code with `npm start` or `ember electron`, creating a production build involves a few steps to ensure that everything is setup correctly. We aim to automate builds as much as possible, so these instructions should ideally always boil down to only a few grunt tasks.

## Windows
`npm run installer`, executed from a Windows machine. Ensure that your machine [is setup for development and has native build tools](developer-environment.md).

The command will first build the ember app using `ember electron:package`, and then use Atom's Windows-Installer tools to create a Squirrel-compatible installer. Once done, find the installer file in `electron-builds/Ghost-win32-installer`.

## Mac OS X
`npm run dmg`, executed from a Mac OS X machine. Ensure that your machine [is setup for development and has native build tools](developer-environment.md). 

The command will first build the ember app using `ember electron:package`, and then use `appdmg` and some Python to create dmg image. Once done, find the dmg file in `electron-builds/Ghost-darwin64-installer`.