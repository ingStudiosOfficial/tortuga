// Import AST types
import { Stmt, Program, Expr, BinaryExpr, NumericLiteral, Identifier, NullLiteral } from "./ast.js";

// Import lexer
import { tokenize, Token, TokenType } from "./lexer.js";

export default class Parser {
    private tokens: Token[] = [];

    private not_eof(): boolean {
        // Checks whether the token is an end of file token
        return this.tokens[0].type != TokenType.EOF;
    }

    private at() {
        // Returns token as Token
        return this.tokens[0] as Token;
    }

    private eat() {
        // Advances to the next token
        const prev = this.tokens.shift() as Token;
        return prev;
    }

    private expect(type: TokenType, err: any) {
        const prev = this.tokens.shift();
        
        if (!prev || prev.type !== type) {
            console.error('Parser Error:\n', err, prev, "Expecting:", type);
            process.exit(1);
        }

        return prev;
    }

    public produceAST(sourceCode: string): Program {
        this.tokens = tokenize(sourceCode);

        // Each element is array of statements
        const program: Program = {
            kind: "Program",
            body: []
        };

        // Parse until not end of file
        while (this.not_eof()) {
            program.body.push(this.parse_stmt());
        }

        return program;
    }

    private parse_stmt(): Stmt {
        // Skip to parse_expr
        return this.parse_expr();
    }

    private parse_expr(): Expr {
        return this.parse_additive_expr();
    }

    // Order of Prescidence - parse highest last
    // AssignmentExpr
    // MemberExpr
    // FunctionCall
    // LogicalExpr
    // ComparisonExpr
    // AdditiveExpr
    // MultiplicativeExpr
    // UnaryExpr
    // PrimaryExpr

    // AdditiveExpr (e.g. (10 + 5) - 5)
    private parse_additive_expr(): Expr {
        let left = this.parse_multiplicative_expr(); // Parse multiplicative first - further down the tree

        while (this.at().value === '+' || this.at().value === '-') {
            const operator = this.eat().value;
            const right = this.parse_multiplicative_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator
            } as BinaryExpr;
        }

        return left;
    }

    // MultiplicativeExpr (e.g. (10 * 5) / 5)
    private parse_multiplicative_expr(): Expr {
        let left = this.parse_primary_expr();

        while (this.at().value === '*' || this.at().value === '/' || this.at().value === '%') {
            const operator = this.eat().value;
            const right = this.parse_primary_expr();
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator
            } as BinaryExpr;
        }

        return left;
    }

    private parse_primary_expr(): Expr {
        const tk = this.at().type;

        switch (tk) {
            case TokenType.Identifier:
                return { kind: "Identifier", symbol: this.eat().value } as Identifier;

            case TokenType.Null:
                this.eat() // Advance past null keyword
                return { kind: "NullLiteral", value: "null" } as NullLiteral;

            case TokenType.Number:
                return {
                    kind: "NumericLiteral",
                    value: parseFloat(this.eat().value)
                } as NumericLiteral;

            case TokenType.OpenParen:
                this.eat() // Eat the open paren
                const value = this.parse_additive_expr();
                this.expect(TokenType.CloseParen, "Unexpected token found inside paranthesised expression. Expected closing parenthisis:"); // Closing paren
                return value;

            default:
                console.error('Unexpected token found during parsing:', this.at());
                process.exit(1);
        }
    }
}