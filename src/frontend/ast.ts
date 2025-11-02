export type NodeType = "Program"
    | "NumericLiteral"
    | "NullLiteral"
    | "Identifier"
    | "BinaryExpr"
    | "UnaryExpr"
    | "FunctionDeclaration";

// Statement
export interface Stmt {
    kind: NodeType
}

// Program
export interface Program extends Stmt {
    kind: "Program",
    body: Stmt[]
}

// Expression
export interface Expr extends Stmt {}

// Binary expression (e.g. foo (expr) - (operator - string) bar (expr))
export interface BinaryExpr extends Expr {
    kind: "BinaryExpr",
    left: Expr,
    right: Expr,
    operator: string
}

// Identifier
export interface Identifier extends Expr {
    kind: "Identifier",
    symbol: string
}

// Numeric literal
export interface NumericLiteral extends Expr {
    kind: "NumericLiteral",
    value: number
}

// Null literal
export interface NullLiteral extends Expr {
    kind: "NullLiteral",
    value: "null"
}