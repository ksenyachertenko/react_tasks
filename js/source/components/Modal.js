/*
	Класс для реализации модальной формы для CRUD операций с задачами
	тип отображения передается через параметр modal
	tmpTasks - список задач текущего пользователя
	scheme - схема хранения данных
	для CUD действий соответствующие параметры - onCreate,onSave,onDelete
*/
import React,{Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from './Button';
import Select from './Select';
import FormInput from './FormInput';

class Modal extends Component{
	constructor(props){
		super(props);

		this.col 	= props.scheme.column;
		this.status = props.scheme.status;

		this.statuses = ['','в разработке','выполнено','просрочено'];
		this.priority_classes = ['priority-low','priority-medium','priority-hight'];
		this.priority_names = ['обычная','важная','блокирующая'];
	}
	//передача элементов родительскому компоненту для сохранения
	setData(){
		let data = this.refs ;
		//проверяем action
		(this.props.modal.type == "edit")
			?this.props.onSave(data)
			:this.props.onCreate(data);
	}
	//рендеринг статуса и приоритета
	_getModalStatuses(status,priority,type){
		return (type == "view")
			?<div className="modal-block">
				<div>{this.statuses[status]}</div>
				<i className={"fa fa-circle "+this.priority_classes[priority]}> 
					{this.priority_names[priority]}
				</i></div>
			:<div className="modal-block">
				<Select 
					value={status} 
					ref="status" 
					className = "form-control"
					options ={ {0:'ожидает выполнения',1:'в разработке',2:'выполнено'} }
				/>
        		<Select 
					value={priority} 
					ref="priority" 
					className = "form-control select-margin-top"
					options ={ {0:'обычная',1:'важная',2:'блокирующая'} }
				/>
        	</div>;
	}
	//рендеринг дат
	_getModalDates(task,status,type){
		return (<div><div>
        	<div className="col-md-6 inline">срок</div>
        	{(type == "view")
        		?<div className="col-md-6 inline pull-right">{task[this.col.end]}</div>
        		:<FormInput ref="end" className="form-control" type="date" value={task[this.col.end]}/>
        	}
        </div>
    	<div>
        	<div className="col-md-6 inline">дата создания</div>
        	{(type == "view")
        		?<div className="col-md-6 inline pull-right">{task[this.col.create]}</div>
        		:<FormInput ref="create" className="form-control" type="date" value={task[this.col.create]}/>
        	}
        </div>
        {(status == this.status.done)
        	?(<div>
	        	<div className="col-md-6 inline">дата завершения</div>
	        	{(type == "view")
		        	?<div className="col-md-6 inline pull-right">{task[this.col.fact_end]}</div>
		        	:<FormInput ref="fact_end" className="form-control" type="date" value={task[this.col.fact_end]}/>
	        	}
	        </div>)
        	:null
        }</div>);
	}
	//верхняя часть модалки
	_renderViewModal(){
		let task 		= this.props.tmpTasks[this.props.modal.row],
			status 		= task[this.col.status],
			priority 	= task[this.col.priority],
			type 		= this.props.modal.type;

		return (<div>
		<div>
			{(type == "view")
			?<h4>{task[this.col.name]}</h4>
			:<FormInput 
					ref="name" 
					id={"name"+this.props.modal.row} 
					className="form-control" 
					value={task[this.col.name]}
				/>
			}
			
			{status == this.status.lose
				?(<i className="fa fa-warning pull-right alert-danger small"> задача просрочена</i>)
				:null}
		</div>
        {this._getModalStatuses(status,priority,type)}

        {(type == "view")
        	?<div className="modal-block">{task[this.col.desc]}</div>
			:<FormInput type="text" ref="desc" className="form-control" value={task[this.col.desc]} />
		}
    	
    	<div className={classNames({
    		"alert clearfix":true,
    		"alert-success": status != this.status.lose,
    		"alert-danger": status == this.status.lose
    	})}>
        	{this._getModalDates(task,status,type)}
        </div></div>);
	}
	//верхняя часть модалки создания
	_renderCreateModal(){
		return (<div>
			<div>
				<div className="col-md-6 inline">заголовок</div>
				<FormInput ref="name" value="" className="form-control"/>
			</div>
	        <div className="modal-block">
	        	<div className="col-md-6 inline">приоритет</div>
	    		<Select 
					ref="priority" 
					className = "form-control select-margin-top"
					options ={ {0:'обычная',1:'важная',2:'блокирующая'} }
					value={0}
				/>
	    	</div>
	    	<div>
	    		<div className="col-md-6 inline">описание задачи</div>
				<FormInput type="text" value="" ref="desc" className="form-control"/>
			</div>
    	
	    	<div className="alert clearfix alert-success">
	        	<div className="col-md-6 inline">срок</div>
					<FormInput ref="end" value="" className="form-control" type="date"/>
	        </div>
	    </div>);
	}
	//рендеринг заголовка
	_renderModalHead(){
		if(!this.props.modal) return null;

		switch(this.props.modal.type){
			case "view":
				return <h3 className="panel-title">Просмотр задачи</h3>
			case "edit":
				return <h3 className="panel-title">Редактирование задачи</h3>
			case "create":
				return <h3 className="panel-title">Создание задачи</h3>
			case "delete":
				return <h3 className="panel-title">Удаление задачи</h3>
			default :
				return null
		}
	}
	//рендеринг контента
	_renderModalContent(){
		if(!this.props.modal) return null;

		switch(this.props.modal.type){
			case "view":
				return this._renderViewModal()
			case "edit":
				return this._renderViewModal()
			case "create":
				return this._renderCreateModal()
			case "delete":
				return <h3 className="panel-title">Вы уверены что хотите удалить задачу?</h3>
			default :
				return null
		}

	}
	render(){
		return <div id={this.props.id} className={this.props.className}>
			<div className="modal-dialog">
		    <div className="modal-content panel panel-default Modal">
				<div className="modal-header panel-heading">
					{this._renderModalHead()}
				</div>
		      <div className="modal-body panel-body">
		        	{this._renderModalContent()}
		      </div>
		      <div className="modal-footer">
		      	<Button 
	        	className="btn btn-info pull-right" 
	        	data-dismiss="modal">закрыть</Button>

		      	{(this.props.modal && this.props.modal.type == "edit")
			        ?<Button 
			        	onClick={this.setData.bind(this)} 
			        	className="btn btn-danger btn-margin" 
			        	data-dismiss="modal">сохранить</Button>
			        :null
		      	}
		      	{(this.props.modal && this.props.modal.type == "delete")
			       ?<Button 
			        	onClick={this.props.onDelete} 
			        	className="btn btn-danger btn-margin"
			        	data-dismiss="modal">ок</Button>
			        :null
		      	}
		      	{(this.props.modal && this.props.modal.type == "create")
			       ?<Button 
			        	onClick={this.setData.bind(this)} 
			        	className="btn btn-danger btn-margin"
			        	data-dismiss="modal">сохранить</Button>
			        :null
		      	}
		      </div>
		    </div>
		  </div>
		</div>
	}
}

export default Modal