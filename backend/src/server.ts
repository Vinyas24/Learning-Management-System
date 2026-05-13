import app from './app';
import { env } from './config/env';
import db from './config/db';
import { hashPassword } from './utils/password';

const PORT = env.PORT;

const seedAdmin = async () => {
    try {
        const existing = await db('users').where({ email: 'admin@learnflow.com' }).first();
        const password_hash = await hashPassword('Admin@1234');
        if (!existing) {
            await db('users').insert({
                email: 'admin@learnflow.com',
                password_hash,
                name: 'Platform Admin',
                role: 'admin',
            });
            console.log('   ✅ Admin account created: admin@learnflow.com / Admin@1234');
        } else {
            // Always enforce role=admin and reset password so credentials are always known
            await db('users').where({ email: 'admin@learnflow.com' }).update({ role: 'admin', password_hash });
            console.log('   ✅ Admin account synced: admin@learnflow.com / Admin@1234');
        }
    } catch (err) {
        console.error('   ⚠️  Could not seed admin account:', err);
    }
};

app.listen(PORT, () => {
    console.log(`\n🚀 LMS Backend running on port ${PORT}`);
    console.log(`   Environment: ${env.NODE_ENV}`);
    console.log(`   CORS Origin: ${env.CORS_ORIGIN}`);
    console.log(`   Health: http://localhost:${PORT}/api/health\n`);

    // Run seedAdmin in background after 2s to allow DB pool to warm up
    setTimeout(() => {
        seedAdmin().catch((err) => console.error('seedAdmin failed:', err));
    }, 2000);
});
