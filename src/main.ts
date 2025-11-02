import Parser from "./frontend/parser.js";
import { evaluate } from "./runtime/interpreter.js";

import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

async function repl() {
    const parser = new Parser(); 
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

            const result = evaluate(program);
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