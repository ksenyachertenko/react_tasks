import React,{Component} from 'react';
import PropTypes from 'prop-types';

class Select extends Component{
	constructor(props){
		super(props);

		this.state = {
			options:props.options,
			value:props.value
		};
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			value:nextProps.value
		});
	}
	onChange(ev){
		this.props.onChangeFunction();
		this.setState({
			value:ev.target.value
		});
	}
	getValue(){
		return this.refs.select.value;
	}
	render(){
		const setting = {
			ref:'select',
			className:this.props.className,
			onChange:this.onChange.bind(this),
			value:this.state.value
		};
		const options = [];
		for(let idx in this.state.options){
			options.push(<option key={idx} value={idx}>{this.state.options[idx]}</option>);
		}
		return <select {...setting}>
			{options}
		</select>;
	}
}

Select.propTypes = {
	options:PropTypes.object.isRequired
}

Select.defaultProps = {
	onChangeFunction: ()=>{}
}

export default Select