import React, { useState, useRef , useEffect} from 'react'
import '../index.css';

const getLocalItems = () => {
    let list = localStorage.getItem('lists');
    if(list){
        return JSON.parse(localStorage.getItem('lists'));
    }else{
        return [];
    }
}

const Todo = () => {
    const inputElement = useRef();
    const listElement = useRef();
    const listBtn = useRef();
    const [inputData, setInputData] = useState('');
    const [items, setItems] = useState(getLocalItems());
    const [toggleSubmit, setToggleSubmit] = useState(true);
    // const [isVisible, setIsVisible] = useState(true);
    const [eItem, setEItem] = useState(null);

    const addItem = () => {
        if (inputData === '' || inputData === ' ') {
            inputElement.current.placeholder = 'Enter the task';
        } else if (inputData && !toggleSubmit) {
            setItems(
                items.map((ele) => {
                    if (ele.id === eItem) {
                        return { ...ele, name: inputData ,t:false}
                    }
                    return ele;
                })
            )
            setToggleSubmit(true);
            // setIsVisible(true);
            setInputData('')
            setEItem(null);
        } else {
            inputElement.current.placeholder = 'Add a task';
            const allInputData = { id: new Date().getTime().toString(), name: inputData, status: false , t: false }
            setItems([...items, allInputData]);
            setInputData("");
        }

    }

    const delItem = (index) => {
        const delItems = items.filter((ele) => {
            return index !== ele.id;
        });
        setItems(delItems);
    }

    useEffect(() => {
        localStorage.setItem('lists', JSON.stringify(items))
    }, [items])
    

    const editItem = (id) => {
        let newEditItem = items.find((ele) => {
            return ele.id === id
        })

        
        setToggleSubmit(false);
        // setIsVisible(false);
        newEditItem.t = true;
        setInputData(newEditItem.name)
        setEItem(id);
    }

    function strikeItem(id) {
        const temp = [...items];
        temp[id].status = !temp[id].status;
        temp[id].t = !temp[id].t;
        setItems(temp);
    }

    return (
        <>
            <div className="blocks">
                <div className="block_add">
                    <div className="head">Todo List</div>
                    <input className="text_add" placeholder="Add a task" type="text"
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                        ref={inputElement}
                    />

                    {
                        toggleSubmit ? <input className="btn_add" type="submit" value="Add" onClick={addItem} /> : <button className="btn_save" onClick={addItem}><i className="fa-solid fa-check"></i></button>
                    }

                </div>
                <div>
                    <ul className="blocks_remove">
                        {
                            items.map((ele, pos) => {
                                return (
                                    <li className="block_remove" key={ele.id}>
                                        <input className={ele.status ? "text_remove_done" : "text_remove"} type="text"
                                            value={ele.name}
                                            readOnly
                                            ref={listElement}
                                            onClick={() => strikeItem(pos)}
                                        />
                                        <button className="btn_edit" style={{ visibility: ele.t ? 'hidden' : 'visible'  }} onClick={() => editItem(ele.id)} ref={listBtn}><i className="fa-solid fa-pen"></i></button>
                                        <button className="btn_remove" onClick={() => delItem(ele.id)}><i className="fa-solid fa-trash"></i></button>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Todo