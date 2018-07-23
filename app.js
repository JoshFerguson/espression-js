const express = require('express');
const app = express();
const { ExpressionJs } = require('./expression-js');

const user = 12;

ExpressionJs.globals({user});
ExpressionJs.config({
    globals: {user},
    uri: 'https://swvdcrest01/{name}/?args={args}&options={options}'
});

const text = 'Hello my name is <%=Person(1).name%>, and I am from <%Person(@user, loc).location%> <%=Date().getTime()%>';

const expressions = ExpressionJs.parse(text);

const results = ExpressionJs.render(expressions);

app.get('/', (req, res) => res.send(JSON.stringify(results)))

app.listen(3000, () => console.log('Example app listening on port 3000!'))