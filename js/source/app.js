'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Logo from './components/Logo';

import Button from './components/Button';
import Select from './components/Select';
import FormInput from './components/FormInput';
import Actions from './components/Actions';

import TasksTable from './components/TasksTable';

const tasks = [
	['Название1','Описание1','2015-05-05','2015-05-05',null,2,1,1],
	['Название2','Описание2','2015-05-05','2015-05-05','2015-05-05',1,2,1],
	['Название3','Описание3','2015-05-05','2017-06-15',null,0,0,1],
	['Название4','Описание4','2015-05-05','2015-05-05',null,0,0,1],
];

const scheme = {
	column:{
		name:0,
		desc:1,
		create:2,
		end:3,
		fact_end:4,
		priority:5,
		status:6,
		user:7
	},
	status:{
		wait:0,
		do:1,
		done:2,
		lose:3
	},
	priority:{
		low:0,
		medium:1,
		high:2
	}
}

ReactDOM.render(
	<div className="container">
		<h1>
			<Logo /> Welcome to The App!
		</h1>
  		<Button className="btn btn-primary" onClick={()=>alert('ok')}>this is Button</Button>
  		<Button className="badge" onClick={()=>alert("info")}><i className="fa fa-pencil"></i></Button>
  		<Button className="btn btn-primary" onClick={()=>alert("change")}><i className="fa fa-table"></i></Button>

  		<Select 
  			className="form-control" 
  			options={ {0:'ожидает выполнения',1:'в разработке',2:'выполнено',3:'просрочено','':'Статус'} } 
  			defaultValue=''
  		/>
  		<FormInput type="text" defaultValue="This is text" />
  		<FormInput className="form-control" type="date" defaultValue="2014-04-04" />


  		<TasksTable tasks={tasks} scheme={scheme}/>
  	</div>,
  document.getElementById('app')
);