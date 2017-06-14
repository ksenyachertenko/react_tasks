import React,{Component} from 'react';
import PropTypes from 'prop-types';

class FormInput extends Component{
	constructor(props){
		super(props);

		this.state = {
			value:this.props.value
		};
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			value:nextProps.value
		});
	}
	onChange(ev){
		this.setState({
			value:ev.target.value
		});
	}
	getValue(){
		return this.refs.input.value;
	}
	render(){
		let settings = {
			ref:"input",
			onChange:this.onChange.bind(this),
			value:this.state.value			
		};

		switch(this.props.type){
			case 'text':
				return <textarea {...this.props} {...settings}></textarea>
			default :
				return <input {...this.props} {...settings}/>
		}
	}
}

FormInput.propTypes = {
	type: PropTypes.oneOf(['input','date','text'])
}

FormInput.defaultProps = {
	type:'input'
}

export default FormInput