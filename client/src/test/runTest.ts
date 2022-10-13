/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as path from 'path';

import { downloadAndUnzipVSCode, resolveCliArgsFromVSCodeExecutablePath, runTests } from '@vscode/test-electron';
import { spawnSync } from 'child_process';
import { readFile } from 'fs/promises';

async function main() {
	const extensionDevelopmentPath = path.resolve(__dirname, '../../../');
	const extensionTestsPath = path.resolve(__dirname, './index');
	const packagePath = path.join(extensionDevelopmentPath, 'package.json');
	const pkgJson = JSON.parse((await readFile(packagePath)).toString('utf-8'));

	try {
		const vscodeExecutablePath = await downloadAndUnzipVSCode('1.72.0');
		const [cli, ...args] = resolveCliArgsFromVSCodeExecutablePath(vscodeExecutablePath);
		for (const dependency of pkgJson.extensionDependencies) {
			const subprocess = spawnSync(cli, [...args, '--install-extension', dependency]);
			console.log('[Extension Install] ' + subprocess.stdout.toString('utf-8').split('\n').join('\n[Extension Install] '));
		}
		// Run the extension test
		await runTests({
			// Use the specified `code` executable
			vscodeExecutablePath,
			extensionDevelopmentPath,
			extensionTestsPath
		});
	} catch (err) {
		console.error('Failed to run tests');
		process.exit(1);
	}
}

main();
