// @ts-nocheck
import * as React from "react";
import { View, StyleSheet } from 'react-native';
import Svg, {
  Path,
  G,
  Defs,
  Stop,
  LinearGradient
} from 'react-native-svg';

const SVGBodyScreen = () => {
  const handlePress = (_muscle: string) => {};

  return (
    <View style={styles.container}>
      <Svg
        width={320}
        height={600}
        viewBox="0 0 320 600"
      >
            <defs id="defs2">
              <linearGradient id="linearGradient1793">
                <stop
                  id="stop1789"
                  offset="0"
                  stopColor="#a45e49"
                  stopOpacity="1"
                ></stop>
                <stop
                  id="stop1791"
                  offset="1"
                  stopColor="#adbec7"
                  stopOpacity="1"
                ></stop>
              </linearGradient>
              <linearGradient id="linearGradient1786">
                <stop
                  id="stop1782"
                  offset="0"
                  stopColor="#a45e49"
                  stopOpacity="1"
                ></stop>
                <stop
                  id="stop1784"
                  offset="1"
                  stopColor="#a45e49"
                  stopOpacity="0"
                ></stop>
              </linearGradient>
              <linearGradient id="linearGradient1760">
                <stop
                  id="stop1756"
                  offset="0"
                  stopColor="#a45e49"
                  stopOpacity="1"
                ></stop>
                <stop
                  id="stop1758"
                  offset="1"
                  stopColor="#a45e49"
                  stopOpacity="0"
                ></stop>
              </linearGradient>
              <linearGradient id="linearGradient1124">
                <stop
                  id="stop1120"
                  offset="0"
                  stopColor="#dbd5c7"
                  stopOpacity="1"
                ></stop>
                <stop
                  id="stop1122"
                  offset="1"
                  stopColor="#e5ecef"
                  stopOpacity="1"
                ></stop>
              </linearGradient>
              <linearGradient id="linearGradient1119">
                <stop
                  id="stop1115"
                  offset="0"
                  stopColor="#a35c47"
                  stopOpacity="1"
                ></stop>
                <stop
                  id="stop1117"
                  offset="1"
                  stopColor="#b7c6ce"
                  stopOpacity="1"
                ></stop>
              </linearGradient>
              <linearGradient id="linearGradient1022">
                <stop
                  id="stop1018"
                  offset="0"
                  stopColor="#f39079"
                  stopOpacity="1"
                ></stop>
                <stop
                  id="stop1020"
                  offset="1"
                  stopColor="#eef2f3"
                  stopOpacity="1"
                ></stop>
              </linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient1024"
                x1="-8.894"
                x2="-9.674"
                y1="-125.835"
                y2="-122.921"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1119"
                id="linearGradient1113"
                x1="-4.866"
                x2="-11.056"
                y1="-114.716"
                y2="-102.243"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient1180"
                x1="5.295"
                x2="7.81"
                y1="-153.255"
                y2="-149.326"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient948"
                x1="52.719"
                x2="53.588"
                y1="-210.341"
                y2="-203.86"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1124"
                id="linearGradient1126"
                x1="33.409"
                x2="45.169"
                y1="-117.732"
                y2="-121.741"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient1241"
                x1="52.719"
                x2="53.588"
                y1="-210.341"
                y2="-203.86"
                gradientTransform="matrix(-1 0 0 1 117.418 0)"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient1243"
                x1="52.719"
                x2="53.588"
                y1="-210.341"
                y2="-203.86"
                gradientTransform="matrix(-1 0 0 1 117.418 0)"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient1302"
                x1="44.901"
                x2="43.966"
                y1="-248.962"
                y2="-245.754"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient1594"
                x1="52.719"
                x2="53.588"
                y1="-210.341"
                y2="-203.86"
                gradientTransform="matrix(-1 0 0 1 117.418 0)"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient1596"
                x1="52.719"
                x2="53.588"
                y1="-210.341"
                y2="-203.86"
                gradientTransform="matrix(-.96551 0 0 1.00185 115.163 .435)"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient1631"
                x1="52.719"
                x2="53.588"
                y1="-210.341"
                y2="-203.86"
                gradientTransform="matrix(-1 0 0 1 117.418 0)"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2167"
                x1="-25.966"
                x2="-27.448"
                y1="-90.187"
                y2="-88.978"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2169"
                x1="-25.966"
                x2="-27.448"
                y1="-90.187"
                y2="-88.978"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2171"
                x1="-25.966"
                x2="-27.448"
                y1="-90.187"
                y2="-88.978"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2173"
                x1="-25.966"
                x2="-27.448"
                y1="-90.187"
                y2="-88.978"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2175"
                x1="-25.966"
                x2="-27.448"
                y1="-90.187"
                y2="-88.978"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2177"
                x1="-25.966"
                x2="-27.448"
                y1="-90.187"
                y2="-88.978"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2179"
                x1="-25.966"
                x2="-27.448"
                y1="-90.187"
                y2="-88.978"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2181"
                x1="-25.966"
                x2="-27.448"
                y1="-90.187"
                y2="-88.978"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2183"
                x1="-25.966"
                x2="-27.448"
                y1="-90.187"
                y2="-88.978"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2185"
                x1="-25.966"
                x2="-27.448"
                y1="-90.187"
                y2="-88.978"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2187"
                x1="52.719"
                x2="53.588"
                y1="-210.341"
                y2="-203.86"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2189"
                x1="52.719"
                x2="53.588"
                y1="-210.341"
                y2="-203.86"
                gradientTransform="matrix(-1 0 0 1 117.418 0)"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2193"
                x1="-8.894"
                x2="-9.674"
                y1="-125.835"
                y2="-122.921"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2195"
                x1="-8.894"
                x2="-9.674"
                y1="-125.835"
                y2="-122.921"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2197"
                x1="-8.894"
                x2="-9.674"
                y1="-125.835"
                y2="-122.921"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2199"
                x1="52.719"
                x2="53.588"
                y1="-210.341"
                y2="-203.86"
                gradientTransform="matrix(-1 0 0 1 117.418 0)"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2201"
                x1="52.719"
                x2="53.588"
                y1="-210.341"
                y2="-203.86"
                gradientTransform="matrix(-1 0 0 1 117.418 0)"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2264"
                x1="42.095"
                x2="42.629"
                y1="13.497"
                y2="17.373"
                gradientTransform="translate(-.794)"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2266"
                x1="42.095"
                x2="42.629"
                y1="13.497"
                y2="17.373"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2268"
                x1="42.095"
                x2="42.629"
                y1="13.497"
                y2="17.373"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2270"
                x1="51.736"
                x2="50.38"
                y1="-30.075"
                y2="-29.834"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1760"
                id="linearGradient2272"
                x1="51.273"
                x2="49.521"
                y1="-25.9"
                y2="-25.316"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2274"
                x1="51.803"
                x2="50.076"
                y1="-36.055"
                y2="-35.427"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1786"
                id="linearGradient2276"
                x1="50.614"
                x2="49.913"
                y1="-30.87"
                y2="-30.101"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2278"
                x1="41.754"
                x2="41.537"
                y1="-46.856"
                y2="-26.39"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2280"
                x1="56.587"
                x2="58.613"
                y1="-96.168"
                y2="-98.132"
                gradientTransform="translate(-2.646)"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2282"
                x1="41.754"
                x2="42.577"
                y1="-46.856"
                y2="-44.344"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2284"
                x1="26.787"
                x2="26.006"
                y1="-96.435"
                y2="-91.784"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2286"
                x1="52.535"
                x2="55.576"
                y1="-68.092"
                y2="-55.574"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2422"
                x1="52.218"
                x2="51.85"
                y1="-258.683"
                y2="-262.525"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2218"
                x1="69.233"
                x2="68.321"
                y1="183.726"
                y2="180.641"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient2362"
                x1="69.233"
                x2="68.321"
                y1="183.726"
                y2="180.641"
                gradientTransform="rotate(27.61 116.511 316.749)"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3020"
                x1="65.678"
                x2="64.667"
                y1="363.714"
                y2="367.915"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3160"
                x1="74.19"
                x2="79.275"
                y1="378.988"
                y2="372.362"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3415"
                x1="65.643"
                x2="63.865"
                y1="442.782"
                y2="461.105"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3689"
                x1="69.233"
                x2="68.321"
                y1="183.726"
                y2="180.641"
                gradientTransform="translate(0 2.646)"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3691"
                x1="69.233"
                x2="68.321"
                y1="183.726"
                y2="180.641"
                gradientTransform="translate(0 2.646)"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3746"
                x1="75.223"
                x2="80.884"
                y1="312.717"
                y2="317.874"
                gradientTransform="translate(-.063 2.646)"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3748"
                x1="69.233"
                x2="68.321"
                y1="183.726"
                y2="180.641"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3750"
                x1="69.459"
                x2="62.533"
                y1="361.89"
                y2="364.268"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3752"
                x1="69.233"
                x2="68.321"
                y1="183.726"
                y2="180.641"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3754"
                x1="69.459"
                x2="62.533"
                y1="361.89"
                y2="364.268"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3756"
                x1="73.336"
                x2="74.72"
                y1="340.517"
                y2="346.303"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3758"
                x1="70.793"
                x2="67.78"
                y1="354.597"
                y2="356.975"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3760"
                x1="69.233"
                x2="68.321"
                y1="183.726"
                y2="180.641"
                gradientTransform="rotate(16.695 117.072 318.33)"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3762"
                x1="69.233"
                x2="68.321"
                y1="183.726"
                y2="180.641"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3764"
                x1="128.396"
                x2="130.286"
                y1="322.814"
                y2="322.391"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3766"
                x1="69.233"
                x2="68.321"
                y1="183.726"
                y2="180.641"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3768"
                x1="82.142"
                x2="87.11"
                y1="321.585"
                y2="327.434"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3770"
                x1="119.151"
                x2="119.739"
                y1="313.62"
                y2="316.351"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1793"
                id="linearGradient3772"
                x1="116.73"
                x2="120.873"
                y1="309.431"
                y2="328.14"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3774"
                x1="69.233"
                x2="68.321"
                y1="183.726"
                y2="180.641"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3776"
                x1="82.366"
                x2="78.242"
                y1="240.822"
                y2="242.864"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3778"
                x1="74.711"
                x2="77.632"
                y1="234.025"
                y2="233.868"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3780"
                x1="79.271"
                x2="76.343"
                y1="233.807"
                y2="234.37"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3782"
                x1="69.233"
                x2="68.321"
                y1="183.726"
                y2="180.641"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3784"
                x1="119.151"
                x2="119.739"
                y1="313.62"
                y2="316.351"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1793"
                id="linearGradient3786"
                x1="116.73"
                x2="120.873"
                y1="309.431"
                y2="328.14"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3788"
                x1="119.151"
                x2="119.739"
                y1="313.62"
                y2="316.351"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1793"
                id="linearGradient3790"
                x1="116.73"
                x2="120.873"
                y1="309.431"
                y2="328.14"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3792"
                x1="69.233"
                x2="68.321"
                y1="183.726"
                y2="180.641"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3794"
                x1="69.233"
                x2="68.321"
                y1="183.726"
                y2="180.641"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3796"
                x1="69.233"
                x2="68.321"
                y1="183.726"
                y2="180.641"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3798"
                x1="69.233"
                x2="68.321"
                y1="183.726"
                y2="180.641"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3800"
                x1="69.233"
                x2="68.321"
                y1="183.726"
                y2="180.641"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3802"
                x1="69.233"
                x2="68.321"
                y1="183.726"
                y2="180.641"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3804"
                x1="69.233"
                x2="68.321"
                y1="183.726"
                y2="180.641"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3806"
                x1="69.233"
                x2="68.321"
                y1="183.726"
                y2="180.641"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3808"
                x1="69.233"
                x2="68.321"
                y1="183.726"
                y2="180.641"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3810"
                x1="69.233"
                x2="68.321"
                y1="183.726"
                y2="180.641"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3812"
                x1="69.233"
                x2="68.321"
                y1="183.726"
                y2="180.641"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <linearGradient
                xlinkHref="#linearGradient1022"
                id="linearGradient3814"
                x1="69.233"
                x2="68.321"
                y1="183.726"
                y2="180.641"
                gradientUnits="userSpaceOnUse"
              ></linearGradient>
              <clipPath id="clipPath1234" clipPathUnits="userSpaceOnUse">
                <use
                  xlinkHref="#path1304-3"
                  id="use1236"
                  width="100%"
                  height="100%"
                  x="0"
                  y="0"
                  strokeWidth="1"
                  transform="translate(-.111)"
                ></use>
              </clipPath>
              <clipPath id="clipPath1428" clipPathUnits="userSpaceOnUse">
                <use
                  xlinkHref="#path1268"
                  id="use1430"
                  width="100%"
                  height="100%"
                  x="0"
                  y="0"
                  strokeWidth="1"
                ></use>
              </clipPath>
              <clipPath id="clipPath1901" clipPathUnits="userSpaceOnUse">
                <path
                  id="use1903"
                  fill="url(#linearGradient2218)"
                  fillOpacity="1"
                  stroke="none"
                  strokeDasharray="none"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit="4"
                  strokeOpacity="1"
                  strokeWidth="0.5"
                  d="M59.167 315.238s.38-.791 1.954-4.049c1.018-2.104 3.157-3.875 3.926-5.466 1.96-4.054.969-2.439.969-2.439l1.37-5.212c.456-1.737 2.338-3.63 3.507-5.445s7.317-3.675 7.317-3.675l1.27-3.074c.422-1.025 2.205-2.74 3.307-4.11s2.806-2.716 4.21-4.075c1.402-1.359 1.648-4.165 2.471-6.247.824-2.083.58-9.934.87-14.9.288-4.968.834-6.983.834-6.983l1.203-8.753-4.41 4.376c-1.47 1.459-6.347 1.114-9.521 1.67-3.174.557-11.159-3.507-11.159-3.507l-6.59 16.473c-2.198 5.49-1.528 8.069-1.528 8.069"
                  stopColor="#000"
                  style={{ fontVariationSettings: "normal" }}
                  vectorEffect="none"
                ></path>
              </clipPath>
              <clipPath id="clipPath1349" clipPathUnits="userSpaceOnUse">
                <path
                  id="path1351"
                  fill="#fde8cc"
                  fillOpacity="1"
                  stroke="#e7be9b"
                  strokeDasharray="none"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit="4"
                  strokeOpacity="1"
                  strokeWidth="0.5"
                  d="M58.255-266.379a17.8 17.8 0 0 0-7.022 1.323c-3.12 1.278-5.899 3.514-7.513 6.473-1.66 3.044-2.007 6.667-1.606 10.11.203 1.745.587 3.462.85 5.198.477 3.139.556 6.338.236 9.497l4.158 4.4 10.901-.172 10.901.172 4.157-4.4c-.32-3.16-.24-6.358.237-9.497.263-1.736.647-3.453.85-5.197.4-3.444.054-7.067-1.606-10.111-1.614-2.96-4.394-5.195-7.513-6.473a17.8 17.8 0 0 0-7.022-1.323z"
                  opacity="1"
                  stopColor="#000"
                  stopOpacity="1"
                  style={{ fontVariationSettings: "normal" }}
                  vectorEffect="none"
                ></path>
              </clipPath>
            </defs>
            <g
              id="layer2"
              display="inline"
              opacity="1"
              transform="translate(43.958 276.631)"
            >
              <g id="g4116">
                <path
                  id="chest"
                  fill="red"
                  fillOpacity="1"
                  stroke="#000"
                  strokeLinecap="butt"
                  strokeLinejoin="miter"
                  strokeOpacity="1"
                  strokeWidth="0.265"
                  d="m38.42-206.867 13.898-18.308 13.764.936 4.811 23.052-2.539 41.226-17.84.602z"
                  onPress={() => handlePress('chest')}
                  display="inline"
                  opacity="1"
                ></path>
                <path
                  id="path2205"
                  fill="#e5ecef"
                  fillOpacity="1"
                  stroke="#adbec7"
                  strokeDasharray="none"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit="4"
                  strokeOpacity="1"
                  strokeWidth="0.4"
                  d="m55.562-219.888 5.198.331.945 16.348-1.418 3.07-4.441-.283-.567-4.016z"
                  display="inline"
                  opacity="1"
                  stopColor="#000"
                  stopOpacity="1"
                  style={{ fontVariationSettings: "normal" }}
                  vectorEffect="none"
                ></path>
                <g id="g2262" display="inline" opacity="1" transform="translate(.326)">
                  <use
                    xlinkHref="#g2108"
                    id="use2110"
                    width="100%"
                    height="100%"
                    x="0"
                    y="0"
                    transform="matrix(-1 0 0 1 115.865 0)"
                  ></use>
                  <g
                    id="g2108"
                    fillOpacity="1"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                  >
                    <path
                      id="path2063"
                      fill="#dbd5c7"
                      stroke="#a6a29a"
                      strokeWidth="0.5"
                      d="M34.945 55.225q.067.993.034 1.987c-.016.471-.048.944-.15 1.404-.044.193-.1.385-.127.581-.027.197-.026.402.043.588.038.103.097.2.177.274s.182.129.29.143a.6.6 0 0 0 .398-.1c.116-.077.21-.185.288-.3.29-.428.384-.954.568-1.437.138-.363.329-.704.5-1.052q.38-.77.635-1.587c.065.481.076.97.034 1.453-.04.465-.13.925-.2 1.386-.062.404-.11.811-.117 1.22-.01.524.046 1.055-.05 1.57-.034.178-.086.352-.118.53a1.3 1.3 0 0 0 0 .54c.03.112.082.219.159.305.077.087.18.152.292.179.13.03.267.008.388-.046a1 1 0 0 0 .314-.238c.198-.217.323-.49.411-.77.09-.28.145-.568.224-.85.092-.333.217-.66.25-1.003.028-.28-.006-.563-.034-.844-.029-.28-.05-.566.001-.843a1.6 1.6 0 0 1 .317-.702c.111.477.173.965.184 1.454.01.462-.024.924-.033 1.386-.018.832.044 1.676-.134 2.489-.047.216-.111.428-.154.644-.044.217-.066.441-.03.659.04.24.151.464.283.67.13.205.283.397.419.6.104.155.2.32.338.444a.7.7 0 0 0 .238.145c.089.03.186.037.276.012a.5.5 0 0 0 .186-.105.7.7 0 0 0 .131-.17c.069-.127.102-.27.134-.41.152-.677.28-1.362.317-2.055.042-.75-.022-1.505.034-2.255.06-.814.26-1.611.35-2.422.031-.274.051-.555.165-.807a.9.9 0 0 1 .243-.33.63.63 0 0 1 .378-.15.6.6 0 0 1 .334.092c.1.06.184.146.25.243.151.222.204.5.204.768 0 .27-.05.536-.087.802-.11.804-.1 1.628.067 2.422.133.637.365 1.256.418 1.905.039.488-.026.983-.167 1.453-.08.266-.185.525-.255.795-.07.269-.106.553-.046.825.065.293.247.563.508.712.13.075.278.118.428.123a.86.86 0 0 0 .434-.1c.153-.083.276-.213.37-.36s.159-.31.214-.475c.237-.7.308-1.453.234-2.188-.038-.384-.116-.768-.083-1.153.038-.458.23-.888.334-1.336.214-.931.04-1.901.016-2.857a9.1 9.1 0 0 1 .785-3.925 2.61 2.61 0 0 1 1.487 1.887c.127.698-.04 1.416-.267 2.088-.132.392-.286.778-.377 1.18-.09.404-.115.832.01 1.226.095.303.274.57.447.837s.344.542.421.85c.106.423.025.868.05 1.303.016.274.077.549.208.79.132.241.338.446.594.546.307.12.665.077.953-.084.287-.16.505-.431.634-.734.14-.33.179-.692.183-1.05.004-.357-.026-.714-.016-1.072.023-.845.266-1.677.234-2.522-.036-.956-.423-1.886-.351-2.84.045-.594.266-1.162.334-1.754s-.02-1.196-.184-1.77a7 7 0 0 0-1.303-2.506l-14.164.793z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path2043"
                      fill="#dbd5c7"
                      stroke="#a6a29a"
                      strokeWidth="0.5"
                      d="M38.506 42.853a29 29 0 0 1-1.11 2.008c-.683 1.127-1.453 2.23-1.819 3.496a6 6 0 0 0-.142 2.693l4.63-3.33 1.11-6.048z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="left-shoulder"
                      fill="#f39079"
                      stroke="#a45e49"
                      strokeWidth="0.5"
                      d="M36.917 56.895a2.56 2.56 0 0 1-1.22-.48 2.56 2.56 0 0 1-.818-1.023c-.194-.44-.26-.928-.254-1.408.005-.48.079-.958.153-1.432.172-1.089.358-2.198.87-3.174a5.23 5.23 0 0 1 2.839-2.472l.601 4.677a6.4 6.4 0 0 0-1.87 2.806 6.4 6.4 0 0 0-.301 2.506"
                      onPress={() => handlePress('left-shoulder')}
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="left-upper-arm"
                      fill="#f39079"
                      stroke="#a45e49"
                      strokeWidth="0.5"
                      d="M39.756 41.727a16.3 16.3 0 0 0-1.436 3.275 13.6 13.6 0 0 0-.635 3.507c-.07 1.742.247 3.473.367 5.212a23 23 0 0 1-.1 4.276 7.76 7.76 0 0 1 1.537-3.307 440 440 0 0 1 .835 5.88 21 21 0 0 1 1.47-5.913c.507.283.946.687 1.27 1.169.629.937.81 2.125 1.47 3.04.356.494.846.89 1.403 1.136.342-1 .599-2.03.768-3.074.213-1.313.287-2.645.334-3.975.1-2.77.082-5.585-.668-8.252a15.4 15.4 0 0 0-1.436-3.441z"
                      onPress={() => handlePress('left-upper-arm')}
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="left-forearm"
                      fill="#f39079"
                      stroke="#a45e49"
                      strokeWidth="0.5"
                      d="M47.374 37.919q.78 2.37 1.436 4.777c.552 2.023 1.04 4.068 1.303 6.148.205 1.618.273 3.25.4 4.877q.228 2.889.703 5.746a2.48 2.48 0 0 1-1.972-.167c-.48-.262-.857-.677-1.202-1.102a15.3 15.3 0 0 1-1.938-3.074l-1.403-17.339Z"
                      onPress={() => handlePress('left-forearm')}
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1983"
                      fill="#e5ecef"
                      stroke="#adbec7"
                      strokeWidth="0.4"
                      d="m39.857 30.602 4.109-.4a54.5 54.5 0 0 1 1.77 7.617c.454 2.873.679 5.786 1.337 8.62.654 2.816 1.733 5.532 2.205 8.385.305 1.844.361 3.763 1.102 5.479.147.339.319.667.441 1.016s.193.725.127 1.088c-.05.28-.186.55-.404.734a1 1 0 0 1-.376.197.85.85 0 0 1-.422.005 1 1 0 0 1-.498-.32 1.9 1.9 0 0 1-.304-.515c-.433-1.03-.335-2.191-.334-3.308 0-3.11-.815-6.16-1.771-9.12-.713-2.209-1.514-4.404-2.673-6.415a20 20 0 0 0-3.174-4.142z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1943"
                      fill="#dbd5c7"
                      stroke="#a6a29a"
                      strokeWidth="0.5"
                      d="M37.798 33.522q-.445 1.111-.756 2.268c-.153.565-.282 1.141-.314 1.726s.037 1.184.266 1.723c.212.495.558.933.993 1.252l3.472-2.67-.756-6.662z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1963"
                      fill="#e5ecef"
                      stroke="#adbec7"
                      strokeWidth="0.4"
                      d="m39.12 31.207 1.583-.378q.572 4.274 1.276 8.528a283 283 0 0 0 2.67 13.938c.478 2.2.986 4.45.708 6.685-.102.821-.31 1.627-.408 2.448-.099.822-.084 1.682.243 2.442.078.183.174.36.23.55q.045.144.046.295c0 .1-.02.2-.064.29a.65.65 0 0 1-.423.333.86.86 0 0 1-.545-.05.9.9 0 0 1-.24-.15.6.6 0 0 1-.162-.228.76.76 0 0 1-.026-.42c.026-.139.076-.273.12-.407a8 8 0 0 0 .331-1.56c.258-2.046.072-4.122-.212-6.165-.31-2.224-.735-4.43-1.134-6.638a292 292 0 0 1-1.11-6.568 90 90 0 0 1-.024 4.134c-.07 2.451-.241 4.898-.354 7.347-.07 1.522-.121 3.06-.496 4.536-.138.543-.32 1.075-.418 1.626-.099.552-.11 1.134.087 1.658.08.213.194.414.27.629.038.107.067.219.076.333a.8.8 0 0 1-.04.337.67.67 0 0 1-.418.408.635.635 0 0 1-.768-.347 1 1 0 0 1-.088-.303c-.028-.21-.001-.422.023-.632.073-.637.129-1.275.189-1.914.322-3.433.77-6.856.945-10.3a65.5 65.5 0 0 0-.095-8.173q-.198 2.249-.472 4.488c-.318 2.598-.713 5.192-1.37 7.725-.199.764-.42 1.524-.545 2.303-.125.78-.149 1.587.049 2.351.087.338.217.669.232 1.017.008.174-.014.351-.082.512a.78.78 0 0 1-.34.385.644.644 0 0 1-.874-.26.76.76 0 0 1-.082-.345 1.2 1.2 0 0 1 .052-.353c.065-.23.174-.444.243-.672.167-.554.089-1.147.071-1.725-.06-1.977.605-3.893 1.087-5.811.567-2.264.885-4.59.945-6.922a14.8 14.8 0 0 1-.922 3.213c-.506 1.22-1.173 2.367-1.724 3.567-.586 1.276-1.047 2.67-.874 4.063.046.374.138.743.14 1.12.001.188-.02.378-.08.557-.06.178-.158.346-.297.473a.73.73 0 0 1-.31.175.5.5 0 0 1-.351-.033.5.5 0 0 1-.223-.244.75.75 0 0 1-.061-.328c.005-.225.086-.44.142-.657.216-.826.093-1.7.166-2.551.082-.971.419-1.905.834-2.787.416-.881.912-1.723 1.339-2.6a19 19 0 0 0 1.205-3.165c.932-3.314.955-6.814.78-10.252a93 93 0 0 0-.45-5.528"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1887"
                      fill="url(#linearGradient2264)"
                      stroke="#a45e49"
                      strokeWidth="0.5"
                      d="M35.545-27.473a64 64 0 0 0-1.961 4.956c-2.792 8.01-3.975 16.644-2.876 25.056.844 6.46 3 12.662 4.847 18.91q1.5 5.076 2.74 10.222l1.67-.267a113.5 113.5 0 0 1-.401-19.978L37.76-27.328"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1848"
                      fill="url(#linearGradient2266)"
                      stroke="#a45e49"
                      strokeWidth="0.5"
                      d="M35.63-27.662a302 302 0 0 0-1.252 5.145c-1.925 8.216-3.513 16.662-2.64 25.056.673 6.463 2.782 12.674 4.61 18.91a226 226 0 0 1 2.74 10.222l1.67-.267a113.5 113.5 0 0 1-.4-19.978l-1.804-38.754"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1828"
                      fill="#dbd5c7"
                      stroke="#a6a29a"
                      strokeWidth="0.5"
                      d="M35.58-26.827a9.6 9.6 0 0 1 .435-3.24c.106-.34.234-.676.434-.97a2.42 2.42 0 0 1 1.669-1.009 2.76 2.76 0 0 1 1.906.475c.552.38.967.954 1.166 1.595.2.64.184 1.344-.03 1.98a3.3 3.3 0 0 1-.939 1.415c-.428.38-.957.646-1.517.763a3.3 3.3 0 0 1-1.696-.09 3.3 3.3 0 0 1-1.428-.92"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1790"
                      fill="url(#linearGradient2268)"
                      stroke="#a45e49"
                      strokeWidth="0.5"
                      d="M37.217-28.498q-.372 3.09-.735 6.181c-.721 6.147-1.417 12.323-1.202 18.508.21 6.05 1.298 12.076 3.34 17.774.94 2.621 2.079 5.17 2.94 7.817a39.6 39.6 0 0 1 1.804 8.954l2.005.267.535-45.235-3.675-14.934"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1734"
                      fill="#f39079"
                      stroke="#a45e49"
                      strokeWidth="0.5"
                      d="M51.783-27.93q.718 4.809 1.404 9.622c.508 3.567 1.004 7.158.868 10.758-.198 5.275-1.742 10.392-3.073 15.501a200 200 0 0 0-4.076 19.645q-.365-7.488-.869-14.968c-.608-9.033-1.36-18.207.535-27.06a46.2 46.2 0 0 1 5.211-13.498"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1714"
                      fill="#dbd5c7"
                      stroke="#a6a29a"
                      strokeWidth="0.5"
                      d="M42.429-18.642q.42 1.776.755 3.57c.985 5.29 1.4 10.683 1.323 16.064-.067 4.682-.503 9.352-.615 14.033-.08 3.386.01 6.775.19 10.158.13 2.472.315 4.97 1.086 7.323.339 1.033.794 2.055.827 3.142.021.699-.135 1.402-.036 2.094.05.347.166.69.38.965.215.276.536.48.884.508.234.019.47-.04.675-.153s.379-.278.516-.467c.275-.379.402-.844.488-1.303.27-1.428.202-2.902-.025-4.337-.404-2.562-1.304-5.024-1.724-7.583-.591-3.597-.22-7.271-.095-10.914.107-3.102.033-6.206-.047-9.308-.156-5.998-.333-12.045.708-17.954a44 44 0 0 1 1.158-4.903l-4.89-6.058z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1901"
                      fill="#e5ecef"
                      stroke="#adbec7"
                      strokeWidth="0.4"
                      d="M43.298 30.87a19.4 19.4 0 0 0 1.035 4.476c.754 2.09 1.86 4.032 3.04 5.914a79 79 0 0 0 2.239 3.374l.1-.969A30.04 30.04 0 0 1 44.98 30.41Z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1694"
                      fill="#e5ecef"
                      stroke="#adbec7"
                      strokeWidth="0.4"
                      d="M39.823-29.6a71.4 71.4 0 0 0 2.606 10.958c.137-.36.369-.683.666-.928s.658-.41 1.038-.475c.655-.113 1.326.073 1.938.334a8 8 0 0 1 2.806 2.004 17.7 17.7 0 0 0 1.403-4.376c.525-2.885.316-5.901-.601-8.686l-10.357-.1Z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1593"
                      fill="url(#linearGradient2270)"
                      stroke="url(#linearGradient2272)"
                      strokeWidth="0.5"
                      d="M48.61-20.38q.763-1.078 1.503-2.17c1.003-1.482 1.98-2.995 2.673-4.645a15.33 15.33 0 0 0 1.002-8.285l-4.176 4.544-.635 3.775a65 65 0 0 1-.367 6.782"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1589"
                      fill="url(#linearGradient2274)"
                      stroke="url(#linearGradient2276)"
                      strokeWidth="0.5"
                      d="M47.941-36.716c.478 1.218.783 2.505.903 3.808.116 1.276.056 2.561.066 3.842q.008.953.067 1.905a4.77 4.77 0 0 0 2.339-1.77c.627-.902.92-1.988 1.403-2.974.357-.73.82-1.41 1.102-2.172.52-1.403.385-2.95.468-4.443.06-1.072.235-2.136.3-3.207a15.8 15.8 0 0 0-.6-5.38l-3.91 4.143z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1585"
                      fill="#e5ecef"
                      stroke="#adbec7"
                      strokeWidth="0.4"
                      d="M35.814-38.988a40.6 40.6 0 0 1 .635 7.951 18 18 0 0 1 3.734 3.539 17.5 17.5 0 0 1 .409-9.185z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1554"
                      fill="url(#linearGradient2278)"
                      stroke="#a45e49"
                      strokeWidth="0.5"
                      d="M55.659-58.465q-.09 2.561-.291 5.117c-.243 3.081-.61 6.157-1.246 9.182-.493 2.342-1.153 4.665-2.205 6.815-.214.437-.446.87-.759 1.244-.312.373-.712.687-1.179.827a1.98 1.98 0 0 1-1.56-.19 1.98 1.98 0 0 1-.912-1.28l-6.682.535-1.87-.468-4.595-6.989a1465 1465 0 0 1-8.303-23.076L24.99-86.996l18.04-2.472 8.62 17.105z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1440"
                      fill="url(#linearGradient2280)"
                      stroke="#a45e49"
                      strokeWidth="0.5"
                      d="M53.721-68.02a7.2 7.2 0 0 0 1.136-2.472c.271-1.11.274-2.266.267-3.408-.025-4.588-.163-9.177-.066-13.764.058-2.764.205-5.553.935-8.219a19.3 19.3 0 0 1 1.67-4.143l-11.425-7.684-7.618-7.75-5.345-2.072.267 8.553 9.355 23.987z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1504"
                      fill="none"
                      stroke="#a45e49"
                      strokeWidth="0.5"
                      d="M54.192-100.022c-.93 1.275-1.65 2.7-2.126 4.205-.722 2.285-.87 4.705-1.134 7.087a72 72 0 0 1-1.323 7.89"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1366"
                      fill="url(#linearGradient2282)"
                      stroke="#a45e49"
                      strokeWidth="0.5"
                      d="M26.93-90.336q.744 4.47 1.23 8.977c.359 3.34.612 6.696 1.133 10.016a63.4 63.4 0 0 0 5.197 16.98c1.473 3.15 3.209 6.192 4.347 9.478.79 2.28 1.286 4.674 1.323 7.087a19.2 19.2 0 0 1-.661 5.292 7.2 7.2 0 0 1 3.496-2.173 7.24 7.24 0 0 1 5.67.85 404 404 0 0 1-.946-3.024c-1.015-3.295-1.99-6.614-2.55-10.016-.75-4.55-.745-9.193-.473-13.796.211-3.59.584-7.19.283-10.772-.341-4.067-1.54-8.006-2.74-11.907a2805 2805 0 0 0-7.654-24.474l-8.032 1.04z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1508"
                      fill="none"
                      stroke="#a45e49"
                      strokeWidth="0.5"
                      d="M51.594-102.384a15.3 15.3 0 0 0-2.646 3.354c-.791 1.358-1.367 2.828-2.032 4.252a37 37 0 0 1-2.929 5.15"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1411"
                      fill="#e5ecef"
                      stroke="none"
                      strokeWidth="0.4"
                      d="M29.718-97.518a3.8 3.8 0 0 0 .567 3.402c.198.263.432.504.567.803.164.363.167.776.142 1.173-.024.397-.072.798 0 1.19.053.285.169.56.189.85.02.297-.06.591-.147.876-.086.286-.18.574-.184.872-.003.251.058.5.155.732.098.23.232.445.378.65.294.407.641.778.885 1.217.206.372.332.782.486 1.179s.343.791.648 1.089c.177.172.387.306.584.455.198.148.388.318.502.537.137.261.155.57.283.837a.73.73 0 0 0 .286.328c.065.036.137.06.21.063a.4.4 0 0 0 .214-.047.4.4 0 0 0 .164-.178.6.6 0 0 0 .058-.237c.007-.164-.04-.324-.08-.483-.118-.447-.2-.912-.142-1.37.053-.421.223-.818.33-1.228.284-1.088.121-2.234.047-3.355-.054-.833-.058-1.67-.094-2.504-.042-.992-.129-1.984-.094-2.977a12.3 12.3 0 0 1 .472-2.976l-2.268-10.017-3.496-.094z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1286"
                      fill="#f39079"
                      stroke="#a45e49"
                      strokeWidth="0.5"
                      d="M25.419-126.315c-.161.826-.382 1.64-.662 2.433-.382 1.086-.877 2.159-.945 3.308-.065 1.12.284 2.219.638 3.283q.629 1.886 1.3 3.756l1.535-10.937z"
                      display="inline"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1307"
                      fill="url(#linearGradient2284)"
                      stroke="#a45e49"
                      strokeWidth="0.5"
                      d="M26.647-124.874a420 420 0 0 0-1.559 11.387c-.757 6.153-1.378 12.327-1.653 18.52-.286 6.422-.198 12.874.618 19.25.883 6.901 2.617 13.683 4.963 20.233 1.322 3.69 2.837 7.308 4.29 10.948.584 1.462 1.16 2.933 1.928 4.308.766 1.374 1.735 2.66 2.989 3.612.35.265.721.504 1.122.685a.9.9 0 0 0 .242.078.4.4 0 0 0 .127-.004.3.3 0 0 0 .115-.05.3.3 0 0 0 .09-.124.4.4 0 0 0 .023-.153.7.7 0 0 0-.1-.29c-.201-.35-.528-.606-.828-.875-1.847-1.658-2.833-4.045-3.754-6.35-2.293-5.739-4.55-11.5-6.374-17.405-1.655-5.358-2.963-10.928-2.6-16.524.243-3.739 1.225-7.387 2.275-10.984 1.54-5.277 3.245-10.553 3.779-16.024.52-5.327-.1-10.762-1.804-15.836z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1512"
                      fill="none"
                      stroke="#a45e49"
                      strokeWidth="0.5"
                      d="M45.593-107.487a15 15 0 0 0-2.315 2.74c-.49.745-.912 1.533-1.417 2.268a12 12 0 0 1-1.607 1.89"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1516"
                      fill="none"
                      stroke="#a45e49"
                      strokeWidth="0.5"
                      d="M39.971-113.77a61 61 0 0 0-.189 3.779c-.026 1.348-.01 2.718-.378 4.016a7 7 0 0 1-1.087 2.22"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1337"
                      fill="url(#linearGradient2286)"
                      stroke="#a45e49"
                      strokeWidth="0.5"
                      d="M29.333-122.075a88.4 88.4 0 0 0 2.539 15.769c2.076 8.125 5.32 15.96 9.688 23.118 3.08 5.048 6.711 9.753 9.622 14.9a62 62 0 0 1 4.477 9.823 117 117 0 0 0-.334-5.48c-.201-2.377-.477-4.754-1.002-7.082-1.19-5.268-3.63-10.155-5.947-15.034-1.98-4.168-3.883-8.37-5.813-12.561-2.01-4.364-4.048-8.714-6.014-13.097a438 438 0 0 1-3.073-7.015z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1397"
                      fill="none"
                      stroke="#a45e49"
                      strokeWidth="0.5"
                      d="M34.868-83.06a972 972 0 0 1 2.457 12.473c.755 3.969 1.485 7.943 2.268 11.906q1.236 6.255 2.646 12.473"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1893"
                      fill="#e5ecef"
                      stroke="#adbec7"
                      strokeWidth="0.4"
                      d="M37.318 28.297a9 9 0 0 1 2.973-2.071 9.1 9.1 0 0 1 7.15.033 16 16 0 0 1 .7 4.544 10.8 10.8 0 0 0-3.307.067c-1.276.224-2.504.678-3.674 1.236a21.7 21.7 0 0 0-3.609 2.171 11.15 11.15 0 0 0-.233-5.98"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1897"
                      fill="#e5ecef"
                      stroke="#adbec7"
                      strokeWidth="0.4"
                      d="M37.384 40.19a46 46 0 0 0 3.776-3.173c1.5-1.406 2.902-2.91 4.376-4.343q1.221-1.187 2.506-2.306a17 17 0 0 1 1.169 3.442 16.4 16.4 0 0 0-3.575 2.305c-1.406 1.192-2.6 2.61-3.909 3.909a30.5 30.5 0 0 1-3.908 3.274 4.83 4.83 0 0 0-.435-3.107"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1905"
                      fill="#e5ecef"
                      stroke="#adbec7"
                      strokeWidth="0.4"
                      d="M40.792 40.057c1.329.139 2.638.466 3.875.969a14.3 14.3 0 0 1 5.012 3.441v1.036a162 162 0 0 1-3.475-1.57c-.857-.4-1.714-.809-2.616-1.095-.901-.287-1.856-.449-2.796-.342a5.05 5.05 0 0 0-2.873 1.336l.033-1.236"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path2377"
                      fill="none"
                      stroke="#adbec7"
                      strokeWidth="0.4"
                      d="M48.881-29.246a27.1 27.1 0 0 1-.33 9.591"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1674"
                      fill="#dbd5c7"
                      stroke="#a6a29a"
                      strokeWidth="0.5"
                      d="M39.49-32.44a6.46 6.46 0 0 1 3.106-2.272c1.522-.515 3.233-.432 4.71.2.609.261 1.194.627 1.57 1.17.265.38.414.834.464 1.294s.006.927-.096 1.379c-.158.707-.461 1.39-.935 1.938a3.63 3.63 0 0 1-1.503 1.035c-1.065.386-2.253.245-3.341-.067-.532-.152-1.051-.343-1.57-.534-.64-.235-1.298-.48-1.805-.936a2.7 2.7 0 0 1-.844-1.501 2.7 2.7 0 0 1 .243-1.706"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                  </g>
                </g>
                <use
                  xlinkHref="#path1100"
                  id="use1128"
                  width="100%"
                  height="100%"
                  x="0"
                  y="0"
                  display="inline"
                  opacity="1"
                  transform="matrix(-1 0 0 1 116.03 0)"
                ></use>
                <path
                  id="path1100"
                  fill="url(#linearGradient1126)"
                  fillOpacity="1"
                  stroke="#adbec7"
                  strokeDasharray="none"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit="4"
                  strokeOpacity="1"
                  strokeWidth="0.4"
                  d="m58.035-168.113-27.967 2.139 1.27 28.597-5.546 8.085a5.45 5.45 0 0 0-.602 2.272c-.022.547.041 1.106.267 1.604.283.621.796 1.106 1.327 1.535.532.428 1.099.823 1.547 1.338.826.951 1.173 2.225 1.87 3.274.834 1.253 2.123 2.126 3.433 2.866s2.687 1.392 3.85 2.346c1.937 1.587 3.136 3.886 4.811 5.746 1.899 2.107 4.364 3.604 6.549 5.412 1.694 1.403 3.286 3.035 5.345 3.809.833.313 1.718.474 2.606.534q.649.045 1.3.019"
                  display="inline"
                  opacity="1"
                  stopColor="#000"
                  stopOpacity="1"
                  style={{ fontVariationSettings: "normal" }}
                  vectorEffect="none"
                ></path>
                <path
                  id="rect1075"
                  fill="#dbd5c7"
                  fillOpacity="1"
                  stroke="#a6a29a"
                  strokeDasharray="none"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit="4"
                  strokeOpacity="1"
                  strokeWidth="0.5"
                  d="M56.216-201.82q.234.081.473.144c.846.223 2.294.223 3.14 0q.24-.063.473-.145c.825-.289 1.345-.002 1.265.872a221 221 0 0 0-.484 33.896c.055.875-.377 2.106-.971 2.75l-.777.842a1.465 1.465 0 0 1-2.153 0l-.776-.841c-.594-.645-1.026-1.876-.971-2.751a221 221 0 0 0-.484-33.896c-.08-.873.44-1.16 1.265-.872"
                  display="inline"
                  opacity="1"
                  stopColor="#000"
                  stopOpacity="1"
                  style={{ fontVariationSettings: "normal" }}
                  vectorEffect="none"
                ></path>
                <g
                  id="g3719"
                  fill="#fde8cc"
                  fillOpacity="1"
                  stroke="none"
                  strokeDasharray="none"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit="4"
                  strokeOpacity="1"
                  strokeWidth="0.5"
                  transform="translate(-.503)"
                >
                  <path
                    id="path1304"
                    d="m60.24-229.573-12.38.195-4.157-4.4a38 38 0 0 0-.236-9.497c-.263-1.736-.647-3.453-.85-5.197-.401-3.444-.054-7.067 1.606-10.111 1.614-2.96 4.394-5.195 7.512-6.473a17.8 17.8 0 0 1 7.03-1.323"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <use
                    xlinkHref="#path1304"
                    id="use1324"
                    width="100%"
                    height="100%"
                    x="0"
                    y="0"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    transform="matrix(-1 0 0 1 117.524 0)"
                    vectorEffect="none"
                  ></use>
                </g>
                <path
                  id="path3697"
                  fill="#e5ecef"
                  fillOpacity="1"
                  stroke="#adbec7"
                  strokeDasharray="none"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit="4"
                  strokeOpacity="1"
                  strokeWidth="0.4"
                  d="m43.29-252.463 14.654 13.23 15.284-13.23c.307-4.105-1.165-8.313-3.966-11.33-2.8-3.019-6.886-4.801-11.003-4.801s-8.203 1.782-11.003 4.8-4.273 7.226-3.966 11.331"
                  clipPath="url(#clipPath1349)"
                  opacity="1"
                  stopColor="#000"
                  stopOpacity="1"
                  style={{ fontVariationSettings: "normal" }}
                  vectorEffect="none"
                ></path>
                <g
                  id="g1357"
                  fill="none"
                  fillOpacity="1"
                  stroke="#e7be9b"
                  strokeDasharray="none"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit="4"
                  strokeOpacity="1"
                  strokeWidth="0.5"
                  transform="translate(-.503)"
                >
                  <path
                    id="path1353"
                    d="m60.24-229.573-12.38.195-4.157-4.4a38 38 0 0 0-.236-9.497c-.263-1.736-.647-3.453-.85-5.197-.401-3.444-.054-7.067 1.606-10.111 1.614-2.96 4.394-5.195 7.512-6.473a17.8 17.8 0 0 1 7.03-1.323"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="use1355"
                    d="m57.284-229.573 12.38.195 4.156-4.4a38 38 0 0 1 .236-9.497c.264-1.736.648-3.453.85-5.197.402-3.444.054-7.067-1.606-10.111-1.613-2.96-4.393-5.195-7.512-6.473a17.8 17.8 0 0 0-7.03-1.323"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                </g>
                <g id="g2343" transform="translate(-.117)">
                  <use
                    xlinkHref="#g2165"
                    id="use2203"
                    width="100%"
                    height="100%"
                    x="0"
                    y="0"
                    transform="matrix(-1 0 0 1 116.753 0)"
                  ></use>
                  <g
                    id="g2165"
                    fillOpacity="1"
                    strokeDasharray="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                  >
                    <path
                      id="path1200"
                      fill="url(#linearGradient2167)"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M-8.977-94.872c.103.821-.01 1.653 0 2.48.011.928.177 1.846.307 2.764q.217 1.53.307 3.071h-6.213l.426-8.386 5.055-.543q.08.303.118.614"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1257"
                      fill="url(#linearGradient2169)"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M-13.489-80.792a3.52 3.52 0 0 0 .732 2.173 3.5 3.5 0 0 0 1.843 1.228 65 65 0 0 0-.118-13.82l-3.473-.07.378 8.622z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1228"
                      fill="url(#linearGradient2171)"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M-13.158-94.045a10.8 10.8 0 0 1 2.764 2.126c.982 1.05 1.76 2.325 2.055 3.732.293 1.4.101 2.853-.19 4.253-.273 1.32-.634 2.627-.779 3.968a12.5 12.5 0 0 0 0 2.67 4.2 4.2 0 0 1-1.015-1.512c-.464-1.187-.363-2.507-.426-3.78-.052-1.06-.221-2.11-.33-3.165-.123-1.183-.184-2.421-.78-3.45a3.7 3.7 0 0 0-1.984-1.63l-.071-3.378z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path987"
                      fill="#dbd5c7"
                      stroke="#a6a29a"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M-20.28-80.916c-.353 1.62-.399 3.308-.133 4.945.063.384.142.768.135 1.157s-.11.791-.369 1.081c-.168.188-.396.323-.534.535a.8.8 0 0 0-.124.542.8.8 0 0 0 .258.493c-.331.15-.6.431-.735.769-.097.24-.126.503-.123.762.002.259.034.516.056.774.07.829.029 1.674-.2 2.473-.174.603-.451 1.17-.636 1.77-.142.465-.228.955-.167 1.437.04.302.136.598.134.902-.001.328-.116.644-.173.968a1.6 1.6 0 0 0-.019.49.86.86 0 0 0 .192.446c.1.115.238.195.386.23a.8.8 0 0 0 .45-.03c.217-.077.395-.242.53-.43.136-.187.234-.398.338-.605.34-.675.753-1.33.902-2.071.145-.724.027-1.48.167-2.205.196-1.017.874-1.87 1.236-2.84.261-.7.354-1.463.267-2.205.233-.19.409-.45.502-.735.1-.31.103-.643.075-.967-.029-.324-.088-.646-.109-.97-.076-1.187.358-2.337.702-3.475.363-1.202.631-2.432.802-3.675z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path991"
                      fill="#dbd5c7"
                      stroke="#a6a29a"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M-16.504-79.212c-.024 1.593.175 3.188.067 4.777-.082 1.21-.341 2.4-.434 3.609-.07.9-.047 1.805-.1 2.706-.053.87-.177 1.735-.234 2.606-.058.878-.048 1.759-.034 2.639.004.226.009.457.09.667.04.106.1.205.182.283a.56.56 0 0 0 .296.152.56.56 0 0 0 .337-.058.8.8 0 0 0 .263-.222c.143-.182.22-.405.302-.622.221-.584.496-1.147.702-1.737.426-1.223.543-2.528.735-3.809q.196-1.313.5-2.605c.174-.221.31-.47.402-.735.17-.49.186-1.021.138-1.538-.048-.516-.159-1.024-.239-1.536a12.75 12.75 0 0 1 .401-5.646l-3.34.234q-.028.417-.034.835"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1186"
                      fill="url(#linearGradient2173)"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M-16.47-81.35c-.054.216-.11.433-.124.656-.014.222.015.452.124.647a1 1 0 0 0 .324.34c.132.087.282.146.436.182.308.072.63.055.945.032.318-.024.64-.055.939-.17.148-.057.29-.136.412-.239.121-.103.222-.232.284-.38.09-.21.097-.449.06-.675-.035-.227-.111-.444-.183-.662a18.1 18.1 0 0 1-.85-6.993l-1.536-.378a29.2 29.2 0 0 1-.831 7.64"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path983"
                      fill="#dbd5c7"
                      stroke="#a6a29a"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M-24.89-80.615a10.54 10.54 0 0 1-1.937 5.98c.073.333.037.69-.1 1.002-.161.366-.453.665-.602 1.036-.104.26-.132.546-.136.827s.016.563.003.843c-.039.828-.36 1.619-.769 2.339-.232.408-.496.805-.637 1.254-.07.224-.108.46-.092.694.017.235.09.467.228.658.082.113.185.21.306.28.12.071.257.114.396.12.263.013.52-.105.72-.278.2-.172.35-.396.482-.623.376-.642.647-1.34.902-2.038.302-.828.593-1.68 1.136-2.372.138-.175.29-.339.425-.516a1.7 1.7 0 0 0 .31-.587c.062-.23.05-.478-.033-.701.382-.152.679-.501.768-.902.062-.279.029-.569-.003-.852-.033-.284-.064-.575.003-.852.095-.394.374-.713.568-1.07.392-.717.43-1.566.568-2.371a9.2 9.2 0 0 1 2.54-4.911l-3.108-.034z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1157"
                      fill="url(#linearGradient2175)"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M-19.537-86.179a11.8 11.8 0 0 0-.874 3.71c-.025.367-.033.74.03 1.102.064.364.203.72.443 1 .22.256.519.44.843.53.324.092.672.092 1 .013.388-.094.748-.3 1.026-.586.279-.287.474-.653.556-1.044a30.3 30.3 0 0 0 .378-8.103l-1.134-.118z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1115"
                      fill="url(#linearGradient2177)"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M-27.9-87.974a39 39 0 0 1 6.12 2.41l2.409-3.922-6.379-.59z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1129"
                      fill="url(#linearGradient2179)"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M-25.04-80.816c.183-1.064.518-2.101.991-3.071.597-1.223 1.407-2.329 2.244-3.402a69 69 0 0 1 2.316-2.811l2.386 1.04a20.7 20.7 0 0 1-3.473 4.771 20.7 20.7 0 0 1-4.465 3.473"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1101"
                      fill="url(#linearGradient2181)"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M-26.222-89.391c1.126.25 2.273.408 3.425.472 1.18.066 2.378.031 3.52-.27 1.143-.302 2.234-.886 3-1.785a4.73 4.73 0 0 0 1.064-2.3 4.73 4.73 0 0 0-.284-2.52l-5.48 1.394z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1047"
                      fill="url(#linearGradient2183)"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M-25.206-93.573a18 18 0 0 1 5.22-5.48l4.796.378v1.582z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1017"
                      fill="url(#linearGradient2185)"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M-29.132-87.397q.664-1.455 1.403-2.873c.49-.942 1.008-1.877 1.668-2.71.66-.83 1.474-1.56 2.441-2 1.113-.508 2.364-.606 3.541-.936a9.26 9.26 0 0 0 3.943-2.272l.534 2.84a27 27 0 0 0-2.706 1.904c-1.038.83-2.033 1.75-3.24 2.305-.544.25-1.12.421-1.683.625-.562.203-1.12.443-1.592.812-.335.262-.62.583-.935.868a5.68 5.68 0 0 1-3.374 1.437"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path979"
                      fill="#dbd5c7"
                      stroke="#a6a29a"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M-29.057-87.88a1.74 1.74 0 0 0-.945.331 1.76 1.76 0 0 0-.709 1.418 1 1 0 0 0-.897.141 1.35 1.35 0 0 0-.383.473c-.094.181-.161.375-.231.567-.166.452-.355.905-.662 1.276-.182.22-.405.41-.555.653a1 1 0 0 0-.147.4.63.63 0 0 0 .088.411c.059.092.146.163.245.21a.75.75 0 0 0 .317.068c.217.001.428-.079.619-.183.465-.254.836-.65 1.276-.945.515-.346 1.112-.548 1.653-.85.804-.45 1.468-1.112 2.056-1.82q.66-.796 1.204-1.677z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path995"
                      fill="#dbd5c7"
                      stroke="#a6a29a"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M-12.127-78.377c.459.693.674 1.544.601 2.372-.017.191-.049.381-.056.573s.01.388.09.563a.87.87 0 0 0 .367.401c-.154.443-.13.944.067 1.37.167.363.45.665.601 1.035.162.397.16.839.15 1.267-.01.429-.024.868.117 1.273.105.297.288.56.461.823s.341.539.408.847c.032.149.04.302.075.45a.9.9 0 0 0 .079.213.474.474 0 0 0 .382.259.6.6 0 0 0 .249-.035.83.83 0 0 0 .384-.32c.132-.191.204-.418.251-.646s.071-.46.117-.69c.046-.233.115-.463.133-.701.028-.355-.058-.709-.165-1.048s-.238-.673-.302-1.023c-.095-.514-.045-1.04-.044-1.563s-.05-1.066-.324-1.511c-.06-.098-.13-.191-.167-.3a.7.7 0 0 1-.027-.26q.011-.13.043-.258c.038-.17.082-.346.051-.518a.9.9 0 0 0-.159-.342c-.074-.103-.16-.196-.242-.293a3.24 3.24 0 0 1-.702-2.54z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1803"
                      fill="#e5ecef"
                      stroke="#adbec7"
                      strokeDashoffset="0"
                      strokeWidth="0.4"
                      d="M-17.423-90.354a114 114 0 0 0-9.602 18.302l2.102-3.07-.07 3.118a74.5 74.5 0 0 1 8.15-17.033 53 53 0 0 0-1.63 5.859c-.388 1.779-.684 3.577-1.04 5.362-.463 2.32-1.028 4.62-1.465 6.945a64 64 0 0 0-.52 3.213 39 39 0 0 0 1.985-4.37 13.6 13.6 0 0 0-.402 4.701 22 22 0 0 0 1.087-4.063c.294-1.767.369-3.562.59-5.34.291-2.326.833-4.615 1.465-6.874q.617-2.202 1.347-4.37a140 140 0 0 0-.142 5.977c-.004 1.844.028 3.693-.165 5.528-.214 2.034-.702 4.033-.874 6.07-.1 1.187-.093 2.383.023 3.568a15.5 15.5 0 0 1 1.323-4.843 48 48 0 0 1 .402 4.11c.304-.831.519-1.696.638-2.574.236-1.742.095-3.51.07-5.268-.029-2.064.102-4.126.142-6.19a70 70 0 0 0-.165-6.378q.327 1.722.732 3.425c.466 1.96 1.01 3.898 1.56 5.835.33 1.164.661 2.327.968 3.497q.403 1.542.756 3.094.22.967.425 1.938a9.65 9.65 0 0 0-.094-4.064 6.5 6.5 0 0 0 1.228 3c-.02-.92-.123-1.838-.307-2.74-.23-1.126-.587-2.223-.969-3.307-.255-.726-.522-1.448-.78-2.173-.423-1.198-.82-2.405-1.275-3.591-.356-.931-.749-1.851-1.016-2.811a11.3 11.3 0 0 1-.36-4.093l-3.49-1.223z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1779"
                      fill="#e5ecef"
                      stroke="#adbec7"
                      strokeDashoffset="0"
                      strokeWidth="0.4"
                      d="M-16.154-95.189a6.93 6.93 0 0 0-1.269 4.835 4.5 4.5 0 0 1 1.871-.05 4.5 4.5 0 0 1 2.255 1.153 25 25 0 0 1 .28-4.51"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1751"
                      fill="url(#linearGradient2187)"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="m53.64-220.883 3.89.152q.04 2.94-.067 5.88c-.101 2.799-.302 5.602-.835 8.352a35 35 0 0 1-.902 3.608l-1.717-.915a37 37 0 0 1-.02-5.633c.107-1.494.306-2.98.367-4.477a24.6 24.6 0 0 0-.715-6.967"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1152"
                      fill="#fde8cc"
                      stroke="#e7be9b"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="m44.868-245.153-1.236-.501v0a2.55 2.55 0 0 0-1.403-1.103 1.8 1.8 0 0 0-.594-.092 1.17 1.17 0 0 0-.576.16 1.2 1.2 0 0 0-.407.422 2.3 2.3 0 0 0-.227.546c-.176.595-.217 1.22-.268 1.838-.061.746-.139 1.502 0 2.238.144.759.51 1.455.869 2.138.395.75.795 1.527.868 2.372.031.353.003.709.034 1.062.03.353.127.716.367.976.123.133.278.234.445.303.167.07.345.11.524.131a2.67 2.67 0 0 0 1.738-.4"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1419"
                      fill="url(#linearGradient1596)"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.492"
                      d="m49.989-237.391 3.22-1.687a93 93 0 0 1 2.5 5.397l-2.004 2.792a28.6 28.6 0 0 0-3.794-6.502z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1447"
                      fill="url(#linearGradient2189)"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="m56.72-243.039 1.795-.685a23 23 0 0 1-.118 3.402 23.1 23.1 0 0 1-3.992 10.654l-1.488 1.134a44.4 44.4 0 0 1 3.803-14.505"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1274"
                      fill="url(#linearGradient1302)"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M43.184-248.897a19.5 19.5 0 0 1 .85-6.331c.324.113.696.078.992-.095.138-.08.259-.188.396-.27a.9.9 0 0 1 .218-.098.5.5 0 0 1 .237-.01.5.5 0 0 1 .264.16c.07.078.119.172.154.27.071.197.088.41.149.61.086.285.262.544.497.728.235.185.527.295.826.31l-1.181 8.883a7.1 7.1 0 0 1-2.953-.567 19.5 19.5 0 0 1-.45-3.59"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1245"
                      fill="url(#linearGradient2422)"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M46.066-245.92q.337-2.764.661-5.529c.32-2.726.674-5.575 2.22-7.843.53-.776 1.206-1.475 2.043-1.902a3.8 3.8 0 0 1 1.343-.402c.468-.044.948.01 1.387.178.872.333 1.53 1.086 1.947 1.92.418.835.626 1.755.84 2.663.573 2.423 1.22 4.842 1.418 7.323a20.5 20.5 0 0 1-.378 5.86"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path950"
                      fill="#f39079"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M21.248-175.329a707 707 0 0 0 2.539 9.421q1.021 3.68 2.071 7.35c1.09 3.811 2.199 7.633 2.74 11.56.272 1.975.396 4.007-.067 5.947-.367 1.537-1.09 2.962-1.782 4.383s-1.367 2.877-1.626 4.436a8.8 8.8 0 0 0 .334 4.21 51 51 0 0 0 5.012 5.613c1.457 1.406 3.015 2.738 4.81 3.675 1.296.675 2.733 1.141 4.193 1.102a6.4 6.4 0 0 0 2.189-.451 74 74 0 0 0-.501-2.923c-.33-1.712-.72-3.415-.936-5.145-.49-3.921-.08-7.89.267-11.827.332-3.755.608-7.532.334-11.292-.183-2.525-.614-5.026-.801-7.55-.147-1.98-.144-3.967-.268-5.947a46.9 46.9 0 0 0-6.48-20.98l-13.23 2.672z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1211"
                      fill="#f39079"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M24.9-213.084c3.408-.818 6.93-1.022 10.394-1.56 2.845-.44 5.694-1.122 8.22-2.503a16.23 16.23 0 0 0 5.954-5.623l1.842 19.631-29.116-5.827 1.478-3.796q.61-.174 1.227-.322"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1231"
                      fill="#dbd5c7"
                      stroke="#a6a29a"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M22.3-212.045a1.42 1.42 0 0 1 .952-.735c.295-.064.603-.03.897.035.294.066.58.165.874.232.894.207 1.825.127 2.74.067 1.938-.127 3.893-.16 5.813.134 2.891.442 5.617 1.608 8.285 2.806 2.113.949 4.213 1.925 6.273 2.983.52.267 1.04.54 1.599.71.945.287 1.966.267 2.902.583.39.132.771.33 1.028.652.177.222.286.494.346.772s.075.564.08.848c.01.682-.034 1.364-.134 2.038l-31.237-8.553z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1109"
                      fill="url(#linearGradient1113)"
                      stroke="#a45e49"
                      strokeWidth="0.4"
                      d="M-17.812-103.33a108 108 0 0 0 3.449-10.772c.568-2.157 1.07-4.332 1.7-6.472a56 56 0 0 1 3.922-9.78l15.923 3.307-14.647 28.3-4.583 2.363-5.197-2.788z"
                      display="inline"
                      opacity="1"
                    ></path>
                    <path
                      id="path1122"
                      fill="#e5ecef"
                      stroke="#adbec7"
                      strokeDashoffset="0"
                      strokeWidth="0.4"
                      d="M-17.812-103.33a9.97 9.97 0 0 1-3.402 5.08c.557.062 1.12.062 1.677 0 .525-.06 1.05-.174 1.575-.127.263.023.525.088.757.213a1.3 1.3 0 0 1 .55.552c.12.24.148.515.139.782-.009.268-.052.533-.068.8-.027.462.03.929.166 1.37a7.4 7.4 0 0 1 3.401.898 12 12 0 0 1 4.04-1.11 47 47 0 0 1 1.95-3.89 8.2 8.2 0 0 1-2.824-.15c-.731-.169-1.447-.44-2.197-.472-.476-.02-.95.057-1.427.077-.476.02-.973-.025-1.384-.266a1.8 1.8 0 0 1-.735-.87 2.3 2.3 0 0 1-.14-1.138 2.7 2.7 0 0 1 .615-1.418z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1065"
                      fill="url(#linearGradient2193)"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M-16.203-95.783c.81-.707 1.53-1.518 2.138-2.405.834-1.218 1.45-2.57 2.138-3.876.826-1.568 1.76-3.078 2.706-4.577 2.03-3.213 4.13-6.386 6.014-9.688a85.8 85.8 0 0 0 6.882-15.435l6.712-13.37 2.913.428a43.4 43.4 0 0 1-2.71 8.298c-1.82 4.116-4.266 7.918-6.715 11.693-4.716 7.27-9.481 14.509-14.031 21.883-1.144 1.855-2.288 3.748-2.873 5.847-.261.935-.407 1.902-.435 2.873"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1080"
                      fill="url(#linearGradient2195)"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M-8.855-98.457q1.395-2.724 2.807-5.44C-.486-114.591 5.3-125.27 8.882-136.78a93 93 0 0 0 2.221-8.552l2.197.626a51.5 51.5 0 0 1-2.244 10.288c-2.093 6.375-5.404 12.268-8.646 18.143a1205 1205 0 0 0-9.686 17.907"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path998"
                      fill="url(#linearGradient2197)"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M-16.37-100.293a189 189 0 0 0 3.85-6.155c1.76-2.939 3.443-5.929 4.913-9.024a74.7 74.7 0 0 0 5.668-16.882l13.838-14.347 1.401 1.995a92 92 0 0 1-6.418 11.339c-2.913 4.387-6.197 8.516-9.22 12.828-4.749 6.773-8.85 14-12.228 21.549"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path861"
                      fill="#f39079"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M10.583-174.53a48.6 48.6 0 0 1-1.823-7.277c-.792-4.66-.888-9.52.462-14.051 1.195-4.016 3.498-7.654 6.37-10.706a33.3 33.3 0 0 1 6.709-5.48c.935.405 1.922.691 2.929.85 2.727.43 5.523-.081 8.27.189 3.097.304 6.005 1.583 8.81 2.93 3.088 1.48 6.132 3.067 9 4.936a53 53 0 0 1 2.552 1.772l-1.735 14.12z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path988"
                      fill="#dbd5c7"
                      stroke="#a6a29a"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M12.615-145.001a9 9 0 0 0 .685.295c.357-.402.66-.852.898-1.335.273-.554.46-1.148.614-1.748q.222-.865.356-1.748l-1.178-5.587-3.903 4.123z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path968"
                      fill="#f39079"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M17.506-183.948 29.2-186.02a10.8 10.8 0 0 0-5.88 6.014c-.721 1.868-.901 3.892-1.136 5.88-.27 2.295-.647 4.654-1.87 6.615-.34.545-.742 1.05-1.093 1.59-.352.537-.658 1.12-.778 1.75-.172.9.04 1.826 0 2.74-.046 1.013-.402 1.983-.735 2.94a79 79 0 0 0-2.54 8.954 38.5 38.5 0 0 1-2.672-9.488z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path847"
                      fill="#f39079"
                      stroke="#a45e49"
                      strokeWidth="0.5"
                      d="M53.862-201.367a28 28 0 0 1 1.512 4.063c.579 2.025.93 4.139.755 6.237-.146 1.77-.664 3.517-.567 5.292.077 1.393.531 2.77.378 4.157-.153 1.393-.91 2.669-1.039 4.064-.072.779.054 1.562.218 2.327.163.765.364 1.525.443 2.303.184 1.797-.29 3.589-.472 5.386-.056.552-.085 1.11-.208 1.65-.122.542-.346 1.075-.737 1.468-.39.393-.922.62-1.464.733-.543.111-1.1.116-1.654.118-3.442.013-6.897-.048-10.3-.567-3.73-.57-7.53-1.78-10.205-4.441-1.388-1.381-2.407-3.09-3.261-4.85-.854-1.762-1.559-3.593-2.41-5.356a35.7 35.7 0 0 0-4.44-6.992"
                      opacity="1"
                    ></path>
                    <path
                      id="path928"
                      fill="#f39079"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="m-1.89-138.859.19-.047a52.8 52.8 0 0 0 13.606-12.143 6.6 6.6 0 0 1 .709 2.126c.08.531.095 1.07.094 1.607q0 1.159-.094 2.315a49 49 0 0 1-3.355 3.874c-1.134 1.18-2.327 2.304-3.449 3.496-1.444 1.535-2.769 3.18-4.252 4.678a30.8 30.8 0 0 1-7.181 5.386z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path948"
                      fill="#f39079"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M14.733-160.028c.042.962-.026 1.927-.2 2.874-.549 2.974-2.137 5.668-4.043 8.018a31.5 31.5 0 0 1-9.788 8.018l2.038-10.09 9.755-7.817z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path908"
                      fill="url(#linearGradient1024)"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M-15.635-102.832q2.206-4.71 4.41-9.421c2.806-6.003 5.607-12.01 8.352-18.04 2.261-4.97 4.49-9.967 6.147-15.168a73.8 73.8 0 0 0 3.475-21.582v0A69 69 0 0 0 3.34-162.7c-6.688 9.262-11.002 20.107-13.43 31.27-1.377 6.327-2.167 12.78-3.809 19.043a72 72 0 0 1-3.207 9.488"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path881"
                      fill="url(#linearGradient1180)"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M17.219-186.206a4.5 4.5 0 0 1 3.192.43 13.15 13.15 0 0 1 1.37 5.434c.134 4.27-1.794 8.289-3.024 12.379-.839 2.788-1.39 5.733-2.976 8.174-1.02 1.568-2.418 2.847-3.663 4.243-1.07 1.2-2.038 2.504-2.749 3.947a13.3 13.3 0 0 0-1.35 5.167l-6.901 6.776a25.3 25.3 0 0 0 1.859-5.014c.55-2.164.811-4.39.992-6.615.33-4.075.393-8.17.803-12.237.318-3.155.853-6.317 2.032-9.26 1.367-3.415 3.555-6.427 5.716-9.403.62-.852 1.243-1.71 2.003-2.441s1.67-1.335 2.696-1.58"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1182"
                      fill="none"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M9.119-164.656a98.8 98.8 0 0 1 8.1-21.55"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path879"
                      fill="none"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M15.9-185.674a18.9 18.9 0 0 1 3.19-7.437c2.655-3.71 6.567-6.335 10.63-8.41a59.8 59.8 0 0 1 15.12-5.308"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path899"
                      fill="none"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M15.46-182.62a13.4 13.4 0 0 0 3.236-3.684"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path919"
                      fill="url(#linearGradient948)"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M49.846-230.453a53.6 53.6 0 0 1 3.407 12.829c.436 3.203.582 6.449 1.203 9.621.382 1.951.943 3.866 1.673 5.715a1.62 1.62 0 0 1-1.523-.102 1.6 1.6 0 0 1-.555-.583l-2.599-7.3.26 4.914a7 7 0 0 1-2.033-.439c-.99-.373-1.88-.962-2.807-1.47A18.6 18.6 0 0 0 44-208.537a23.2 23.2 0 0 0 2.506-4.744 25.3 25.3 0 0 0 1.37-5.112 27.9 27.9 0 0 0-.067-9.254z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path970"
                      fill="#f39079"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="m48.017-162.56.783-.067c.873-.076 2.286-.227 3.159-.316.493-.05.986-.093 1.48-.114.874-.037 2.3.073 3.15.284.394.098.61.908.54 1.782q-.021.273-.039.547a39 39 0 0 0-.044 3.173q.038 1.077.149 2.15c.09.872-.487 1.398-1.343 1.204-.677-.153-1.923-.419-2.79-.546a16 16 0 0 0-2.06-.161q-.411-.002-.821.025c-.874.057-2.262.388-3.104.629-.823.235-2.217.486-3.09.432-.588-.035-1.258-.825-1.43-1.684a24 24 0 0 1-.356-2.71q-.066-1.08-.017-2.16c.04-.875.826-1.748 1.687-1.912q.495-.095.995-.176c.865-.14 2.278-.301 3.151-.38"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path974"
                      fill="#f39079"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M42.429-150.606a4.07 4.07 0 0 1 1.704-1.437c1.015-.455 2.168-.473 3.24-.768.784-.216 1.532-.58 2.34-.669.639-.07 1.284.04 1.913.177.628.138 1.253.306 1.895.358.668.054 1.35-.018 2.004.134.688.16 1.327.585 1.67 1.202.32.574.368 1.26.322 1.916s-.177 1.303-.188 1.96c-.008.49.052.982 0 1.47-.04.386-.151.766-.347 1.101a2.1 2.1 0 0 1-.822.803c-.337.177-.72.246-1.1.276-.378.03-.76.022-1.138.058-.956.09-1.865.45-2.807.635-.944.186-1.913.196-2.873.267-.601.045-1.21.113-1.804.007-.5-.09-.973-.3-1.47-.408a5 5 0 0 0-1.069-.1c-.305 0-.62.013-.902-.1a1.24 1.24 0 0 1-.583-.515 1.9 1.9 0 0 1-.243-.747c-.065-.523.032-1.052.058-1.578.039-.813-.094-1.626-.067-2.44a6.2 6.2 0 0 1 .267-1.603z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path978"
                      fill="#f39079"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M44.337-142.323c.934.17 1.887.238 2.836.202 1.254-.046 2.494-.271 3.742-.4 1.225-.127 2.477-.166 3.641-.568.234-.081.464-.177.706-.231s.5-.065.731.023a1.1 1.1 0 0 1 .456.341c.12.15.21.322.279.501.27.698.251 1.474.158 2.216-.092.742-.255 1.48-.258 2.228-.003.604.098 1.204.162 1.805s.089 1.217-.062 1.803a2.3 2.3 0 0 1-.262.638c-.12.197-.28.372-.473.498-.203.132-.44.208-.68.237-.24.03-.485.013-.724-.027-.477-.081-.932-.26-1.402-.377-1.357-.34-2.78-.167-4.176-.1-1.195.056-2.402.034-3.575.267-.401.08-.802.189-1.21.177a1.6 1.6 0 0 1-.596-.126 1.07 1.07 0 0 1-.466-.385c-.14-.216-.182-.48-.195-.736s0-.514-.039-.768c-.088-.561-.43-1.052-.568-1.603-.178-.718.004-1.469.096-2.203.09-.713.1-1.457.405-2.107a2.52 2.52 0 0 1 1.474-1.305"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1012"
                      fill="#f39079"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M48.456-132.426c.802.02 1.603.062 2.404.104.875.046 2.294.109 3.171.125q.516.009 1.03.012c.877.003 1.697.69 1.816 1.559a98 98 0 0 1 .415 3.503c.183 1.854.301 3.714.316 5.576a62 62 0 0 1-.08 3.173c-.04.755-.093 1.51-.149 2.264a267 267 0 0 0-.22 3.167 78 78 0 0 0-.119 2.83c-.02.876-.01 2.298.023 3.174q.036.897.103 1.793c.066.874-.436 1.155-1.243.815-.697-.294-2.008-.523-2.87-.687-.18-.035-1.077-.17-1.774-.693-.147-.11-.727-.763-1.084-1.558a35 35 0 0 0-.86-1.785c-.313-.599-.914-1.704-1.329-2.477a438 438 0 0 1-1.676-3.149 158 158 0 0 1-1.459-2.82c-.343-.691-.67-1.39-.96-2.103-.33-.811-.758-2.17-.939-3.027a18 18 0 0 1-.382-3.824c.005-.877.13-2.295.276-3.16q.085-.503.195-1.002c.19-.855 1.11-1.642 1.983-1.718l.24-.02a37 37 0 0 1 3.172-.072"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1172"
                      fill="url(#linearGradient2199)"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M58.017-243.516c-.01-.62-.18-1.232-.445-1.793a7.2 7.2 0 0 0-1.025-1.548c-.515-.612-1.104-1.169-1.778-1.601-.674-.433-1.436-.74-2.23-.838-1.002-.124-2.027.086-2.952.49-.926.404-1.758.995-2.528 1.649-.54.458-1.055.953-1.456 1.537-.4.583-.683 1.263-.715 1.97-.03.662.158 1.32.45 1.915.291.595.684 1.134 1.087 1.66.398.522.81 1.038 1.29 1.487.479.45 1.03.833 1.65 1.052.847.3 1.785.28 2.657.06s1.685-.63 2.454-1.095c.91-.55 1.78-1.19 2.446-2.02.665-.828 1.115-1.863 1.095-2.925"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1202"
                      fill="url(#linearGradient1241)"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M56.588-243.015a4.4 4.4 0 0 0-.733-1.276c-.931-1.13-2.41-1.737-3.874-1.771a6.23 6.23 0 0 0-4.961 2.338"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1192"
                      fill="#fde8cc"
                      stroke="#e7be9b"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M56.588-243.015a11 11 0 0 1-4.158.78 11 11 0 0 1-5.41-1.489c-.01.524.14 1.05.425 1.489.382.587.99 1.003 1.647 1.248.656.245 1.362.33 2.062.358.83.034 1.67-.01 2.474-.217s1.576-.582 2.18-1.153c.311-.295.575-.64.78-1.016"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1326"
                      fill="url(#linearGradient2201)"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M43.562-235.999c-.013 1.412.13 2.825.425 4.205a18.8 18.8 0 0 0 3.166 7.134c1.646 2.262 3.826 4.14 6.33 5.387.997.495 2.044.892 3.119 1.18a14.3 14.3 0 0 1-2.173-6.992 67 67 0 0 1-1.182-5.339c-.103-.58-.2-1.162-.365-1.728-.166-.565-.405-1.116-.769-1.579a3.47 3.47 0 0 0-1.937-1.228 8.9 8.9 0 0 1-2.22 3.543 5.5 5.5 0 0 1-.85-1.937c-.084-.378-.128-.763-.206-1.142-.078-.38-.194-.757-.409-1.079a2.02 2.02 0 0 0-1.37-.865 2.02 2.02 0 0 0-1.56.44"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1390"
                      fill="none"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M49.802-234.02a33 33 0 0 1-1.578 10.694 15.9 15.9 0 0 0 5.023-7.098"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path1799"
                      fill="#e5ecef"
                      stroke="#adbec7"
                      strokeDashoffset="0"
                      strokeWidth="0.4"
                      d="M-31.443-84.005a10.65 10.65 0 0 0 4.11-1.725 10.7 10.7 0 0 0 2.788-2.858l-.638-.095a99 99 0 0 0-2.386 1.678 80 80 0 0 0-2.173 1.63 67 67 0 0 0-1.7 1.37"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path2345"
                      fill="none"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M22.769-173.859a22.4 22.4 0 0 0 5.984 4.613"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path2349"
                      fill="none"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M23.904-169.449a17.4 17.4 0 0 0 6.415 2.272"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path2353"
                      fill="none"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M24.64-166.108a94 94 0 0 0 9.101 1.84"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path2357"
                      fill="none"
                      stroke="#a45e49"
                      strokeDashoffset="0"
                      strokeWidth="0.5"
                      d="M25.508-164.304a76 76 0 0 0 5.472 2.095"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                  </g>
                </g>
                <path
                  id="path1721"
                  fill="url(#linearGradient1243)"
                  fillOpacity="1"
                  stroke="#a45e49"
                  strokeDasharray="none"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit="4"
                  strokeOpacity="1"
                  strokeWidth="0.5"
                  d="M58.415-224.055a2.88 2.88 0 0 0-2.32-1.27 2.88 2.88 0 0 0-2.357 1.203 2.9 2.9 0 0 0-.518 1.67c.005.547.166 1.085.42 1.569.255.483.6.914.983 1.304a8.2 8.2 0 0 0 1.979 1.487v0a7 7 0 0 0 1.813.15m0-6.113a2.88 2.88 0 0 1 2.321-1.27 2.88 2.88 0 0 1 2.356 1.203c.34.485.524 1.078.518 1.67a3.5 3.5 0 0 1-.42 1.569c-.255.483-.6.914-.983 1.304a8.2 8.2 0 0 1-1.979 1.487v0a7 7 0 0 1-1.813.15"
                  opacity="1"
                  stopColor="#000"
                  stopOpacity="1"
                  style={{ fontVariationSettings: "normal" }}
                  vectorEffect="none"
                ></path>
                <path
                  id="path1476"
                  fill="url(#linearGradient1594)"
                  fillOpacity="1"
                  stroke="#a45e49"
                  strokeDasharray="none"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit="4"
                  strokeOpacity="1"
                  strokeWidth="0.5"
                  d="M58.386-223.03q-.715.015-1.43 0c-.634-.013-1.272-.045-1.89-.189a4.8 4.8 0 0 1-1.76-.795 4 4 0 0 1-1.24-1.472 3.46 3.46 0 0 1-.35-1.616 3.06 3.06 0 0 1 .492-1.574c.29-.44.7-.795 1.151-1.068s.946-.469 1.448-.632a13.1 13.1 0 0 1 3.579-.638m0 7.984q.714.015 1.429 0c.634-.013 1.272-.045 1.89-.189a4.8 4.8 0 0 0 1.76-.795 4 4 0 0 0 1.24-1.472c.242-.501.37-1.06.35-1.616a3.06 3.06 0 0 0-.492-1.574c-.29-.44-.7-.795-1.151-1.068s-.946-.469-1.448-.632a13.1 13.1 0 0 0-3.578-.638"
                  opacity="1"
                  stopColor="#000"
                  stopOpacity="1"
                  style={{ fontVariationSettings: "normal" }}
                  transform="translate(-.127)"
                  vectorEffect="none"
                ></path>
                <g id="g1590" opacity="0.994" transform="translate(.165)">
                  <path
                    id="path1506"
                    fill="#f5a794"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M58.382-227.964c-.197.05-.408.044-.602-.017-.29-.092-.53-.301-.818-.4s-.606-.083-.901-.009-.574.203-.853.326a24 24 0 0 1-2.188.835q.534.428 1.085.835c.697.514 1.44 1.014 2.289 1.186.356.072.723.085 1.086.067q.335-.016.668-.067"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <use
                    xlinkHref="#path1506"
                    id="use1535"
                    width="100%"
                    height="100%"
                    x="0"
                    y="0"
                    transform="matrix(-1 0 0 1 116.28 0)"
                  ></use>
                  <path
                    id="path1681"
                    fill="#f5a794"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M53.02-227.23a24.7 24.7 0 0 0 10.241 0"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                </g>
                <path
                  id="path1633"
                  fill="#e5ecef"
                  fillOpacity="1"
                  stroke="#adbec7"
                  strokeDasharray="none"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit="4"
                  strokeOpacity="1"
                  strokeWidth="0.4"
                  d="M58.348-229.969a1.23 1.23 0 0 1-.751-.3c-.133-.117-.24-.26-.362-.388s-.267-.244-.44-.28a.8.8 0 0 0-.288.001c-.095.017-.188.046-.28.074a2 2 0 0 1-.28.07.7.7 0 0 1-.288-.011.59.59 0 0 1-.377-.34.71.71 0 0 1-.007-.512c.056-.157.16-.292.268-.417.11-.126.226-.246.316-.385.185-.286.245-.634.401-.936.187-.36.515-.646.898-.783a1.64 1.64 0 0 1 1.19.04m0 4.168a1.23 1.23 0 0 0 .752-.3c.133-.117.239-.261.361-.389s.268-.244.44-.28a.8.8 0 0 1 .289.002c.095.017.187.045.28.073.092.028.185.056.28.07a.7.7 0 0 0 .288-.011.59.59 0 0 0 .377-.34.71.71 0 0 0 .007-.512 1.4 1.4 0 0 0-.269-.417c-.109-.125-.226-.245-.316-.385-.184-.285-.244-.633-.4-.935a1.64 1.64 0 0 0-.898-.783 1.64 1.64 0 0 0-1.19.04"
                  opacity="1"
                  stopColor="#000"
                  stopOpacity="1"
                  style={{ fontVariationSettings: "normal" }}
                  vectorEffect="none"
                ></path>
                <path
                  id="path1612"
                  fill="url(#linearGradient1631)"
                  fillOpacity="1"
                  stroke="#a45e49"
                  strokeDasharray="none"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit="4"
                  strokeOpacity="1"
                  strokeWidth="0.5"
                  d="M58.563-243.511c-.442.78-.807 1.605-1.087 2.457-.341 1.037-.556 2.111-.732 3.189a47 47 0 0 0-.558 5.292c.191-.51.561-.952 1.03-1.229a2.4 2.4 0 0 1 1.347-.33m0-9.38c.442.781.806 1.606 1.086 2.458.341 1.037.556 2.111.733 3.189.286 1.751.472 3.519.557 5.292-.19-.51-.56-.952-1.03-1.229a2.4 2.4 0 0 0-1.346-.33"
                  opacity="1"
                  stopColor="#000"
                  stopOpacity="1"
                  style={{ fontVariationSettings: "normal" }}
                  transform="translate(-.304)"
                  vectorEffect="none"
                ></path>
              </g>
              <g id="g3613" transform="translate(211.98 -413.58)">
                <use
                  xlinkHref="#g3482"
                  id="use3484"
                  width="100%"
                  height="100%"
                  x="0"
                  y="0"
                  transform="matrix(-1 0 0 1 118.331 0)"
                ></use>
                <g id="g3482">
                  <path
                    id="path3288"
                    fill="#dbd5c7"
                    fillOpacity="1"
                    stroke="#a6a29a"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M66.141 477.748q-.09-.808-.267-1.601c-.087-.394-.19-.788-.37-1.149-.18-.36-.44-.69-.786-.897-.171-.103-.36-.173-.544-.249a2 2 0 0 1-.523-.285c-.215-.173-.363-.414-.478-.664-.116-.25-.204-.511-.323-.76-.271-.563-.697-1.04-.978-1.6-.37-.734-.47-1.588-.356-2.402a4.8 4.8 0 0 1 .622-1.779 11.3 11.3 0 0 0 1.69-5.692c.012-.514-.012-1.033.091-1.536.16-.774.605-1.452.989-2.142a15.24 15.24 0 0 0 1.888-6.469l5.46-.401a40 40 0 0 0 .378 9.747c.238 1.458.555 2.902.8 4.359q.292 1.726.446 3.468c.367.031.729.122 1.067.267.208.09.408.2.58.348.173.146.317.33.398.542s.097.446.073.672a3 3 0 0 1-.162.662c-.276.819-.688 1.587-1.156 2.313a16 16 0 0 1-.89 1.245 2.5 2.5 0 0 1 .445.711c.23.56.248 1.196.09 1.78a3.16 3.16 0 0 1-1.78 2.045z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path3322"
                    fill="url(#linearGradient3689)"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M61.92 470.054a.25.25 0 0 1 0-.125.28.28 0 0 1 .119-.16.37.37 0 0 1 .192-.059.7.7 0 0 1 .382.124c.51.306.844.832 1.132 1.352.283.513.54 1.04.786 1.573q.471 1.025.88 2.075l-.817 1.321q-.405-.72-.85-1.415c-.457-.718-.948-1.421-1.289-2.201a6.4 6.4 0 0 1-.534-2.485"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path3268"
                    fill="#dbd5c7"
                    fillOpacity="1"
                    stroke="#a6a29a"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M65.113 470.82c.486-.809 1.12-1.548 1.934-2.024a3.7 3.7 0 0 1 1.323-.476c.466-.07.95-.038 1.397.11.583.192 1.091.577 1.486 1.046s.682 1.023.904 1.595c.527 1.36.69 2.83.88 4.277.058.434.118.872.084 1.31-.034.436-.17.878-.46 1.206-.178.2-.406.35-.652.454a3 3 0 0 1-.772.2c-.528.07-1.066.042-1.596.1-.728.08-1.43.32-2.152.436-.362.058-.73.084-1.095.043a2.36 2.36 0 0 1-1.03-.353 2.4 2.4 0 0 1-.72-.777 4.3 4.3 0 0 1-.412-.984c-.603-2.049-.22-4.333.88-6.164"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path3254"
                    fill="url(#linearGradient3748)"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M78.368 408.57a24.2 24.2 0 0 1 1.51 5.66c.566 4.057.09 8.195-.755 12.202-.797 3.772-1.919 7.466-2.894 11.195a147.6 147.6 0 0 0-4.29 25.107l-1.873-29.258 6.667-25.158z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path3216"
                    fill="url(#linearGradient3415)"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M65.789 401.4a158 158 0 0 0-1.132 9.686 150 150 0 0 0-.378 20.378c.162 3.19.431 6.372.63 9.56a216 216 0 0 1 .201 23.024l6.968-49.315z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path3176"
                    fill="#dbd5c7"
                    fillOpacity="1"
                    stroke="#a6a29a"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="m67.378 363.663 8.005-3.513 4.136 9.695-.8 7.071-6.85 6.894-5.736-9.117z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path3162"
                    fill="url(#linearGradient3750)"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M72.315 359.394a56 56 0 0 0 1.823 5.781c.822 2.184 1.792 4.334 3.158 6.226a17 17 0 0 0 1.6 1.913l1.113-1.824-4.448-18.278-4.714-1.557z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path3104"
                    fill="url(#linearGradient3160)"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M78.997 371.524a63 63 0 0 0-3.836 5.102c-.614.91-1.205 1.834-1.792 2.76q-.891 1.406-1.772 2.819l4.79 2.716 3.53-10.753z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path2990"
                    fill="url(#linearGradient3020)"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M61.284 331.334c-.091 7.08.614 14.155 1.811 21.133.35 2.034.74 4.061 1.056 6.1.559 3.599.885 7.246.694 10.882-.097 1.866-.331 3.73-.251 5.597.088 2.055.56 4.092 1.383 5.975q.396-1.435.692-2.893c1.022-5.016 1.162-10.165 1.258-15.283.246-13.123.225-26.251-.063-39.373l-5.984-1.584a95 95 0 0 0-.596 9.446"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path3511"
                    fill="url(#linearGradient3746)"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M59.138 325.017a6.05 6.05 0 0 0 3.003-.786c1.696-.965 2.865-2.803 3.019-4.749l-.944-7.013-4.34.43-.524 1.858-.214.417"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path2962"
                    fill="url(#linearGradient3752)"
                    fillOpacity="1"
                    stroke="none"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="m76.495 325.638 8.361 5.248v10.496l-2.49 15.21-3.47 7.382a417 417 0 0 1-2.4-38.336"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path2931"
                    fill="url(#linearGradient3754)"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M65.117 320.924a86 86 0 0 0-1.068 8.45c-.457 6.017-.274 12.088.623 18.056.629 4.185 1.608 8.323 1.95 12.542.262 3.234.145 6.504-.445 9.695-.36 1.946-.897 3.9-.711 5.87a8.1 8.1 0 0 0 1.156 3.47l.8-6.405a27.5 27.5 0 0 1 2.224-2.757c1.094-1.19 2.323-2.328 2.935-3.825.392-.957.505-2.006.504-3.04s-.111-2.064-.148-3.097c-.152-4.314.684-8.598 1.068-12.898l2.045-22.948z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path2803"
                    fill="url(#linearGradient3756)"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="m71.712 321.546 5.48.012q.651 4.006 1.157 8.033c.598 4.76 1.044 9.54 1.235 14.333.186 4.668.131 9.35.558 14.002.384 4.183 1.156 8.34 1.156 12.542 0 2.328-.239 4.657-.711 6.937a56 56 0 0 0-1.335-4.358c-.64-1.824-1.376-3.612-2.045-5.426a78.6 78.6 0 0 1-3.371-11.955c-.982-4.958-1.477-10-1.79-15.044a213 213 0 0 1-.334-19.076"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path2900"
                    fill="url(#linearGradient3758)"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M67.99 323.283a64 64 0 0 0-1.006 8.743c-.306 6.688.438 13.373.692 20.063.088 2.347.117 4.697.063 7.045-.085 3.65-.368 7.292-.596 10.936q-.25 4.026-.41 8.058a42.4 42.4 0 0 0 1.446-6.918c.215-1.748.32-3.507.437-5.264.089-1.33.189-2.686.695-3.919.425-1.036 1.117-1.936 1.698-2.893a15.2 15.2 0 0 0 2.139-6.479l-.222-28.524z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path2290"
                    fill="#dbd5c7"
                    fillOpacity="1"
                    stroke="#a6a29a"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M124.18 316.013a34.7 34.7 0 0 0 7.432 4.925c2.628 1.29 5.409 2.242 8.048 3.509.363.174.737.366.975.692.069.095.125.2.151.315a.55.55 0 0 1-.026.345.55.55 0 0 1-.249.255.9.9 0 0 1-.348.091 1.7 1.7 0 0 1-.836-.179c-.261-.122-.5-.286-.737-.45-.347-.24-.713-.484-1.132-.534-.24-.03-.485.009-.723-.032-.357-.06-.661-.287-.947-.51-.287-.223-.585-.455-.94-.528-.36-.074-.732.026-1.1.032-.508.008-1.025-.175-1.384-.535-.173-.174-.31-.385-.503-.535a1.6 1.6 0 0 0-.547-.254c-.194-.056-.393-.094-.586-.154-.816-.254-1.473-.87-2.264-1.195-.694-.287-1.49-.336-2.201-.095a3 3 0 0 0-.598.283q.5.948 1.07 1.856c.577.918 1.209 1.801 1.855 2.673.647.872 1.319 1.75 1.698 2.767.08.216.15.441.283.63.13.18.314.319.44.502.172.248.224.559.239.86s-.004.604.045.901c.066.41.257.79.486 1.137.23.346.497.665.74 1.002.703.976 1.182 2.09 1.698 3.176.234.491.476.979.692 1.478.304.704.555 1.43.755 2.17.07.258.134.52.157.786a1 1 0 0 1-.023.375.5.5 0 0 1-.084.167.4.4 0 0 1-.145.119.4.4 0 0 1-.241.025.54.54 0 0 1-.222-.104c-.13-.1-.216-.247-.291-.393-.152-.297-.268-.61-.41-.912-.434-.935-1.09-1.746-1.697-2.579a37 37 0 0 1-2.359-3.71c-.776-1.383-1.483-2.804-2.264-4.183-.703-1.242-1.466-2.452-2.076-3.743-.475-1.007-.863-2.072-1.54-2.956a2.5 2.5 0 0 0-.567-.566.8.8 0 0 0-.256-.123.4.4 0 0 0-.278.029.36.36 0 0 0-.166.218.5.5 0 0 0 .005.277c.05.18.174.33.286.48.57.766.89 1.684 1.227 2.579a68 68 0 0 0 2.327 5.409c.836 1.747 1.75 3.536 1.824 5.472.012.322 0 .647.032.968.031.322.108.646.282.918.09.14.203.264.308.393.105.13.204.268.258.425.048.14.06.29.056.438s-.02.295-.024.443c-.022.61.149 1.211.356 1.787.206.575.451 1.139.587 1.735a4.5 4.5 0 0 1 .063 1.73c-.025.15-.06.304-.14.435a.6.6 0 0 1-.152.171.44.44 0 0 1-.211.085.45.45 0 0 1-.215-.032.6.6 0 0 1-.184-.12 1.5 1.5 0 0 1-.262-.351c-.451-.752-.883-1.52-1.226-2.327-.793-1.865-1.097-3.896-1.635-5.85-.521-1.89-1.263-3.71-1.982-5.534a211 211 0 0 1-1.76-4.623c-.27-.735-.535-1.472-.818-2.201q-.344-.889-.724-1.761c.013.79.087 1.58.22 2.358.184 1.066.48 2.127.44 3.208-.011.338-.056.674-.068 1.013-.011.338.012.683.132 1 .143.377.414.694.566 1.069.223.55.166 1.168.126 1.76-.072 1.055-.078 2.132.22 3.146.146.496.363.971.471 1.478.106.494.104 1.004.095 1.509-.015.776-.047 1.553 0 2.327.028.465.084.93.189 1.384.066.291.153.578.204.872s.063.6-.016.889a1.44 1.44 0 0 1-.597.818 2 2 0 0 1-.786-.472c-.462-.446-.688-1.091-.755-1.73-.07-.657.011-1.321-.032-1.98-.06-.915-.355-1.797-.471-2.705-.15-1.166-.002-2.354-.126-3.523-.1-.94-.375-1.856-.723-2.736-.1-.252-.207-.503-.279-.765a1.9 1.9 0 0 1-.067-.807c.05-.328.215-.627.314-.943.23-.731.107-1.527-.106-2.263s-.516-1.448-.649-2.203c-.14-.792-.09-1.617-.314-2.39a.5.5 0 0 0-.07-.164.2.2 0 0 0-.065-.062.2.2 0 0 0-.085-.026.17.17 0 0 0-.116.047.24.24 0 0 0-.065.108c-.025.082-.015.17-.008.254.071.842-.156 1.677-.252 2.516-.164 1.439.057 2.892.063 4.34.003.619-.034 1.237-.063 1.855-.048 1.039-.072 2.083.063 3.114.074.566.197 1.127.22 1.698.054 1.294-.4 2.586-.22 3.868.027.19.068.38.055.57a.8.8 0 0 1-.065.279.54.54 0 0 1-.179.22.5.5 0 0 1-.34.082.6.6 0 0 1-.32-.145.9.9 0 0 1-.25-.407c-.05-.153-.072-.314-.096-.473-.196-1.279-.561-2.527-.755-3.805a18 18 0 0 1-.188-2.485c-.02-1.416.078-2.83.125-4.245.043-1.28.045-2.56.126-3.837.1-1.582.316-3.215-.188-4.717-.207-.615-.529-1.185-.755-1.793a6.2 6.2 0 0 1-.346-2.893l4.371-3.805z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path2352"
                    fill="url(#linearGradient3760)"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M122.443 321.796a12.5 12.5 0 0 1 .106 7.09 14.76 14.76 0 0 1-2.935-8.825l.639-1.581.9.5z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path2338"
                    fill="url(#linearGradient3762)"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M123.212 320.107a12.5 12.5 0 0 1 2.139 6.761 14.76 14.76 0 0 1-5.346-7.61l.157-1.698 1.006.22z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path2378"
                    fill="url(#linearGradient3764)"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M126.923 322.214a3.8 3.8 0 0 1 1.615-.257c.354.022.704.094 1.058.1a2.84 2.84 0 0 0 1.699-.535l.723.378a8.74 8.74 0 0 1-5.22 1.163z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path2324"
                    fill="url(#linearGradient3766)"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M126.357 318.88a22 22 0 0 1 1.415 3.46c.454 1.454.755 2.954.944 4.465q.174 1.395.22 2.8l-4.214-7.548-4.025-5.566 1.352-.881z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path2744"
                    fill="url(#linearGradient3768)"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M59.96 317.62c.157.907.389 1.801.692 2.671.883 2.53 2.44 4.9 4.706 6.328 2.072 1.307 4.554 1.738 6.912 2.399 2.426.68 4.791 1.636 6.894 3.024 1.955 1.291 3.697 2.994 4.692 5.115.147.315.279.64.356.979.174.77.062 1.57 0 2.357-.147 1.853-.01 3.717-.068 5.574-.083 2.658-.568 5.293-1.296 7.85a42 42 0 0 1-2.4 6.391l.567 4.71q.09-.457.194-.91c.883-3.797 2.624-7.332 3.914-11.01a50.7 50.7 0 0 0 2.435-10.381c.72-5.646.534-11.375 1.165-17.032.223-2.003.549-4 .605-6.014a25 25 0 0 0-.04-2.216 28 28 0 0 0-.272-2.554c.531-.885.934-1.847 1.191-2.846.51-1.975.449-4.051.259-6.082-.32-3.408-1.011-6.833-2.592-9.868a18.2 18.2 0 0 0-3.818-4.979l-8.14-.667-10.495 1.957-4.403 16.81z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path2024"
                    fill="url(#linearGradient3770)"
                    fillOpacity="1"
                    stroke="url(#linearGradient3772)"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M83.997 278.973c.357 1.422.578 2.877.66 4.34.077 1.366.038 2.77.504 4.057.358.99 1.006 1.884 1.163 2.925a3.28 3.28 0 0 1-.849 2.704l-4.686-2.642-5.314-.66 1.29-5.818z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path2004"
                    fill="#dbd5c7"
                    fillOpacity="1"
                    stroke="#a6a29a"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M66.038 303.117a60 60 0 0 1 1.651-3.185 50 50 0 0 1 2.869-4.58c.586-.827 1.207-1.638 1.973-2.3.767-.661 1.693-1.17 2.697-1.303.934-.124 1.89.08 2.824-.045.671-.09 1.323-.35 2.001-.333.656.016 1.273.29 1.89.511 1.003.36 2.052.592 3.113.69a4.02 4.02 0 0 0-1.734-2.447c-.767-.489-1.678-.7-2.58-.822a15.3 15.3 0 0 0-4.183.01l-8.425 1.814z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path1955"
                    fill="url(#linearGradient3774)"
                    fillOpacity="1"
                    stroke="none"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="m63.153 245.585 29.62 3.914 3.024-22.86-20.903-11.563z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <g
                    id="g2002"
                    fillOpacity="1"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    clipPath="none"
                  >
                    <path
                      id="path2234"
                      fill="#dbd5c7"
                      stroke="#a6a29a"
                      d="M75.6 240.984a34 34 0 0 0 1.939 6.502l3.115-.442-.494-8.135z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path2163"
                      fill="url(#linearGradient3776)"
                      stroke="#a45e49"
                      d="M78.053 241.645a31.3 31.3 0 0 0 1.076 5.642 34 34 0 0 1 2.988-.409c1.844-.169 3.739-.193 5.471-.849 2.29-.867 4.12-2.863 4.787-5.22l.993-9.29-13.71 6.667z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path2115"
                      fill="url(#linearGradient3778)"
                      stroke="#a45e49"
                      d="M78.053 241.645a3.57 3.57 0 0 1-3.135-.138c-.526-.292-.967-.713-1.45-1.072a7.3 7.3 0 0 0-2.909-1.29l2.9-20.338 2.31 7.983"
                      display="inline"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                    <path
                      id="path2085"
                      fill="url(#linearGradient3780)"
                      stroke="#a45e49"
                      d="M92.283 234.555a57 57 0 0 1-4.625 3.514c-.946.645-1.913 1.263-2.935 1.779a17.1 17.1 0 0 1-6.67 1.797c-.537-2.863-1.333-4.887-1.76-7.768-.493-3.323-.598-7.507-.944-10.85l6.527-6.306z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                  </g>
                  <path
                    id="path2220"
                    fill="url(#linearGradient3782)"
                    fillOpacity="1"
                    stroke="none"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M59.167 315.238c-.005-3.702 1.552-7.382 4.213-9.955a13.8 13.8 0 0 1 2.636-1.999c.23-1.786.691-3.543 1.37-5.212.818-2.014 1.964-3.914 3.507-5.445a13.28 13.28 0 0 1 7.317-3.675c.26-1.083.69-2.124 1.27-3.074.921-1.51 2.201-2.764 3.29-4.16 1.303-1.672 2.328-3.541 3.374-5.386.937-1.65 1.901-3.298 2.57-5.075 1.746-4.64 1.356-9.761 1.623-14.712.127-2.342.406-4.676.835-6.982l1.203-8.753a12.7 12.7 0 0 1-4.63 3.622c-2.886 1.32-6.166 1.506-9.333 1.293a40 40 0 0 1-11.127-2.376 67.3 67.3 0 0 0-8.118 24.542"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path1867"
                    fill="#e5ecef"
                    fillOpacity="1"
                    stroke="none"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.4"
                    d="M60.796 263.374a3.6 3.6 0 0 0 .267 2.891 3.58 3.58 0 0 0 1.912 1.601 1.12 1.12 0 0 0-.311 1.112c.077.275.256.509.439.728s.377.435.495.695c.1.221.139.464.166.704.028.241.044.484.1.72.117.485.398.913.668 1.334.133.208.268.423.31.667.052.292-.034.588-.084.88a1.6 1.6 0 0 0-.026.444.8.8 0 0 0 .155.41c.1.127.246.209.39.282.143.073.292.142.41.252.183.168.274.412.329.654.055.241.08.49.161.725.167.48.549.849.8 1.29.162.282.269.592.4.889.175.392.398.774.446 1.2.036.325-.031.654 0 .979.03.326.16.635.316.924.155.289.336.563.484.855.344.68.494 1.438.667 2.18.08.336.164.674.294.995s.307.627.551.872c.33.33.78.54 1.246.578a5.7 5.7 0 0 0 .044 1.112 5.7 5.7 0 0 0 1.823 3.425l-14.187 29.62-5.025-7.962.711-48.165z"
                    clipPath="url(#clipPath1901)"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path3733"
                    fill="none"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M59.167 315.238a18.8 18.8 0 0 1 2.69-5.222c.692-.943 1.472-1.82 2.146-2.776a15.6 15.6 0 0 0 2.013-3.956c.23-1.786.691-3.543 1.37-5.212.818-2.014 1.964-3.914 3.507-5.445a13.28 13.28 0 0 1 7.317-3.675c.26-1.083.69-2.124 1.27-3.074.921-1.51 2.201-2.764 3.29-4.16 1.303-1.672 2.328-3.541 3.374-5.386.937-1.65 1.901-3.298 2.57-5.075 1.746-4.64 1.356-9.761 1.623-14.712.127-2.342.406-4.676.835-6.982l1.203-8.753a12.7 12.7 0 0 1-4.63 3.622c-2.886 1.32-6.166 1.506-9.333 1.293a40 40 0 0 1-11.127-2.376 67.3 67.3 0 0 0-8.118 24.542"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path1797"
                    fill="url(#linearGradient3784)"
                    fillOpacity="1"
                    stroke="url(#linearGradient3786)"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M116.59 298.81a36.6 36.6 0 0 1 2.545 6.211c.668 2.181 1.135 4.435 2.072 6.515.738 1.64 1.76 3.148 2.973 4.477 1.884 2.065 4.24 3.704 6.849 4.71 1.825.704 3.763 1.1 5.546 1.905.729.329 1.426.724 2.107 1.144.156.096.314.197.425.343.076.1.128.223.122.348a.4.4 0 0 1-.054.179.3.3 0 0 1-.139.122.4.4 0 0 1-.223.017 1 1 0 0 1-.214-.076c-.652-.294-1.245-.7-1.878-1.032-.613-.321-1.26-.57-1.913-.799-1.377-.481-2.783-.875-4.17-1.324-1.977-.64-3.955-1.413-5.563-2.727-.687-.561-1.295-1.212-1.973-1.784a11.3 11.3 0 0 0-4.677-2.35l-4.04-14.576z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path2358"
                    fill="url(#linearGradient2362)"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M120.893 322.83a12.5 12.5 0 0 1-1.239 6.983 14.76 14.76 0 0 1-1.21-9.222l.926-1.432.79.662z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path1725"
                    fill="url(#linearGradient3788)"
                    fillOpacity="1"
                    stroke="url(#linearGradient3790)"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="m103.99 277.151 4.442.52a37 37 0 0 1 4.3 7.323c1.425 3.232 2.38 6.653 3.13 10.105a102 102 0 0 1 1.5 8.841c.44 3.485.757 7.11 2.504 10.158 1.03 1.798 2.504 3.293 3.732 4.961 2.188 2.973 3.563 6.45 5.34 9.686 1.343 2.448 2.924 4.772 4.062 7.323.474 1.062.887 2.187 1.687 3.03.15.158.312.305.454.47.141.166.263.354.315.566a.75.75 0 0 1-.02.446.55.55 0 0 1-.122.19.47.47 0 0 1-.42.127.7.7 0 0 1-.213-.08 1.5 1.5 0 0 1-.345-.299c-.897-.987-1.472-2.216-2.071-3.408-1.693-3.37-3.667-6.59-5.496-9.889-.83-1.497-1.631-3.013-2.572-4.443a27 27 0 0 0-3.391-4.176q.753 1.865 1.52 3.725c.766 1.86 1.543 3.715 2.255 5.596.972 2.567 1.825 5.178 2.823 7.734.595 1.524 1.242 3.029 1.77 4.577a38 38 0 0 1 1.02 3.592c.122.52.235 1.052.2 1.586a1 1 0 0 1-.06.315c-.04.1-.11.19-.207.237a.4.4 0 0 1-.237.029.5.5 0 0 1-.22-.1c-.13-.096-.217-.238-.295-.38-.442-.813-.645-1.73-.885-2.623-.458-1.704-1.064-3.365-1.654-5.028-1.325-3.739-2.567-7.51-4.042-11.192a95 95 0 0 0-1.921-4.46q.308 1.816.55 3.642c.318 2.379.554 4.768.853 7.149.256 2.036.558 4.068.718 6.114.088 1.123.133 2.249.184 3.374.039.859.085 1.733.384 2.54.087.235.197.467.217.717a.74.74 0 0 1-.044.336.47.47 0 0 1-.223.25.43.43 0 0 1-.204.04.5.5 0 0 1-.202-.05.8.8 0 0 1-.312-.275c-.168-.232-.253-.515-.297-.798s-.048-.57-.07-.856c-.083-1.047-.4-2.06-.602-3.09-.439-2.231-.342-4.529-.485-6.799-.153-2.437-.584-4.848-1.035-7.25q-.549-2.918-1.136-5.829a50 50 0 0 0-.434 3.992c-.146 2.14-.154 4.287-.218 6.431-.042 1.42-.11 2.84-.083 4.26.025 1.363.136 2.73.434 4.06.105.467.233.947.15 1.42-.019.11-.05.22-.11.314a.46.46 0 0 1-.257.203.4.4 0 0 1-.25-.015.6.6 0 0 1-.21-.142c-.117-.123-.184-.285-.242-.444-.252-.698-.376-1.436-.467-2.172-.198-1.606-.242-3.226-.25-4.844-.015-2.595.06-5.19.133-7.784.092-3.29.174-6.642-.735-9.806a16 16 0 0 0-.952-2.506l-6.443-14.846z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path2364"
                    fill="url(#linearGradient3792)"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M116.766 321.554a18.36 18.36 0 0 0 .283 9.34l.566-5.787.126-4.434z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path1697"
                    fill="url(#linearGradient3794)"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M105.822 277.582a30 30 0 0 0 .248 4.388c.591 4.54 2.21 8.87 3.449 13.277 1.35 4.802 2.265 9.76 4.3 14.315 1.147 2.572 2.647 5.002 3.448 7.702.593 1.999.787 4.116.567 6.19l-4.441-9.356-12.095-30.569 3.59-6.33z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path1598"
                    fill="url(#linearGradient3796)"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M97.954 277.526a9 9 0 0 0-.534 2.907c-.021 1.25.218 2.49.5 3.708 1.872 8.047 5.68 15.51 9.89 22.618 2.523 4.26 5.201 8.425 7.817 12.628q.79 1.267 1.57 2.54a342 342 0 0 0-7.75-18.61c-2.175-4.816-4.5-9.726-4.844-15a20.8 20.8 0 0 1 .968-7.75 3 3 0 0 1 .335-1.538c.188-.36.451-.68.768-.935l.134-2.071-5.98-4.31z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path2254"
                    fill="#dbd5c7"
                    fillOpacity="1"
                    stroke="#a6a29a"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M106.105 290.389a326 326 0 0 0 10.315 29.12 727 727 0 0 0-6.038-12.579c-2.297-4.67-4.661-9.36-5.944-14.403a35.7 35.7 0 0 1-1.1-8.616l1.338-.074z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path1648"
                    fill="url(#linearGradient3798)"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M101.863 274.219a34 34 0 0 1 2.806 2.271c2.925 2.641 5.373 5.793 7.317 9.221a41 41 0 0 1 3.875 9.388 83 83 0 0 0-2.806-12.094c-.869-2.779-1.897-5.537-3.474-7.985a20.2 20.2 0 0 0-4.811-5.178z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path1652"
                    fill="none"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M102.431 270.978a30.3 30.3 0 0 1 8.047 5.573"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path1627"
                    fill="none"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="m104.902 276.657-3.172 4.073"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path1542"
                    fill="url(#linearGradient3800)"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M106.448 246.346a42 42 0 0 1 1.606 6.142c.562 3.097.771 6.256.661 9.402-.078 2.234-.323 4.49-1.092 6.588a13.8 13.8 0 0 1-4.672 6.263 299 299 0 0 1-6.961-34.589l9.135 3.737z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path1513"
                    fill="url(#linearGradient3802)"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M90.27 233.727a228 228 0 0 0 0 8.753c.11 5.734.438 11.465 1.003 17.172.502 5.074 1.251 10.303 3.942 14.633a18.2 18.2 0 0 0 2.873 3.542q.314-3.51.668-7.016.606-6.021 1.336-12.027c.304-2.494.62-5.067-.066-7.484-.495-1.74-1.482-3.292-2.248-4.93a20.8 20.8 0 0 1-1.914-9.946z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path1486"
                    fill="#e5ecef"
                    fillOpacity="1"
                    stroke="#adbec7"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.4"
                    d="M95.344 238.74a8.34 8.34 0 0 0 .237 4.133 8.34 8.34 0 0 0 2.197 3.497l.165-8.198z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path1452"
                    fill="url(#linearGradient3804)"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M77.567 221.38a8 8 0 0 0 .626 2.291c.881 1.988 2.526 3.514 4.064 5.052 2.15 2.15 4.171 4.429 6.378 6.52a52.7 52.7 0 0 0 12.237 8.646 53 53 0 0 0 5.576 2.457c.568-2.736.9-5.522.992-8.316.125-3.835-.206-7.688-1.04-11.433-.661-2.972-1.666-5.93-3.496-8.363a14.3 14.3 0 0 0-4.56-3.945q-2.957.504-5.929.921c-2.156.303-4.322.573-6.433 1.106s-4.18 1.341-5.932 2.632c-.937.689-1.775 1.51-2.483 2.432"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path1432"
                    fill="#dbd5c7"
                    fillOpacity="1"
                    stroke="#a6a29a"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M96.573 212.14a5.6 5.6 0 0 1 1.772 2.149q-1.03.336-2.008.803c-1.371.655-2.646 1.495-3.993 2.197-1.199.625-2.46 1.143-3.78 1.441-1.3.294-2.637.371-3.968.425-.987.04-1.976.068-2.952.219-.975.15-1.943.43-2.789.939a5.65 5.65 0 0 0-1.829 1.777l1.215-5.014 15.473-5.905z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path1304-3"
                    fill="#fde8cc"
                    fillOpacity="1"
                    stroke="none"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="m59.181 186.303 12.21-.039a16 16 0 0 0 4.635-5.042 35 35 0 0 1 .193-8.621c.256-1.737.643-3.454.85-5.197.409-3.445.07-7.074-1.606-10.111-1.627-2.947-4.42-5.143-7.512-6.473a19.85 19.85 0 0 0-8.697-1.587"
                    display="inline"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path1212"
                    fill="#e5ecef"
                    fillOpacity="1"
                    stroke="#adbec7"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.4"
                    d="M74.042 154.728a85 85 0 0 1-.072 6.526c-.107 2.16-.297 4.314-.406 6.473-.179 3.519-.15 7.093-1.087 10.489a19 19 0 0 1-1.701 4.158l-13.985.236.709-39.31 13.323 2.882z"
                    clipPath="url(#clipPath1234)"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path1191"
                    fill="#f39079"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M61.338 167.611c.172.231.415.409.687.504.272.094.572.105.85.03.369-.097.692-.34 1.07-.4.216-.035.437-.007.653.032s.43.09.65.102c.46.025.911-.121 1.336-.301.27-.115.542-.246.835-.267.362-.027.712.117 1.042.267s.667.315 1.03.334c.312.016.622-.078.935-.067.266.01.524.095.768.2a4.44 4.44 0 0 1 1.67 1.27 14 14 0 0 1-.434 4.143 14 14 0 0 1-1.87 4.21 4 4 0 0 0-2.774-.234c-.595.167-1.155.475-1.77.534-.2.02-.401.012-.602 0-.69-.04-1.382-.127-2.071-.067a4.8 4.8 0 0 0-1.303.301 24.7 24.7 0 0 1-.702-10.59"
                    display="inline"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path3496"
                    fill="none"
                    fillOpacity="1"
                    stroke="#e7be9b"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="m59.975 186.303 11.416-.039a16 16 0 0 0 4.635-5.042 35 35 0 0 1 .193-8.621c.256-1.737.643-3.454.85-5.197.409-3.445.07-7.074-1.606-10.111-1.627-2.947-4.42-5.143-7.512-6.473a19.85 19.85 0 0 0-8.697-1.587"
                    display="inline"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path1327"
                    fill="url(#linearGradient3806)"
                    fillOpacity="1"
                    stroke="none"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="m63.042 181.51 3.542-.301 6.55 20.417-4.98 1.365-5.58-14.633z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path1339"
                    fill="none"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M62.875 190.496a12.94 12.94 0 0 0 4.911-5.813"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path1343"
                    fill="none"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M63.81 195.541a18.7 18.7 0 0 0 5.78-4.878"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path1347"
                    fill="none"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="m66.918 200.252.133-.1c.912-.674 1.93-1.213 2.74-2.005a5.93 5.93 0 0 0 1.57-2.673"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path1238"
                    fill="url(#linearGradient3808)"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M64.546 180.741a2.25 2.25 0 0 1 1.77-.434c.34.062.658.203.989.3s.691.15 1.016.034c.196-.07.366-.196.539-.312.172-.116.357-.226.563-.256a.97.97 0 0 1 .573.109c.176.09.329.22.465.363.274.285.494.626.812.86.411.304.971.395 1.458.238a238 238 0 0 1 1.303 21.916l-2.205-.334a24 24 0 0 0-.435-2.405c-.562-2.406-1.49-4.708-2.372-7.016a199 199 0 0 1-4.476-13.063"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path1268"
                    fill="url(#linearGradient3810)"
                    fillOpacity="1"
                    stroke="none"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M59.167 267.89q2.282-4.986 4.522-9.992c3.68-8.224 7.279-16.497 10.205-25.017.739-2.15 1.434-4.316 1.985-6.52.531-2.13.942-4.332 2.031-6.237.669-1.169 1.614-2.22 2.835-2.788 1.189-.553 2.537-.613 3.827-.85 1.693-.311 3.31-.935 4.914-1.56q3.548-1.38 7.087-2.787a13.5 13.5 0 0 0-3.45-2.93c-2.085-1.236-4.457-1.886-6.708-2.787-2.808-1.123-5.46-2.652-8.363-3.496-2.244-.652-4.654-.905-6.658-2.106-1.894-1.136-3.235-3.023-4.161-5.028-1.214-2.625-1.798-5.496-2.174-8.363a63 63 0 0 1-.513-6.688c-.377.18-.82.22-1.223.109a1.76 1.76 0 0 1-.827-.508c-.172.343-.435.64-.756.85a1.3 1.3 0 0 1-.383.182.74.74 0 0 1-.42-.004c-.15-.05-.272-.156-.387-.264-.115-.107-.229-.22-.37-.291a.74.74 0 0 0-.594-.029.74.74 0 0 0-.42.423"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <g
                    id="g1424"
                    clipPath="url(#clipPath1428)"
                    transform="translate(-.096)"
                  >
                    <path
                      id="path1376"
                      fill="#e5ecef"
                      fillOpacity="1"
                      stroke="none"
                      strokeDasharray="none"
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeMiterlimit="4"
                      strokeOpacity="1"
                      strokeWidth="0.4"
                      d="M64.28 179.066c.412.51.692 1.124.807 1.77a3.9 3.9 0 0 1-.146 1.94c-.205.603-.554 1.147-.827 1.724-.098.208-.187.421-.31.616a1.24 1.24 0 0 1-.493.47c-.244.117-.528.117-.797.088-.27-.028-.539-.082-.81-.064-.285.02-.563.119-.85.118-.179 0-.358-.041-.52-.118q-.096.575-.07 1.157c.021.49.109.976.141 1.465.027.401.016.803.024 1.205.005.276.02.551.024.827.008.544-.019 1.09.047 1.63.052.43.164.852.33 1.252a.55.55 0 0 0-.378.007.55.55 0 0 0-.283.253.65.65 0 0 0-.07.271 1 1 0 0 0 .03.28c.044.183.123.356.182.535.124.38.151.79.307 1.158.171.404.498.74.898.921a.58.58 0 0 0-.485-.187.58.58 0 0 0-.437.282.8.8 0 0 0-.097.37c-.008.128.002.257.003.386 0 .17-.014.341-.013.512s.02.345.084.503c.09.223.273.406.496.496a.88.88 0 0 0-.118.733c.078.268.28.482.496.661.462.386 1.004.66 1.533.947.528.288 1.056.598 1.467 1.038q.214.228.378.496a9.4 9.4 0 0 1-1.654-.142 11 11 0 0 1 .662 1.158 4.3 4.3 0 0 1-2.268-.473 8.5 8.5 0 0 0 1.654 1.488c1.086.745 2.33 1.225 3.59 1.607 1.591.482 3.231.818 4.89.921q.633.04 1.268.034a52 52 0 0 0-3.107.702c-1.005.26-2.04.57-2.807 1.27-.59.538-.976 1.27-1.57 1.803a3.3 3.3 0 0 1-.445.337.76.76 0 0 0 .78.2 13.5 13.5 0 0 0-5.127 6.71 1.7 1.7 0 0 0 1.122.224c-.373.141-.703.394-.937.717-.233.323-.37.716-.386 1.114-.013.315.048.634.177.922q-.234.495-.401 1.015c-.621 1.923-.54 4.004-.229 6 .087.556.192 1.11.234 1.67.084 1.101-.073 2.213.067 3.308.11.858.399 1.681.624 2.516.226.835.39 1.71.245 2.562-.124.725-.468 1.406-.535 2.138-.045.504.043 1.01.14 1.506.096.496.203.996.194 1.501-.007.45-.106.893-.161 1.34-.056.446-.066.912.094 1.333a1.72 1.72 0 0 0 1.27 1.069c-.275.243-.503.54-.668.869-.328.654-.396 1.406-.401 2.138-.005.602.029 1.209-.067 1.804-.043.268-.112.532-.144.801-.033.27-.026.551.077.802a1.1 1.1 0 0 0 .869.669q-.296.346-.535.735c-.297.484-.523 1.009-.735 1.536-.098.245-.195.496-.209.76a1 1 0 0 0 .053.39c.045.124.12.238.223.32.163.13.394.172.592.106a.64.64 0 0 0 .41-.44 5.08 5.08 0 0 0-.996 3.98c.164.953.609 1.856 1.264 2.568l-1.27 6.682-6.08-.534 2.038-92.142z"
                      opacity="1"
                      stopColor="#000"
                      stopOpacity="1"
                      style={{ fontVariationSettings: "normal" }}
                      vectorEffect="none"
                    ></path>
                  </g>
                  <path
                    id="path1556"
                    fill="#e5ecef"
                    fillOpacity="1"
                    stroke="#adbec7"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.4"
                    d="M98.088 277.827a3940 3940 0 0 0-1.751-5.92c.208-.215.37-.475.472-.756.2-.554.159-1.163.095-1.748a25 25 0 0 0-.615-3.402.7.7 0 0 0 .615-.284c.132-.183.167-.42.17-.645.005-.226-.017-.454.019-.678.044-.274.175-.529.345-.747.171-.22.381-.404.6-.576.184-.145.379-.284.52-.472.165-.222.245-.507.22-.783a1.15 1.15 0 0 0-.362-.729c.405-.303.743-.698.98-1.146a3.47 3.47 0 0 0 .366-2.09 25.8 25.8 0 0 1 2.055 5.551l.45-1.087q.143.508.283 1.016c.037.135.074.27.132.398a.9.9 0 0 0 .246.335c.129.103.291.155.451.197s.324.078.47.157c.138.075.253.185.36.3s.207.235.325.338c.35.305.847.431 1.3.33-.423.118-.803.38-1.064.733-.292.396-.427.886-.52 1.37-.247 1.29-.242 2.62-.543 3.898-.208.884-.56 1.73-.732 2.622-.086.446-.127.906-.307 1.323-.267.62-.815 1.084-1.087 1.701-.191.434-.235.923-.183 1.395.053.471.198.928.372 1.369.269.682.608 1.336 1.016 1.945a9.9 9.9 0 0 0 1.89 2.095l-.095 2.008a11.7 11.7 0 0 1-1.583-1.087 10.8 10.8 0 0 1-1.842-1.914c-.57-.765-1.03-1.608-1.418-2.48a18 18 0 0 1-.78-2.103z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path2775"
                    fill="none"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M75.223 294.351a33.6 33.6 0 0 1 4.654 6.667 33.6 33.6 0 0 1 3.271 9.183"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path3075"
                    fill="url(#linearGradient3812)"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M77.11 374.732a1.95 1.95 0 0 1 1.03-.479c.381-.05.78.027 1.108.227.248.152.451.37.604.616s.257.52.328.802c.14.563.148 1.15.2 1.727.13 1.429.533 2.82 1.033 4.164.833 2.24 1.943 4.39 2.508 6.713.737 3.038.505 6.214.392 9.339-.146 4.036-.098 8.154-1.332 12-1.194 3.722-3.516 6.955-5.494 10.327-.284.485-.563.976-.923 1.407s-.809.804-1.34.983a2.266 2.266 0 0 1-2.138-.377c-.437-.35-.729-.853-.912-1.381s-.266-1.085-.347-1.638c-1.363-9.3-2.496-18.76-1.258-28.077.406-3.058 1.089-6.14 2.641-8.806.901-1.546 2.092-2.952 2.642-4.654.164-.508.268-1.034.439-1.539s.42-1 .819-1.354"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path3022"
                    fill="url(#linearGradient3814)"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M68.134 374.203c.273-.159.61-.184.92-.12.308.066.594.215.859.387a4.9 4.9 0 0 1 1.645 1.78c.616 1.145.733 2.483.845 3.78.151 1.734.316 3.467.445 5.203.316 4.231.424 8.477.356 12.72-.058 3.648-.246 7.292-.445 10.935-.205 3.765-.422 7.529-.533 11.297-.02.64-.043 1.31-.356 1.868-.197.351-.505.64-.868.813a1.98 1.98 0 0 1-1.178.165c-.407-.07-.785-.268-1.108-.525s-.596-.571-.849-.898c-.892-1.154-1.55-2.47-2.162-3.794-1.629-3.521-2.984-7.187-3.738-10.992-1.239-6.246-.817-12.8 1.115-18.869.918-2.884 2.166-5.651 3.184-8.502.426-1.194.813-2.405 1.067-3.647.062-.301.117-.607.233-.893.117-.285.302-.553.568-.708"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path3341"
                    fill="url(#linearGradient3691)"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M73.515 473.18q.764-.564 1.424-1.246c.19-.196.373-.401.524-.629s.27-.48.32-.75a1.63 1.63 0 0 0-.222-1.156 11 11 0 0 1-1.29 1.512c-.28.274-.58.54-.756.89a1.56 1.56 0 0 0 0 1.379"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path3196"
                    fill="#e5ecef"
                    fillOpacity="1"
                    stroke="#adbec7"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.4"
                    d="M76.317 422.124a204 204 0 0 0-4.091 25.083c-.475 4.756-.782 9.528-1.068 14.3-.149 2.489-.292 4.994 0 7.47.113.96.292 1.93.152 2.887a3.4 3.4 0 0 1-.483 1.355c-.263.406-.641.744-1.092.918-.592.228-1.277.157-1.846-.124-.57-.28-1.028-.756-1.356-1.3-.743-1.227-.831-2.752-.628-4.172.204-1.42.676-2.787.984-4.188.427-1.945.538-3.947.533-5.939-.009-4.096-.5-8.179-.533-12.275-.035-4.223.415-8.433.89-12.63.42-3.724.859-7.494.355-11.208-.03-.224-.065-.45-.064-.677 0-.227.037-.458.14-.66.144-.28.404-.484.566-.754.172-.286.223-.628.25-.96s.032-.67.128-.99c.112-.377.342-.708.598-1.007s.54-.573.785-.88c.38-.474.661-1.02.912-1.572.11-.24.216-.487.395-.68a.9.9 0 0 1 .32-.228.64.64 0 0 1 .386-.036c.138.033.26.118.351.227s.151.241.19.378c.079.273.075.562.12.842.113.713.532 1.334.911 1.95.262.423.51.857.692 1.32.21.531.334 1.105.66 1.573.146.208.328.389.472.597.278.399.411.896.371 1.38"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path3355"
                    fill="#e5ecef"
                    fillOpacity="1"
                    stroke="#adbec7"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.4"
                    d="M63.553 461.794a39 39 0 0 0 5.248 3.736 21.3 21.3 0 0 0 4.536-2.802 12.2 12.2 0 0 0 .801 4.937l-1.29 1.156-3.913 2.224a11.4 11.4 0 0 1-3.203-1.245 11.4 11.4 0 0 1-3.602-3.291z"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path1152-2"
                    fill="#fde8cc"
                    fillOpacity="1"
                    stroke="#e7be9b"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M75.871 170.389c.296-.115.572-.28.814-.485.302-.256.552-.577.89-.785.24-.148.52-.232.802-.238s.567.065.81.209c.351.208.607.559.735.947.2.603.102 1.257.035 1.888-.083.772-.117 1.554-.31 2.306-.193.746-.538 1.442-.87 2.138-.363.762-.718 1.54-.868 2.372-.124.684-.11 1.406-.4 2.038a1.9 1.9 0 0 1-.734.845 1.41 1.41 0 0 1-1.094.163 1.24 1.24 0 0 1-.879-.975"
                    display="inline"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                  <path
                    id="path1919"
                    fill="none"
                    fillOpacity="1"
                    stroke="#a45e49"
                    strokeDasharray="none"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="4"
                    strokeOpacity="1"
                    strokeWidth="0.5"
                    d="M59.167 267.89q2.282-4.986 4.522-9.992c3.68-8.224 7.279-16.497 10.205-25.017.739-2.15 1.434-4.316 1.985-6.52.531-2.13.942-4.332 2.031-6.237.669-1.169 1.614-2.22 2.835-2.788 1.189-.553 2.537-.613 3.827-.85 1.693-.311 3.31-.935 4.914-1.56q3.548-1.38 7.087-2.787a13.5 13.5 0 0 0-3.45-2.93c-2.085-1.236-4.457-1.886-6.708-2.787-2.808-1.123-5.46-2.652-8.363-3.496-2.244-.652-4.654-.905-6.658-2.106-1.894-1.136-3.235-3.023-4.161-5.028-1.214-2.625-1.798-5.496-2.174-8.363a63 63 0 0 1-.513-6.688c-.377.18-.82.22-1.223.109a1.76 1.76 0 0 1-.827-.508c-.172.343-.436.64-.756.85a1.3 1.3 0 0 1-.383.182.74.74 0 0 1-.42-.004c-.15-.05-.272-.156-.387-.264-.115-.107-.228-.22-.37-.291a.74.74 0 0 0-.681.017"
                    opacity="1"
                    stopColor="#000"
                    stopOpacity="1"
                    style={{ fontVariationSettings: "normal" }}
                    vectorEffect="none"
                  ></path>
                </g>
              </g>
              <path
                id="path1379"
                fill="#e5ecef"
                fillOpacity="1"
                stroke="none"
                strokeLinecap="butt"
                strokeLinejoin="miter"
                strokeOpacity="1"
                strokeWidth="0.265"
                d="m270.919-146.857.09.275.04.491.192-.743.263-.405v-85.137h-.88z"
              ></path>
              <path
                id="path1381"
                fill="#e5ecef"
                fillOpacity="1"
                stroke="none"
                strokeDasharray="none"
                strokeDashoffset="0"
                strokeLinecap="butt"
                strokeLinejoin="miter"
                strokeMiterlimit="4"
                strokeOpacity="1"
                strokeWidth="0.265"
                d="m271.005-99.715.14.592.173-.6v-45.711h-.354z"
                opacity="1"
                stopColor="#000"
                stopOpacity="1"
                style={{ fontVariationSettings: "normal" }}
                vectorEffect="none"
              ></path>
            </g>
          </Svg>
        );

    </View>
  );
};

export default SVGBodyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // or any other color
    alignItems: 'center',
    justifyContent: 'center',
  },
});
