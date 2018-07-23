const { ExpressionJs } = require('./expression-js');

const user = 12;

ExpressionJs.globals({user});

const text = 'Hello my name is <%=Person(1).name%>, and I am from <%Person(@user, loc).location%> <%=Date().string|UTCString%>';

const expressions = ExpressionJs.parse(text);

const results = ExpressionJs.printable(expressions);
//const results = ExpressionJs.render(expressions);

console.log(results);


// '<%Date(<%DaysFromNow(2)%>)%>'