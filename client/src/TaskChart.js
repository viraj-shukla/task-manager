import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { 
    ChartComponent, 
    SeriesCollectionDirective, 
    SeriesDirective,  
    Inject, 
    Category, 
    DataLabel,
    DateTime,
    BarSeries,
    StripLine
} from '@syncfusion/ej2-react-charts';
import './App.css';
import TasksNavBar from './TasksNavBar';
import EditAddHeader from './EditAddHeader';

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
        project.subjects.forEach(subject => {
            subject.tasks.forEach(task => {
                if (task.due) {
                    let date = new Date(task.due)
                taskData.push({
                    name: `${subject.name}/${task.name}`,
                    priority: task.priority,
                    due: date,
                    dueMarker: `${date.getMonth() + 1}/${date.getDate()}`
                })
                }
            })
        })
        let sortTasks = (task1, task2) => {
            if (task1.priority != task2.priority) {
                return task2.priority.localeCompare(task1.priority)
            }
            if (task1.due.getTime() != task2.due.getTime()) {
                return task1.due.getTime() < task2.due.getTime() ? 1 : -1
            }
            return task1.name.localeCompare(task2.name)
        }

        return taskData.sort(sortTasks)
    }

    pointRender = (args) => {
        let seriesColor = []
        /*let colors = {
            "1": "#ed4c2f",
            "2": "#f1da0b",
            "3": "#1dc434",
            "4": "#ebebeb"
        }*/
        this.state.tasks.forEach(task => {
            seriesColor.push(this.state.project.priorityColors[task.priority])
        })
        args.fill = seriesColor[args.point.index]
    }
    
    
    primaryXAxis = { 
        valueType: 'Category',
    }
    primaryYAxis = { 
        valueType: 'DateTime', 
        labelFormat: 'M/d', 
        opposedPosition: true,
        //minimum: new Date(),
        rangePadding: 'Additional',
        //minimum: new Date(),
        stripLines: [{ start: 0, end: new Date(), color: '#d1d1d1' }]
    }
    marker = {
        visible: true,
        dataLabel: { visible: true, position: 'Outer', name: 'dueMarker', visible: true }
    }

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
            <ChartComponent
                id="chart"
                primaryXAxis={this.primaryXAxis} 
                primaryYAxis={this.primaryYAxis}
                pointRender={this.pointRender}
                width='80%'
                background="#ffffff5f"
            >
                <Inject services={[BarSeries, Category, DateTime, DataLabel, StripLine]} />
                <SeriesCollectionDirective>
                    <SeriesDirective 
                        dataSource={this.state.tasks} 
                        marker={this.marker}
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

                <div class="below-navbar">
                    <span class="title-bar">
                        <Link to='/project' class="back-link-alone">
                            <FontAwesomeIcon id="back-icon-alone" icon={faAngleLeft} size="1x" />
                        </Link>

                        <b class="chart-title">
                            {this.state.project.name}
                        </b>
                    </span>
                    
                    

                    {this.state.loaded ? this.content() : null}
                </div>
                
            </div>
        )
    }
}

export default TaskChart;