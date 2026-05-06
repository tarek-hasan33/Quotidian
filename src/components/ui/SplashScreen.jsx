import { useEffect, useState } from 'react'

export const SplashScreen = ({ onComplete }) => {
  const [fadingOut, setFadingOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadingOut(true)
      setTimeout(() => {
        onComplete()
      }, 500)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  const handleClick = () => {
    setFadingOut(true)
    setTimeout(() => onComplete(), 500)
  }

  return (
    <div
      onClick={handleClick}
      style={{ 
        zIndex: 9999,
        opacity: fadingOut ? 0 : 1,
        transition: 'opacity 0.5s ease-out'
      }}
      className="fixed inset-0 bg-stone-50 flex flex-col items-center justify-center gap-6 cursor-pointer"
    >
      <h1 className="font-serif text-6xl text-neutral-900 animate-fade-up">
        Quotidian
      </h1>
      <p className="font-serif italic text-base text-neutral-400 max-w-sm text-center animate-fade-up-delay">
        "The only way to do great work is to love what you do."
      </p>
    </div>
  )
}
