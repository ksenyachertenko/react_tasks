/*
	Базовый класс
	users - все пользователи(array)
	tasks - все задачи(array)
	scheme - схема хранения данные
*/
import React,{Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Authorization from './Authorization';
import TasksTable from './TasksTable';

class TasksTraker extends Component{
	constructor(props){
		super(props);

		this.state = {
			users:props.users,
			tasks:props.tasks,
			tmpTasks:props.tasks,
			tasks_without_this_user:[],
			type:"table"
		};
	}
	componentWillMount() {
		if(localStorage.user)
			this.authorization();
	}
	updateTasks(){
		let new_tasks = this.state.tasks.slice(); 
		if(this.state.type == "table"){
			let table = document.getElementById('TasksTable');
			if(table && table.getAttribute('data-table')){
				new_tasks = this.state.tasks_without_this_user.concat(JSON.parse(table.getAttribute('data-table')));
			}
		}
		localStorage.setItem("tasks",JSON.stringify(new_tasks));
		this.setState({tasks:new_tasks});
	}
	//обновление пользователей при регистрации
	updateUsers(users){
		this.setState({users});
		localStorage.setItem("users",JSON.stringify(users));
	}
	//обновление задач при авторизации
	authorization(){
		let tasks = this.state.tasks.slice();
		let tasks_without_this_user = [];

		let tmpTasks = tasks.filter((row)=>{
			if(row[this.props.scheme.column.user] == localStorage.user){
				return true;
			}else{
				tasks_without_this_user.push(row);
				return false;
			}
		});

		this.setState({
			tmpTasks:tmpTasks,
			tasks_without_this_user:tasks_without_this_user
		});
	}
	render(){
		return <div>
			<Authorization 
				users={this.state.users} 
				scheme={this.props.scheme.user}
				onUserChange={this.updateUsers.bind(this)}
				onAuthorization={this.authorization.bind(this)}
				onLogout={this.updateTasks.bind(this)}
			/>
			{(localStorage.user)
	  			?<TasksTable 
	  				tasks={this.state.tmpTasks} 
	  				scheme={this.props.scheme}
	  				updateAllTasks={this.updateTasks.bind(this)}
	  			/>
	  			:null
	  		}
	  	</div>
	}
}

TasksTraker.propTypes = {
	users: PropTypes.arrayOf(PropTypes.array).isRequired,
	tasks: PropTypes.arrayOf(PropTypes.array).isRequired,
	scheme: PropTypes.objectOf(PropTypes.object).isRequired,
}

export default TasksTraker