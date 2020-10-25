#!/usr/bin/env node

const fs = require('fs');
const glob = require('glob');
const path = require('path');
const yamljs = require('yamljs');
const argv = require('yargs')
    .option('path', { alias: 'p', default: process.cwd(), description: 'Root path for finding yml files to generate from.' })
    .option('delete', { alias: 'd', type: 'boolean', description: 'Delete files that were generated.' })
    .argv;

const del = argv.d;
if (del) {
    const puffin = `    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ░░░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒████████░░░░░░░░░░░░░░░░
    ░░░░░░░░░░░░▒▒▒▒▒▒▒▒░░░░      ░░▓▓░░░░░░░░░░░░░░
    ░░░░░░░░▒▒▒▒▒▒▒▒░░░░░░            ██░░░░░░░░░░░░
    ░░░░░░▒▒▒▒▒▒▒▒░░  ░░░░            ░░▓▓░░░░░░░░░░
    ░░░░▒▒▒▒▒▒▒▒░░░░░░░░░░    ████      ████░░░░░░░░
    ░░▒▒▒▒▒▒▒▒░░░░░░░░░░░░    ████      ████░░░░░░░░
    ░░░░▒▒▒▒░░░░░░░░░░░░░░              ██████░░░░░░
    ░░░░▒▒▒▒▒▒░░░░░░░░░░░░              ██████░░░░░░
    ░░░░░░▒▒▒▒░░  ░░░░░░░░              ██████░░░░░░
    ░░░░░░░░▒▒░░░░░░░░░░                ████░░░░░░░░
    ░░░░░░░░░░▒▒▒▒░░░░                ██▓▓██░░░░░░░░
    ░░░░░░░░░░░░▒▒▒▒                ▒▒▓▓▓▓  ░░░░░░░░
    ░░░░░░░░░░░░  ▒▒              ▒▒██▒▒░░  ░░░░░░░░
    ░░░░░░░░░░░░▒▒▓▓░░▒▒        ▒▒▒▒██▓▓▒▒░░░░░░░░░░
    ░░░░░░░░░░▒▒██████▒▒░░░░░░░░▒▒▓▓▓▓▓▓▓▓▒▒░░░░░░░░
    ░░░░░░░░▒▒████▓▓██▒▒░░░░░░░░▒▒██████████▒▒░░░░░░
    ░░░░░░▒▒██▓▓██████▒▒░░░░░░░░▒▒████████████▒▒░░░░
    ░░░░▒▒▓▓██████████▒▒░░░░░░░░▒▒██▓▓████████▒▒░░░░
    ░░░░▒▒████████████▒▒░░░░░░░░▒▒████▓▓▓▓████▒▒░░░░
    ░░░░▒▒████████████▒▒░░░░░░░░▒▒▓▓██████████▒▒░░░░
    ░░░░▒▒████████████▒▒░░░░░░░░▒▒▓▓▓▓██▓▓██████▒▒░░
    ░░▒▒██████████████▒▒░░░░░░░░▒▒██▓▓██▓▓▓▓▓▓██▒▒░░
    ░░▒▒████████████▓▓▒▒░░░░░░░░▒▒██▓▓▓▓▓▓▓▓▓▓██▓▓▒▒
    ░░▒▒████████████▓▓▒▒        ▒▒▓▓▓▓████▓▓▓▓████▒▒
    ░░▒▒▓▓▓▓████████▒▒            ▒▒▓▓██▓▓▓▓▓▓████▒▒
    ░░░░▒▒▓▓██▓▓██▒▒                ▒▒████▓▓▓▓██▒▒░░
    ░░░░▒▒██████▒▒                    ▒▒██▓▓▓▓██▒▒░░
    ░░░░░░▒▒████                        ▒▒██▓▓▓▓▒▒░░
    ░░░░░░▒▒██▒▒                          ▒▒██▒▒░░░░
    ░░░░░░░░▒▒                              ▒▒░░░░░░
    ░░░░░░░░░░▒▒                          ▒▒░░░░░░░░
    ░░░░░░░░░░░░▒▒▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▒▒░░░░░░░░░░
    ░░░░░░░░░░░░▓▓░░░░░░░░░░▓▓░░░░░░░░░░▓▓░░░░░░░░░░
    ░░░░░░░░░░░░▓▓░░░░░░░░░░▓▓░░░░░░░░░░▓▓░░░░░░░░░░
    ░░░░░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒░░▒▒▒▒▒▒▒▒▒▒░░░░░░░░░░░░
    ░░░░░░░░░░░░  ▓▓▓▓▓▓▓▓▓▓░░▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░`
    console.log(puffin);
    console.log('deleting generated files...');
}
else {
    const jelly = `
                                    ▒▒▒▒▒▒▒▒▒▒                                      
                                  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                    
                                ▒▒▒▒██▒▒▒▒▒▒██▒▒▒▒                                  
                                ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                  
                                ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                  
                                  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                    
                                  ▒▒  ▒▒  ▒▒  ▒▒                                    
                                ▒▒▒▒  ▒▒  ▒▒  ▒▒                                    
                                ▒▒  ▒▒  ▒▒  ▒▒  ▒▒                                  
                                ▒▒  ▒▒  ▒▒  ▒▒  ▒▒                                  
                                  ▒▒  ▒▒▒▒▒▒  ▒▒                                    
                                  ▒▒  ▒▒  ▒▒  ▒▒`
    console.log(jelly);
    console.log('generating files...');
}

