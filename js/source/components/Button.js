import React,{Component} from 'react';
import PropTypes from 'prop-types';

class Button extends Component{
	render(){
		return <a {...this.props} />;
	}
}

Button.propTypes = {
	href:PropTypes.string
}

export default Button