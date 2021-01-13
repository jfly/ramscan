import React from "react";
import Interactable from "react-interactable";
import { Animated } from "react-native";

enum SwipeDirection {
    NEXT,
    PREV,
    UP,
}
type SnapPoint = {
    id: SwipeDirection | null;
    x?: number;
    y?: number;
    damping?: number;
};

type SpringPoint = {
    x?: number;
    y?: number;
    tension?: number;
    damping?: number;
    influenceArea?: {
        left?: number;
        right?: number;
        top?: number;
        bottom?: number;
    };
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

    nextEl: React.ReactNode;
    onNext: (() => void) | null;

    prevEl: React.ReactNode;
    onPrev: (() => void) | null;

    upEl: React.ReactNode;
    onUp: (() => void) | null;
};
function Swipeable({
    children,
    nextEl,
    onNext,
    prevEl,
    onPrev,
    upEl,
    onUp,
}: SwipeableProps) {
    const snapPoints: SnapPoint[] = [{ id: null, x: 0, y: 0 }];
    const springPoints: SpringPoint[] = [];

    if (onPrev) {
        snapPoints.push({ id: SwipeDirection.PREV, x: 150, y: 0 });
    } else {
        // There's no next element. Add a spring to make it more difficult to
        // swipe right.
        springPoints.push({
            x: 0,
            tension: 6000,
            damping: 0.5,
            influenceArea: { left: 0 },
        });
    }
    if (onNext) {
        snapPoints.push({ id: SwipeDirection.NEXT, x: -150, y: 0 });
    } else {
        // There's no next element. Add a spring to make it more difficult to
        // swipe left.
        springPoints.push({
            x: 0,
            tension: 6000,
            damping: 0.5,
            influenceArea: { right: 0 },
        });
    }
    if (onUp) {
        snapPoints.push({ id: SwipeDirection.UP, x: 0, y: -300 });
    }

    const deltaX = new Animated.Value(0);
    const deltaY = new Animated.Value(0);
    function handleSnap({ id }: { id: SwipeDirection }) {
        const handler = {
            [SwipeDirection.NEXT]: onNext,
            [SwipeDirection.PREV]: onPrev,
            [SwipeDirection.UP]: onUp,
        }[id];
        handler?.();
    }
    return (
        <>
            <div className="swipeable">
                <HorizontalOrVerticalDraggableView
                    dragWithSpring={{ tension: 2000, damping: 0.5 }}
                    boundaries={{ bottom: 0 }}
                    snapPoints={snapPoints}
                    onSnap={handleSnap}
                    animatedValueX={deltaX}
                    animatedValueY={deltaY}
                    springPoints={springPoints}
                    style={{
                        width: "100%",
                        height: "100%",
                        justifyContent: "center",
                    }}
                >
                    <div className="prev">{prevEl}</div>
                    {children}
                    <div className="next">{nextEl}</div>
                    <div className="up">{upEl}</div>
                </HorizontalOrVerticalDraggableView>
            </div>
        </>
    );
}

export default Swipeable;
