DESCRIPCIÓN
========
Modulo que maneja de foma modular la publicacion de las rutas para Api nodeJs

Nombre : light-routes

PRE-REQUISITOS
===================
1. Directorio controllers
2. Directorio Middlewares
3. express nodejs

INSTALACIÓN
===================

1. Instalar NPM <https://nodejs.org/en/>

```bash
sudo npm install npm install git+https://github.com/jetoGithhub/light-routes.git --save
```

USO
=================================
Para utilizar el modulo dentro de tu estructura y modulos debes tener los siguientes requirimientos minimo

1. Directorio controllers
2. Directorio Middlewares

El modulo esta compuesto por los siguinetes metodos

1. init este metodo inicializa la configuracion y el modulo live.routes, recibe como parametro un objeto con la ruta de los directorios controllers y middlewares

```javascript
var path = require('path');
var lightRoutes = require('light-routes');
var routes = lightRoutes.init({
    pathControllers:path.join(__dirname,'controllers'),
    pathMiddlewares:path.join(__dirname,'middlewares'),
})
```
2. publish: Este metodo te permite publicar en un objeto Router de express todas las rutas de tu Api de una forma simple y mantenible

```javascript

lightRoutes.publish('get','nombre_endponint','nombre_del_controlador?metofo',['nombre_del_middleware or nombre_del_middleware_en_controladro']);

```
3. getPublish: Este metodo devuelve el objeto Router express con todos las rutas agregadas al mismo por medio de el metodo publish

```javascript

app.use('/',lightRoutes.getPublish());

```

EJEMPLO COMPLETO

```javascript
var path = require('path');
var express = require('express');
var app = express();
var lightRoutes = require("live-routes");

var routes = lightRoutes.init({
    pathControllers:path.join(__dirname,'controllers'),
    pathMiddlewares:path.join(__dirname,'middlewares'),
})

require('./routes')(routes);

app.use('/',lightRoutes.getPublish());

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

```

AUTORES
=======

Jefferson Lara <jetox21@gmail.com>
