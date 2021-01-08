import React from "react";

type DocProps = {
    name: string;
};
const Doc = ({ name }: DocProps) => {
    return <div>hiya {name}</div>;
};

export default Doc;
