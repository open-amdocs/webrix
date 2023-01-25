module.exports = {
    "presets": ["@babel/preset-env", "@babel/preset-react"],
    "plugins": [
        "@babel/plugin-proposal-export-default-from",
        "@babel/plugin-proposal-function-bind",
        "@babel/plugin-transform-runtime",
        "@babel/plugin-proposal-optional-chaining",

        ["module-resolver", {
            "root": ["./src"],
            "alias": {
                "utility": "./src/utility",
                "hooks": "./src/hooks",
                "tools": "./src/tools"
            }
        }],
    ],
    "env": {
        "test": {
            "plugins": [
                "babel-plugin-rewire"
            ]
        }
    }
}
