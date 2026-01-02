import fs from 'fs/promises'; 
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { createSchema } from 'genson-js';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

async function loadSchema( schemaPath: string ) {
    try {
        await fs.access(schemaPath);
    } catch (err) {
        throw new Error(`Schema file not found at path: ${schemaPath}`);
    }
    const schemaContent = await fs.readFile(schemaPath, 'utf-8');  
    return JSON.parse(schemaContent);
}

async function generateNewSchema( responseBody: object, schemaDir: string ) {
    try {
        const generatedNewSchema = createSchema(responseBody);
        await fs.mkdir(path.dirname(schemaDir), { recursive: true });
        await fs.writeFile(schemaDir, JSON.stringify(generatedNewSchema, null, 4), 'utf-8');
    }catch (err) {  
        throw new Error(`Failed to generate schema at path: ${schemaDir}, Error: ${err}`);
    }
}

export async function validateSchema( dirName: string, fileName: string, responseData: any, createSchemaFlag: boolean = false ) {
    const schemasDir = path.join(__dirname, '..', 'response-schemas', dirName, `${fileName}_schema.json`);
    if (createSchemaFlag) {
        await generateNewSchema(responseData, schemasDir);
    }
    const schema = await loadSchema(schemasDir);
    const validate = ajv.compile(schema);
    const valid = validate(responseData);
    if (!valid) {
        throw new Error(`Schema validation for ${fileName} failed: \n` + 
            `${JSON.stringify(validate.errors, null, 4)}\n` + 
            `Actual Response Data: \n${JSON.stringify(responseData, null, 4)}`);
    }
}   
