import classes from './Cell.module.css'

function Cell({ 
  value, color, index, indicator=false,
  base=false, stronghold=false, 
  playable=true, visible=true, editable=false,
  onValueChange
}) {
  let classNames = classes['cell']
  if (!playable) {
    classNames += ' ' + classes['system']
  }
  if (!visible) {
    classNames += ' ' + classes['hidden']
  }
  if (indicator) {
    classNames += ' ' + classes['indicator']
  }
  
  return (
    <div
      data-type={
        base 
          ? 'base' 
          : stronghold 
            ? 'stronghold' 
            : null} 
      data-index={index}
      style={{
        '--primaryColor': color ? color[0] : 'white',
        '--secondaryColor': color ? color[1] : 'black'
      }} 
      className={classNames}>
        { 
          <input type="text" disabled={!(playable && editable)} value={ value } onChange={e => {
            const num = Number(e.target.value)
            !Number.isNaN(num) && onValueChange(index, num)
          }}/> 
        }
    </div>
  )
}

export default Cell