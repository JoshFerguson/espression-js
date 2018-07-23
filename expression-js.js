const NativeExpressions = {
    Date: (date) => {
        return new Date(date||null)
    }
}

const ExpressionRegex = /(<%([^%]|"")*%>)/g;

const globals = (props) => {
    this.globalProps = props;
    return this.default;
}

const config = () => {
    return this.default;
}

const use_global = (input) => {
    const global = input.replace('@', '');
    if(this.globalProps){
        return this.globalProps[global] || input;
    }
    return input;
}

const string_int = (input) => {
    if(input instanceof Array){
        return input.map(i => string_int(i));
    }else{
        if(input[0]==='@'){
            input = use_global(input);
        }
        return parseInt(input, 10) || input;
    }
}

const parseExpression = (inst) => {
    const expression = inst.slice(1, -1).slice(1, -1);
    const name = expression.split('(')[0];
    const args = expression.match(/\(([^)]+)\)/);
    const opts = expression.split('|');
    const tail = expression.split(').');
    const prop = tail.length > 1 ? tail[1].split('|')[0] : '';
    const propIsFunc = prop[prop.length - 1] === ')';
    return {
        name: name.replace('=', ''),
        args: args ? string_int(args[0].replace(/[{()}]/g, '').replace(/ /g, '').split(',')) : [],
        prop: propIsFunc ? prop.substring(0, prop.length-2) : prop,
        propIsFunc: propIsFunc,
        options: opts.length > 1 ? opts[1].split(' ') : [],
        expression: inst,
        print: (name[0] === '=')
    }
}

const parseNested = (textString) => {
    return textString;
}

const parse = (textString, preventProgression) => {
    const matches = parseNested(textString).match(ExpressionRegex);
    const result = !matches ? [] : matches.map((expression, index) => {
        return preventProgression ? expression : parseExpression(expression);
    });
    result.textString = textString;
    console.log(result)
    return result;
}

const fetchData = (expression) => {
    if( NativeExpressions[expression.name] ){
        const result = NativeExpressions[expression.name]();
        if(expression.prop){
            if(expression.propIsFunc){
                console.log(expression.prop)
                return result[expression.prop]();
            }
            return result[expression.prop];
        }
        return result;
    }
    return expression.name;
}

const render = (expressions, printOnly) => {
    expressions.filter(expression => {
        if(printOnly){
            return expression.print === true;
        }else{
            return true;
        }
    })
    .map(expression => expressions.textString = expressions.textString.replace(expression.expression, fetchData(expression)));
    return expressions.textString;
}

const ExpressionJs = {
    globals,
    config,

    parse,
    parseExpression,

    render
}

exports.ExpressionJs = ExpressionJs;
exports.default = ExpressionJs;
