const ExpressionRegex = /(<%([^%]|"")*%>)/g;

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
    return {
        name: name.replace('=', ''),
        args: args ? string_int(args[0].replace(/[{()}]/g, '').replace(/ /g, '').split(',')) : [],
        prop: tail.length > 1 ? tail[1].split('|')[0] : [],
        options: opts.length > 1 ? opts[1].split(' ') : [],
        expression: inst,
        print: (name[0] === '=')
    }
}

const parse = (textString, preventProgression) => {
    const matches = textString.match(ExpressionRegex);
    const result = !matches ? [] : matches.map((expression, index) => {
        return preventProgression ? expression : parseExpression(expression);
    });
    result.textString = textString;
    return result;
}

const printable = (expressions) => {
    expressions.map(expression => {
        if(expression.print){
            expressions.textString = expressions.textString.replace(expression.expression, expression.name)
        }
    });
    return expressions.textString;
}

const render = (expressions) => {
    expressions.map(expression => {
        return expressions.textString = expressions.textString.replace(expression.expression, expression.name);
    });
    return expressions.textString;
}

const globals = (props) => {
    this.globalProps = props;
    return this.default;
}

const ExpressionJs = {
    globals,

    parse,
    parseExpression,

    printable,
    render
}

exports.ExpressionJs = ExpressionJs;
exports.default = ExpressionJs;

