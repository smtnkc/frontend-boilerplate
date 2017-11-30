const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // for html and pug files
const ExtractTextPlugin = require('extract-text-webpack-plugin'); // for style files

const PATHS = {
    src: path.join(__dirname, 'src'), // join = resolve
    dist: path.join(__dirname, 'dist')
};

let config = {
    entry: {
        home: PATHS.src + '/scripts/home.js',
        contact: PATHS.src + '/scripts/contact.js'
    },
    output: {
        path: PATHS.dist,
        filename: 'js/[name].bundle.js' // the final bundled js file where [name] refers to entry name
    },
    module: {
        rules: [
            { // JS LOADERS
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader' 
            },
            { // PUG LOADERS
                test: /\.pug$/,
                loader: 'pug-loader',
                options: {
                    pretty: true
                }
            },
            {   // STYLE LOADERS
                // 1- convert sass files to plain old css using sass-loader
                // 2- resolve imports and url()s to bundle multiple css files using css-loader
                // 3- insert bundled css files to html using style-loader
                test: /\.(css|scss|sass)$/, 
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [ 'css-loader', 'sass-loader' ]
                })
            },
            { // FILE LOADERS
                test: /\.(svg|png|jpe?g|gif|ico)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'img/'
                        }
                    }
                ]
            },
        ]
    },
    devServer: {
        contentBase: PATHS.dist, // the parent directory to generate virtual files
        compress: true, // gzip files 
        port: 9000, // localhost:9000
        stats: 'errors-only', // show only the errors on terminal
        open: true // open a new browser tab at initial build
    },
    plugins: [
        new HtmlWebpackPlugin({
            // PUG FILE OPTIONS
            inject: true, // include chunk files
            injectExtras: {
                head: [
                    {
                        tag: 'meta',
                        charset: 'UTF-8',
                        name: 'description',
                        content: 'We can use injectExtrasHead option'
                    }
                ]
            },

            // OTHER html-webpack-plugin OPTIONS:
            title: 'Home',
            template: PATHS.src + '/templates/index.pug',
            // minify: { collapseWhitespace: true },
            // hash: true,
            chunks: ['home'],
            filename: './index.html'
        }),
        new HtmlWebpackPlugin({
            // HTML FILE OPTIONS
            title: 'Contact', // pass page title as a parameter
            template: PATHS.src + '/templates/contact.html', // template may be an .ejs or .html
            // minify: { collapseWhitespace: true }, // remove line-breaks and indentations 
            // hash: true, // add a hash to bundled css/js/img files to check build no
            chunks: ['contact'], // include ONLY contact.bundle.js
            filename: './contact.html' // generate directly under PATHS.dist directory
        }),
        
        new ExtractTextPlugin({
            // CSS FILE OPTIONS
            filename: 'css/bundle.css', // generate under PATHS.dist/css directory 
            disable: false, // plugin is not disabled
            allChunks: true // bundle all css-js files
        })
    ]
}

module.exports = config;