const express = require("express");
/**
 * Objeto encaragdo de manipular el objeto router de express y la publicacion de los
 * endpoint del api
 *
 * @packages comision_estnadares_sigis_node
 * @author Jefferson Lara
 * @date 19-10-2016.
 */
var liveRoutes = function () {
    throw 'Error: live routes no puede ser istnaciada por e operador new, utilice el metodo init'
}

liveRoutes.init = function (config) {

    var _config = config || {};

    var mapRoputes = (function () {
        let router = express.Router();
        let controllers = null;
        let middlewares = null;
        let defaultMiddleware = [];

        if(_config && _config.defaultMiddleware){
            defaultMiddleware = _config.defaultMiddleware;
        }

        if (_config && _config.controllers) {
            controllers = _config.controllers;
        } else {
            controllers = require(_config.pathControllers);
        }

        if (_config && _config.middlewares) {
            middlewares = _config.middlewares;
        } else {
            middlewares = require(_config.pathMiddlewares);
        }
        /**
         * Metodo que mapea se encarga de buscar el merodo del controlador indicado en el string que recibe
         *
         * @param value
         * @returns {*}
         * @private
         */
        var resolveController = function (value) {
            if(typeof value == 'function')
                return value
            if( typeof value == 'string' && value.indexOf("?") !== -1 ){
                let separate = value.split('?');
                let controllerName = separate[0];
                let method = separate[1];
                if(controllers[controllerName] && controllers[controllerName][method]) {
                    let controller = controllers[controllerName];
                    return controller[method].bind(controller);
                } else {
                    throw new Error('Controller '+controllerName+' or method '+method+' not defined');
                }
            } else {
                throw new Error('String '+value+' unresolved ');
            }
        }
        /**
         * Metodo que se encarga de resolver los middlewares que se le stan solicitnado a la ruta
         *
         * @param fnc
         * @param array
         * @returns {Array}
         * @private
         */
        var resolveMiddleware = function (fnc,middlewareArray) {
            var middlewareStack = [];
            middlewareArray.forEach(function (middlewareName,i) {
                if( typeof middlewareName == 'function' ){
                    middlewareStack.push(middlewareName);
                } else {
                    if ( middlewares[middlewareName] ) {
                        middlewareStack.push(middlewares[middlewareName]);
                    } else if ( typeof middlewareName == 'string') {
                        if( middlewareName.indexOf("?") >= 0 ){
                            let separate        = middlewareName.split('?');
                            let controllerName  = separate[0];
                            let middlewareFn    = separate[1];
                            if (controllers[controllerName] && controllers[controllerName][middlewareFn]){
                                let controller = controllers[controllerName];
                                middlewareStack.push(controller[middlewareFn].bind(controller));
                            }
                        } else {
                            let separate = fnc.split('?');
                            let controllerName  = separate[0];

                            if (controllers[controllerName] && controllers[controllerName][middlewareName]){
                                let controller = controllers[controllerName];
                                middlewareStack.push(controller[middlewareName].bind(controller));
                            } else {
                                throw new Error('Controller '+controllerName+' or middleware method '+middlewareName+' not defined');
                            }
                        }
                    }
                }
            });
            middlewareStack.push(resolveController(fnc));
            return middlewareStack;
        }

        return {

            /**
             * Metodo encargado de realizar la inclusion en el router de express
             *
             * @author Jefferson Lara
             * @date 08-10-2016
             * @param type {string}, contiene el verbo http a publicar "GET, POST,PUT .."
             * @param endPoint {string}, contiene el nombre de la ruta http a publicar
             * @param callback {function,string}, contiene el metodo o la referencia del controlador que se va utilizar para la logica del endpoitn
             * @param middleware {array}, contiene un arreglo con los nombres de los middlewares que se le van a consignar a la logica del endpoint
             *
             */
            publish:function (type,endPoint,callback,middlewares) {
                let methods = [];
                for(let i = 0; i < defaultMiddleware.length;i++){
                    let middleware = defaultMiddleware[i];
                    if(typeof middleware == "function"){
                        methods.push(middleware);
                    } else {
                        console.error("Requested Default Middleware is not a function");
                    }
                }
                if( middlewares && typeof middlewares == 'object' ){
                    methods.push(resolveMiddleware(callback,middlewares));
                }else{
                    methods.push(resolveController(callback));
                }
                router[type](endPoint,methods)
            },
            /**
             * Metodo que devuleve la objeto router de espress que contiene las rutas del api
             *
             * @author Jefferson Lara
             * @date 08-10-2016
             * @return object
             */
            getPublish:function () {
                return router;
            }
        }
    })();
    return mapRoputes;
}

module.exports = liveRoutes;