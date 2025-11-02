import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

import Parser from "./frontend/parser.js";
import { evaluate } from "./runtime/interpreter.js";
import Environment from "./runtime/environment.js";
import { MK_BOOL, MK_NULL, MK_NUMBER, NumberVal } from "./runtime/values.js";

async function repl() {
    const parser = new Parser();
    const env =  new Environment();
    env.declareVar("x", MK_NUMBER(100));
    env.declareVar("true", MK_BOOL(true));
    env.declareVar("false", MK_BOOL(false));
    env.declareVar("null", MK_NULL());
    console.log("\nRepl v0.1");

    const rl = readline.createInterface({ input, output });

    while (true) {
        const userInput = await rl.question(">"); 

        if (!userInput || userInput.includes("exit")) {
            rl.close(); // Close only on exit
            process.exit(0);
        }

        try {
            const program = parser.produceAST(userInput);

            const result = evaluate(program, env);
            console.dir(result, {
                depth: null,
                colors: true
            });

            console.log('\n')
        } catch (e) {
            console.error("Parser Error:", e);
        }
    }
}

repl();