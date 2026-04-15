module.exports = {
    '*.ts': ['pnpm exec prettier --write', 'pnpm exec eslint --fix'],
};
