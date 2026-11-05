import ThemeToggle from './ThemeToggle'
import LanguageSwitcher from './LanguageSwitcher'

export default function TopBar() {
  return (
    <header className="max-w-xl mx-auto px-5 pt-5 flex justify-end items-center gap-2">
      <ThemeToggle />
      <LanguageSwitcher />
    </header>
  )
}
