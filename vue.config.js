const webpack = require('webpack')
const packageJson = require('./package.json')

module.exports = {
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: 'jquery',
                jquery: 'jquery',
                'window.jQuery': 'jquery',
                jQuery: 'jquery'
            }),
            new webpack.DefinePlugin({
                'process.env.VERSION': JSON.stringify(packageJson.version)
            }),
        ]
    }
}