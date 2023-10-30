import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

export class Installer {

    protected static readonly executable = 'data_producer';

    static EnsureInstall(installPath: string) {
        const fullPath = path.resolve(installPath);
        const execFullPath = path.resolve(fullPath + '/target/release/' + this.executable);
        if (fs.existsSync(execFullPath)) {
            // TODO: ??? check version and auto update
            return { fullPath, execFullPath};
        }

        // get from repo
        if (fs.existsSync(fullPath)) {
            // remove dir and files, probaly outdated or corrupted\incorrect
            execSync(`rm -rf "${fullPath}"`, { stdio: 'inherit'});
        }

        execSync(`mkdir -p "${fullPath}"`, { stdio: 'inherit'});

        // TODO: ??? change url to final public
        execSync(`git clone https://github.com/venom-blockchain/fusion-producer.git "${fullPath}"`, {
            stdio: 'inherit',
            cwd: fullPath
        });

        // compile
        execSync(`cargo build --release --features venom`, {
            stdio: 'inherit',
            cwd: fullPath
        });

        // check results
        if (!fs.existsSync(execFullPath)) {
            throw Error("unknown error during compilation");
        }

        return { fullPath, execFullPath };
    }
}