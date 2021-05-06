import { Machine, assign } from "xstate";

type Context = {
  display: string;
  operand1?: string;
  operand2?: string;
  operator?: string;
};

function doMath(operand1: string, operand2: string, operator: string) {
  switch (operator) {
    case "+":
      return +operand1 + +operand2;
    case "-":
      return +operand1 - +operand2;
    case "/":
      return +operand1 / +operand2;
    case "x":
      return +operand1 * +operand2;
    default:
      return Infinity;
  }
}

const calMachine = Machine<Context>(
  {
    id: "calcMachine",
    context: {
      display: "0",
      operand1: undefined,
      operand2: undefined,
      operator: undefined,
    },
    strict: false,
    initial: "start",
    on: {
      CLEAR_EVERYTHING: {
        target: ".start",
        actions: ["reset"],
      },
    },
    states: {
      start: {},
    },
  },
  {
    actions: {
      defaultReadout: assign({
        display: () => {
          console.log("defaultReadout");
          return "0";
        },
      }),
      setReadoutNum: assign({
        display: (_context, event) => {
          return `${event.key}`;
        },
      }),
      recordOperator: assign({
        operand1: (context, _event) => context.display,
        operator: (_context, event) => event.operator,
      }),
      reset: assign({
        display: (_context, _event) => "0",
        operand1: (_context, _event) => undefined,
        operand2: (_context, _event) => undefined,
        operator: (_context, _event) => undefined,
      }),
      appendNumber: assign({
        display: (context, event) => {
          return `${context.display}${event.key}`;
        },
      }),
      storeResultAsOperand1: assign({
        operand1: (context) => context.display,
      }),
      storeResultAsOperand2: assign({
        operand2: (context) => context.display,
      }),
      saveOperand2: assign({
        operand2: (context, event) => context.display,
      }),
      compute: assign({
        display: (context, event) => {
          const result = doMath(
            context.operand1 ? context.operand1 : "1",
            context.operand2 ? context.operand2 : "1",
            context.operator ? context.operator : "0"
          );

          console.log(
            `doing calculation ${context.operand1} ${context.operator} ${context.operand2} = ${result}`
          );
          return result.toString();
        },
      }),
    },
  }
);

export default calMachine;
