const fs = require('fs');
const { readdir } = require('fs/promises');
const jsonSchemaToTS = require('json-schema-to-typescript');

const generate = async () => {

    const themes = await readdir('./src/xt/templates/themes')
    const pages = await readdir('./src/xt/templates/pages')
    const headers = await readdir('./src/xt/templates/components/header')
    const footers = await readdir('./src/xt/templates/components/footer')
    const landingHero = await readdir('./src/xt/templates/components/landing/hero')
    const landingTestimonials = await readdir('./src/xt/templates/components/landing/testimonials')
    const landingPricing = await readdir('./src/xt/templates/components/landing/pricing')
    const landingTeam = await readdir('./src/xt/templates/components/landing/team')
    // Definir el modelo de datos de manera programática
    const modelo = {
        "$schema": "src/xt/types/xt-config.schema.json",
        type: 'object',
        properties: {
            appName: { type: "string" },
            appDescription: { type: 'string' },
            "components": {
                type: "object",
                properties: {
                    "header": { type: "string", enum: getArray(headers) },
                    "landing": {
                        type: "object",
                        properties: {
                            "hero": { type: 'string', enum: getArray(landingHero) },
                            "testimonials": { type: 'string', enum: getArray(landingTestimonials) },
                            "pricing": { type: 'string', enum: getArray(landingPricing) },
                            "team": { type: 'string', enum: getArray(landingTeam) },
                        }
                    },
                    "footer": { type: "string", enum: getArray(footers) },
                }
            },
            styling: {
                type: "object",
                properties: {
                    theme: {
                        "type": "string",
                        enum: getArray(themes)
                    },
                    rounded: {
                        "type": "string",
                        "enum": ['0.125rem', '0.25rem', '0.375rem', '0.5rem', '0.625rem', '0.75rem', '0.875rem', '1rem', '1.125rem', '1.25rem', '1.375rem', '1.5rem']
                    },
                    baseSize: {
                        "type": "string",
                        "enum": ['0.125rem', '0.25rem', '0.375rem', '0.5rem', '0.625rem', '0.75rem', '0.875rem', '1rem', '1.125rem', '1.25rem', '1.375rem', '1.5rem']
                    },
                    gap: {
                        "type": "string",
                        "enum": ['0.125rem', '0.25rem', '0.375rem', '0.5rem', '0.625rem', '0.75rem', '0.875rem', '1rem', '1.125rem', '1.25rem', '1.375rem', '1.5rem']
                    },
                    sectionGap: {
                        "type": "string",
                        "enum": ['1.5rem', '3rem', '6rem', '9rem', '12rem', '15rem', '18rem']
                    }
                },
                required: ["theme", "rounded", "baseSize", "gap", "sectionGap"]
            },
            "mode": {
                type: "string",
                enum: ["server", "client", "none"]
            },

            "pages": {
                "type": "array",
                "items":
                {
                    "type": "object",
                    "properties": {
                        "showInMenu": { type: "boolean", default: true },
                        "template": { type: "string", enum: getArray(pages) },
                        "slug": { "type": "string" },
                        "name": { "type": "string" },
                        "loading": { "type": "boolean" },
                        "error": { "type": "boolean" },
                        "fetchData": { "type": "string", "enum": ["client", "server", "none"] },
                        "revalidatePattern": { "type": "string" },
                        "generateStaticPaths": { "type": "string" }
                    },
                    required: ['template', 'slug', 'name', 'showInMenu']
                }

            },
        },

        required: ['appName', 'appDescription', 'styling', 'pages'],
    };

    // Convertir el JSON Schema a TypeScript
    jsonSchemaToTS.compile(modelo, 'xtConfig', {
        enableConstEnums: true,

    })
        .then(tsCode => {
            // Guardar las definiciones de tipos TypeScript en un archivo
            fs.writeFileSync('./src/xt/types/xt-config.d.ts', tsCode);

            // Generar el JSON Schema
            const jsonSchema = JSON.stringify(modelo, null, 2);
            fs.writeFileSync('./src/xt/types/xt-config.schema.json', jsonSchema);

            console.log('✅ Archivos generados exitosamente: modelo.ts y modelo-schema.json');
        })
        .catch(error => console.error('Error al generar archivos:', error));

}
generate()


const getArray = (array, extension) => {
    return array.map(i => i.split('.')[0])
}