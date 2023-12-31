import ora from 'ora'
import { PKG_NAME, PKG_VERSION } from '../utils/constants'
import log from '../utils/log';
import npmType from '../utils/npm-type';
import { execSync } from 'child_process';
//TODO:理解版本号比较
const checkLatestVersion = async (npm: "npm" | "pnpm"): Promise<string | null> => {
    const latestVersion = execSync(`${npm} view ${PKG_NAME} version`).toString('utf8').trim();

    if (PKG_VERSION === latestVersion) return null;

    const compareArr = PKG_VERSION.split('.').map(Number);
    const beCompareArr = latestVersion.split('.').map(Number);

    for (let i = 0; i < compareArr.length; i++) {
        if (compareArr[i] > beCompareArr[i]) {
            return null;
        } else if (compareArr[i] < beCompareArr[i]) {
            return latestVersion;
        }
    }
}
export default async (install = true) => {
    const checking = ora(`[${PKG_NAME}] 正在检查最新版本`);
    checking.start();

    try {
        const npm = await npmType;
        const latestVersion = await checkLatestVersion(npm);
        checking.stop();

        if (latestVersion && install) {
            const update = ora(`[${PKG_NAME}]存在新版本，将升级至 ${latestVersion}`)
            update.start()
            execSync(`${npm} i -g ${PKG_NAME}`)
            update.stop();
        } else if (latestVersion) {
            log.warn(`最新版本为${latestVersion},本地版本为${PKG_VERSION},请尽快升级为最新版本。\n你可以执行 ${npm} i ${PKG_NAME}@latest 来安装最新版本\n`);
        }else if(install){
            log.info('当前没有可用更新')
        }
    } catch (error) {
        checking.stop();
        log.error(error)
    }
}