import { useState, useEffect } from 'react'
import '../styles/index.css'
import { useAuth } from "../scripts/AuthContext";





export default function(){    
    const { user, token, logout } = useAuth();
    let [taskName, setTaskName] = useState('')
    let [dueDatetime, setDueDatetime] = useState()
    let [logDatetime, setLogDatetime] = useState(new Date())

    let getCurrentDatetime = () => {
        // let nowLocal = new Date().toISOString().slice(0,16);
        let nowLocalInput = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0,16);
        console.log(nowLocalInput)
        return nowLocalInput
    }

    let setDueDateNow = (e) => {
        e.preventDefault()
        setDueDatetime(getCurrentDatetime());
        return
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setLogDatetime(getCurrentDatetime());
        }, 1000); // update every second

            return () => clearInterval(interval); // clean up on unmount
    }, []);

    let handleSubmit = async (e) => {        
        e.preventDefault();

        //Are you sure????????

        try{
            let response = await fetch('https://react-tasks-online.onrender.com/api/log-tasks', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                // body: formData
                body: JSON.stringify({
                    user_id: user.id,
                    name: taskName,
                    due_datetime: dueDatetime,
                    log_datetime: logDatetime,
                    fin_datetime: '',  // default empty string
                    completed: false,  // default false
                    memo: ''           // default empty string
                })
            })
            let data = await response.json()
            console.log(data)
            if (data.success) {
                setTaskName('')
                setDueDatetime('')
            }
        }      
        catch(error){
            console.error("Error: ", error)
        }
    }

    return(
        <form id="task-input-form" onSubmit={handleSubmit} method="post">
            <h1 className='varela-round'>New Task</h1>
            <input
                className='task-input'
                placeholder='Task Name'
                name='name'
                type='text'
                value={taskName}
                onChange={e => setTaskName(e.target.value)}
                required
            />
            <label>Due</label>
            <input
                className='task-input'
                name='dueDatetime'
                type='datetime-local'
                value={dueDatetime}
                onChange={e => setDueDatetime(e.target.value)}
                required
            />
            <label>Log</label>
            <input
                className='task-input'
                name='logDatetime'
                type='datetime-local'
                value={logDatetime}
                onChange={e => setLogDatetime(e.target.value)}
            />
            <input className='task-input-buttons' value={"Submit"} type="submit"></input>
            <input className='task-input-buttons' type='button' value={"Get Current Datetime"} onClick={setDueDateNow}></input>
        </form>
        
    )
}