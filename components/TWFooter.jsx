import {
  TWHorizontalSpread
} from '.'

const TWFooter = ({ className, children }) => {
  return (
    <div className={`${className} p-3 bg-gray-900 text-white text-xs leading-10`}>
      <TWHorizontalSpread className='sm:px-24'>
        {children}
      </TWHorizontalSpread>
    </div>
  );
}

TWFooter.defaultProps = {
  children: ['child1', 'child2', 'child3'].map(
    (child, index) => <div key={'child-' + index}>{child}</div>
  ),
  className: ""
}

export default TWFooter;