
export enum RoastLevel {
  LIGHT = '淺焙',
  MEDIUM_LIGHT = '淺中焙',
  MEDIUM = '中焙',
  MEDIUM_DARK = '中深焙',
  DARK = '深焙'
}

export enum ProcessMethod {
  WASHED = '水洗',
  NATURAL = '日曬',
  HONEY = '蜜處理',
  ANAEROBIC = '厭氧處理'
}

export interface CoffeeParams {
  origin: string;
  process: ProcessMethod | string;
  roast: RoastLevel | string;
  targetVolume: number;
  dripper: string;
}

export interface BrewingStep {
  time: string;
  action: string;
  waterAmount: string;
  technique: string;
}

export interface BrewingRecipe {
  powderWeight: number;
  waterRatio: string;
  grindSize: string;
  temperature: number;
  totalTime: string;
  notes: string;
  steps: BrewingStep[];
}
