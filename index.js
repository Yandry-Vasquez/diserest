const http = require('http');
const url = require('url');
let designers = [];
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    // Obtener la ruta y el método de la solicitud
    const path = parsedUrl.pathname;
    const method = req.method;
    // Enrutamiento
    if (path === '/designers') {
        if (method === 'GET') {
            // Obtener todos los diseñadores
            //prueba
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(designers));
        } else if (method === 'POST') {
            // Crear un nuevo diseñador
            let body = '';
            req.on('data', chunk => {
                body += chunk;
            });
            req.on('end', () => {
                const { nombre, experiencia } = JSON.parse(body);
                const id = designers.length + 1;
                const designer = { id, nombre, experiencia };
                designers.push(designer);

                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 201;
                res.end(JSON.stringify(designer));
            });

        }

    } else if (path.startsWith('/designers/')) {
        const designerId = parseInt(path.substring(11));

        if (method === 'GET') {
            // Obtener un diseñador por su ID
            const designer = designers.find(d => d.id === designerId);

            if (designer) {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify(designer));
            } else {
                res.statusCode = 404;
                res.end();
            }
        } else if (method === 'PUT') {
            // Actualizar un diseñador por su ID
            //.....
            let body = '';
            req.on('data', chunk => {
                body += chunk;
            });

            req.on('end', () => {
                const { nombre, experiencia } = JSON.parse(body);
                const designerIndex = designers.findIndex(d => d.id === designerId);

                if (designerIndex !== -1) {
                    designers[designerIndex].nombre = nombre;
                    designers[designerIndex].experiencia = experiencia;

                    res.setHeader('Content-Type', 'application/json');
                    res.statusCode = 200;
                    res.end(JSON.stringify(designers[designerIndex]));
                } else {
                    res.statusCode = 404;
                    res.end();
                }

            });

        } else if (method === 'DELETE') {
            // Eliminar un diseñador por su ID
            const designerIndex = designers.findIndex(d => d.id === designerId);

            if (designerIndex !== -1) {
                const deletedDesigner = designers.splice(designerIndex, 1)[0];

                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify(deletedDesigner));

            } else {
                res.statusCode = 404;
                res.end();
            }
        }
    } else {
        res.statusCode = 404;
        res.end();
    }
});


const port = 3000;
server.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});


