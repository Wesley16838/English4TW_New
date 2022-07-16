import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    StyleSheet
} from "react-native";
import { Colors } from "styles"

const LinearGradientLayout = ({children}: {children: JSX.Element})  => {
    return(
        <LinearGradient
            colors={[Colors.white, Colors.page_background]}
            style={styles.container}
        >
            {children}
        </LinearGradient>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        alignItems: "center",
        width: "100%",
    },
})

export default LinearGradientLayout