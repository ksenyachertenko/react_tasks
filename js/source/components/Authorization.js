/*
	Класс для авторизации

	users - все пользователи(array)
	scheme - схема пользователей
	onUserChange - функция для обновления пользователей при регистрации
	onAuthorization - функция для обновления текущего пользователя и его задач после авторизации
	onLogout - скидывание текущего пользователя и сохранение изменений при выходе

	для шифрования пароля используется npm пакет md5
*/
import React,{Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from './Button';
import FormInput from './FormInput';
import md5 from 'js-md5';

class Authorization extends Component{
	constructor(props){
		super(props);

		this.state ={
			error:null,
			user:localStorage.user,//id пользователя
			state:"auth"//авторизация или регистрация
		};

		this.scheme = this.props.scheme;
		this.interval = null;
	}
	//каждые 5 минут сохранение в localStorage
	componentDidMount() {
		let self = this;
		this.interval = setInterval(()=>{
			localStorage.setItem("users",JSON.stringify(self.props.users));
		},300000);
	}
	//убираем интервал до удаления из DOM
	componentWillUnmount() {
		clearInterval(this.interval);
	}
	//обновляем id пользователя
	updateUserState(){
		this.setState({user:localStorage.user,state:"auth"});
		this.props.onAuthorization();
	}
	//выход
	userLogout(){
		localStorage.removeItem("user");
		this.updateUserState();
		//сохраняем изменения пользователя в tasks
		this.props.onLogout();
	}
	//регистрация
	userRegistration(){
		let users = this.props.users.slice(),
			name = this.refs.Name.getValue(),
			pass = this.refs.Pass.getValue();

		if(name.trim == "" || pass.trim == ""){
			//выводим сообщение об ошибке
			this.setState({error:"Данные не введены!"});
		}else{
			//добавляем пользователя 
			let id = users.length+1;//id нового пользователя

			users.push([id,name,md5(pass)]);
			//и авторизовываем
			localStorage.setItem("user",id);
			this.props.onUserChange(users);
			this.updateUserState();
		}
	}
	//вход
	userLogin(){
		let users = this.props.users.slice(),
			name = this.refs.Name.getValue(),
			pass = this.refs.Pass.getValue();

		//ищем пользователя
		let this_user = users.filter((row,idx)=>{
			return (row[this.scheme.name] == name && row[this.scheme.pass] == md5(pass));
		});
		//если пользователь найден
		if(this_user.length > 0){
			//авторизовываем
			localStorage.setItem("user",this_user[0][this.scheme.id]);
			this.updateUserState();
		}else{
			//иначе выводим сообщение об ошибке
			this.setState({error:"Неверный логин или пароль"});
		} 
	}
	//смена режима авторизация/регистрация
	setUserState(state){
		this.setState({state,error:null});
	}
	//рендеринг формы авторизации/регистрации
	_renderAuthorization(){
		return <form className="login-form jumbotron margin-auto clearfix">
			{(this.state.state == "auth")
				?<h2 className="login-form-h2">Авторизация</h2>
				:<h2 className="login-form-h2">Регистрация</h2>
			}
			{(this.state.error)
				?<div className="alert alert-danger">{this.state.error}</div>
				:null}
			<div className="form-group">
				<label htmlFor="name">Логин</label>
				<FormInput className="form-control" id="name" value="" ref="Name" />
			</div>
			<div className="form-group">
				<label htmlFor="pass">Пароль</label>
				<FormInput className="form-control" id="pass" value="" ref="Pass" type="password" />
			</div>
			<Button className="btn btn-info" 
				onClick={(this.state.state == "auth")
					?this.userLogin.bind(this)
					:this.userRegistration.bind(this)} 
			>ок</Button>
			<Button className="btn btn-info pull-right" 
				onClick={(this.state.state == "auth")
					?this.setUserState.bind(this,"registr")
					:this.setUserState.bind(this,"auth")} 
			>{(this.state.state == "auth")
				?<span>регистрация</span> 
				: <span>авторизация</span>}
			</Button>
		</form>
	}
	//рендеринг кнопки выхода
	_renderLogout(){
		return <Button 
			className="btn btn-primary pull-right"
			onClick={this.userLogout.bind(this)}
			>
				выйти
			</Button>
	}
	render(){
		const content = (this.state.user)
			?this._renderLogout()
			:this._renderAuthorization();
		return content;
	}
} 

Authorization.propTypes = {
	users : PropTypes.arrayOf(PropTypes.array).isRequired,
	scheme: PropTypes.object.isRequired
}

export default Authorization
