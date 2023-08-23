import ora from 'ora';
import initAction from './actions/init'
import scanAction from './actions/scan'
import printReport from './utils/print-report'
import { InitOptions, ScanOptions } from './type'
import { PKG_NAME } from './utils/constants';

type IInitOptions = Omit<InitOptions, 'checkVersionUpdate'>;

export const init = async (options: IInitOptions) => {
    return await initAction({
        ...options,
        checkVersionUpdate: false
    })
}

export const scan = async (options: ScanOptions) => {
    const checking = ora();//TODO:
    checking.start(`执行 ${PKG_NAME} 代码检查`);
    const report=await scanAction(options);
    const {errorCount,warningCount,results}=report;
    let type='succeed';
    if(errorCount>0){
        type='fail';
    }else if(warningCount>0){
        type='warn';
    }
    checking[type]();
    if(results.length>0)printReport(results,false);//TODO:
    return report
}