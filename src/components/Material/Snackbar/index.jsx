import React from 'react'

import { getForeground } from '../utils/foreground'

import ClassManager from '../utils/class'


export default class Snackbar extends React.Component {
    render() {
        const {
            background,
            foreground,
            className,
            children,
            disabled,
            darkTheme,
            onClick,
            onMouseEnter,
            onMouseLeave,
            timeout
        } = this.props

        const foregroundColor = getForeground(foreground)

        const rootClass = ClassManager.get('snack-bar raised', [
            className,
            foregroundColor,
            disabled ? 'disabled' : '',
            darkTheme ? 'dark-theme' : ''
        ])

        const style = {
            backgroundColor: background,
            color: foregroundColor
        }

        const events = {
            onClick: onClick,
            onMouseEnter: onMouseEnter,
            onMouseLeave: onMouseLeave
        }

        return (
            <div className={rootClass} style={style} {...events}>
                {children}
            </div>
        )
    }
}



Snackbar.defaultProps = {
    background: '#323232',
    foreground: '#efefef',
    disabled: false,
    darkTheme: false,
    timeout: 4
}