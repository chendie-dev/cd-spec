import path from "path"
import { glob } from "glob";
import ejs from 'ejs'
import fs from 'fs-extra'
import _ from 'lodash'
import { ESLINT_IGNORE_PATTERN, MARKDOWN_LINT_IGNORE_PATTERN, STYLELINT_FILE_EXT, STYLELINT_IGNORE_PATTERN } from "./constants";

const mergeVscodeConfig = (filePath: string, content: string) => {
    if (!fs.existsSync(filePath)) return content;
    try {
        const targetData = fs.readJSONSync(filePath)//TODO:api区别
        const sourceData = JSON.parse(content);
        return JSON.stringify(
            _.mergeWith(targetData, sourceData, (target, source) => {
                if (Array.isArray(target) && Array.isArray(source)) {
                    return [...new Set(target.concat(source))]
                }
            }),
            null,
            2
        )
    } catch (error) {
        return ''
    }
}

export default (cwd: string, config: Record<string, any>, vscode?: boolean) => {
    console.log('configggggg',config)
    const templatePath = path.resolve(__dirname, '../config');
    const templates = glob.sync(`${vscode ? 'vscode' : '**'}/*.ejs`, { cwd: templatePath });
    for (const name of templates) {
        const filePath = path.resolve(cwd, name.replace(/\.ejs$/, '').replace(/^_/, '.'));
        let content = ejs.render(fs.readFileSync(path.resolve(templatePath, name), 'utf8'), {
            eslintIgnores: ESLINT_IGNORE_PATTERN,
            stylelintExt: STYLELINT_FILE_EXT,
            stylelintIgnores: STYLELINT_IGNORE_PATTERN,
            markdownLintIgnores: MARKDOWN_LINT_IGNORE_PATTERN,
            ...config
        });

        if (/^_vscode/.test(name)) {
            content = mergeVscodeConfig(filePath,content);
        }
        if(!content.trim())continue;
        fs.outputFileSync(filePath,content,'utf8')
    }
}