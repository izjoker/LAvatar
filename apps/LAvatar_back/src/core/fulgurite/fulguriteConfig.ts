import path from 'path'
import fs from 'fs'
import _ from 'lodash'
import YAML from 'js-yaml'
import process from 'process'

interface FulguriteConfigOptions {
    configDir: string;
    defaultDir: string;
    auto: boolean;
    max_depth: number;
}


export default class FulguriteConfig {
    moduleName: string;
    options?: FulguriteConfigOptions;
    configDir: string;
    defaultDir: string;
    buildTarget: string;
    config: any;

    constructor({moduleName, buildTarget, options}: { moduleName?: string; buildTarget?: string; options?: FulguriteConfigOptions } = {}) {
        this.moduleName = moduleName || 'config';
        this.options = options || ({} as FulguriteConfigOptions);
        this.defaultDir = process.env.Fulgurite_DEFAULT_DIR || process.cwd();
        this.configDir = process.env.Fulgurite || path.join(process.cwd(), 'config');
        this.buildTarget = buildTarget || process.env.NODE_ENV || 'development';
        
        this.load();

        return this;
    }

    static fileName(moduleName: string, buildTarget: string) {
        return moduleName ? moduleName.concat('.', buildTarget) : buildTarget;
    }

    prepareDefault() {
        
        
        const defaultFileName = FulguriteConfig.fileName(this.moduleName, 'default') + '.yaml';
        const defaultFilePath = path.join(this.defaultDir, defaultFileName);
        const configDefaultPath = path.join(this.configDir, defaultFileName);
        
        // load both origin default file and default configuration file
        /**
         * @type {Buffer}
         */
        let originDefaultBuf = null;
        let destDefaultBuf = null;
        try {
            originDefaultBuf = fs.readFileSync(defaultFilePath);
        } catch (e) {
            console.log(e);
        }
        try {
            destDefaultBuf = fs.readFileSync(configDefaultPath);
        } catch (e) {
            console.log(e);
        }

        // check default files
        if (!originDefaultBuf) {
            console.warn('default file does not exist. load configuration without default');
        } else if (!destDefaultBuf) {
            fs.copyFileSync(defaultFilePath, configDefaultPath);
            console.info('default file in config directory is not exist. generate it from default');
        } else if (!originDefaultBuf.equals(destDefaultBuf)) {
            fs.copyFileSync(defaultFilePath, configDefaultPath);
            console.info('default file in config directory is not fresh. update it to new version');
        } else {
            console.log('default file is exist');
        }
    }

    /**
     * Load all config
     * @return {*}
     */
    load() {
        this.loadConfig();

        return this;
    }

    static loadFile(filePath: string) {
        try {
            return YAML.load(fs.readFileSync(filePath, 'utf8'), { json: true, filename: filePath });
        } catch (e) {
            console.warn('load configuration file failed', filePath);
            console.error(e);
            return {};
        }
    }

    /**
     * load default and user config from files.
     * if cache flag is set, update cache also
     * @return {Config}
     */
    loadConfig() {
        this.prepareDefault();

        // get default config
        const defaultFileName = FulguriteConfig.fileName(this.moduleName, 'default') + '.yaml';
        const defaultFilePath = path.join(this.configDir, defaultFileName);
        const defaultConfig = FulguriteConfig.loadFile(defaultFilePath);

        const configFileName = FulguriteConfig.fileName(this.moduleName, this.buildTarget) + '.yaml';
        const configFilePath = path.join(this.configDir, configFileName);
        const userConfig = FulguriteConfig.loadFile(configFilePath);

        console.log('defaultFilePath', defaultFilePath);
        console.log('defaultConfig', defaultConfig);
        console.log('configFilePath', configFilePath);
        console.log('userConfig', userConfig);
        this.config = extendDeep(defaultConfig, userConfig);
        console.log('merged:', this.config);

        return this;
    }

    

    /**
     * return config value in path
     * if path is not valid, return undefined
     * @param {string | array} [path]
     * @return {*}
     */
    get(path?: string | Array<string>) {
        return path ? _.get(this.config, path) : this.config;
    }
}
function extendDeep(defaultObj: any, configObj: any): any {
    // console.log("defaultObj", defaultObj)
    // console.log("configObj", configObj)
    if (_.isArray(defaultObj) && _.isArray(configObj)) {
        return configObj;
    } else if (typeof defaultObj === 'object' && typeof configObj === 'object') {
        return _.assignWith(defaultObj, configObj, extendDeep);
    } else if (typeof defaultObj === 'undefined') {
        console.warn(`config ${configObj} (${typeof configObj}) is not defined on default`);
        return configObj;
    } else if (typeof defaultObj !== typeof configObj) {
        console.warn(
            `config type mismatch, default is ${defaultObj}(${typeof defaultObj})` +
                `but config is ${configObj} (${typeof configObj})`,
        );
        return defaultObj;
    } else {
        return configObj;
    }
}