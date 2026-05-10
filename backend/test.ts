import db from './src/config/db';

async function main() {
    const cols = await db('users').columnInfo();
    console.log(cols);
    process.exit(0);
}
main();
