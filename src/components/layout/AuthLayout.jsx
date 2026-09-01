export default function AuthLayout({ image, reverse = false, children }) {
  return (
    <div className="grid min-h-[70vh] w-full md:grid-cols-2">
      {!reverse ? (
        <div className="relative hidden min-h-[480px] md:block">
          <img src={image} alt="" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      ) : null}
      <div className={`flex items-center px-6 py-16 md:px-16 ${reverse ? 'md:order-1' : ''}`}>
        {children}
      </div>
      {reverse ? (
        <div className="relative hidden min-h-[480px] md:block">
          <img src={image} alt="" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      ) : null}
    </div>
  )
}
