// import { Strength, User } from "../types/profile";

const Lift = {
    bench: 'bench',
    squat: 'squat',
    deadlift: 'deadlift',
    pullup: 'pullup'
}

// Muscle group contributions (must sum to 1.0 for each lift)
const muscleContributions = {
    'bench': { 'chestVal': 0.5, 'tricepVal': 0.3, 'shoulderVal': 0.2 },
    'squat': { 'quadVal': 0.4, 'gluteVal': 0.3, 'hamstringVal': 0.2, 'lowerBackVal': 0.1 },
    'deadlift': { 'lowerBackVal': 0.4, 'gluteVal': 0.3, 'hamstringVal': 0.2, 'quadVal': 0.1 },
    'pullup': { 'backVal': 0.5, 'bicepVal': 0.3, 'forearmVal': 0.2 }
};

const calculatePR = (user) => {
    const pr = {};
    for (const lift of Object.values(Lift)) {
        const contribution = muscleContributions[lift];
        let totalContribution = 0;
        for(const [muscle, val] of Object.entries(contribution)) {
            totalContribution += user[muscle] * val;
        }
        if(lift === 'pullup') {
            totalContribution /= 2;
        }
        if(lift === 'bench') {
            totalContribution *= 2;
        }
        if(lift === 'deadlift') {
            totalContribution *= 2;
        }
        if(lift === 'squat') {
            totalContribution *= 2;
        }
        pr[lift] = totalContribution;
    }
    return pr;
}

const getInitialStrength = (user) => {
    // Base strength templates
    const baseTemplates = {
        'beginner': {
            chestVal: 10, backVal: 12, shoulderVal: 8, bicepVal: 10, tricepVal: 9,
            forearmVal: 15, quadVal: 20, hamstringVal: 15, gluteVal: 18, calfVal: 15,
            adductorVal: 10, coreVal: 12, obliqueVal: 10, lowerBackVal: 15, cardioVal: 15
        },
        'intermediate': {
            chestVal: 25, backVal: 28, shoulderVal: 22, bicepVal: 24, tricepVal: 23,
            forearmVal: 28, quadVal: 35, hamstringVal: 30, gluteVal: 32, calfVal: 28,
            adductorVal: 25, coreVal: 30, obliqueVal: 26, lowerBackVal: 32, cardioVal: 35
        },
        'advanced': {
            chestVal: 45, backVal: 50, shoulderVal: 42, bicepVal: 44, tricepVal: 43,
            forearmVal: 48, quadVal: 60, hamstringVal: 55, gluteVal: 58, calfVal: 50,
            adductorVal: 45, coreVal: 55, obliqueVal: 48, lowerBackVal: 58, cardioVal: 50
        }
    };

    // Get base template
    const baseTemplate = baseTemplates[user.experience] || baseTemplates.beginner;
    
    // Gender multipliers
    const genderMultipliers = {
        upperBody: user.gender === 'female' ? 0.6 : 1.0,
        lowerBody: user.gender === 'female' ? 0.7 : 1.0,
        core: user.gender === 'female' ? 0.8 : 1.0,
        cardio: user.gender === 'female' ? 1.1 : 1.0
    };

    // Age-based strength curve
    const age = user.age || 25;
    let ageMultiplier = 1.0;
    if (age < 20) ageMultiplier = 0.7 + (age - 15) * 0.06;
    else if (age > 35) ageMultiplier = Math.max(0.5, 1.0 - (age - 35) * 0.01);

    // Weight and height scaling
    const avgWeight = 70 * 2.20462; // kg
    const avgHeight = 175 * 2.54; // cm
    // Weight scales linearly with strength (more weight = more muscle potential)
    const weightMultiplier = (user.weight / avgWeight) ** 0.67; // Using 2/3 power law for mass scaling
    // Height affects leverage (taller = more strength needed for same movement)
    const heightMultiplier = (user.height / avgHeight) ** 0.67;

    // Apply all multipliers
    const result = { ...baseTemplate };
    for (const [key, value] of Object.entries(result)) {
        if (key === 'cardioVal') {
            // Cardio is more about weight than height
            result[key] = value * genderMultipliers.cardio * (user.weight / avgWeight) ** 0.5;
        } else {
            const category = 
                ['chest', 'back', 'shoulder', 'bicep', 'tricep', 'forearm'].some(m => key.includes(m)) ? 'upperBody' :
                ['quad', 'hamstring', 'glute', 'calf', 'adductor'].some(m => key.includes(m)) ? 'lowerBody' :
                'core';
            result[key] = value * 
                         genderMultipliers[category] * 
                         ageMultiplier * 
                         weightMultiplier * 
                         heightMultiplier;
        }
    }

    return result;
};

// Example usage:
const user = {
    gender: 'male',
    age: 25,
    weight: 150,    // in lb
    height: 180,   // in cm
    experience: 'beginner'
};

const initialStrength = getInitialStrength(user);

console.log(calculatePR(initialStrength));