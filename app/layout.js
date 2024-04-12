import "./globals.css";
import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";

/* UI Components */
import { ConfigProvider } from "antd";
import Foot from "./components/ServerSide/Footer/Footer";
import BackToTop from "./components/ClientSide/BackToTop/BackToTop";
import DisclaimerModal from "./components/ClientSide/DisclaimerModal/DisclaimerModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ImpactU",
  description:
    "Laboratorio de I+D para la evaluación responsable de la investigación en Colombia.",
};

/**
 * RootLayout is a function component that provides a layout for the entire application.
 * It wraps the application in a ConfigProvider component to provide configuration to Ant Design components,
 * and an AntdRegistry component to register Ant Design components for server-side rendering in Next.js.
 * It also includes a Footer component at the bottom of the layout.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components to render within the layout.
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
            <DisclaimerModal />

            <div id="content_container">{children}</div>
            <Foot />
          </AntdRegistry>
        </ConfigProvider>
      </body>
    </html>
  );
}
