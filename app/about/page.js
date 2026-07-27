import { redirect } from "next/navigation";

export const metadata = {
  title: "Acerca de ImpactU",
  description:
    "ImpactU es un laboratorio de I+D que impulsa la evaluación responsable de la investigación en Colombia. Nuestra plataforma CRIS facilita la gestión científica con un enfoque en ciencia abierta y diversidad.",
};

export default function AboutPage() {
  redirect("/about/presentacion");
}
