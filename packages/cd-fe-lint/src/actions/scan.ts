import path from "path";
import fs from 'fs-extra'
import { Config, PKG, ScanOptions, ScanReport, ScanResult } from "../type";
import { PKG_NAME } from "../utils/constants";
import { doMarkdownlint, doPrettier, doStylelint,doESLint } from "../lints";


export default async (options: ScanOptions): Promise<ScanReport> => {
    const { cwd, fix, outputReport, config: scanConfig } = options;

    const readConfigFile = (pth: string): any => {
        const localPath = path.resolve(cwd, pth);
        return fs.existsSync(localPath) ? require(localPath) : {};
    }
    const pkg: PKG = readConfigFile('package.json');
    const config: Config = scanConfig || readConfigFile(`${PKG_NAME}.config.js`);
    const runErrors: Error[] = [];
    let results: ScanResult[] = [];
    if (fix && config.enablePrettier) {
        await doPrettier(options);
    }

    if (config.enableStylelint) {
        try {
            const stylelintResults = await doStylelint({ ...options, pkg, config });
            results = results.concat(stylelintResults);
        } catch (error) {
            runErrors.push(error)
        }
    }
    if (config.enableESLint) {
        try {
            const eslintResults = await doESLint({ ...options, pkg, config });
            results = results.concat(eslintResults);
        } catch (error) {
            runErrors.push(error)
        }
    }
    if (config.enableMarkdownlint) {
        try {
            const markdownlintresults = await doMarkdownlint({ ...options, pkg, config });
            results = results.concat(markdownlintresults);
        } catch (error) {
            runErrors.push(error)
        }
    }
    if(outputReport){
        const reportPath=path.resolve(process.cwd(),`./${PKG_NAME}-report.json`);
        fs.outputFile(reportPath,JSON.stringify(results,null,2),()=>{})//TODO:
    }

    return{
        results,
        errorCount:results.reduce((count,{errorCount})=>count+errorCount,0),
        warningCount:results.reduce((count,{warningCount})=>count+warningCount,0),
        runErrors
    };
}

