Parame52
========


Presentation
------------

*Parame52* constains the *geometrix design* library *desi52*, which  belongs to the *parametrix* tutorial. The file structure of *parame52* can be used as template for creating other *geometrix design libraries*.

This is the monorepo that contains a single *javascript* packages:

1. desi52: a simple library of 3D-parts using *geometrix*

The *UI* and *Cli* apps are generated automatically within *paxApps*.

A public instance of *desiXY-ui* is available on that [github-page](https://charlyoleg2.github.io/parame52/).
The *code source* is available on [github](https://github.com/charlyoleg2/parame52).


Prerequisite
------------

- [node](https://nodejs.org) version 20.10.0 or higher
- [npm](https://docs.npmjs.com/cli/v7/commands/npm) version 10.2.4 or higher


Getting started
---------------

```bash
git clone https://github.com/charlyoleg2/parame52
cd parame52
npm i
npm run clean_paxApps
npm run install_paxApps
rm -fr node_modules
npm i
npm run ci
npm run preview
```

Other useful commands:
```bash
npm run clean
npm run ls-workspaces
npm -w desi52 run check
npm -w desi52 run build
npm -w desiXY-ui run dev
```


