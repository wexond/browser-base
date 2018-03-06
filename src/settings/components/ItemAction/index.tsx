import React from 'react'

interface Props {

}

interface State {

}

export default class ItemAction extends React.Component<Props, State> {

  private action: any

  public render(): JSX.Element {
    return (
      <div className='item-action'>
        {React.Children.map(this.props.children, (child) => {
          return React.cloneElement((child), {ref: (r: any) => {
            this.action = r

            const {ref} = child

            if (typeof ref === 'function') {
              ref(r)
            }
            
          }, onClick: (e: any) => { e.stopPropagation() }})
        })}
      </div>
    )
  }
}