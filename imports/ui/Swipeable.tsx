import React from "react";
import Interactable from "react-interactable";
import { Animated } from "react-native";

enum SwipeDirection {
    LEFT,
    RIGHT,
}
type SnapPoint = {
    id: SwipeDirection | null;
    x: number;
    damping?: number;
};

type SwipeableProps = {
    children: React.ReactNode;
    leftText?: string;
    onLeft: (() => void) | null;
    rightText?: string;
    onRight: (() => void) | null;
};
function Swipeable({
    children,
    leftText,
    onLeft,
    rightText,
    onRight,
}: SwipeableProps) {
    const snapPoints: SnapPoint[] = [{ id: null, x: 0, damping: 0.8 }];

    if (onRight) {
        snapPoints.push({ id: SwipeDirection.RIGHT, x: 150 });
    }
    if (onLeft) {
        snapPoints.push({ id: SwipeDirection.LEFT, x: -150 });
    }

    const deltaX = new Animated.Value(0);
    function handleSnap({ id }: { id: SwipeDirection }) {
        const handler = {
            [SwipeDirection.LEFT]: onLeft,
            [SwipeDirection.RIGHT]: onRight,
        }[id];
        handler?.();
    }
    return (
        <>
            <div className="pageImgSwipeWrapper">
                <div style={{ position: "absolute", left: 0 }}>
                    <Animated.Text
                        style={[
                            {
                                opacity: deltaX.interpolate({
                                    inputRange: [0, 150],
                                    outputRange: [0, 1],
                                    extrapolateLeft: "clamp",
                                    extrapolateRight: "clamp",
                                }),
                                fontSize: "50px",
                                width: "150px",
                                display: "block",
                                textAlign: "center",
                            },
                        ]}
                    >
                        {rightText}
                    </Animated.Text>
                </div>
                <div style={{ position: "absolute", right: 0 }}>
                    <Animated.Text
                        style={[
                            {
                                opacity: deltaX.interpolate({
                                    inputRange: [-150, 0],
                                    outputRange: [1, 0],
                                    extrapolateLeft: "clamp",
                                    extrapolateRight: "clamp",
                                }),
                                fontSize: "50px",
                                width: "150px",
                                display: "block",
                                textAlign: "center",
                            },
                        ]}
                    >
                        {leftText}
                    </Animated.Text>
                </div>
                <Interactable.View
                    horizontalOnly={true}
                    snapPoints={snapPoints}
                    onSnap={handleSnap}
                    animatedValueX={deltaX}
                    style={{
                        width: "100%",
                        height: "100%",
                        justifyContent: "center",
                    }}
                >
                    {children}
                </Interactable.View>
            </div>
        </>
    );
}

export default Swipeable;
