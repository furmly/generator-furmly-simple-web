"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

module.exports = class extends Generator {
  _error(message) {
    this.log(chalk.default.red(message));
  }

  async prompting() {
    this.log(
      yosay(
        `Welcome to the remarkable ${chalk.red(
          "generator-furmly-simple-web"
        )} generator!`
      )
    );

    const proc = this.spawnCommand(
      "npm",
      ["search", "furmly-components", "--json"],
      {
        stdio: "pipe"
      }
    );

    const furmlyComponents = await new Promise((resolve, reject) => {
      let data = "";

      proc.stdout.on("data", message => {
        data += message.toString();
      });
      proc.on("exit", code => {
        if (code) {
          return reject(new Error("an error occurred"));
        }
        return resolve(JSON.parse(data));
      });
    });

    const prompts = [
      {
        type: "question",
        name: "appName",
        message: "Project Name (all lowercase) ?",
        default: "awesome-furmly-web"
      },
      {
        type: "list",
        name: "furmlyComponentLib",
        message: "Please select a furmly component lib to use",
        choices: furmlyComponents.map(x => x.name)
      },
      {
        type: "confirm",
        message: "Furmly component uses themes ?",
        name: "usesTheme",
        default: true
      }
    ];
    this.answers = await this.prompt(prompts);
    this.answers.furmlyComponentLib = furmlyComponents.find(
      x => x.name === this.answers.furmlyComponentLib
    );
  }

  _copy(template, destinationName, obj) {
    const destination =
      (typeof destinationName === "string" && destinationName) || template;
    obj = (typeof destinationName === "object" && destinationName) || obj;
    const destinationPath = `${this.answers.appName}/src/${destination}`;
    if (obj) {
      this.fs.copyTpl(
        this.templatePath(template),
        this.destinationPath(destinationPath),
        obj
      );
      return;
    }
    this.fs.copy(
      this.templatePath(template),
      this.destinationPath(destinationPath)
    );
  }

  writing() {
    try {
      this._copy("package.json", "../package.json", {
        appName: this.answers.appName
      });

      this._copy("errorhandler.js");
      this._copy("furmly-client.config.js", "../furmly-client.config.js");

      // Edit package .json to add furmly-components.
      const pkg = {
        dependencies: {
          "react-router-dom": "^4.3.1",
          "furmly-react-router-web-addons": "^1.0.0",
          "query-string": "^6.3.0",
          "redux-persist": "^5.10.0",
          history: "^4.7.2",
          [this.answers.furmlyComponentLib.name]: `^${
            this.answers.furmlyComponentLib.version
          }`
        }
      };
      this.fs.extendJSON(
        this.destinationPath(`${this.answers.appName}/package.json`),
        pkg
      );
      // Copy template files to destination
      const componentPkg = {
        component: this.answers.furmlyComponentLib.name
      };
      const appArgs = {
        ...componentPkg,
        appName: this.answers.appName,
        hasWorker: Boolean(
          this.answers.furmlyComponentLib.keywords.find(x => x === "hasWorker")
        )
      };
      this.fs.delete("src");
      this._copy("client.js");
      if (this.answers.usesTheme) {
        this._copy("theme.js", componentPkg);
        appArgs.usesTheme = this.answers.usesTheme;
      }
      this._copy("App.js", appArgs);
      this._copy("app.scss");
      this._copy("index.js");
      this._copy(".babelrc", "../.babelrc");
      this._copy("furmly/", "furmly/", appArgs);
      this._copy("webpack.dev.config.js", "../webpack.dev.config.js", appArgs);
      this._copy(
        "webpack.build.config.js",
        "../webpack.build.config.js",
        appArgs
      );
      this._copy("index.html", "assets/index.html");
      this._copy("Menu.js");
    } catch (e) {
      this._error(e.message);
      this._error("deleting project...");
      this.fs.delete(this.answers.appName);
    }
  }

  install() {
    if (!this.options["skip-install"])
      this.spawnCommand("npm", ["install"], { cwd: this.answers.appName });
  }
};
