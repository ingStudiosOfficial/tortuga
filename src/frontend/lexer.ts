import * as fs from 'fs';

export enum TokenType {
    Number, // Done
    Identifier, // Done
    String,
    Equals, // Done
    OpenParen, // Done
    CloseParen, // Done
    BinaryOperator, // Done
    Let,
    Const, // Done
    EOF // End of file
}

const KEYWORDS: Record<string, TokenType> = {
    "const": TokenType.Const
};

export interface Token {
    value: string,
    type: TokenType
}

function token(value = "", type: TokenType): Token {
    return { value, type };
}

function isalpha(src: string) {
    return src.toUpperCase() !== src.toLocaleLowerCase(); // If it is a decimal, number etc - this will be true
}

function isint(src: string) {
    const c = src.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
    return (c >= bounds[0] && c <= bounds[1]); // Checks if unicode character is in bounds
}

function isskippable(str: string) {
    return str === ' ' || str === '\n' || str === '\t';
}

export function tokenize(sourceCode: string): Token[] {
    const tokens = new Array<Token>();
    const src = sourceCode.split("");

    // Build token until end of file
    while (src.length > 0) {
        if (src[0] === '(') {
            tokens.push(token(src.shift(), TokenType.OpenParen));
        } else if (src[0] === ")") {
            tokens.push(token(src.shift(), TokenType.CloseParen));
        } else if (src[0] === "+" || src[0] === "-" || src[0] === "*" || src[0] === "/" || src[0] === "%") {
            tokens.push(token(src.shift(), TokenType.BinaryOperator));
        } else if (src[0] === "=") {
            tokens.push(token(src.shift(), TokenType.Equals));
        } else {
            // Handle multicharacter tokens

            if (isint(src[0])) { // Build number token (e.g. 54 - runs through 5 and 4 and appends it to the number)
                let num = "";
                while (src.length > 0 && isint(src[0])) {
                    num += src.shift();
                }

                tokens.push(token(num, TokenType.Number));
            } else if (isalpha(src[0])) { // Build identifier token (e.g. hello - runs through h e l l o and appends each letter to the identifier)
                let ident = "";
                while (src.length > 0 && isalpha(src[0])) {
                    ident += src.shift();
                }

                // Check for reserved keywords
                const reserved = KEYWORDS[ident];
                if (typeof reserved === "number") {
                    tokens.push(token(ident, reserved));
                } else {
                    tokens.push(token(ident, TokenType.Identifier));
                }
            } else if (isskippable(src[0])) {
                src.shift(); // Skips the current character
            } else {
                console.error('Unrecognized token:', src[0]);
                process.exit(1);
            }
        }
    }

    tokens.push({ type: TokenType.EOF, value: 'EndOfFile' })
    return tokens;
}