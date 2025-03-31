import "./globals.css";
import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";

/* Analytics */
import { GoogleAnalytics } from "@next/third-parties/google";

/* UI Components */
import { ConfigProvider } from "antd";
import BackToTop from "./components/ClientSide/BackToTop/BackToTop";
import Foot from "./components/ServerSide/Footer/Footer";
import HeadSearch from "./components/ServerSide/Header/HeaderSearchBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ImpactU",
  description:
    "ImpactU es el laboratorio de I+D líder en evaluación responsable de la investigación en Colombia. Ofrecemos la plataforma CRIS más completa del país, con datos sólidos basados en principios FAIR y Métricas Responsables para impulsar la producción académica.",
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://impactu.colav.co/",
    images: [
      {
        url: "https://impactu.colav.co/media/PreviewIMG.png",
        width: 630,
        height: 630,
        alt: "ImpactU",
      },
    ],
  },
};

/**
 * RootLayout is a function component that provides a layout for the entire application.
 * It wraps the application in a ConfigProvider component to provide configuration to Ant Design components,
 * and an AntdRegistry component to register Ant Design components for server-side rendering in Next.js.
 * It also includes a Footer component at the bottom of the layout.
 *
 * @param {ReactNode} children - The child components to render within the layout.
 * @returns {ReactNode} The rendered layout component.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#F9B250",
              borderRadius: 6,
              fontFamily: "Montserrat",
            },
          }}
        >
          <AntdRegistry>
            <BackToTop />
            <HeadSearch />
            <div id="content_container">{children}</div>
            <Foot />
          </AntdRegistry>
        </ConfigProvider>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
    </html>
  );
}
