import React from "react";
import Interactable from "react-interactable";
import { Animated } from "react-native";

enum SwipeDirection {
    LEFT,
    RIGHT,
    UP,
}
type SnapPoint = {
    id: SwipeDirection | null;
    x?: number;
    y?: number;
    damping?: number;
};

/*
 * A subclass of Interactable.View that can be dragged either horizontally or
 * verically, but only one of those directions at a time.
 *
 * The funky type definition (any) is because Interactable.View itself doesn't
 * have any useful type information. This prevents typescript complaining when
 * other places use HorizontalOrVerticalDraggableView.
 */
const HorizontalOrVerticalDraggableView: any = class extends Interactable.View {
    onDragging({ dx, dy }: { dx: number; dy: number }) {
        super.onDragging({ dx, dy });
        let velocity = this.animator.getVelocity();
        const horizontal =
            Math.abs(dx) > Math.abs(dy) ||
            Math.abs(velocity.x) > Math.abs(velocity.y);
        if (horizontal) {
            this.dragBehavior.y0 = 0;
        } else {
            this.dragBehavior.x0 = 0;
        }
    }
};

type SwipeableProps = {
    children: React.ReactNode;

    leftText?: string;
    onLeft: (() => void) | null;

    rightText?: string;
    onRight: (() => void) | null;

    upText?: string;
    onUp: (() => void) | null;
};
function Swipeable({
    children,
    leftText,
    onLeft,
    rightText,
    onRight,
    upText,
    onUp,
}: SwipeableProps) {
    const snapPoints: SnapPoint[] = [{ id: null, x: 0, y: 0, damping: 0.8 }];

    if (onRight) {
        snapPoints.push({ id: SwipeDirection.RIGHT, x: 150, y: 0 });
    }
    if (onLeft) {
        snapPoints.push({ id: SwipeDirection.LEFT, x: -150, y: 0 });
    }
    if (onUp) {
        snapPoints.push({ id: SwipeDirection.UP, x: 0, y: -300 });
    }

    const deltaX = new Animated.Value(0);
    const deltaY = new Animated.Value(0);
    function handleSnap({ id }: { id: SwipeDirection }) {
        const handler = {
            [SwipeDirection.LEFT]: onLeft,
            [SwipeDirection.RIGHT]: onRight,
            [SwipeDirection.UP]: onUp,
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
                <div style={{ position: "absolute", bottom: 0, width: "100%" }}>
                    <Animated.Text
                        style={[
                            {
                                opacity: deltaY.interpolate({
                                    inputRange: [-150, 0],
                                    outputRange: [1, 0],
                                    extrapolateLeft: "clamp",
                                    extrapolateRight: "clamp",
                                }),
                                fontSize: "50px",
                                display: "block",
                                textAlign: "center",
                            },
                        ]}
                    >
                        {upText}
                    </Animated.Text>
                </div>
                <HorizontalOrVerticalDraggableView
                    snapPoints={snapPoints}
                    onSnap={handleSnap}
                    animatedValueX={deltaX}
                    animatedValueY={deltaY}
                    boundaries={{ bottom: 0 }}
                    style={{
                        width: "100%",
                        height: "100%",
                        justifyContent: "center",
                    }}
                >
                    {children}
                </HorizontalOrVerticalDraggableView>
            </div>
        </>
    );
}

export default Swipeable;
