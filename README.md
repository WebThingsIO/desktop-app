# WebThings Desktop App

A general purpose [Web of Things](https://www.w3.org/WoT/) consumer desktop app.

![A UI mockup of the WebThings Desktop App showing a collection of Things](https://webthings.io/images/webthings_desktop_app_mockup.png)
*UI Mockup of the WebThings Desktop App*

See [WebThings App UI Mockups](https://docs.google.com/presentation/d/1qRuAxqvSS4c_nq26Lpa_51wsutIILY1Q-LANxblI5qo/edit?usp=sharing) for more.

## Development

To get started hacking on the WebThings desktop app, first make sure that you have [Git](https://git-scm.com/) installed.

Clone the repository from GitHub:

```
$ git clone https://github.com/WebThingsIO/desktop-app.git
$ cd desktop-app
```

### Build for Linux desktop

To build for Linux desktop, first make sure that you have [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed.

We recommend using nvm to install the version of Node.js and npm listed in the .nvmrc file of this repository:

```
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
$ . ~/.bashrc
$ nvm install
$ nvm use
```

Install dependencies:
```
$ npm install
```

Start the application:

```
$ npm start
```
