/*
Sorry...

FunctionNode    sqrt, SELECT
                   |
  OperatorNode     +, FROM
                  / \
  ConstantNode   2   x   SymbolNode (non-calculated ConstantNode)

*/

// #region "Math Builder"

enum MathmeticalOperatorTypes {
  ADD,
  SUBTRACT,
  DIVIDE,
  MULTIPLY
}

function addition<T extends number>(first: T, second: T) {
  //console.log("addition", first, second);
  return first + second;
}

function subtraction<T extends number>(first: T, second: T) {
  //console.log("subtraction", first, second);
  return first - second;
}

function division<T extends number>(first: T, second: T) {
  //console.log("subtraction", first, second);
  return first / second;
}

function multiplication<T extends number>(first: T, second: T) {
  //console.log("subtraction", first, second);
  return first * second;
}

const mathmeticalImplementation: OperatorImplementationMap<number> = new Map([
  [MathmeticalOperatorTypes.ADD, addition],
  [MathmeticalOperatorTypes.SUBTRACT, subtraction],
  [MathmeticalOperatorTypes.DIVIDE, division],
  [MathmeticalOperatorTypes.MULTIPLY, multiplication]
]);

// #endregion

// #region "SQL Builder"

enum SQLOperatorTypes {
  SELECT
}

function select<T extends string>(first: T, second: T) {
  //console.log("select", first, second);
  return `SELECT ${second} FROM ${first}`;
}

const queryBuilderImplementation: OperatorImplementationMap<string> = new Map([
  [SQLOperatorTypes.SELECT, select]
]);

// #endregion

export type MayBeStringable<T> = T | { toString: () => T };

export type OperatorCollection = { [k: number]: any };
export type OperatorType = keyof OperatorCollection;

export type FunctionTypeNode<T> = (
  cn: ConstantNode<T>
) => ConcludedOperation<T>;
export type Implementation<T> = (value1: T, value2: T) => Constant<T>;

export type OperatorImplementationMap<T> = Map<OperatorType, Implementation<T>>;

export type Constant<T> = T;
export type ConcludedOperation<T> = T;
export type ConstantNode<T, C = Constant<T>> = [C, C];
export type OperationNode<V extends any> = (
  constants: ConstantNode<V>
) => ConcludedOperation<V>;

const defaultImplementationMap = mathmeticalImplementation;

export function useWith<T>(operationSet: OperatorImplementationMap<T>) {
  //console.log("prepare", arguments);
  return executer => executer(operationSet);
}

// FunctionNode
export function expression<T>(
  operation: FunctionTypeNode<T> | Constant<T>,
  implementationMap: OperatorImplementationMap<any> = defaultImplementationMap
): ConcludedOperation<T> {
  //console.log("======================= expression", arguments);
  // typeof OperationNode
  if (typeof operation === "function") {
    return (operation as Function)(implementationMap);
    // typeof ConstantNode
  } else {
    return operation;
  }
}

/**
 * Shared logic for `apply` and `using`.
 * @param constants
 * @param operationType
 * @param implementationMap
 */
function applyUsing<O extends OperatorType>(
  constants: ConstantNode<any>,
  operationType: O,
  implementationMap: OperatorImplementationMap<any>
) {
  //console.log("applyUsing", constants, operationType, implementationMap);
  const method = implementationMap.get(operationType);
  console.log(method.name, ...constants);

  let result = constants[0];

  constants.forEach((constantValue, index) => {
    if (index) {
      const currentResult = result;
      result = method(result, constantValue);
      console.log(
        "operation",
        method.name,
        "with",
        currentResult,
        "and",
        constantValue,
        "equates to",
        result
      );
    }
  });

  console.log("new constant concluded", result);
  return result;
}

/**
 * Use operationType, but query definition when execute.
 * @param operationType
 */
export function using<O extends OperatorType>(operationType: O) {
  //console.log("using ... ", operationType);
  return (constants: ConstantNode<any>) => {
    return (implementationMap: OperatorImplementationMap<any>) => {
      //console.log("... from map", implementationMap);
      const [symbol, target] = constants;
      if (symbol !== undefined) {
        return applyUsing([target, symbol], operationType, implementationMap);
      } else {
        return target;
      }
    };
  };
}

/**
 * Use operationType, but query definition when constants provided.
 * @param operationType
 */
export function apply<O extends OperatorType>(operationType: O) {
  //console.log("apply", arguments);
  return (constants: ConstantNode<any>) =>
    applyUsing(constants, operationType, defaultImplementationMap);
}

/**
 * Merge arguments into Tuple.
 * TODO: Support more than 2 values.
 * @param constantValue
 * @param symbolNode
 */
export function values<T>(
  constantValue: MayBeStringable<Constant<T>>,
  ...symbols: Array<MayBeStringable<Constant<T>>>
): any | ConstantNode<T> {
  //console.log("values", arguments);
  const _target: T =
    typeof constantValue === "object"
      ? ((constantValue.toString() as unknown) as T)
      : constantValue;

  let _symbols = [];

  if (symbols.length) {
    _symbols = symbols.map(symbol =>
      typeof symbol === "object"
        ? ((symbol.toString() as unknown) as T)
        : symbol
    );
  }

  return [_target, ..._symbols];
}

let test, result;

const add = apply(MathmeticalOperatorTypes.ADD);
const subtract = apply(MathmeticalOperatorTypes.SUBTRACT);
const divide = apply(MathmeticalOperatorTypes.DIVIDE);
const multiply = apply(MathmeticalOperatorTypes.MULTIPLY);

function factorial(factorial) {
  result = 1;
  for (let i = 2; i < factorial + 1; i++) {
    result = multiply([result, i]);
  }

  return result;
}

console.group("Use case 1");
test = 1 + (2 - (1 + 2 + 3 + 4 + 5));
result = add(values(1, subtract(values(2, add(values(1, 2, 3, 4, 5))))));

console.log({
  works: test === result,
  test,
  result
});
console.groupEnd();

console.group("Use case 2");
test = (5 + 5) / 2;
result = divide(values(add(values(5, 5)), 2));

console.log({
  works: test === result,
  test,
  result
});
console.groupEnd();

console.group("Special case factorial");
test = 1 * 2 * 3 * 4 * 5;
result = factorial(5);

console.log({
  works: test === result,
  test,
  result
});
console.groupEnd();

/*








*/

result = expression(add(values(1, add(values(1, subtract(values(2)))))));

console.log("result:", result);

const selectFrom = using(SQLOperatorTypes.SELECT);
const prepare = useWith(queryBuilderImplementation);
const execute = prepare(selectFrom(values(["field1", "field2"], "MY_TABLE")));

console.log(execute);

// let lastConstant;

// Object.entries(uiConstructedObject).forEach(([index, oDef]) => {
//     if(lastConstant!== undefined){
//         if(oDef) {
//             lastConstant =
//         }
//     } else {

//     }
// })
