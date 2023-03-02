import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';

export const EditExercisePage = ({ exerciseToEdit }) => {
    const [name, setName] = useState(exerciseToEdit.name);
    const [reps, setReps] = useState(exerciseToEdit.reps);
    const [weight, setWeight] = useState(exerciseToEdit.weight);
    const [unit, setUnit] = useState(exerciseToEdit.unit);
    const [date, setDate] = useState(exerciseToEdit.date);
    const navigate = useNavigate();

    const editExercise = async () => {

        const editedExercise = { name, reps, weight, unit, date };
        const response = await fetch(`/exercises/${exerciseToEdit._id}`, {
            method: 'PUT',
            body: JSON.stringify(editedExercise),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.status === 200) {
            alert("Successfully edited the exercise. Navigating to homepage.");

        } else {
            alert(`Failed to edit exercise, double check your inputs. Status code = ${response.status}`);
        }
        navigate("/");
    };

    return (
        <div>
            <h1>Edit Exercise</h1>
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
                                value={date}
                                onChange={e => setDate(e.target.value)} />
                        </td>
                    </tr>
                </tbody>
            </table>
            <button
                onClick={editExercise}
            >Save</button>
        </div>
    );
}


export default EditExercisePage;