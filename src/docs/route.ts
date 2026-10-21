import { Express } from "express"
import swaggerUi from "swagger-ui-express"
import swaggerDocument from './swagger-output.json' with {
    type: "json"
}


const swaggerDocs = (app: Express) => {

    app.use('/api-doc', swaggerUi.serveFiles(swaggerDocument), swaggerUi.setup(swaggerDocument));
}

export default swaggerDocs;