const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#EAAF63",
              "@info-color": "#35BEAD",
              "@heading-color": "#1E3448",
              "@text-color": "#1E3448",
              "@text-color-secondary": "#6D6D2C",
              "@text-color-inverse": "#DBE6F0",
              "@font-size-base": "16px",
              "@layout-body-background": "#EAEAE6",
              "@layout-header-background": "#39658C",
              "@layout-header-height": "80px",
              "@layout-sider-background": "#162736",
              "@layout-trigger-background": "#0F1A24",
              "@layout-trigger-color": "#EAAF63",
              "@layout-footer-background": "#DCDCD5",
              "@menu-bg": "#1E3448",
              "@menu-item-color": "#DBE6F0",
              "@card-head-background": "#FFE1BB",
              "@link-color": "#9D3715",
              "@tooltip-color": "#FFE1BB",
              "@tabs-card-head-background": "#DCDCD5",
              "@border-color-split": "#DCDCD5",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
