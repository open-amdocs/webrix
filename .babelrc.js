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

        ["search-and-replace", {
            // for jest to compile, first babel needs to search-&-replace all the prefixes constants
            "rules": [
                {
                    "search": /{{PREFIX}}/,
                    "searchTemplateStrings": true,
                    "replace": "wx-"
                }
            ]
        }]
    ],
    "env": {
        "test": {
            "plugins": [
                "babel-plugin-rewire"
            ]
        }
    }
}
