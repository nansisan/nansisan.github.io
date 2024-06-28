class Calculator {
    constructor() { }
    inputCheck(a) {
        if (typeof a === "number" || typeof a === "bigint") return this.normalize(a);
        if (typeof a === "string") {
            if (/^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(a)) return this.normalize(a);
            else throw new Error("Contains non-half-width digits.");
        } else throw new Error("The input value should be a number, a string of one-byte numbers only, or a BigInt type.");
    }
    normalize(a) {
        if ("number" == typeof a || "bigint" == typeof a) a = a.toString();
        if (a.startsWith("+")) a = a.slice(1);
        if (a == 0) return a;
        var expPattern = /^([+-]?\d+\.?\d*)[eE]([+-]?\d+)$/;
        var match = a.match(expPattern);
        if (match) {
            var base = match[1],
                exponent = match[2];
            a = this.multiply(base, this.intpow(10, exponent, this.abs(exponent)));
            a = a.toString();
        }
        a = a.replace(/^(-?)0+/, "$1");
        if (a.startsWith("-.")) {
            a = "-0." + a.slice(2);
        } else if (a.startsWith(".")) {
            a = "0." + a.slice(1);
        }
        a = a.replace(/\.0+$/, "");
        a = a.replace(/(\.[0-9]*[1-9])0+$/, "$1");
        return a;
    }    
    ver() {
        return "v0.3.0"
    }
    add(a, b) {
        a = this.inputCheck(a), b = this.inputCheck(b);
        let
            decimalA = (a + "").includes(".") ? (a + "").split(".")[1].length : 0,
            decimalB = (b + "").includes(".") ? (b + "").split(".")[1].length : 0,
            maxDecimal = Math.max(decimalA, decimalB),
            bigIntA = BigInt((a + "").replace(".", "")) * 10n ** BigInt(maxDecimal - decimalA),
            bigIntB = BigInt((b + "").replace(".", "")) * 10n ** BigInt(maxDecimal - decimalB),
            result = (bigIntA + bigIntB).toString();
        return maxDecimal > 0 ? (result = result.slice(0, -maxDecimal) + "." + result.slice(-maxDecimal).padStart(maxDecimal, "0")) : result;
    }
    subtract(a, b) {
        a = this.inputCheck(a), b = this.inputCheck(b);
        let
            decimalA = (a + "").includes(".") ? (a + "").split(".")[1].length : 0,
            decimalB = (b + "").includes(".") ? (b + "").split(".")[1].length : 0,
            maxDecimal = Math.max(decimalA, decimalB),
            bigIntA = BigInt((a + "").replace(".", "")) * 10n ** BigInt(maxDecimal - decimalA),
            bigIntB = BigInt((b + "").replace(".", "")) * 10n ** BigInt(maxDecimal - decimalB),
            result = (bigIntA - bigIntB).toString();
        return maxDecimal > 0 ? (result = result.slice(0, -maxDecimal) + "." + result.slice(-maxDecimal).padStart(maxDecimal, "0")) : result;
    }
    multiply(a, b) {
        if (a = this.inputCheck(a), b = this.inputCheck(b), (a + "").includes(".") || (b + "").includes(".")) {
            let
                result,
                decimalA = (a + "").includes(".") ? (a + "").length - (a + "").indexOf(".") - 1 : 0,
                decimalB = (b + "").includes(".") ? (b + "").length - (b + "").indexOf(".") - 1 : 0,
                totalDecimal = decimalA + decimalB,
                bigIntA = BigInt((a + "").replace(".", "")),
                bigIntB = BigInt((b + "").replace(".", "")),
                product = bigIntA * bigIntB + "";
            if (product.length > totalDecimal) {
                product.startsWith("-") ? (result = `${product.slice(0, -totalDecimal)}.${product.slice(-totalDecimal)}`, result.startsWith(".") && (result = `-${result}`), result.endsWith(".") && (result += "0")) : (result = `${product.slice(0, -totalDecimal)}.${product.slice(-totalDecimal)}`, result.startsWith(".") && (result = `0${result}`), result.endsWith(".") && (result += "0"));
            } else {
                let padding = "0".repeat(totalDecimal - product.length);
                result = "0" == product ? "0" : 0 == totalDecimal ? `${product}` : `.${padding}${product}`;
            }
            return result;
        }
        return BigInt(a) * BigInt(b) + "";
    }
    divide(a, b, decimalPlaces = 20) {
        if (a = this.inputCheck(a), b = this.inputCheck(b), decimalPlaces = parseInt(this.inputCheck(decimalPlaces),10), 0 > decimalPlaces) throw new Error("decimalPlaces must be non-negative");
        if (0 == b || "0" == b) throw new Error("division by zero");
        const
            stringA = a.toString(),
            stringB = b.toString();
        let
            decimalA = stringA.indexOf("."),
            decimalB = stringB.indexOf("."),
            decimalLengthA = -1 === decimalA ? 0 : stringA.length - decimalA - 1,
            decimalLengthB = -1 === decimalB ? 0 : stringB.length - decimalB - 1,
            maxDecimal = Math.max(Math.max(decimalLengthA, decimalLengthB), decimalPlaces),
            bigIntA = stringA.replace(".", "") + "0".repeat(maxDecimal - decimalLengthA + decimalPlaces),
            bigIntB = stringB.replace(".", "") + "0".repeat(maxDecimal - decimalLengthB),
            quotient = BigInt(bigIntA) / BigInt(bigIntB),
            quotientString = quotient.toString().padStart(decimalPlaces + 1, "0"),
            decimalIndex = quotientString.length - decimalPlaces;
        return quotientString.slice(0, decimalIndex) + (0 < decimalPlaces ? "." : "") + quotientString.slice(decimalIndex);
    }
    intpow(a, b, decimalPlaces = 0) {
        a = this.inputCheck(a), b = this.inputCheck(b);
        let result = 1n, neg = (b < 0);
        b = BigInt(neg ? -b : b);
        for (a = BigInt(a); b; result *= (b & 1n) ? a : 1n, a *= a, b >>= 1n);
        return neg ? this.divide(1n, result, decimalPlaces) : result.toString();
    }
    factorial(a) {
        return a = this.inputCheck(a), a = BigInt(a), 0n === a ? "1" : 1n === a || 2n === a ? a.toString() : this.product(2n, a).toString();
    }
    product(a, b) {
        if (a = this.inputCheck(a), b = this.inputCheck(b), b = BigInt(b), a = BigInt(a), b === a) return a;
        if (b === a + 1n) return this.multiply(a, b);
        let mid = (a + b) / 2n;
        return this.multiply(this.product(a, mid), this.product(mid + 1n, b));
    }
    nCr(n, r) {
        n = this.inputCheck(n);
        r = this.inputCheck(r);
        if (r > n) {
            throw new Error("r cannot be greater than n");
        }
        return this.divide(this.factorial(n), this.multiply(this.factorial(r), this.factorial(n - r)), 0);
    }
    nPr(n, r) {
        n = this.inputCheck(n);
        r = this.inputCheck(r);
        if (r > n) {
            throw new Error("r cannot be greater than n");
        }
        return this.divide(this.factorial(n), this.factorial(n - r), 0);
    }
    sum(a, b, decimalPlaces = 0) {
        return a = this.inputCheck(a), b = this.inputCheck(b), decimalPlaces = this.inputCheck(decimalPlaces), this.divide(this.multiply(this.add(this.subtract(b, a), 1n), this.add(a, b)), 2n, decimalPlaces);
    }
    pow(a, b, decimalPlaces = 20) {
        a = this.inputCheck(a), b = this.inputCheck(b);
        if (b < 0) a = this.divide(1, a, decimalPlaces), b = -b;
        if ((a + "").includes(".")) {
            let
                decimalA = (a + "").includes(".") ? (a + "").split(".")[1].length : 0,
                bigIntA = BigInt((a + "").replace(".", "")) * 10n ** BigInt(decimalA),
                power = this.intpow(bigIntA.toString(), b),
                result = this.divide(power, this.intpow(10, 2 * decimalA * b), this.abs(decimalA * b));
            return this.round(result, decimalPlaces);
        }
        return this.intpow(a, b);
    }
    sqrt(a, decimalPlaces = 20) {
        a = this.inputCheck(a), decimalPlaces = this.inputCheck(decimalPlaces);
        for (let guess = a; ;) {
            let newGuess = this.divide(this.add(guess, this.divide(a, guess, decimalPlaces)), 2, decimalPlaces);
            if (0 == this.subtract(newGuess, guess)) return newGuess;
            guess = newGuess;
        }
    }
    mod(a, b) {
        a = this.inputCheck(a), b = this.inputCheck(b);
        let
            quotient = this.divide(a, b, 0),
            product = this.multiply(quotient, b),
            remainder = this.subtract(a, product);
        return remainder;
    }
    floor(a, decimalPlaces = 20) {
        if ((a + "").includes(".")) {
            a = this.multiply(a, this.pow(10, decimalPlaces));
            let parts = (a + "").split(".");
            return this.divide(parts[0], this.pow(10, decimalPlaces), decimalPlaces);
        }
        return a;
    }
    ceil(a, decimalPlaces = 20) {
        if ((a + "").includes(".")) {
            a = this.multiply(a, this.pow(10, decimalPlaces));
            let
                parts = (a + "").split("."),
                increment = parts[1] && 1 <= parts[1] ? 1n : 0n;
            return this.divide(BigInt(parts[0]) + increment, this.pow(10, decimalPlaces), decimalPlaces).toString();
        }
        return a;
    }
    round(a, decimalPlaces = 20) {
        if ((a + "").includes(".")) {
            a = this.multiply(a, this.pow(10, decimalPlaces));
            let
                parts = (a + "").split("."),
                increment = parts[1] && 5 <= parts[1][0] ? 1n : 0n;
            return this.divide(BigInt(parts[0]) + increment, this.pow(10, decimalPlaces), decimalPlaces).toString();
        }
        return a;
    }
    abs(a) {
        return (a + "").includes("-") ? this.multiply(a, -1) : a;
    }

    greaterThan(a, b) {
        a = this.inputCheck(a), b = this.inputCheck(b);
        return this.subtract(a, b).startsWith("-");
    }

    lessThan(a, b) {
        a = this.inputCheck(a), b = this.inputCheck(b);
        return this.subtract(b, a).startsWith("-");
    }

    equals(a, b) {
        a = this.inputCheck(a), b = this.inputCheck(b);
        return this.subtract(a, b) === "0";
    }

    PI(decimalPlaces = 20) {
        let a = 1;
        let b = this.divide(1, this.sqrt(2, decimalPlaces), decimalPlaces+1);
        let t = this.divide(1, 4, decimalPlaces);
        let p = 1;
    
        for (let i = 0; i < Math.log2(decimalPlaces); i++) {
            let a_next = this.divide(this.add(a, b), 2, decimalPlaces+2);
            let b_next = this.sqrt(this.multiply(a, b), decimalPlaces+2);
            let t_next = this.subtract(t, this.multiply(p, this.pow(this.subtract(a, a_next), 2)));
    
            a = a_next;
            b = b_next;
            t = t_next;
            p = this.multiply(2, p);
        }
    
        let pi = this.divide(this.pow(this.add(a, b), 2), this.multiply(4, t), decimalPlaces);
        return this.normalize(pi);
    }
    sqrt2(decimalPlaces) {
        this.sqrt(2,decimalPlaces)
    }
}
const calc = new Calculator;
