showHello('greeting', 'TypeScript');

function showHello(divName: string, name: string) {
    const elt = document.getElementById(divName);
    elt!.innerText = `Hello from ${name}`;
}

function WithCashMethod<T, A extends any[], R>(
    originalMethod: (...args: A) => R,
    context: ClassMethodDecoratorContext<T, (...args: A) => R>
) {
    if(context.kind !== 'method') throw new Error('Method-only decorator');

    const cache = new Map();
    function replacementMethod(this: T, ...args: A): R {
        const cacheKey = JSON.stringify(args);
        if (!cache.has(cacheKey)) {
            const result = originalMethod.apply(this, args);
            cache.set(cacheKey, result);
        }
        console.log('return value from cash');
        return cache.get(cacheKey);
    }

    return replacementMethod;
}

function WithDebounce(delay: number) {
    return function<T, A extends any[], R>(
        originalMethod: (...args: A) => R,
        context: ClassMethodDecoratorContext<T, (...args: A) => R>
    ) {
        if(context.kind !== 'method') throw new Error('Method-only decorator');

        let timeoutId: NodeJS.Timeout;
        function replacementMethod(this: T, ...args: A): void {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                originalMethod.apply(this, args);
            }, delay);
        }
        return replacementMethod;
    };
}



class MyClass {
    @WithCashMethod
    calculate(num1: number, num2: number): number {
        console.log('Calculating...');
        return num1 + num2;
    }
    @WithDebounce(1500)
    someMethod() {
        console.log('some method called');
    }
}

const myObject = new MyClass();
console.log(myObject.calculate(2, 3));
console.log(myObject.calculate(2, 3));
console.log(myObject.calculate(4, 5));
console.log(myObject.calculate(4, 5));
myObject.someMethod();
