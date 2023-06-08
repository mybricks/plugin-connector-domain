import React, { FC } from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {error, warning} from '../../icon';

import styles from './index.less';

type MessageProps = {
	type: string;
	message: string;
};
let dom = null;
let timer = null;
type OptionType = {
	type?: string;
	timeout?: number;
}

export const notice = (message = '', option: OptionType = { type: 'error', timeout: 2000 }) => {
	const container = document.querySelector('div[data-id=plugin-panel]');
	
	if (!dom) {
		dom = document.createElement('div');
	}
	container.appendChild(dom);
	clearTimeout(timer);
	render(<Message type={option.type} message={message} />, dom);
	
	timer = setTimeout(() => unmountComponentAtNode(dom), option.timeout || 2000);
};

const Message: FC<MessageProps> = props => {
	const { type = 'error', message } = props;
	
  return message ? (
	  <div className={styles.message}>
		  {type === 'error' ? error : null}
		  {type === 'warning' ? warning : null}
		  <span className={styles.content}>{message}</span>
	  </div>
  ) : null;
};

export default Message;
