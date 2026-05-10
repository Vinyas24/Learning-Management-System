import { register } from './src/modules/auth/auth.service';
import db from './src/config/db';

async function seedSpecialUsers() {
    try {
        console.log('Registering Instructor...');
        await register('instructor@example.com', 'password123', 'John Instructor');
        await db('users').where({ email: 'instructor@example.com' }).update({ role: 'instructor' });
        console.log('Instructor created: instructor@example.com / password123');

        console.log('Registering Admin...');
        await register('admin@example.com', 'password123', 'Jane Admin');
        await db('users').where({ email: 'admin@example.com' }).update({ role: 'admin' });
        console.log('Admin created: admin@example.com / password123');

        process.exit(0);
    } catch (e) {
        console.error('Error seeding:', e);
        process.exit(1);
    }
}

seedSpecialUsers();
