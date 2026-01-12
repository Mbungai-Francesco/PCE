import { cn } from "@/lib/utils"
import { Link, useLocation } from "react-router"

interface props{
  className?: string
}
const links = [
  { name: "Accueil", href: "/" },
  { name: "Carte", href: "/carte" },
]

const active = "font-bold underline underline-offset-8"

const Navbar = ({ className }: props) => {
  const location = useLocation();

  return (
    <div className={cn(className, "w-full p-4 flex justify-between")}>
      <p className={cn("font-bold text-2xl text-sky-900/90 bg-white p-2 rounded-lg")}>
        <Link to='/'>CEREMA</Link>
      </p>
      <ul className="flex gap-2 text-lg font-semibold">
        {links.map((link, index) => (
          <li key={index} className={cn(location.pathname === link.href ? active : "")}>
            <Link to={link.href}>{link.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Navbar