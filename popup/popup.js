let tasks = []

function updateTime(){
    chrome.storage.local.get(["timer", "timeOption"], (res) =>{
        const time = document.getElementById("time")
        const minutes = `${res.timeOption - Math.ceil(res.timer / 60)}`.padStart(2, "0")
        let seconds = "00"
        if(res.timer % 60 != 0){
            seconds = `${60 - res.timer % 60}`.padStart(2, "0")
        }
        time.textContent = `${minutes} : ${seconds}`
    })
}

updateTime()
setInterval(updateTime, 1000)

const startTimerBtn = document.getElementById("start-btn")
startTimerBtn.addEventListener("click", () =>{
    chrome.storage.local.get(["isRunning"], (res) => {
        chrome.storage.local.set({
            isRunning: !res.isRunning,
        }, () => {
            startTimerBtn.textContent = !res.isRunning ? "Pause Timer" : "Start Timer"
        })
    })
})

const resetTimerBtn = document.getElementById("reset-btn")
resetTimerBtn.addEventListener("click", () => {
    chrome.storage.local.set({
        timer: 0,
        isRunning: false,
    }, () => {
        startTimerBtn.textContent = "Start Timer"
    })
})

const addTaskBtn = document.getElementById("add-task-btn")
addTaskBtn.addEventListener("click", () => addTask())

chrome.storage.sync.get(["tasks"], (res) =>{
    tasks = res.tasks ? res.tasks : []
    renderTasks()
})
function saveTask(){
    chrome.storage.sync.set({
        tasks,
    })
}

function renderTask(tasksNum){
    const taskRow = document.createElement("div")

    const text = document.createElement("input")
    text.type = "text"
    text.placeholder = "Enter a Task..."
    text.value = tasks[tasksNum]
    text.addEventListener("change", () =>{
        tasks[tasksNum] = text.value
        saveTask()
        //console.log(tasks)
    })

    const deleteBtn = document.createElement("input")
    deleteBtn.type = "button"
    deleteBtn.value = "X"
    deleteBtn.addEventListener("click", () => {
        deleteTask(tasksNum)
    })

    taskRow.appendChild(text)
    taskRow.appendChild(deleteBtn)

    const taskContainer = document.getElementById("task-div")
    taskContainer.appendChild(taskRow)
}

function addTask(){
    const tasksNum = tasks.length
    tasks.push("")
    renderTask(tasksNum)
    saveTask()
}

function deleteTask(tasksNum){
    tasks.splice(tasksNum, 1)
    renderTasks()
    saveTask()
}

function renderTasks(){
    const taskContainer = document.getElementById("task-div")
    taskContainer.textContent = ""
    tasks.forEach((taskText, tasksNum) =>{
        renderTask(tasksNum)
    })
}
