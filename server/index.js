const express = require('express');
const { v4: uuidv4 } = require('uuid');

const dynamoDB = require('../lib/dynamodb');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/tasks', (req, res) => {
    let { title, description, status, dueDate } = req.body;

    const params = {
        TableName: 'tasks',
        Item: {
            id: uuidv4(),
            title: title,
            description: description,
            status: status || 'pending',
            dueDate: dueDate || new Date().toISOString(),
        },
    };

    dynamoDB.put(params, (err, data) => {
        console.log('data: ', params)
        if (err) {
            console.error('Unable to add item. Error: ', err);
            res.status(500).json({ error: 'Could not add task to DynamoDB' });
        }
        else {
            res.status(201).json({message: 'Task created successfully.', task: params.Item});
        }
    });
});

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});
