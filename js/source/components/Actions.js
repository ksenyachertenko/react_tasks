/*
	Класс для реализации CRUD
	row - индекс редактируемой строки (idx)
	view - функция при отображении модалки просмотра задачи
	edit - функция при отображении модалки редактирования задачи
	delete - функция при отображении модалки удаления задачи
	create - функция при отображении модалки создания задачи
*/
import React,{Component} from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

class Actions extends Component{
	render(){
		return <div>
			<Button className="badge" onClick={this.props.edit} ><i className="fa fa-pencil"></i></Button>
			<Button className="badge" onClick={this.props.view}><i className="fa fa-eye"></i></Button>
			<Button className="badge" onClick={this.props.delete}><i className="fa fa-times"></i></Button>
		</div>
	}
}

Actions.propTypes = {
	row:PropTypes.number.isRequired//номер редактируемой строки
}

Actions.propTypes = {
	edit: ()=>{},
	view: ()=>{},
	delete: ()=>{},
	create: ()=>{}
}

export default Actions