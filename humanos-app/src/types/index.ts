export type Step = {
  text: string;
  intention?: string;
  duration?: number;
};

export type TriggerType = 'time_window' | 'manual';

export type Trigger = {
  type: TriggerType;
  start: string;
  end: string;
  preferred: string;
  days: string[];
};

export type Routine = {
  id: string;
  name: string;
  tags: string[];
  emoji?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
  trigger: Trigger;
  steps: Step[];
};

export type RoutinesData = {
  routines: Routine[];
};

export type RoutineStatus = 'not_started' | 'in_progress' | 'completed';

export type RoutineWithStatus = Routine & {
  status: RoutineStatus;
};