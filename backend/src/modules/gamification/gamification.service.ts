import db from '../../config/db';

export const recordActivity = async (userId: number, xpAmount: number = 0) => {
    const user = await db('users').where({ id: userId }).first();
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let lastActive = user.last_active_date ? new Date(user.last_active_date) : null;
    if (lastActive) lastActive.setHours(0, 0, 0, 0);

    let newStreak = user.current_streak;
    let longestStreak = user.longest_streak;

    if (!lastActive) {
        newStreak = 1;
    } else {
        const diffTime = today.getTime() - lastActive.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            newStreak += 1; // Consecutive day
        } else if (diffDays > 1) {
            newStreak = 1; // Streak broken
        }
        // If diffDays === 0, streak remains same (already active today)
    }

    if (newStreak > longestStreak) {
        longestStreak = newStreak;
    }

    await db('users')
        .where({ id: userId })
        .update({
            xp: user.xp + xpAmount,
            current_streak: newStreak,
            longest_streak: longestStreak,
            last_active_date: new Date() // store exact timestamp
        });
};

export const getUserGamificationStats = async (userId: number) => {
    const user = await db('users').where({ id: userId }).first();
    if (!user) return null;
    return {
        xp: user.xp,
        current_streak: user.current_streak,
        longest_streak: user.longest_streak,
        last_active_date: user.last_active_date
    };
};
