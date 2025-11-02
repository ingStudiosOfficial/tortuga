import { RuntimeVal, NumberVal, NullVal } from "./values.js";
import { BinaryExpr, NumericLiteral, Program, Stmt } from "../frontend/ast.js";

function evaluate_program(program: Program): RuntimeVal {
    let lastEvaluated: RuntimeVal = { type: "null", value: "null" } as NullVal;

    // Evaluates every statement until end of file
    for (const statement of program.body) {
        lastEvaluated = evaluate(statement);
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

function evaluate_binary_expr(binop: BinaryExpr): RuntimeVal {
    const lhs = evaluate(binop.left);
    const rhs = evaluate(binop.right);

    if (lhs.type === "number" && rhs.type === "number") {
        return evaluate_numeric_binary_expr(lhs as NumberVal, rhs as NumberVal, binop.operator);
    }

    // One or both are null
    return { type: "null", value: "null" } as NullVal;
}

export function evaluate(astNode: Stmt): RuntimeVal {
    switch (astNode.kind) {
        case "NumericLiteral":
            return {
                value: ((astNode as NumericLiteral).value),
                type: "number"
            } as NumberVal;

        case "NullLiteral":
            return { value: "null", type: "null" } as NullVal;

        case "BinaryExpr":
            return evaluate_binary_expr(astNode as BinaryExpr);

        case "Program":
            return evaluate_program(astNode as Program);

        default:
            console.error("This AST node has not yet been setup for interpretation.");
            process.exit(0);
    }
}