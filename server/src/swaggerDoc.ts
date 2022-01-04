import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';

const swaggerSpec = YAML.load('./src/memoryroad-1.0.0-swagger.yaml');

export { swaggerUi, swaggerSpec };
