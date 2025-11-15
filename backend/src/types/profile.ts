// each has a range from 1-100
type Strength = {
  chestVal: number
  backVal: number
  shoulderVal: number
  bicepVal: number
  tricepVal: number
  forearmVal: number
  quadVal: number
  hamstringVal: number
  gluteVal: number
  calfVal: number
  adductorVal: number
  coreVal: number
  obliqueVal: number
  lowerBackVal: number
  cardioVal: number
}

type User = {
    userId: string;
    height: number;
    weight: number;
    age: number;
    gender: string;
    goal: Goal;
    bodyFat: number;
    experience: Experience;
    userStrength: Strength;
    workout: Strength & {
        months: number;
    };
}

type Goal = "bulk" | "lean" | "fit";
type Experience = "beginner" | "intermediate" | "advanced";

export { Strength, User, Goal, Experience };