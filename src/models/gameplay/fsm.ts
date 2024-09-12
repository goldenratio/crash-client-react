import { assign, createMachine } from "xstate";

// State machine
export const gameplayMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswAcA2KCeAtGigMYAWAlgHZgB01pALhQG5gDEAKgPIDivAGQCiAbQAMAXUShMAe1gVmsqtJAAPRAEYAbAE4ANCDxaAzLtpiAHCZu27JzQF9Hh1Bhz4ipSjVpNWHDz8wuJSSCByCkoq4RoIOgZGiJaWtACs1vZZzi4gVLIQcKpuWLiExOTUYKqRihTKqnEE2obGCM3OruilnhU+dAwkzGw18nUNsYgALABMrYi6U7TaK6trqwDsnSAlHuXeVX5DAaNR9TGgcTO6JrQOM2nzCJaa6TmOQA */
  id: "gameplay-machine",
  initial: "inactive",
  context: {
    count: 0,
  },
  states: {
    inactive: {
      on: {
        TOGGLE: { target: "active" },
      },
    },
    active: {
      entry: assign({ count: ({ context }) => context.count + 1 }),
      on: {
        TOGGLE: { target: "inactive" },
      },
    },
  },
});
