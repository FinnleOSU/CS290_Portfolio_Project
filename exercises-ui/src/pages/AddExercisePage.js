import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';

export const AddExercisePage = () => {

    /**
     * five state variables for the five inputs of the form. 
     */

    const [name, setName] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [unit, setUnit] = useState('kgs');
    const [date, setDate] = useState('');
    const navigate = useNavigate();

    const addExercise = async () => {
        /**
         * create new variable and collect the values of the state variable. Then send a 
         * request with this object to the rest API. We have to set the method to the HTTP 
         * method we want (default is GET). For post, we have to send the body (the JSOn 
         * representation of the object), fetch wants the body to be a string. 
         * In the request, we want to specify that the body we are sending is JSON, so we 
         * must set the content type header. 
         */
        const newExercise = { name, reps, weight, unit, date };
        const response = await fetch('/exercises', {
            method: 'POST',
            body: JSON.stringify(newExercise),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.status === 201) {
            alert("Successfully added the exercise");

        } else {
            alert(`Failed to add exercise, status code = ${response.status}`);
        }
        navigate("/");
    };

    return (
        <div>
            <h1>Add an Exercise</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Reps</th>
                        <th>Weight</th>
                        <th>Unit</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)} />
                        </td>
                        <td>
                            <input
                                type="number"
                                value={reps}
                                onChange={e => setReps(e.target.value)} />
                        </td>
                        <td>
                            <input
                                type="number"
                                value={weight}
                                onChange={e => setWeight(e.target.value)} />
                        </td>
                        <td>
                            <select name="unit" value={unit} onChange={e => setUnit(e.target.value)}>
                                <option value="kgs">kgs</option>
                                <option value="lbs">lbs</option>
                            </select>
                        </td>
                        <td>
                            <input
                                type="text"
                                placeholder="mm-dd-yy"
                                value={date}
                                onChange={e => setDate(e.target.value)} />
                        </td>
                    </tr>
                </tbody>
            </table>
            <button
                onClick={addExercise}
            >Add</button>

        </div>
    );
}

export default AddExercisePage;