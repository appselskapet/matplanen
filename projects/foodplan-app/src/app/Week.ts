import { FoodPlan } from "./FoodPlan";

export interface Week {
    weeknumber: number;
    startDate: Date;
    endDate: Date;
    foodPlan: FoodPlan;
}