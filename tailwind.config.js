/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#fff",
        darkslategray: "#454545",
        black: "#000",
        red: "#ff0000",
        gainsboro: {
          "100": "#e7e7e7",
          "200": "#e6e6e6",
          "300": "#e0e0e0",
        },
        gray: "#828282",
        darkgray: "#aeaeae",
        whitesmoke: "#f5f5f5",
      },
      spacing: {
        "spacing-sm": "32px",
      },
      fontFamily: {
        "small-text": "Inter",
      },
      borderRadius: {
        "71xl": "90px",
      },
    },
    fontSize: {
      base: "16px",
      "21xl": "40px",
      "5xl": "24px",
      "13xl": "32px",
      xl: "20px",
      lgi: "19px",
      "45xl": "64px",
      "19xl": "38px",
      "32xl": "51px",
      "29xl": "48px",
      "17xl": "36px",
      "10xl": "29px",
      "3xl": "22px",
      "181xl": "200px",
      "61xl": "80px",
      "31xl": "50px",
      inherit: "inherit",
    },
    screens: {
      lg: {
        max: "1200px",
      },
      mq1125: {
        raw: "screen and (max-width: 1125px)",
      },
      mq1050: {
        raw: "screen and (max-width: 1050px)",
      },
      mq1000: {
        raw: "screen and (max-width: 1000px)",
      },
      mq750: {
        raw: "screen and (max-width: 750px)",
      },
      mq450: {
        raw: "screen and (max-width: 450px)",
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
};