const rootDir = argv.p;
const template = {
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {}
};

glob(rootDir + '/**/*.yml', {}, (err, files) => {
    let count = 0;
    for (var i = 0; i < files.length; i++) {
        const yml = files[i];
        if (!yml.includes('node_modules') && !yml.includes('azure-pipelines')) {

            const dir = path.dirname(yml);
            const d = yamljs.load(yml);

            let name = path.parse(yml).name;
            console.log('processing', name);
            puff(del, template, dir, name, d);

            count++;
        }
    }

    console.log('processed:', count);
});

async function puff(del, template, dir, n, data) {
    let name = data.name || n;
    const baseLayer = layer(data.default || data);
    const baseEnvironments = Environments(baseLayer, data.environments);

    //console.log(baseEnvironments);
    const services = new Map([[name, baseEnvironments]]);
    //services[name] = baseEnvironments;
    // const services = (data.services === undefined) ?
    //     new Map([[name, new Map([['environments', baseEnvironments]])]])
    //     : Services(baseLayer, data.services);
// console.log(services.size);
     //console.log(services.toString ( ));
     console.log(services);
    services.forEach((value, key, map) => {
        //console.log(value.toString ( ));
        // console.log(`${key} = ${value}`);
        // //return ;
          //console.log(value);
       //   console.log(value.size);
        //console.log(key, value);
        value.forEach((v, k, m) => {
        console.log(`${k} = ${v}`);
    }
        );
}
    );
    // for (const s of services.keys()) {
    //     // console.log(sMap.toString ( ));
    //      //console.log(sMap.size);
    //      console.log(s);

    //     for (const e of services[s].keys()) {
    //         console.log(e);

    //         // console.log(s);
    //         //console.log(eMap[e]);
    //         //console.log(e, eMap);
    //         //console.log(eMap.size);
    //     //     for (const [x, xMap] of eMap.entries()) {
    //     //         console.log('asdasd');
    //     //     //     console.log(x, xMap);
    //         //  const filename = FileName(dir, s, e, eMap['region']);
    //         //  console.log(filename);
    //         // Io(filename, template, finalLayer, filename);
    //     // }
    // }
    // }
    // Object.keys(services).forEach(service => {
    // //services.keys.forEach(service => {
    //     console.log('service:' + service);

    //     for (env in services[service].environments) {
    //         //Object.keys(serivces[service].environments).forEach(env => {
    //         console.log('env:' + env);

    //         const filename = FileName(dir, service, env, serivces[service][env].region);
    //         Io(filename, template, finalLayer, filename).then(console.log('ji'));
    //     }
    //   });
    // for (service in services) {
    //     //Object.keys(services).forEach(service => {

    // }
}

function Services(baseLayer, services) {
    const srvs = new Map();

    for (service in services) {
        srvs[service] = new Map();

        const serviceLayer = merge(baseLayer, layer(services[service]));
        const environments = Environments(serviceLayer, services[service].environments);

        for (env in services[service].environments) {
            srvs[service][env] = environments[env];
        }
    }

    return srvs;
}

function Environments(baseLayer, environments) {
    const envs = new Map();

    Object.keys(environments).forEach(env => {
        const envLayer = merge(baseLayer, layer(environments[env]));

        if (null != environments[env].region) {
            const finalLayer = envLayer;
            finalLayer.set('region', { value: environments[env].region });
            envs[env] = finalLayer;
        }
        else if (null != environments[env].regions && 0 < environments[env].regions.length) {
            environments[env].regions.forEach(r => {
                const region = Object.keys(r)[0];
                const finalLayer = merge(envLayer, layer(r[region]));
                finalLayer.set('region', { value: region });
                envs[env] = finalLayer;
            });
        }
        else {
            envs[env] = envLayer;
        }
    });

    return envs;
}

function FileName(dir, name, env, region) {
    const fn = (region === undefined) ? name + '.' + env : name + '.' + env + '.' + region;
    return path.join(dir, fn + '.json');
}

async function Io(filename, template, layer, filename) {
    if (del) return await Delete(filename)
    else return await Write(template, layer, filename);
}

async function Delete(filename) {
    return await fs.unlink(filename, function (err) {
        if (err) {
            if (err.code != 'ENOENT') return console.log(err);
        } else {
            console.log('-', path.basename(filename));
        }
    });
}

async function Write(template, final, filename) {
    const contents = template;
    contents.parameters = MapToObject(final);

    return await fs.writeFile(filename
        , JSON.stringify(contents, null, 1)
        , {
            flag: 'w+',
            encoding: "utf8"
        }
        , function (err, data) {
            if (err) console.log(err);
            else {
                console.log('+', path.basename(filename));
            }
        }
    );
}

function MapToObject(m) {
    function selfIterator(map) {
        return Array.from(map).reduce((acc, [key, value]) => {
            if (value instanceof Map) {
                acc[key] = selfIterator(value);
            } else {
                acc[key] = value;
            }

            return acc;
        }, {})
    }

    return selfIterator(m);
}

function layer(data) {
    const map = new Map();

    if (null != data) {
        const keys = Object.keys(data);
        if (0 < keys.length) {
            keys.forEach(element => {
                if ('regions' !== element
                    && 'environments' !== element
                    && 'services' !== element) {
                    const val = (data[element].reference) ? data[element] : { value: data[element] };

                    map.set(element, val);
                }
            });
        }
    }

    return map;
}

function merge(a, b) {
    return new Map(function* () { yield* a; yield* b; }());
}