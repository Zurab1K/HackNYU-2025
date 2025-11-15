import { User } from "types/profile";

const IMPROVEMENT_RATES = {
    beginner: 0.2, // 20% monthly
    intermediate: 0.1, // 15% monthly
    advanced: 0.05 // 5% monthly
}

const simulate = (user: User) => {
    const workout = user.workout;
    // Calculate daily rate based on experience
    const baseRate = IMPROVEMENT_RATES[user.experience] / 30;
    
    // Diminishing returns factor (0 to 1, where 1 is full potential)
    const potentialUsed = 1 - Math.exp(-0.1 * user.workout.months);
    const effectiveRate = baseRate * (1 - potentialUsed);
}