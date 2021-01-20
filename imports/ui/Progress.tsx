import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

type CircularProgressWithLabelProps = {
    /**
     * The value of the progress indicator for the determinate variant.
     * Value between 0 and 100.
     */
    value: number;
    description: string;
};
function CircularProgressWithLabel({
    value,
    description,
}: CircularProgressWithLabelProps) {
    return (
        <Box
            position="relative"
            display="inline-flex"
            height="100%"
            alignItems="center"
            justifyContent="center"
        >
            <CircularProgress
                size="50vmin"
                variant="determinate"
                value={value}
            />
            <Box
                width="50vmin"
                height="50vmin"
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Typography
                    variant="caption"
                    component="div"
                    color="textSecondary"
                >
                    {description} {Math.round(value)}%
                </Typography>
            </Box>
        </Box>
    );
}

export default CircularProgressWithLabel;
