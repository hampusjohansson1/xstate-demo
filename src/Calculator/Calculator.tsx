import styles from "./calculator.module.scss";
import clsx from "clsx";
import { useMachine } from "@xstate/react";
import machine from "../machine";
import { SingleOrArray, Event, AnyEventObject, SCXML, EventData } from "xstate";

const buttons = [
  "C",
  "+",
  "-",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  "=",
];

function isOperator(text: string) {
  return "+-x/".indexOf(text) > -1;
}

const Calculator = () => {
  const [state, sendMachine] = useMachine(machine, {});

  function send(
    event: SingleOrArray<Event<AnyEventObject>> | SCXML.Event<AnyEventObject>,
    payload: EventData | undefined
  ) {
    console.log("Event - Payload", { event, payload });
    sendMachine(event, payload);
  }

  const handleButtonClick = (item: string) => () => {
    if (Number.isInteger(+item)) {
      send("NUMBER", { key: +item });
    } else if (isOperator(item)) {
      send("OPERATOR", { operator: item });
    } else if (item === "C") {
      send("CLEAR_EVERYTHING", {});
    } else if (item === ".") {
      send("DECIMAL_POINT", {});
    } else if (item === "%") {
      send("PERCENTAGE", {});
    } else if (item === "CE") {
      send("CLEAR_ENTRY", {});
    } else {
      send("EQUALS", {});
    }
  };

  return (
    <div
      style={{
        width: 300,
        height: "auto",
        border: "1px solid rgba(0,0,0,0.05)",
        margin: "0 auto",
        marginTop: 16,
      }}
    >
      <div>
        <input
          type="text"
          value={state.context.display}
          disabled
          style={{
            width: "100%",
            textAlign: "right",
            padding: "8px 20px",
            border: "none",
            outline: "none",
          }}
        />
      </div>
      <div
        className={styles.grid}
        style={{
          padding: "8px 20px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {buttons.map((btn, index) => (
          <button
            className={clsx(styles.button, {
              [styles["button--two-span"]]: btn === "C",
            })}
            type="button"
            key={index}
            onClick={handleButtonClick(btn)}
          >
            {btn}
          </button>
        ))}
      </div>
      <div>
        <p className="mt-1">State</p>
        <pre>
          <code>{JSON.stringify(state.value, null, 2)}</code>
        </pre>
        <p className="mt-1">Context:</p>
        <pre>
          <code>{JSON.stringify(state.context, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
};

export default Calculator;
