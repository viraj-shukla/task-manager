import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { 
    ChartComponent, 
    SeriesCollectionDirective, 
    SeriesDirective,  
    Inject, 
    Category, 
    DataLabel,
    DateTime,
    BarSeries
} from '@syncfusion/ej2-react-charts';
import './App.css';
import TasksNavBar from './TasksNavBar';

class TaskChart extends React.Component {
    state = {
        project: {
            id: '',
            subjects: []
        },
        tasks: [],
        loaded: false
    }

    getTaskData = (project) => {
        let taskData = []
        let priorityCount = {}
        project.subjects.forEach(subject => {
            subject.tasks.forEach(task => {
                taskData.push({
                    name: `${subject.name}/${task.name}`,
                    priority: task.priority,
                    due: new Date(task.due)
                })
                priorityCount[task.priority]++
            })
        })
        let sortTasks = (task1, task2) => {
            if (task1.priority != task2.priority) {
                return task1.priority.localeCompare(task2.priority)
            }
            if (task1.due.getTime() != task2.due.getTime()) {
                return task1.due.getTime() > task2.due.getTime() ? 1 : -1
            }
            return task1.name.localeCompare(task2.name)
        }

        return taskData.sort(sortTasks)
    }

    /*pointRender = (args) => {
        let colors = {
            "1": #ed4c2f
        }
    }*/
    
    
    primaryXAxis = { valueType: 'Category' }
    primaryYAxis = { valueType: 'DateTime', labelFormat: 'M/d' }

    componentDidMount() {
        fetch('http://localhost:5001/task-manager-ed416/us-central1/api/get-project', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "text/plain",
            },
            //credentials: 'include',
            body: JSON.stringify({
                foo: 'bar'
            })
        })
        .then(res => res.text())
        .then(dataJSON => {
            let data = JSON.parse(dataJSON)
            console.log(JSON.stringify(data.project))
            if (!data.error) {
                this.setState({
                    project: data.project,
                    tasks: this.getTaskData(data.project),
                    loaded: true
                })
            }
        })
    }

    content = () => (
        <div class="chart-container">
            <ChartComponent id="chart" primaryXAxis={this.primaryXAxis} primaryYAxis={this.primaryYAxis}>
                <Inject services={[BarSeries, Category, DateTime]} />
                <SeriesCollectionDirective>
                    <SeriesDirective 
                        dataSource={this.state.tasks} 
                        xName='name'
                        yName='due'
                        name='Dates'
                        type='Bar'
                    />
                </SeriesCollectionDirective>
            </ChartComponent>
        </div>
    )


    render() {
        return (
            <div>
                <TasksNavBar handleLogout={this.handleLogout} />

                {this.state.loaded ? this.content() : null}
            </div>
        )
    }
}

export default TaskChart;