import { Button } from "@/components/ui/button"
import { LightRays } from "@/components/ui/light-rays"
import { Link } from "react-router"

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-5">
      <h1 className="text-3xl">404</h1>
      <p className="text-xl text-muted-foreground">
        A página que você está procurando não existe ou foi removida.
      </p>
      <Link to="/">
        <Button variant="link">Voltar para a página inicial</Button>
      </Link>
      <LightRays />
    </div>
  )
}
