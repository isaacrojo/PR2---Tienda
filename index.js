const express = require("express");
const createError = require("http-errors");
const app = express();
const port = 3000;

//configuracion del motor de templates
app.set("view engine", "ejs");

// Variables
let productosTienda = [
    {
        id: 'a',
        nombre: "Ropa de Verano",
        prendas: [
            {
                id: 1,
                nombre: "playera manga corta",
                img: "https://http2.mlstatic.com/D_NQ_NP_750792-MLM43608152893_092020-W.jpg",
                detalles: "playera fresca bien perrona"
            },
            {
                id: 2,
                nombre: "playera tirantes",
                img: "https://i.pinimg.com/736x/3b/40/7c/3b407ca13e48e903962151a4e5b6b2c2.jpg",
                detalles: "pa tirar músculo ayayy "
            }, {
                id: 3,
                nombre: "shorts",
                img: "https://i.pinimg.com/736x/06/53/7d/06537d6fd43312f3b1cdeafd96b93f8b.jpg",
                detalles: "es como un pantalon pero cortao..."
            }
        ]
    },
    {
        id: 'b',
        nombre: "Ropa de Invierno",
        prendas: [
            {
                id: 1,
                nombre: "chamarra chida",
                img: "https://i.pinimg.com/736x/c8/c9/89/c8c9896798bd44989440999c391ae830.jpg",
                detalles: "chamarra perrona en distintos colores y tamaños muy variados",
            },
            {
                id: 2,
                nombre: "hoodie",
                img: "https://cdn.shopify.com/s/files/1/0028/1165/8310/products/Send_Memes_mock_1200x1200.jpg?v=1571732021", 
                detalles: "ps manda unos memes no?"
            }, {
                id: 3,
                nombre: "playera manga larga",
                img: "https://cdn.shopify.com/s/files/1/1748/4357/products/nDAjxKCnBkASEhJhPypVAEtCbjxeu86fKZ23CTjasVnG2tASfJ_5skq1q1u51db.png?v=1605901506",
                detalles: "una playera de manga larga estilo hindú importada de alemania"
            }
        ]
    },
    {
        id: 'c',
        nombre: "Accesorios",
        prendas: [
            {
                id: 1,
                nombre: "gorro",
                img: "https://i.kym-cdn.com/photos/images/original/001/584/790/ab6.jpg",
                detalles: "un gorro bn perron"
            }, {
                id: 2,
                nombre: "bufanda",
                img: "https://www.wfla.com/wp-content/uploads/sites/71/2017/12/giant-scarf_36655927_ver1.0.jpg",
                detalles: "una bufanda muy suave smn"
            }, {
                id: 3,
                nombre: "lentes",
                img: "https://www.laprensa.hn/csp/mediapool/sites/dt.common.streams.StreamServer.cls?STREAMOID=dmPGzFc$Sn_YZr5GbwrE6c$daE2N3K4ZzOUsqbU5sYtj2n_fbb5hcdXNvHvLpu9Z6FB40xiOfUoExWL3M40tfzssyZqpeG_J0TFo7ZhRaDiHC9oxmioMlYVJD0A$3RbIiibgT65kY_CSDiCiUzvHvODrHApbd6ry6YGl5GGOZrs-&CONTENTTYPE=image/jpeg",
                detalles: "unos lentes bn fresones"
            }
        ]
    }
];

let masVendidos = [
    {

    }
];


// Rutas
app.use(express.static("public"));

app.get("/", (req, res) => {
    //render es para mostrar una vista/html/ejs
    res.render("pages/index");
});

app.get("/productos", (req, res) => {
    res.render("pages/productos", {
        productos: productosTienda
    });
});

app.get("/productos/:idProducto/:idDetalles", (req, res, next) => {
    let idProducto = req.params.idProducto;
    let idDetalles = req.params.idDetalles;

    let productoEncontrado = false;

    productosTienda.forEach((producto) => {
        if (producto.id === idProducto) {
            // Encontramos el producto solicitado

            producto.prendas.forEach((prenda) => {
                if (prenda.id && prenda.id.toString() === idDetalles) {
                    // Encontramos la prenda solicitada
                    productoEncontrado = true;

                    res.render("pages/producto", {
                        producto,
                        prenda,
                    });
                }
            });
        }
    });

    if (!productoEncontrado) {
        next();
    }
});

// busqueda   -- not working well---
/// los dos puntos indican que es un parametro :
// o variable nombrada con name=  en html
app.get("/productos/:nombre/producto", (req, res, next) => {
    
    let id = req.query.id; //es un string
    let nombre = req.params.nombre;
    let prendas = [];
    switch (prendas.nombre) {
        case "playera manga corta":
            producto = nombre;
            break;
        case "playera tirantes":
            producto = nombre;
            break;
        case "Accesorios":
            producto = nombre;
            break;
    
        default:
            // No coincide con un valor esperado
            break;
    }

    for (let i = 0; i < prendas.length; i++) {
        const prenda = prendas[i];
        
        if (prenda.id.toString() === id) { 
            //return finalizar función actual (req, res)
            return res.render("pages/productos/producto", {
                prenda
            });
        }
    }

    // TODO: Mostrar error 404 
    //(Next es pamandar a la siguiente ruta o middleware jaja)
    return next();
});

app.get("/search", (req, res) => {
    // query -> lo que está en el name del input
    console.log('req.query.query', req.query.query);
    let query = req.query.query;
    
    // En este arreglo vamos a guardar los resultados de la búsqueda
    let resultados = [];

    // Paso #1 buscar en el primer arreglo de productos de la tienda
    // - nombre
    for (let i = 0; i < productosTienda.length; i++) {
        const prenda = productosTienda[i];
        // Revisar si el nombre coincide con la búsqueda
        if (prenda.nombre.toLowerCase() === query.toLowerCase()) {
            // Agregar postre al arreglo de resultados
            resultados.push(prenda);
        }
    }

    res.render("pages/search", {
        resultados
    });
});

// Not Found
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    let message = err.message;
    let error = err;

    res.status(err.status || 500);
    res.render("pages/error", {
        message,
        error
    });
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
