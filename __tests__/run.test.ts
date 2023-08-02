// Copyright 2021 The CUE Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as run from '../src/run'
import * as os from 'os';
import * as toolCache from '@actions/tool-cache';
import * as fs from 'fs';
import * as path from 'path';
import * as core from '@actions/core';
import * as util from 'util';

describe('Testing all functions in run file.', () => {
    test('run() must download specified cuectl version and set output', async () => {
        jest.spyOn(core, 'getInput').mockReturnValue('v0.4.0');
        jest.spyOn(toolCache, 'find').mockReturnValue('pathToCachedTool');
        jest.spyOn(os, 'type').mockReturnValue('Linux');
        jest.spyOn(fs, 'chmodSync').mockImplementation();
        jest.spyOn(core, 'addPath').mockImplementation();
        jest.spyOn(console, 'log').mockImplementation();
        jest.spyOn(core, 'setOutput').mockImplementation();

        expect(await run.run()).toBeUndefined();
        expect(core.getInput).toBeCalledWith('version', { 'required': true });
        expect(core.addPath).toBeCalledWith('pathToCachedTool');
        expect(core.setOutput).toBeCalledWith('cuectl-path', path.join('pathToCachedTool', 'cue'));
    });

    test('getExecutableExtension() must return .exe file extension when os equals Windows', () => {
        jest.spyOn(os, 'type').mockReturnValue('Windows_NT');

        expect(run.getExecutableExtension()).toBe('.exe');
        expect(os.type).toBeCalled();
    });

    test('getExecutableExtension() must return an empty string for non-windows OS', () => {
        jest.spyOn(os, 'type').mockReturnValue('Darwin');

        expect(run.getExecutableExtension()).toBe('');
        expect(os.type).toBeCalled();
    });

    test.each([
        ['arm', 'arm'],
        ['arm64', 'arm64'],
        ['x64', 'amd64']
    ])("getCuectlArch() must return on %s os architecture %s cuectl architecture", (osArch, cuectlVersion) => {
        jest.spyOn(os, 'arch').mockReturnValue(osArch);

        expect(run.getCuectlOSArchitecture()).toBe(cuectlVersion);
        expect(os.arch).toBeCalled();
    });

    test.each([
        ['arm64'],
        ['amd64']
    ])('getCuectlDownloadURL() must return the URL to download %s cuectl for Linux based systems', (arch) => {
        jest.spyOn(os, 'type').mockReturnValue('Linux');
        const cuectlLinuxUrl = util.format('https://github.com/cue-lang/cue/releases/download/v0.4.0/cue_v0.4.0_linux_%s.tar.gz', arch);

        expect(run.getCuectlDownloadURL('v0.4.0', arch)).toBe(cuectlLinuxUrl);
        expect(os.type).toBeCalled();
    });

    test.each([
        ['arm64'],
        ['amd64']
    ])('getCuectlDownloadURL() must return the URL to download %s cuectl for MacOS based systems', (arch) => {
        jest.spyOn(os, 'type').mockReturnValue('Darwin');
        const cuectlDarwinUrl = util.format('https://github.com/cue-lang/cue/releases/download/v0.4.0/cue_v0.4.0_darwin_%s.tar.gz', arch);

        expect(run.getCuectlDownloadURL('v0.4.0', arch)).toBe(cuectlDarwinUrl);
        expect(os.type).toBeCalled();
    });

    test.each([
        ['amd64']
    ])('getCuectlDownloadURL() must return the URL to download %s cuectl for Windows based systems', (arch) => {
        jest.spyOn(os, 'type').mockReturnValue('Windows_NT');
        const cuectlWindowsUrl = util.format('https://github.com/cue-lang/cue/releases/download/v0.4.0/cue_v0.4.0_windows_%s.zip', arch);

        expect(run.getCuectlDownloadURL('v0.4.0', arch)).toBe(cuectlWindowsUrl);
        expect(os.type).toBeCalled();
    });

    test('downloadCuectl() must download cuectl tarball, add it to github actions tool cache and return the path to extracted dir', async () => {
        jest.spyOn(toolCache, 'find').mockReturnValue('');
        jest.spyOn(toolCache, 'downloadTool').mockReturnValue(Promise.resolve('cuectlDownloadPath'));
        jest.spyOn(toolCache, 'extractTar').mockReturnValue(Promise.resolve('cuectlExtractedFolder'));

        jest.spyOn(toolCache, 'cacheDir').mockReturnValue(Promise.resolve('pathToCachedTool'));
        jest.spyOn(os, 'type').mockReturnValue('Linux');
        jest.spyOn(fs, 'chmodSync').mockImplementation(() => {});

        expect(await run.downloadCuectl('v0.4.0')).toBe(path.join('pathToCachedTool', 'cue'));
        expect(toolCache.find).toBeCalledWith('cue', 'v0.4.0');
        expect(toolCache.downloadTool).toBeCalled();
        expect(toolCache.cacheDir).toBeCalled();
        expect(os.type).toBeCalled();
        expect(fs.chmodSync).toBeCalledWith(path.join('pathToCachedTool', 'cue'), '777');
    });

    test('downloadCuectl() must download cuectl zip archive, add it to github actions tool cache and return the path to extracted dir', async () => {
        jest.spyOn(toolCache, 'find').mockReturnValue('');
        jest.spyOn(toolCache, 'downloadTool').mockReturnValue(Promise.resolve('cuectlDownloadPath'));
        jest.spyOn(toolCache, 'extractZip').mockReturnValue(Promise.resolve('cuectlExtractedFolder'));

        jest.spyOn(toolCache, 'cacheDir').mockReturnValue(Promise.resolve('pathToCachedTool'));
        jest.spyOn(os, 'type').mockReturnValue('Windows_NT');
        jest.spyOn(fs, 'chmodSync').mockImplementation(() => {});

        expect(await run.downloadCuectl('v0.4.0')).toBe(path.join('pathToCachedTool', 'cue.exe'));
        expect(toolCache.find).toBeCalledWith('cue', 'v0.4.0');
        expect(toolCache.downloadTool).toBeCalled();
        expect(toolCache.cacheDir).toBeCalled();
        expect(os.type).toBeCalled();
        expect(fs.chmodSync).toBeCalledWith(path.join('pathToCachedTool', 'cue.exe'), '777');
    });

    test('getLatestCuectlVersion() must download latest version file, read version and return it', async () => {
        jest.spyOn(toolCache, 'downloadTool').mockResolvedValue('pathToTool');
        const response = JSON.stringify(
            [
                {
                    'tag_name': 'v0.2.0'
                }, {
                    'tag_name': 'v0.3.0-rc.2'
                }, {
                    'tag_name': 'v0.5.0'
                }, {
                    'tag_name': 'v0.4.0'
                }, {
                    'tag_name': 'v0.5.0-alpha.1'
                }
            ]
        );
        jest.spyOn(fs, 'readFileSync').mockReturnValue(response);

        expect(await run.getLatestCuectlVersion()).toBe('v0.5.0');
        expect(toolCache.downloadTool).toBeCalled();
        expect(fs.readFileSync).toBeCalledWith('pathToTool', 'utf8');
    });
})
