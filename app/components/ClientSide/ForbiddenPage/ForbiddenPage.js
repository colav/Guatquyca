"use client";

/* Next */
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/* UI Library Components */
import { Result, Button } from "antd";

/**
 * ForbiddenPage component
 *
 * Displays a permission denied message and redirects the user to home.
 *
 * @component
 * @returns {JSX.Element}
 */
export default function ForbiddenPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Result
      status="403"
      title="Acceso denegado"
      subTitle="No tienes permisos para acceder a esta sección."
      extra={
        <Button type="primary" onClick={() => router.replace("/")}>
          Ir al inicio
        </Button>
      }
    />
  );
}
