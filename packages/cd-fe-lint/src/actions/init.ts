import path from "path";
import fs from "fs-extra"
import inquirer from 'inquirer'
import spawn from 'cross-spawn'
import { InitOptions, PKG, PROJECT_TYPES } from "../type";
import update from "./update";
import log from "../utils/log";
import conflictResolve from "../utils/conflictResolve";
import npmType from "../utils/npm-type";
import { PKG_NAME } from "../utils/constants";
import generateTemplate from "../utils/generate-template";

let step = 0;
//选择语言和框架
const chooseEslintType = async (): Promise<string> => {
    const { type } = await inquirer.prompt({
        type: "list",
        name: 'type',
        message: `Step ${++step}.请选择项目的语言（JS/TS）和框架类型（Vue/React）`,
        choices: PROJECT_TYPES
    })
    return type;
}

//选择使用stylelint
const chooseEnableStylelint = async (defaultValue: boolean): Promise<string> => {
    const { enable } = await inquirer.prompt({
        type: 'confirm',
        name: 'enable',
        message: `Step ${++step}.是否需要stylelint（若没有样式文件则不需要）：`,
        default: defaultValue
    })
    return enable;
}

//选择使用markdownlint
const chooseEnableMarkdownlint = async (): Promise<string> => {
    const { enable } = await inquirer.prompt({
        type: 'confirm',
        name: 'enable',
        message: `Step ${++step}. 是否需要markdownlint（若没有样式markdown文件则不需要）：`,
        default: true,
    })
    return enable;
}

//选择使用prettier
const chooseEnablePrettier = async (): Promise<string> => {
    const { enable } = await inquirer.prompt({
        type: 'confirm',
        name: 'enable',
        message: `Step ${++step}. 是否需要prettier格式化代码：`,
        default: true,
    })
    return enable;
}
export default async (options: InitOptions) => {
    const cwd = options.cwd || process.cwd();//根目录
    const isTest = process.env.NODE_DEV === 'test';
    const checkVersionUpdate = options.checkVersionUpdate || false;
    const disableNpmInstall = options.disableNpmInstall || false;
    const config: Record<string, any> = {};
    const pkgPath = path.resolve(cwd, "package.json");
    let pkg: PKG = fs.readFileSync(pkgPath);

    //版本检查
    if (!isTest && checkVersionUpdate) {
        await update(false);
    }
    //初始化enableESLint，无需用户选择
    if (typeof options.enableESLint === 'boolean') {
        config.enableESLint = options.enableESLint;
    } else {
        config.enableESLint = true;
    }

    //初始化eslintType
    if (options.eslintType && PROJECT_TYPES.find(choice => choice.value === options.eslintType)) {
        config.eslintType = options.eslintType
    } else {
        config.eslintConfig = await chooseEslintType();
    }

    //初始化enableStylelint
    if (typeof options.enableStylelint === 'boolean') {
        config.enableStylelint = options.enableStylelint;
    } else {
        config.enableStylelint = await chooseEnableStylelint(!/node/.test(config.eslintType))
    }

    //初始化enableMarkdownlint
    if (typeof options.enableMarkdownlint === 'boolean') {
        config.enableMarkdownlint = options.enableMarkdownlint;
    } else {
        config.enableMarkdownlint = await chooseEnableMarkdownlint()
    }

    //初始化enablePrettier
    if (typeof options.enablePrettier === 'boolean') {
        config.enablePrettier = options.enablePrettier;
    } else {
        config.enablePrettier = await chooseEnablePrettier()
    }

    if (!isTest) {
        log.info(`Step${++step}. 检查项目中可能存在的依赖和配置的冲突`);
        pkg = await conflictResolve(cwd, options.rewriteConfig);
        log.success(`Step ${++step}. 已完成项目依赖和配置冲突检查处理 :D`)
        if (!disableNpmInstall) {
            log.info(`Step ${++step}. 安装依赖`);
            const npm = await npmType;
            spawn.sync(npm, ['i', '-D', PKG_NAME], { stdio: 'inherit', cwd })//TODO:
            log.success(`Step ${step}. 安装依赖成功 :D`)
        }

    }
    //写入scripts命令
    pkg = fs.readJSONSync(pkgPath);
    if (!pkg.scripts) {
        pkg.scripts = {};
    }
    if (!pkg.scripts[`${PKG_NAME}-scan`]) {
        pkg.scripts[`${PKG_NAME}-scan`] = `${PKG_NAME} scan`;
    }
    if (!pkg.scripts[`${PKG_NAME}-fix`]) {
        pkg.scripts[`${PKG_NAME}-fix`] = `${PKG_NAME} fix`;
    }
    //配置 git commit 卡点
    log.info(`Step ${++step}. 配置 git commit 卡点`);
    if (!pkg.husky) pkg.husky = {};
    if (!pkg.husky.hook) pkg.husky.hooks = {};
    pkg.husky.hooks['pre-commit'] = `${PKG_NAME} commit-file-scan`;
    pkg.husky.hooks['commit-msg'] = `${PKG_NAME} commit-msg-scan`;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    log.success(`Step ${step}. 配置 git commit 卡点成功 :D`);

    log.info(`Step ${++step}. 写入配置文件`);
    generateTemplate(cwd, config);
    log.success(`Step ${step}. 写入配置文件成功 :D`);

    log.success([`${PKG_NAME} 初始化完成 :D`].join('\r\n'));//TODO:
}