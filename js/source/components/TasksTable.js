/*
	Класс для реализации табличного представления
	tasks - список задач текущего пользователя(array)
	scheme - схема хранения данных(array)
	updateAllTasks - функция обновления задач в основном комполененте и localStorage
*/
import React,{Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from './Button';
import Select from './Select';
import FormInput from './FormInput';
import Actions from './Actions';
import Modal from './Modal';

class TasksTable extends Component{
	constructor(props){
		super(props);

		//схема колонок
		this.col 		= props.scheme.column;
		//статусы
		this.status 	= props.scheme.status;
		this.statuses 	= ['','в разработке','выполнено','просрочено'];
		this.status_buttons=[
			{text:"начать работу",willStatus:this.status.do,className:"btn btn-primary btn-done-action btn-action"},
			{text:"выполнить",willStatus:this.status.done,className:"btn btn-success btn-done-action btn-action"},
			{text:"возобновить",willStatus:this.status.do,className:"btn btn-warning btn-done-action btn-action"},
			{text:"начать работу",willStatus:this.status.do,className:"btn btn-danger btn-done-action btn-action"}
		];
		//приоритеты
		this.priority 	= props.scheme.priority;
		this.priority_classes = ['priority-low','priority-medium','priority-hight'];
		this.priority_names = ['обычная','важная','блокирующая'];	
		
		//классы для интерфейса
		this.row_classes = ['','alert-success','','alert-danger'];
		this.sort_classes = {
			"ASC":"fa fa-sort-alpha-asc",
			"DESC":"fa fa-sort-alpha-desc"
		};

		this.modalId = "myModal";

		let tmpTasks = props.tasks.slice();
		tmpTasks.map((item,idx)=>{
			item['idx'] = idx;
		});

		this.state = {
			tasks: tmpTasks,
			tmpTasks,//для поиска и фильтрации
			edit:null,//редактируемая строка
			sort:{col:null,direction:"DESC"},
			search:{col:null,value:''}
		}

		this.interval = null;
	}
	//обновление таблицы каждые 5 минут c сохранением в localStorage
	componentDidMount() {
		let self = this;
		this.interval = setInterval(()=>{
			new Promise((resolve, reject)=>{
				self.updateTable();
				resolve();
			})
			.then(() => this.props.updateAllTasks());
		},300000);
		this.props.updateAllTasks();
		this.updateTable();
	}
	//убираем интервал до удаления из DOM
	componentWillUnmount() {
		clearInterval(this.interval);
	}
	//функция обновления таблицы
	updateTable(){
		let tasks = this.state.tasks.slice();

		tasks.map((item)=>{
			this.checkStateLate(item['idx']);
		})
	}
	//установка значения поиска
	setSearch(col){
		let value = this.refs.selectSearch.getValue();

		(value == '')
			? this.stopSearch()
			:this.search(col,value);
	}
	//остановить поиск
	stopSearch(){
		let tmpTasks = this.state.tasks.slice();

		this.setState({
			tmpTasks,
			search:{col:null,value:''}
		});
	}
	//реализация поиска
	search(col,value){
		let tasks = this.state.tasks.slice(),
			search = {col,value},
			sort = {col:null,direction:"DESC"};//обнуляем сортировку

		let tmpTasks = this.searchTmpTasks(tasks,col,value);

		this.setState({
			tmpTasks,
			search,
			sort
		});
	}
	//обновление поиска для TmpTasks
	searchTmpTasks(tasks,col,value){
		//если поиска нет возвращаем текущие задачи
		if(value == "" || col == null) return tasks;
		return tasks.filter((row)=>{
			return (row[col] == value);
		});
	}
	//установка направления сортировки
	setSort(col){
		let direction = (this.state.sort.col != col || this.state.sort.direction == "DESC")?"ASC":"DESC";

		this.setState({
			sort:{col,direction}
		},this.sort);
	}
	//реализация сортировки
	sort(){
		let self = this,
			tmpTasks = this.state.tmpTasks.slice(),
			col = this.state.sort.col;

		tmpTasks.sort((a,b)=>{
			return (self.state.sort.direction == "ASC")
				?(a[col] > b[col]? 1: -1)
				:(a[col] > b[col]? -1: 1);
		});

		this.setState({tmpTasks});
	}
	//обновление данных поиска
	updateSortSearch(){
		if(this.state.search.value == "")
			this.stopSearch()
		else{
			let tasks = this.state.tasks.slice();
			let tmpTasks = this.searchTmpTasks(tasks,this.state.search.col,this.state.search.value);
			
			this.setState({tmpTasks});
		}
	}
	//установка значения task по idx
	setValueByIdxRow(row,col,value){
		let tmp_tasks = this.state.tasks.slice();

		tmp_tasks[row][col] = value;
		//проверка и установка даты выполнения
		tmp_tasks[row][this.col.fact_end] = this.checkDateFactEnd(tmp_tasks[row]);

		this.setState({tasks:tmp_tasks},this.updateSortSearch);
	}
	//установка редактируемого значения таблицы
	setEdit(row,col){
		this.setState({
			edit:{row,col}
		});
	}
	//формат yyyy-mm-dd
	getDateToday(){
		var date = new Date();
		return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
	}
	//проверка даты окончания строки
	checkDateFactEnd(row){
		if(row[this.col.status] == this.status.done && row[this.col.fact_end] == null)
			return this.getDateToday();
		if(row[this.col.status] != this.status.done)
			return null;
		return row[this.col.fact_end];
	}
	//проверка статуса строки по idx
	checkStateLate(row){
		let date_end = this.state.tasks[row][this.col.end],
			date_today = this.getDateToday(),
			status 	= this.state.tasks[row][this.col.status];

		if(date_end == '' || [this.status.do,this.status.done].includes(parseInt(status))){
			//если нет даты окончания и задача просрочена, ставим "ожидает выполнения"
			if(status == this.status.lose)
				this.setValueByIdxRow(row,this.col.status,this.status.wait);
			else
				this.updateSortSearch(); 
			return;
		}

		if(date_end > date_today){
			if(status == this.status.lose)
				this.setValueByIdxRow(row,this.col.status,this.status.wait);
		}else{
			this.setValueByIdxRow(row,this.col.status,this.status.lose);
		}
	}
	//сохранение данных по ref
	saveByRef(ref,ev){
		ev.preventDefault();
		let value = this.refs[ref].getValue() || '',
			tasks = this.state.tasks.slice(),
			row = this.state.tmpTasks[this.state.edit.row]['idx'];
		//находим редактируемую ячейку по state
		tasks[row][this.state.edit.col] = value;
		tasks[row][this.col.fact_end] = this.checkDateFactEnd(tasks[row]);
		let tmpTasks = this.searchTmpTasks(tasks,this.state.search.col,this.state.search.value);

		this.setState({
			edit:null,
			tasks,
			tmpTasks
		},()=>this.checkStateLate(row));
	}
	//установка данных для модалки
	setModal(type,row){
		this.setState({modal:{type,row}},()=>{
			$("#"+this.modalId).modal("show")
		});
	}
	//создание новой задачи из модалки
	createTaskFromModal(val){
		let tasks 	= this.state.tasks.slice(),
			row 	= [];

		for(let key in val){
			row[this.col[key]] = val[key].getValue();
		}
		//данные по умолчанию
		row[this.col.create] = this.getDateToday();
		row[this.col.fact_end] = null;
		row[this.col.status] = 0;
		row[this.col.user] = parseInt(localStorage.user);
		row['idx'] = tasks.length;

		tasks.push(row);
		//обновляем выводимые задачи
		let tmpTasks = this.searchTmpTasks(tasks,this.state.search.col,this.state.search.value);

		this.setState({tasks:tasks,tmpTasks:tmpTasks},()=>this.checkStateLate(row['idx']));
	}
	//сохранение данных из модалки
	saveFullRow(val){
		let tasks 	= this.state.tasks.slice(),
			row 	= this.state.modal.row;

		for(let key in val){
			tasks[row][this.col[key]] = val[key].getValue();
		}
		//обновляем выводимые задачи
		let tmpTasks = this.searchTmpTasks(tasks,this.state.search.col,this.state.search.value);
		
		this.setState({tasks:tasks,tmpTasks:tmpTasks},()=>this.checkStateLate(row));
	}
	//удаление(модалка)
	deleteRow(){
		let tasks 	= this.state.tasks.slice();

		tasks.splice(this.state.modal.row,1);
		//обновляем idx
		tasks.map((item,idx)=>item['idx'] = idx);
		//обновляем выводимые задачи
		let tmpTasks = this.searchTmpTasks(tasks,this.state.search.col,this.state.search.value);

		this.setState({tasks,tmpTasks});
	}
	//рендеринг заголовка таблицы
	_renderTHead(){
		return <thead>
          <tr>
            <th className="col-md-4 table-sort" onClick={this.setSort.bind(this,this.col.name)}>
            	Задачи {this.state.sort.col == this.col.name 
        			?(<i className={this.sort_classes[this.state.sort.direction]}></i>)
        			:""}
            </th>
            <th className="col-md-2">
            	<Select 
            		ref="selectSearch"
            		className = "form-control"
            		options ={ {0:'ожидает выполнения',1:'в разработке',2:'выполнено',3:'просрочено','':'Статус'} }
            		value={this.state.search.value}
            		onChangeFunction = {this.setSearch.bind(this,this.col.status)}
            	/>
			</th>
            <th className="col-md-2"></th>
            <th className="col-md-2 table-sort" onClick={this.setSort.bind(this,this.col.end)}>
            	Срок {this.state.sort.col == this.col.end
        			?(<i className={this.sort_classes[this.state.sort.direction]}></i>)
        			:""}
            </th>
            <th className="col-md-2"></th>
          </tr>
        </thead>
	}
	//рендеринг тела таблицы
	_renderTBody(){
		return <tbody>
		{this.state.tmpTasks.map((item,idx)=>{
			let status 		= item[this.col.status],
				priority 	= item[this.col.priority],
				btn_setting = this.status_buttons[status];

			return <tr key={idx} className={this.row_classes[status]}> 
				<td key="0" onDoubleClick={this.setEdit.bind(this,idx,this.col.name)}>
					{ (this.state.edit && this.state.edit.row == idx && this.state.edit.col == this.col.name)
						?(<div>
							<form onSubmit={this.saveByRef.bind(this,"input")}>
								<FormInput 
									value={item[this.col.name]} 
									ref="input" 
								/>
							</form>
						</div>)
						:(<div>
							<i className={"fa fa-circle "+this.priority_classes[priority]}></i> {item[this.col.name]}
						</div>)
					}
				</td>
				<td key="1" onDoubleClick={this.setEdit.bind(this,idx,this.col.status)}>
					{ (this.state.edit && this.state.edit.row == idx && this.state.edit.col == this.col.status)
						?(<div>
							<form onChange={this.saveByRef.bind(this,"selectStatus")}>
								<Select 
									value={item[this.col.status]} 
									ref="selectStatus" 
									className = "form-control"
            						options ={ {0:'ожидает выполнения',1:'в разработке',2:'выполнено'} }
								/>
							</form>
						</div>)
						:(<div>
							{this.statuses[status]}
						</div>)
					}
				</td>
				<td key="2">
					<Button 
						className={btn_setting.className} 
						onClick={this.setValueByIdxRow.bind(this,item['idx'],this.col.status,btn_setting.willStatus)}
					>
						{btn_setting.text}
					</Button>
				</td>
				<td key="3" onDoubleClick={this.setEdit.bind(this,idx,this.col.end)}>
					{(this.state.edit && this.state.edit.row == idx && this.state.edit.col == this.col.end)
						?(<div>
							<form onChange={this.saveByRef.bind(this,"input")}>
								<FormInput 
									type="date"
									value={item[this.col.end]} 
									ref="input" 
								/>
							</form>
						</div>)
						:(<div>
							{item[this.col.end]}
						</div>)
					}
				</td>
				<td key="4">
		        	<Actions 
		        		row={item['idx']}
		        		view={this.setModal.bind(this,"view",item['idx'])}
		        		edit={this.setModal.bind(this,"edit",item['idx'])}
		        		delete={this.setModal.bind(this,"delete",item['idx'])}
		        	/>
		        </td>
			</tr>
		})}
      </tbody>
	}
	render(){
		return <div>
			<Modal 
				id={this.modalId} 
				className="modal fade" 
				modal={this.state.modal}
				onSave = {this.saveFullRow.bind(this)}
				onCreate = {this.createTaskFromModal.bind(this)}
				onDelete = {this.deleteRow.bind(this)}
				tmpTasks = {this.state.tasks}
				scheme = {this.props.scheme}
			/>
			<Button 
				className="btn btn-danger"
				onClick={this.setModal.bind(this,"create",null)}
				>добавить задачу
			</Button>
			<table className="table" id="TasksTable" data-table={JSON.stringify(this.state.tasks)}>
				{this._renderTHead()}
				{this._renderTBody()}
			</table>
		</div>
	}
}

TasksTable.propTypes = {
	tasks: PropTypes.arrayOf(PropTypes.array).isRequired,
	scheme: PropTypes.objectOf(PropTypes.object).isRequired
}

export default TasksTable