import "./globals.css";
import { Inter, Montserrat } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";

/* Analytics */
import { GoogleAnalytics } from "@next/third-parties/google";

/* Context */
import { AuthProvider } from "@/app/context/AuthContext";

/* UI Components */
import { ConfigProvider } from "antd";
import BackToTop from "./components/ClientSide/BackToTop/BackToTop";
import HeaderSearchBar from "./components/ServerSide/Header/HeaderSearchBar";
import Foot from "./components/ServerSide/Footer/Footer";

/* Utils */
import ScrollToTop from "@/lib/ScrollToTop";
import "@/lib/utils/dayjsConfig";

/* Sentry */
import * as Sentry from "@sentry/nextjs";

/**
 * Font configuration using next/font to avoid layout shifts
 * and ensure fonts are loaded optimally with Next.js.
 */
const inter = Inter({ subsets: ["latin"] });

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

/**
 * generateMetadata is a function that generates metadata for the application.
 */
export function generateMetadata() {
  return {
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
    other: {
      ...Sentry.getTraceData(),
    },
  };
}

/**
 * RootLayout is a function component that provides a layout for the entire application.
 * It wraps the application in an AntdRegistry component to ensure proper server-side rendering
 * of Ant Design styles in Next.js. Inside it, the ConfigProvider supplies the theme configuration
 * for Ant Design components.
 *
 * The layout also includes global UI elements such as:
 * - ScrollToTop utility
 * - BackToTop floating button
 * - HeaderSearchBar
 * - Footer
 *
 * Additionally, it provides the AuthProvider context to the entire application.
 *
 * @param {ReactNode} children - The child components to render within the layout.
 * @returns {ReactNode} The rendered layout component.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.className} ${montserrat.variable}`}>
        <ScrollToTop />

        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#F9B250",
                borderRadius: 6,
                fontFamily: "var(--font-montserrat)",
              },
            }}
          >
            <AuthProvider>
              <BackToTop />
              <HeaderSearchBar />
              <div id="content_container">{children}</div>
              <Foot />
            </AuthProvider>
          </ConfigProvider>
        </AntdRegistry>

        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  );
}
