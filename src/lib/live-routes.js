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
        var express = require("express");
        var router = express.Router();
        var controllers = require(_config.pathControllers);
        var middlewares = require(_config.pathMiddlewares);
        /**
         * Metodo que mapea se encarga de buscar el merodo del controlador indicado en el string que recibe
         *
         * @param value
         * @returns {*}
         * @private
         */
        var _getController = function (value) {
            if(typeof value == 'function')
                return value
            if(typeof value == 'string' && value.indexOf("?") !== -1){
                var separate = value.split('?');
                var ctrl = separate[0];
                var method = separate[1];
                if(controllers[ctrl] && controllers[ctrl][method]) {
                    return controllers[ctrl][method].bind(controllers[ctrl]);
                }else{
                    throw new Error('Controller '+ctrl+' or method '+method+' not defined');
                }
            }else{
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
        var _join = function (fnc,array) {
            var _fncs = [];
            array.forEach(function (d,i) {

                if(typeof d == 'function'){
                    _fncs.push(d);
                }else {

                    if (middlewares[d]) {
                        _fncs.push(middlewares[d]);
                    } else if (typeof fnc == 'string' && fnc.indexOf("?") !== -1) {
                        var separate = fnc.split('?');
                        var ctrl = separate[0];
                        if (controllers[ctrl] && controllers[ctrl][d])
                            _fncs.push(controllers[ctrl][d].bind(controllers[ctrl]))
                    }
                }
            })
            _fncs.push(_getController(fnc));
            return _fncs;
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
                var methods = [];
                if(middlewares && typeof middlewares == 'object'){
                    methods.push(_join(callback,middlewares));
                }else{
                    methods.push(_getController(callback));
                }
                router[type](endPoint,methods)
            },
            /**
             * Metodo que devuleve el objeto router de express que contiene las rutas del api
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
