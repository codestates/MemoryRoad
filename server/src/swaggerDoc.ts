import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';
import path from 'path';

const swaggerSpec: any = YAML.load(
  path.join(__dirname, '../../src/swagger.yaml'),
);

export { swaggerUi, swaggerSpec };
