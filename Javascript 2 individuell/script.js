const _URL = 'https://jsonplaceholder.typicode.com/todos/'
const getURL = 'https://jsonplaceholder.typicode.com/todos?page=1&_limit=7'
const form = document.querySelector('.todo-form')
const input = document.querySelector('.text-input')
const submit = document.querySelector('.submit-input')
const output = document.querySelector('.output')
const modal = document.querySelector('.modalContainer')
const modalBtn = document.querySelector('.modalBtn')

modalBtn.addEventListener('click', () => {
    modal.classList.add('hidden')
})

let todos = []

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const errorText = document.querySelector('.red')
    if(input.value.trim() == ''){
        errorText.classList.remove('hidden')
        return
    }
        
    errorText.classList.add('hidden')
    postTodo()
})


const postTodo = () => {
    return fetch(_URL, {
        method: 'POST',
        body: JSON.stringify({
            title: input.value,
            completed: false,
            userId: 1
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
        })
        .then((res) => res.json())
        .then((data) => {
        todos.push(data)
        console.log(data)
        printTodo(data.completed, data.title, data.id)
        })
        .catch((err) => console.log(err))
} 

const deleteTodo = (id, status) => {
    if(status === false){
        modal.classList.remove('hidden')
        return
    }
    return fetch(_URL + id, {
        method: 'DELETE'
    })
    .then((res) => {
        console.log(res.status)
        todos = todos.filter((todo) => todo.id != id)
        output.innerHTML = '<h1>Todos:</h1>'
        todos.forEach(element => {
            printTodo(element.completed, element.title, element.id)
        });
    })
    .catch((err) => console.log(err))
    
}

const swapTodo = (id, status) => {
    let newStatus = true
    if(status === true)
        newStatus = false

    return fetch(_URL + id, {
        method: 'PUT',
        body: JSON.stringify({
            completed: newStatus
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then((res) => {
        console.log(res.status)
        todos[todos.findIndex((todo) => todo.id === id)].completed = !todos[todos.findIndex((todo) => todo.id === id)].completed
        output.innerHTML = '<h1>Todos:</h1>'
        todos.forEach(element => {
            printTodo(element.completed, element.title, element.id)
        });
    })
    
    .catch((err) => console.log(err))
    
}

const printTodo = (completed, title, id) => {

    const textContainer = document.createElement('div')
    textContainer.classList.add('itemContainer')
    const buttonContainer = document.createElement('div')
    buttonContainer.classList.add('buttonContainer')
    
    const itemText = document.createElement('p')
    const itemStatus = document.createElement('p')
    const itemId = document.createElement('p')
    itemStatus.textContent = '(Completed!)'
    itemText.textContent = title
    itemId.textContent = 'id: ' + id
    //----------------------------------------------------------
    const deleteItem = document.createElement('button')
    deleteItem.textContent = 'Delete'
    deleteItem.addEventListener('click', () => deleteTodo(id, completed))

    const swapItem = document.createElement('button')
    if(completed === true)
        swapItem.textContent = 'Un-complete'
    else
        swapItem.textContent = 'Complete'
        
    swapItem.addEventListener('click', () => swapTodo(id, completed))
    
    const item = document.createElement('div')
    if(completed === true){
        item.classList.add('completed', 'item')
        item.appendChild(itemStatus)} 
    else{
        item.classList.add('item')}
    //----------------------------------------------------------
    
    output.appendChild(item)
    item.appendChild(textContainer)
    textContainer.appendChild(itemId)
    textContainer.appendChild(itemText)
    textContainer.appendChild(buttonContainer)
    buttonContainer.appendChild(swapItem)
    buttonContainer.appendChild(deleteItem)
    
    
}
const getTodo = () => {
    return fetch(getURL)
        .then((res) => res.json())
        .then((data) => {
            data.forEach(element => {
                todos.push(element)
            });
            todos.forEach(element => {
                printTodo(
                    element.completed,
                    element.title,
                    element.id
                )
            });
        })
        .catch((err) => console.log(err))
}

getTodo()
