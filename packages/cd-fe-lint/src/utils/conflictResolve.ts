import path from "path"
import glob from 'glob'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import { PKG } from "../type";
import log from "./log";
import { PKG_NAME } from "./constants";

// 精确移除依赖
const packageNamesToRemove = [
    '@babel/eslint-parser',
    '@commitlint/cli',
    '@iceworks/spec',
    'babel-eslint',
    'eslint',
    'husky',
    'markdownlint',
    'prettier',
    'stylelint',
    'tslint',
];
// 按前缀移除依赖
const packagePrefixesToRemove = [
    '@commitlint/',
    '@typescript-eslint/',
    'eslint-',
    'stylelint-',
    'markdownlint-',
    'commitlint-',
];

/**
 * 待删除的无用配置
 * @param cwd
 */
const checkUselessConfig = (cwd: string): string[] => {
    return []
        .concat(glob.sync('.eslintrc?(.@(yaml|yml|json))', { cwd }))
        .concat(glob.sync('.stylelintrc?(.@(yaml|yml|json))', { cwd }))
        .concat(glob.sync('.markdownlint@(rc|.@(yaml|yml|jsonc))', { cwd }))
        .concat(
            glob.sync('.prettierrc?(.@(cjs|config.js|config.cjs|yaml|yml|json|json5|toml))', { cwd }),
        )
        .concat(glob.sync('tslint.@(yaml|yml|json)', { cwd }))
        .concat(glob.sync('.kylerc?(.@(yaml|yml|json))', { cwd }));
};

const checkRewriteConfig = (cwd: string) => {
    return glob
        .sync('**/*.ejs', { cwd: path.resolve(__dirname, 'package.json') })
        .map(name => name.replace(/^_/, '.').replace(/\.ejs$/, ''))
        .filter(fileName => fs.existsSync(path.resolve(cwd, fileName)));//查找该路径是否有这个文件
}

export default async (cwd: string, rewriteConfig?: boolean) => {
    const pkgPath = path.resolve(cwd, 'package.json');
    const pkg: PKG = fs.readFileSync(pkgPath);
    const dependenciesName = [].concat(
        Object.keys(pkg.dependencies || {}),
        Object.keys(pkg.devDependencies || {})
    );
    const willRemovePackages = dependenciesName.filter(
        (name) =>
            packageNamesToRemove.includes(name) ||
            packagePrefixesToRemove.some(prefix => name.startsWith(prefix))
    );
    const uselessConfig = checkUselessConfig(cwd);
    const reWriteConfig = checkRewriteConfig(cwd);
    const willChangCount = willRemovePackages.length + uselessConfig.length + reWriteConfig.length;
    if (willChangCount > 0) {
        log.warn(`检测到项目中存在可能与 ${PKG_NAME} 冲突的依赖和配置，为保证正常运行将`);
        if (uselessConfig.length > 0) {
            log.warn('删除以下配置文件：');
            log.warn(JSON.stringify(uselessConfig, null, 2));//2是缩进
        }

        if (reWriteConfig.length > 0) {
            log.warn('覆盖以下配置文件：');
            log.warn(JSON.stringify(reWriteConfig, null, 2));
        }

        if (willRemovePackages.length > 0) {
            log.warn('删除以下依赖：');
            log.warn(JSON.stringify(willRemovePackages, null, 2));
        }
        if (typeof rewriteConfig === 'undefined') {
            const { isOverWrite } = await inquirer.prompt({
                type: 'confirm',
                name: 'isOverWrite',
                message: '请确认是否继续：'
            })
            if (!isOverWrite) process.exit(0)
        } else if (!rewriteConfig) process.exit(0)
    }
    //删除配置文件
    for (const name of uselessConfig) {
        fs.removeSync(path.resolve(cwd, name))
    }
    //修正package.json
    delete pkg.eslintConfig;
    delete pkg.eslintIgnore;
    delete pkg.stylelint;
    for (const name of willRemovePackages) {
        delete (pkg.dependencies || {})[name];
        delete (pkg.devDependencies || {})[name];
        fs.writeJSONSync(path.resolve(cwd, 'package.json'), JSON.stringify(pkg, null, 2))
    }
    return pkg
}