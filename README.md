DESCRIPCIÓN
========
Modulo que maneja de foma modular la publicacion de las rutas para Api nodeJs

Nombre : live-routes

PRE-REQUISITOS
===================
1. Directorio controllers
2. Directorio Middlewares
3. express nodejs

INSTALLATCIÓN
===================

1. Instalar NPM <https://nodejs.org/en/>
```
sudo npm install npm install git+http://git.sigis.com.ve/jlara/live-routes.git --save 
```
DEPLOYMENT
=================================
Para utilizar el modulo dentro de tu estructura y modulos debes tener los siguientes requirimientos minimo

1. Directorio controllers
2. Directorio Middlewares

El modulo esta compuesto por los siguinetes metodos

1. init este metodo inicializa la configuracion y el modulo live.routes, recibe como parametro un objeto con la ruta de los directorios controllers y middlewares
```
var path = require('path')
var lr = require('live-routes');
var routes = lr.init({
    pathControllers:path.join(__dirname,'controllers'),
    pathMiddlewares:path.join(__dirname,'middlewares'),
})
```
2. publish: Este metodo te permite publicar en un objeto Router de express todas las rutas de tu Api de una forma simple y mantenible
```
lr.publish('get','nombre_endponint','nombre_del_controlador?metofo',['nombre_del_middleware or nombre_del_middleware_en_controladro']);
```
3. getPublish: Este metodo devuelve el objeto Router express con todos las rutas agregadas al mismo por medio de el metodo publish
```
app.use('/',lr.getPublish());
```

EJEMPLO COMPLETO
```
var path = require('path');
var express = require('express');
var app = express();
var lr = require("live-routes");
var routes = lr.init({
    pathControllers:path.join(__dirname,'controllers'),
    pathMiddlewares:path.join(__dirname,'middlewares'),
})  
require('./routes')(routes);

app.use('/',lr.getPublish());

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

```

AUTHORS
=======

Jefferson Lara <jefferson.lara@sigis.com.ve>


COPYRIGHT
=======
Copyright (c) SIGIS Soluciones Integrales GIS C.A
