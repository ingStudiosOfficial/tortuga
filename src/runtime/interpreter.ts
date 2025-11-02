import { RuntimeVal, NumberVal, MK_NULL } from "./values.js";
import { BinaryExpr, Identifier, NumericLiteral, Program, Stmt } from "../frontend/ast.js";
import Environment from "./environment.js";

function evaluate_program(program: Program, env: Environment): RuntimeVal {
    let lastEvaluated: RuntimeVal = MK_NULL();

    // Evaluates every statement until end of file
    for (const statement of program.body) {
        lastEvaluated = evaluate(statement, env);
    }

    return lastEvaluated;
}

function evaluate_numeric_binary_expr(lhs: NumberVal, rhs: NumberVal, operator: string): NumberVal {
    let result: number = 0;
    
    if (operator === "+") {
        result = lhs.value + rhs.value;
    } else if (operator === "-") {
        result = lhs.value - rhs.value;
    } else if (operator === "*") {
        result = lhs.value * rhs.value;
    } else if (operator === "/") {
        // Division by zero check
        if (rhs.value === 0) {
            console.error(`Math Error: Division by zero (${lhs.value} ${operator} ${rhs.value})`);
            process.exit(1);
        }

        result = lhs.value / rhs.value;
    } else if (operator === "%") {
        result = lhs.value % rhs.value;
    }

    return { value: result, type: "number" };
}

function evaluate_binary_expr(binop: BinaryExpr, env: Environment): RuntimeVal {
    const lhs = evaluate(binop.left, env);
    const rhs = evaluate(binop.right, env);

    if (lhs.type === "number" && rhs.type === "number") {
        return evaluate_numeric_binary_expr(lhs as NumberVal, rhs as NumberVal, binop.operator);
    }

    // One or both are null
    return MK_NULL();
}

function evaluate_identifier(ident: Identifier, env: Environment): RuntimeVal {
    const val = env.lookupVar(ident.symbol);
    return val;
}

export function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
    switch (astNode.kind) {
        case "NumericLiteral":
            return {
                value: ((astNode as NumericLiteral).value),
                type: "number"
            } as NumberVal;

        case "Identifier":
            return evaluate_identifier(astNode as Identifier, env)

        case "BinaryExpr":
            return evaluate_binary_expr(astNode as BinaryExpr, env);

        case "Program":
            return evaluate_program(astNode as Program, env);

        default:
            console.error("This AST node has not yet been setup for interpretation.");
            process.exit(0);
    }
}