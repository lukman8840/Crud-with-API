import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CRUD = () => {
    // State variables
    const [formData, setFormData] = useState({
        userId: "",
        id: "",
        title: "",
        body: ""
    });

    const [editId, setEditId] = useState(null); // State for editing
    const [data, setData] = useState([]); // State for storing fetched data

    const [refresh, setRefresh] = useState(0); // State to trigger a re-render

    const { userId, id, title, body } = formData; // Destructuring form data

    // Function to handle changes in form inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (userId && id && title && body) {
            if (editId) { // If in edit mode, update existing record
                axios.put(`https://jsonplaceholder.typicode.com/posts/${editId}`, formData)
                    .then(res => {
                        // Update data array with updated record
                        const updatedData = data.map(item => item.id === editId ? res.data : item);
                        setData(updatedData);
                        // Clear form data and exit edit mode
                        setFormData({ userId: "", id: "", title: "", body: "" });
                        setEditId(null);
                    })
                    .catch(err => console.log(err));
            } 
            else { // If not in edit mode, create new record
                axios.post('https://jsonplaceholder.typicode.com/posts', formData)
                    .then(res => {
                        // Add new record to data array
                        setData([...data, res.data]);
                        // Clear form data
                        setFormData({ userId: "", id: "", title: "", body: "" });
                        // Trigger re-render to update UI
                        setRefresh(refresh + 1);
                    })
                    .catch(err => console.log(err));
            }
        }
    };

    // Function to handle deletion of a record
    const handleDelete = (deleteID) => {
        axios.delete(`https://jsonplaceholder.typicode.com/posts/${deleteID}`)
        .then(res => {
            // Remove deleted record from data array
            const updatedData = data.filter(item => item.id !== deleteID);
            setData(updatedData);
            console.log("DELETED RES:::", res.data)
        })
        .catch(err => console.log(err))
    };
    
    // Function to handle editing of a record
    const handleEdit = (item) => {
        // Populate form with data of selected item
        setFormData(item);
        // Set edit mode to true
        setEditId(item.id);
    };

    // Fetch data from API on component mount
    useEffect(() => {
        axios.get('https://jsonplaceholder.typicode.com/posts')
            .then(res => {
                setData(res.data);
            })
            .catch(err => console.log(err));
    }, [refresh]);

    return (
        <div className='container'>
            <div className='row'>
                <div className='column'>
                    <h4>Let's learn CRUD API Integration in React JS</h4>

                    <form onSubmit={handleSubmit}>
                        {/* Form inputs */}
                        <div className='form-group'>
                            <label htmlFor='userId' className='lab'>User Id</label>
                            <input
                                type='text'
                                className='form-control'
                                id='userId'
                                placeholder='Enter user Id'
                                name='userId'
                                value={userId}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Repeat similar input fields for other form fields */}
                        <div className='form-group'>
                            <label htmlFor='id' className='lab'>Id</label>
                            <input
                                type='text'
                                className='form-control'
                                id='id'
                                placeholder='Enter Id'
                                name='id'
                                value={id}
                                onChange={handleChange}
                            />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='title' className='lab'>Title</label>
                            <input
                                type='text'
                                className='form-control'
                                id='title'
                                placeholder='Enter title'
                                name='title'
                                value={title}
                                onChange={handleChange}
                            />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='body' className='lab'>Body</label>
                            <textarea
                                className='form-control'
                                id='body'
                                placeholder='Enter Body'
                                name='body'
                                rows='3'
                                value={body}
                                onChange={handleChange}
                            />
                        </div>

                        <button type='submit' className='btn btn-primary'>
                            {editId ? "Update" : "Submit"}
                        </button>
                    </form>

                    <hr />

                    {/* Table to display fetched data */}
                    <table className='table table-striped'>
                        <thead>
                            <tr>
                                <th>User Id</th>
                                <th>Id</th>
                                <th>Title</th>
                                <th>Body</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.userId}</td>
                                    <td>{item.id}</td>
                                    <td>{item.title}</td>
                                    <td>{item.body}</td>
                                    <td>
                                        {/* Edit and Delete buttons */}
                                        <button className='btn btn-warning' onClick={() => handleEdit(item)}>
                                            Edit
                                        </button>
                                        <button className='btn btn-danger' onClick={() => handleDelete(item.id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default CRUD;
