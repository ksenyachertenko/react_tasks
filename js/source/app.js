// базовый скрипт
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import Button from './components/Button';
import Select from './components/Select';
import FormInput from './components/FormInput';
import Actions from './components/Actions';

import TasksTable from './components/TasksTable';
import Authorization from './components/Authorization';
import TasksTraker from './components/TasksTraker';
import tasksDB from './tasksDB';
import usersDB from './usersDB';
import schemeDB from './schemeDB';

const tasks = (localStorage.tasks)
? JSON.parse(localStorage.tasks)  
:tasksDB;

const users = (localStorage.users)
? JSON.parse(localStorage.users)  
:usersDB;

const scheme = schemeDB;

ReactDOM.render(
	<div className="container">
		<TasksTraker 
			users={users} 
			tasks={tasks} 
			scheme={scheme} 
		/>
  	</div>,
  document.getElementById('app')
);