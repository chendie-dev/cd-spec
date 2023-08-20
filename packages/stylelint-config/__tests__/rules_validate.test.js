const assert = require("assert")
const stylelint = require("stylelint")
const path = require("path")

describe('test/rule_validate.test.js', () => {
    it('Validate css-module', async () => {
        const filePaths = [path.join(__dirname, './fixtures/css-module.scss')];

        const result = await stylelint.lint({
            configFile: path.join(__dirname, '../index.js'),
            files: filePaths,
            fix: false,
        });

        if (result && result.errored) {
            const filesResult = JSON.parse(result.output || '[]') || [];
            filesResult.forEach((fileResult) => {
                console.log(`========= ${filePaths} ==========`);
                console.log(fileResult.warnings);
            });

            assert.ok(filesResult.length > 0);
        }
    });

    it('Validate default', async () => {
        const filePaths = [path.join(__dirname, './fixtures/index.css')]
        const res = await stylelint.lint({
            configFile: path.join(__dirname, '../index.js'),
            files: filePaths,
            fix: false
        })
        if (res && res.errored) {
            const fileResults = JSON.parse(res.output || '[]') || []
            fileResults.forEach(fileResult => {
                console.log(`==========${fileResult}========`)
                console.log(fileResult.warnings)
            });
            assert.ok(fileResults.length > 0)
        }
    })

    it('Validate less', async () => {
        const filePaths = [path.join(__dirname, './fixtures/less-test.less')];

        const result = await stylelint.lint({
            configFile: path.join(__dirname, '../index.js'),
            files: filePaths,
            fix: false,
        });

        if (result && result.errored) {
            const filesResult = JSON.parse(result.output || '[]') || [];
            filesResult.forEach((fileResult) => {
                console.log(`========= ${filePaths} ==========`);
                console.log(fileResult.warnings);
            });

            assert.ok(filesResult.length !== 0);
        }
    });

    it('Validate scss', async () => {
        const filePaths = [path.join(__dirname, './fixtures/sass-test.scss')];

        const result = await stylelint.lint({
            configFile: path.join(__dirname, '../index.js'),
            files: filePaths,
            fix: false,
        });

        if (result && result.errored) {
            const filesResult = JSON.parse(result.output || '[]') || [];
            filesResult.forEach((fileResult) => {
                console.log(`========= ${filePaths} ==========`);
                console.log(fileResult.warnings);
            });

            assert.ok(filesResult.length !== 0);
        }
    });


})