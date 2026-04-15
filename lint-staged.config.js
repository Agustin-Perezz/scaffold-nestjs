module.exports = {
    '*.ts': [
        'pnpm exec prettier --write',
        'pnpm exec eslint --fix',
        (files) => {
            const e2eFiles = files.filter(f => f.endsWith('.e2e-spec.ts'));
            const unitTestFiles = files.filter(f => !f.endsWith('.e2e-spec.ts'));

            const commands = [];
            if (unitTestFiles.length > 0) {
                commands.push(`pnpm test -- --passWithNoTests --findRelatedTests ${unitTestFiles.join(' ')}`);
            }
            return commands;
        },
    ],
};
