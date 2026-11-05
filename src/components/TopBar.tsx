import ThemeToggle from './ThemeToggle'
import LanguageSwitcher from './LanguageSwitcher'

export default function TopBar() {
  return (
    <header className="max-w-xl mx-auto px-5 pt-5 flex flex-wrap justify-between items-center gap-3">
      <ThemeToggle />
      <LanguageSwitcher />
    </header>
  )
}
