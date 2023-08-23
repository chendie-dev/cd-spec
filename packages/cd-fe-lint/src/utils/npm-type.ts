import {sync as commandExistsSync} from 'command-exists'
const promise:Promise<'npm'|'pnpm'>=new Promise((resolve)=>{
    if(!commandExistsSync('pnpm'))return resolve('npm');
    return resolve('pnpm')
})

export default promise