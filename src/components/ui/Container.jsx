export default function Container({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag className={`w-full px-3 ${className}`} {...props}>
      {children}
    </Tag>
  )
}
