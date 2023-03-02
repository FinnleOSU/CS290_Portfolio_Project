import 'dotenv/config';
import * as exercises from './exercises_model.mjs';
import express from 'express';

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

/**
* Return true if the date format is MM-DD-YY where MM, DD 
* and YY are 2 digit integers
*/
function isDateValid(date) {
    // Test using a regular expression. 
    const format = /^\d\d-\d\d-\d\d$/;
    console.log('you tested the date')
    return format.test(date);
};

/**
 * validates if the unit property is either the string 'kgs' 
 * or 'lbs'. Pass a string from the request body.  
 */
function isUnitValid(unit) {
    console.log('you tested the unit')
    return unit === 'kgs' || unit === 'lbs'
};

/**
 * checks if any of the body data is invalid. 
 */
function isDataInvalid(name, reps, weight, unit, date) {
    console.log("reached isDataInvalid");
    console.log(typeof (name));
    console.log(typeof (reps));
    console.log(typeof (weight));
    console.log(typeof (unit));
    console.log(unit);
    if (name.length < 1 ||
        typeof (name) !== 'string' ||
        reps < 1 ||
        isNaN(reps) ||
        typeof (reps) !== 'number' ||
        isNaN(weight) ||
        weight < 1 ||
        typeof (weight) !== 'number' ||
        !isUnitValid(unit) ||
        !isDateValid(date)
    ) {
        return true;
    }
    return false;
};

/**
 *Create using POST. Checks if the data provided is valid via isDataInvalid. If the *data is not valid, returns status 400 with JSON body. If the data is valid, then a *new document is created, status code 201 is sent and the body is a JSON object with *all the properties of the schema defined in the model layer. 
 */
app.post('/exercises', (req, res) => {

    console.log("before casting")
    const reps = parseInt(req.body.reps);
    const weight = parseInt(req.body.weight);
    console.log("after casting")

    if (isDataInvalid(req.body.name, reps, weight, req.body.unit, req.body.date)) {
        console.log("inside invalid data if")
        res.status(400).json({ Error: 'Invalid Request' });
        return;
    }
    exercises.createExercise(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
        .then(exercise => {
            res.status(201).json(exercise);
        })
        .catch(error => {
            console.log(error);
            console.error(error);
            // In case of an error, send back status code 400. 
            res.status(400).json({ Error: 'Request failed' });
        });
});

/**
 * Retrieves an exercise by a specific Id. If no exercise with the specified id exists, * sends status code 404 error and json object * with the string "not found"
 */
app.get('/exercises/:_id', (req, res) => {
    const filter = {};
    filter._id = req.params._id;
    exercises.findExercisesById(filter)
        .then(exercise => {
            if (Object.keys(exercise).length !== 0) {
                res.json(exercise);
            } else {
                res.status(404).json({ Error: 'Not found' });
            }
        })
        .catch(error => {
            res.status(400).json({ Error: 'Request failed' });
        });

});

/**
 *Retrieves the entire collection of exercises. If there are no exercises, the *response is an empty array. Status code: 200  
 */
app.get('/exercises', (req, res) => {
    let filter = {};
    exercises.findExercises(filter)
        .then(exercises => {
            res.json(exercises);
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Request failed' });
        });

});

/**
 *Request: body = JSON object with all 5 properties listed in the data model. Date *property in the format MM-DD-YY. Path parameter contains the ID of a document.
 *Response: check if the request body is valid. If it's valid and a document with the *specific ID exists, then the document is updated with a response that has JSON object *in the body... status code 200. 
 *If the request body is invalid, send a JSON body object with Error: "Invalid Request" *with status code 400. 
 *If the id doesn't exist in a document, error JSON sent with "Not Found" and code 404.
 *Note: first check the validity of the request body and if it is invalid, return the *response with status code 400. Only look for the existence of the document if the *request body is valid. 
 */
app.put('/exercises/:_id', (req, res) => {
    /**Convert the strings received in the body into the appropriate types */
    const reps = parseInt(req.body.reps);
    const weight = parseInt(req.body.weight);

    /**check if the body data is valid */
    if (isDataInvalid(req.body.name, reps, weight, req.body.unit, req.body.date)) {
        res.status(400).json({ Error: 'Invalid request' });
        return;
    }

    let filter = {};
    filter._id = req.params._id;
    let update = { name: req.body.name, reps: req.body.reps, weight: req.body.weight, unit: req.body.unit, date: req.body.date };

    exercises.replaceExercise(filter, update)
        .then(numUpdated => {
            if (numUpdated === 1) {
                res.json({ _id: req.params._id, name: req.body.name, reps: req.body.reps, weight: req.body.weight, unit: req.body.unit, date: req.body.date })
            } else {
                res.status(404).json({ Error: 'Not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Request failed' });
        });
});

app.delete('/exercises/:_id', (req, res) => {
    let filter = {};
    filter._id = req.params._id;
    exercises.deleteExercise(filter)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'Not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Request failed' });
        });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});